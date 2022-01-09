/*
TODO:
- profile in Chrome using ... more tools -> javascript profiler
*/

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { LocalNotifications } from '@capacitor/local-notifications';

import { environment } from '../environments/environment';
import { GlobalService } from './global.service';
import { Poll, Option } from "./poll.service";

import * as PouchDB from 'pouchdb/dist/pouchdb';

import BLAKE2s from 'blake2s-js'; // TODO: replace by sodium later

import * as CryptoJS from 'crypto-js';
const crypto_algorithm = 'des-ede3';
const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f"); // this needs to be some arbitrary but GLOBALLY CONSTANT value

/** DATA STORAGE DESIGN
 * 
 * 
 * REDUNDANCY
 * 
 * Most data is stored in three places simultaneously, which are continuously synchronized:
 * - a session-specific local temporal cache 
 * - a device-specific local persistent PouchDB
 * - a set of documents with contiguous doc-ids in some remote CouchDB
 * 
 *   
 * SEPARATION BETWEEN USER, POLL, AND VOTER DATA
 * 
 * The data is divided into several portions:
 * - "user data" is data that is not poll-specific, such as overall settings.
 * - "poll data" is data that is poll-specific but not voter-specific, such as poll titel and options
 * - "voter data" is data that is poll- and voter-specific, such as ratings and delegations
 * 
 * User data is stored in a single user cache+PouchDB+CouchDB. A few user data items are stored in the cache only.
 * 
 * Poll and voter data is stored in a poll-specific cache+PouchDB+CouchDB, 
 * i.e. for each poll there is a separate cache+PouchDB+CouchDB.
 * 
 * 
 * FLAT KEY-VALUE DATA MODEL
 * 
 * All data is stored as simple key-value pairs.
 * 
 * Keys are strings that can be hierarchically structures by dots ('.') as separators, 
 * such as 'language' or 'poll.78934865986.db_server_url'.
 * Keys of voter data start with 'voter.' followed by the vid (voter id) and a colon (':'), 
 * such as 'voter.968235:option.235896.rating'. Otherwise the colon does not appear in keys.
 * 
 * In the local caches, there is one entry per key, and they key is used without any further prefix.
 * 
 * 
 * MAPPING KEYS TO DOCUMENTS
 * 
 * In the local PouchDBs and remote CouchDBs, there is one document per key that has the following structure:
 * - user data documents: { _id: "~vodle.user.UUU:KEY", value: XXX }
 * - poll data documents: { _id: "~vodle.poll.PPP:KEY", value: YYY }
 * - voter data documents: { _id: "~vodle.poll.PPP.voter.VVV:REST_OF_KEY", value: YYY }
 * 
 * In this, UUU is the hash of the user's email address plus ':' plus their password,
 * PPP is a poll id, and VVV is a voter id.
 * KEY the full key, REST_OF_KEY the key without the part "voter.ZZZ:".
 * XXX is a value encrypted with the user's password, and YYY is a value encrypted with the poll password. 
 * In this way, no-one can infer the actual owner of a document 
 * and no unauthorized person can read the actual values.
 * Note that voter documents are encrypted with the poll password rather than the voter's own password
 * so that all voters in the poll can read all other voters' ratings and delegations. 
 * 
 * 
 * MAPPING DOCUMENTS TO DATABASE USERS
 * 
 * The part of the document _id between '~' and ':' is the database username that is used to 
 * create or update the document: 'vodle.user.UUU', 'vodle.poll.PPP', and 'vodle.poll.PPP.voter.VVV'.
 * The database users 'vodle.user.UUU' and 'vodle.poll.PPP.voter.VVV' have the user's password 
 * as their password, while the database user 'vodle.poll.PPP' has the poll password as its password.
 * Other database users only have read access to the document, but are only able to make 
 * sense of its contents if they have the correct password used for encrypting the value.
 * In this way, no unauthorized person can modify any value.
 * 
 * 
 * REMOTE COUCHDB CONFIGURATION
 * 
 * Each used remote CouchDB is identified by the URL of a CouchDB server (!) 
 * (rather than the URL of a database contained in that server!).
 * The CouchDB server must provide:
 * - a user database named '_users' (which is the standard name for user databases)
 * - a database named 'vodle' that will contain the data
 * - a user named 'vodle' that has write access to both (!) these databases.
 * 
 * The user 'vodle' will be used by the vodle app to automatically create the other database users
 * ('vodle.user.UUU', 'vodle.poll.PPP', and 'vodle.poll.PPP.voter.VVV')
 * when a user logs in the first time, changes their password, creates a new poll, 
 * or starts participating in a poll as a voter.
 * This way the database administrator only needs to be involved when setting up the database initially,
 * but not later on to create users.
 * 
 * Although the database user 'vodle' can create users, it cannot delete or modify users or read their passwords.
 * Also, neither the database user 'vodle' or 'vodle.poll.PPP' can change their own password.
 * This way, no-one can delete or overtake the database users 'vodle.user.UUU' or 'vodle.poll.PPP.voter.VVV'
 * of any other person or prevent others from accessing their personal, poll, or voter data.
 * 
 */

/** TODO:
- verify that we DO NOT need a db user vodle.poll.PPP after all!
- ignore vids that have not provided a valid signature document
- if voter keys are individualized (not at first), ignore vids that use a signature some other vid uses as well
- at poll creation, write a pubkey document for each valid voter key, giving each key a random key id
- a valid signature document has _id ~vodle.voter.<vid>.signature-<key id> and value signed(key id)
*/


const user_doc_id_prefix = "~vodle.user.", poll_doc_id_prefix = "~vodle.poll.";

function get_poll_key_prefix(pid:string) {
  return 'poll.' + pid + '.';
}

// sudo docker run -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -p 5984:5984 -d --name test-couchdb couchdb
// curl -u test -X PUT .../{db}/_design/{ddoc}/_update/{func}/{docid}

// some user data keys are only stored locally and not synced to a remote CouchDB:
const local_only_user_keys = ['local_language', 'email', 'password', 'db', 'db_from_pid', 'db_other_server_url', 'db_other_password', 'db_server_url', 'db_password'];
// some of these trigger a move from one remote user dvb to another when changed:
const keys_triggering_data_move = ['email', 'password', 'db', 'db_from_pid', 'db_from_pid_server_url', 'db_from_pid_password', 'db_other_server_url','db_other_password'];

// some poll and voter data keys are stored in the user db rather than in the poll db:
const poll_keys_in_user_db = ['db', 'db_from_pid', 'db_other_server_url', 'db_other_password', 'db_server_url', 'db_password', 'password', 'vid'];
const voter_keys_in_user_db = ['have_opened', 'have_rated', 'have_seen_results'];

// ENCRYPTION:

let textEncoder = new TextEncoder();

function encrypt_deterministically(value, password:string) {
  var aesEncryptor = CryptoJS.algo.AES.createEncryptor(password, { iv: iv });
  const result = aesEncryptor.process(''+value).toString()+aesEncryptor.finalize().toString(); 
  return result;
}
function encrypt(value, password:string): string {
  try {
    const result = CryptoJS.AES.encrypt(''+value, password).toString(); 
    return result;
  } catch (error) {
    return null;
  }
}
function decrypt(value:string, password:string): string {
  try {
    const temp = CryptoJS.AES.decrypt(value, password);
    // FIXME: sometimes we get a malformed UTF-8 error on toString: 
    const result = temp.toString(CryptoJS.enc.Utf8);
    return result;
  } catch (error) {
    return null;
  }
}
function myhash(what): string {
  // we use Blake2s since it is fast and more reliable than MD5
  const blake2s = new BLAKE2s(environment.data_service.hash_n_bytes); // 16? 32?
  blake2s.update(textEncoder.encode(what.toString())); 
  return blake2s.hexDigest();
}



// SERVICE:

// attributes of DataService to be stored in storage:
const state_attributes = ["user_cache", "_pids", "poll_caches", "ratings_map_caches", "tally_caches"];

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {

  private G: GlobalService;
  
  private restored_user_cache = false;
  private restored_poll_caches = false;

  // current page, used for notifying of changes method:
  private _page; 
  public set page(page) { this._page = page; }

  private loadingElement: HTMLIonLoadingElement;

  // DATA:

  public user_cache: {}; // temporary storage of user data
  private local_only_user_DB: PouchDB.Database; // persistent storage of local-only user data
  private local_synced_user_db: PouchDB.Database; // persistent local copy of synced user data

  private remote_user_db: PouchDB.Database; // persistent remote copy of synced user data

  private _pids: Set<string>; // list of pids known to the user
  public get pids() { return this._pids; }
  private _pid_oids: Set<[string, string]>;

  private poll_caches: Record<string, {}>; // temporary storage of poll data
  private local_poll_dbs: Record<string, PouchDB.Database>; // persistent local copies of this user's part of the poll data

  private remote_poll_dbs: Record<string, PouchDB.Database>; // persistent remote copies of complete poll data

  public ratings_map_caches: Record<string, Map<string, Map<string, number>>>; // redundant storage of ratings data, not stored in database
  public tally_caches: Record<string, {}>; // temporary storage of tally data, not stored in database

  // LYFECYCLE:

  private uninitialized_pids: Set<string>; // temporary set of pids currently initializing 
  private _ready: boolean = false;
  public get ready() { return this._ready; }
  private _loading: boolean = false;
  public get loading() { return this._loading; }

  constructor(
      private router: Router,
      public loadingController: LoadingController,
      public translate: TranslateService,
      public storage: Storage,
      ) { 
    // send local notification:
    // TODO: test this!
    LocalNotifications.schedule({
      notifications: [{
        title: "DataService constructor called.",
        body: "DataService constructor called.",
        id: 1
      }]
    })
    .then(res => {
      console.log("DataService constructor localNotifications.schedule succeeded");
    }).catch(err => {
      console.warn("DataService constructor localNotifications.schedule failed:", err);
    });
  }

  ionViewWillLeave() {
    this.save_state();
  }
  ngOnDestroy() {
    console.log("DataService.ngOnDestroy entry");
    this.save_state();
    console.log("DataService.ngOnDestroy exit");
  }

  save_state() {
    this.G.L.entry("DataService.save_state");
    let state = {};
    for (let a of state_attributes) {
      state[a] = this[a];
    }
    this.storage.set('state', state)
    .then(
      (state) => {
        console.log("DataService.save_state storing state succeeded");
      },
      (error) => {
        console.log("DataService.save_state storing state failed:", error);        
      }
    );
    this.G.L.exit("DataService.save_state");
  }

  // INITIALIZATION

  /** Initialization process overview
      -------------------------------

  init()
  `–– try restoring caches from storage 
      init_databases()
      `– asynchronously: 
        process_local_only_user_docs()
        |– if necessary, first redirect to email and password prompt on login page 
        `– email_and_password_exist()
            |
            |– asynchronously: 
            |  local_user_docs2cache()
            |  |– doc2user_cache() for each doc
            |  |  `– for each new poll id:
            |  |     asynchronously:
            |  |     start_poll_initialization()
            |  |     `– local_poll_docs2cache()
            |  |        `– doc2user_cache() for each doc
            |  |
            |  |– once all user docs are processed:
            |  |  for each new poll id:
            |  |  connect_to_remote_poll_db()
            |  |  |– get_remote_connection()
            |  |  `– start_poll_sync()
            |  |     `– handle_poll_db_change() whenever local or remote db has changed
            |  |  
            |  `– once all polls are initialized:
            |     local_docs2cache_finished() 
            |     |– after_changes()
            |     `– notify page that we are ready via <page>.onDataReady()
            |
            `– meanwhile: 
              |– if necessary, first redirect to db credentials prompt on login page 
              `– connect_to_remote_user_db()
                  |– get_remote_connection()
                  `– start_user_sync()
                    `– handle_user_db_change() whenever local or remote db has changed
  */

  init(G: GlobalService) {
    // called by GlobalService
    G.L.entry("DataService.init");
    this.G = G;
    // if necessary, show a loading animation:
    this.show_loading();
    // now start the complicated and partially asynchronous data initialization procedure (see overview in comment below):
    // initialize caches that only live during current session:
    this.user_cache = {};
    this._pids = new Set();
    this.poll_caches = {};
    this.tally_caches = {};
    // make sure storage exists:
    this.storage.create();
    // restore state from storage:
    this.storage.get('state')
    .then((state) => {
      G.L.debug('DataService got state from storage');
      for (let a of state_attributes) {
        if (a in state) {
          this[a] = state[a];
          G.L.trace("DataService restored attribute", a, "from storage");
        } else {
          G.L.warn("DataService couldn't find attribute", a, "in storage");
        }
      }
      if ('user_cache' in state) {
        this.restored_user_cache = true;
      }
      if (('_pids' in state)&&('poll_caches' in state)) {
        this.restored_poll_caches = true;
      }
    }).catch((error) => {
      G.L.warn('DataService could not get state from storage:', error);
    }).finally(() => {
      this.init_databases();
    });
    G.L.exit("DataService.init");
  }

  // User data initialization:

  private init_databases() {
    this.G.L.entry("DataService.start_initialization");

    // access locally stored data and get some statistics about it:
    this.local_only_user_DB = new PouchDB('local_only_user');

    this.local_only_user_DB.info()
    .then(doc => { 

      this.G.L.debug("DataService local_only_user_DB info", doc);

    }).catch(err => {

      this.G.L.error("DataService local_only_user_DB error", err);

    });

    this.local_synced_user_db = new PouchDB('local_synced_user');

    this.local_synced_user_db.info()
    .then(doc => { 

      this.G.L.debug("DataService local_synced_user_DB info", doc);

    }).catch(err => {

      this.G.L.error("DataService local_synced_user_DB error", err);

    });

    this._pid_oids = new Set();
    this.uninitialized_pids = new Set();
    this.local_poll_dbs = {};
    this.remote_poll_dbs = {};

    if (this.restored_user_cache) {
      // user_cache was restored from storage.

      this.after_local_only_user_cache_is_filled();

    } else {
      // try restoring from local PouchDB:

      this.user_cache = {};
      // ASYNC:
      // Now start filling the temporary session cache with the persistent local data and syncing with remote data.
      // Because of PouchDB, this must be done asynchronously.
      // First, we fetch all local-only docs:
      this.local_only_user_DB.allDocs({
        include_docs: true
      }).then(

        // process them:
        this.process_local_only_user_docs.bind(this)

      ).catch(err => {

        this.G.L.error(err);

      });
    }

    this.G.L.exit("DataService.start_initialization");
  }

  private process_local_only_user_docs(result) {
    this.G.L.entry("DataService.process_local_only_user_docs");
    // copy data from local-only docs to cache:
    for (let row of result.rows) {
      let doc = row.doc, key = doc['_id'], value = doc['value'];
      this.user_cache[key] = value;
      this.G.L.trace("DataService.process_local_only_user_docs filled user cache with key", key, "and value", value);
      if (key=='local_language') {
        // adjust app language:
        this.translate.use((value||'')!=''?value:environment.default_lang);
      }
    }
    this.after_local_only_user_cache_is_filled();
    this.G.L.exit("DataService.process_local_only_user_docs");
  }

  private after_local_only_user_cache_is_filled() {
    this.G.L.entry("DataService.after_user_cache_is_filled");
    // check if email and password are set:
    if ((this.user_cache['email']||'')=='' || (this.user_cache['password']||'')=='') {
      this.G.L.info("DataService found empty email or password, redirecting to login page.");
      this.hide_loading();
      if (!this.router.url.includes('/login')) {
        this.router.navigate([(this.user_cache['local_language']||'')==''?'/login/start':'/login/used_before']);
      }
    } else {
      this.email_and_password_exist();
    }
    this.G.L.exit("DataService.after_user_cache_is_filled");
  }

  private email_and_password_exist() {
    this.G.L.entry("DataService.email_and_password_exist: email", 
      this.user_cache['email'], ", password", this.user_cache['password']);

    if (this.restored_user_cache) {
      // user_cache was restored from storage.

      this.init_poll_data();

    } else {
      // try restoring from local PouchDB:

      // ASYNC:
      // while remote synchronisation is happening (potentially slow, to be started below), 
      // already fetch all current local versions of synced docs:
      this.local_synced_user_db.allDocs({
        include_docs:true
      }).then(result => {

        this.local_user_docs2cache.bind(this)(result);

      }).catch(err => {

        this.G.L.error("DataService could not read local_synced_user_DB", err);

      });
    }

    // check if db credentials are set:
    if (this.has_user_db_credentials()) {

      // ASYNC:
      // connect to remote and start sync:
      this.connect_to_remote_user_db()
      .then(success => {

        if (this.router.url.includes('/login')) {
          this.router.navigate(['/login/connected']);
        } 

      }).catch(err => {

        this.G.L.warn("DataService could not connect to remote user db", err);

      });

    } else {
      this.G.L.warn("DataService found insufficient db credentials, redirecting to login page.");
      this.router.navigate(['/login/db_credentials/missing']);
      // TODO: make that page
    }
    this.G.L.exit("DataService.email_and_password_exist"); 
  }

  private init_poll_data() {
    // called when user_cache could be restored from storage and email and password exist.
    // checks for existence of all poll caches.
    if (!this.restored_poll_caches) {
      let initializing_polls = false;
      // TODO: go through user cache for pids
      for (let key in this.user_cache) {
        if (this.check_whether_poll_or_option(key, this.user_cache[key])) {
          initializing_polls = true;
        }
      }
    }    
    this.local_docs2cache_finished();
  }

  private has_user_db_credentials() {
    // return whether poll db credentials are nonempty:
    this.G.S.compute_db_credentials();
    return this.getu('db_server_url')!='' && this.getu('db_password')!=''; // && !!this.email_and_pw_hash();
  }

  private local_user_docs2cache(result) {
    // called whenever a connection to a remote user db was established
    this.G.L.entry("DataService.local_user_docs2cache");
    // decrypt and process all synced docs:
    var initializing_polls = false;
    for (let row of result.rows) {
      let [dummy, initializing_poll] = this.doc2user_cache(row.doc);
      initializing_polls = initializing_polls || initializing_poll;
    }
    if (!initializing_polls) {
      this.local_docs2cache_finished();
    } // else that will only be called after poll initialization has finished.
    this.G.L.exit("DataService.local_user_docs2cache");
  }

  private connect_to_remote_user_db() {
    // called at initialization and whenever db credentials were changed
    this.G.L.entry("DataService.connect_to_remote_user_db");
    let user_password = this.user_cache['password'];
    let user_db_private_username = "vodle.user." + this.email_and_pw_hash();

    let promise = new Promise((resolve, reject) => {

      // ASYNC:
      this.get_remote_connection(
        this.getu('db_server_url'), this.getu('db_password'),
        user_db_private_username, user_password
      ).then(db => { 

        this.remote_user_db = db;
        // start synchronisation asynchronously:
        this.start_user_sync();

        // RESOLVE:
        resolve(true);

      }).catch(err => {

        this.G.L.warn("DataService.connect_to_remote_user_db failed, redirecting to login page", err);
        // TODO: if no network, notify and try again when network available. if wrong url or password, ask again for credentials. if wrong permissions, notify to contact db admin. also set 'ready' to false?
        this.router.navigate(['/login/db_credentials/failed']);
        // TODO: make that page

        // REJECT:
        reject(err);

      });

    });

    this.G.L.exit("DataService.connect_to_remote_user_db");
    return promise;
  }

  // Poll data initialization:

  private get_local_poll_db(pid:string) {
    if (!(pid in this.local_poll_dbs)) {
      this.local_poll_dbs[pid] = new PouchDB('local_poll_'+pid);
      this.G.L.info("DataService.get_local_poll_db new poll db", pid, this.local_poll_dbs[pid]);
    } 
    return this.local_poll_dbs[pid];
  }
  private ensure_local_poll_data(pid:string) {
    // start fetching poll data from local poll db:
    this.G.L.entry("DataService.start_reading_local_poll_db", pid);
    this._ready = false;
    this.uninitialized_pids.add(pid);
    this.ensure_poll_cache(pid);
    let lpdb = this.get_local_poll_db(pid);

    if ("state" in this.poll_caches[pid]) {
      // poll cache was restored from storage.
      this._pids.add(pid);

    } else {
      // this poll's cache was not reconstructed properly from storage, so get it from local PouchDB:

      // ASYNC:
      // fetch all docs from local poll db:
      lpdb.allDocs({
        include_docs: true
      }).then(result => {

        this.local_poll_docs2cache.bind(this)(pid, result)

      }).catch(err => {

        this.G.L.error("DataService.start_reading_local_poll_db could not fetch all docs", pid, err);

      }).finally(() => {

        this.uninitialized_pids.delete(pid);
        this.G.L.trace("DataService.start_reading_local_poll_db no. of still uninitialized pids:", this.uninitialized_pids.size);
        if (this.uninitialized_pids.size == 0) {
          this.local_docs2cache_finished();
        }  

      });
    }
    this.G.L.exit("DataService.start_reading_local_poll_db", pid);
  }
  private local_poll_docs2cache(pid:string, result) {
    this.G.L.entry("DataService.local_poll_docs2cache", pid);
    // decrypt and process all synced docs:
    for (let row of result.rows) {
      this.doc2poll_cache(pid, row.doc);
    }
    this._pids.add(pid);
    this.G.L.exit("DataService.local_poll_docs2cache", pid);
  }
  public connect_to_remote_poll_db(pid:string) {
    // called at poll initialization
    this.G.L.entry("DataService.connect_to_remote_poll_db", pid);
    // In order to be able to write our own voter docs, we connect as a voter dbuser (not as a poll dbuser!),
    // who has the same password as the overall user:
    let poll_db_private_username = "vodle.poll." + pid + ".voter." + this.getp(pid, 'vid');

    let promise = new Promise((resolve, reject) => {

      // ASYNC:
      this.get_remote_connection(
        this.getp(pid, 'db_server_url'), this.getp(pid, 'db_password'),
        poll_db_private_username, this.G.S.password
      ).then(db => { 

        this.remote_poll_dbs[pid] = db;
        // start synchronisation asynchronously:
        this.start_poll_sync(pid);

        // RESOLVE:
        resolve(true);

      }).catch(err => {

        this.G.L.warn("DataService.connect_to_remote_poll_db failed", pid, err);

        // REJECT:
        reject(err);

      });

    });
    this.G.L.exit("DataService.connect_to_remote_poll_db", pid);
    return promise;
  }

  // End of initialization:

  private local_docs2cache_finished() {
    // called whenever content of local docs has fully been copied to cache
    this.G.L.entry("DataService.local_user_docs2cache_finished");
    this.after_changes();
    // mark as ready, dismiss loading animation, and notify page:
    this.G.L.info("DataService READY");
    this._ready = true;
    this.hide_loading();
    if (this._page && this._page.onDataReady) this._page.onDataReady();
    this.G.L.exit("DataService.local_user_docs2cache_finished");
  }

  // HOOKS FOR OTHER SERVICES:

  public change_poll_state(p:Poll, new_state:string) {
    // called by PollService when changing state
    let pid = p.pid, pd = {}, prefix = get_poll_key_prefix(pid);
    this.G.L.entry("DataService.change_poll_state", pid, new_state);
    let old_state = this.user_cache[prefix + 'state'];

    if (old_state=='draft') {

      this.G.L.debug("DataService.change_poll_state old state was draft, so moving data from user db to poll db and then starting sync", pid, new_state);

      // move data from local user db to poll db.
      for (let [ukey, value] of Object.entries(this.user_cache)) {
        if (ukey.startsWith(prefix)) {
          // used db entry belongs to this poll.
          let key = ukey.substring(prefix.length);
          if ((key != 'state') && !poll_keys_in_user_db.includes(key)) {
            if (this._setp_in_polldb(pid, key, value as string)) {
              this.delu(ukey);
            } else {
              this.G.L.warn("DataService.change_poll_state couldn't move", pid, ukey, key);
            }
          }
        }
      }

      // finally, start synching with remote poll db:
      // check if db credentials are set:
      if (this.poll_has_db_credentials(pid)) {
        this.G.L.trace("DataService.change_poll_state found remote poll db credentials");
        // connect to remote and start sync:
        this.connect_to_remote_poll_db(pid).catch(err => {
          this.G.L.warn("DataService.change_poll_state couldn't start remote poll db syncing for", pid, err);
          // TODO
        });
      } else {
        this.G.L.warn("DataService.change_poll_state couldn't find remote poll db credential for", pid);
        // TODO
      }
    }

    if (new_state != 'draft') {
      this._setp_in_polldb(pid, 'state', new_state); 
    }
    this.setu(prefix + 'state', new_state);
    this.G.L.exit("DataService.change_poll_state");
  }

  // HOOKS FOR PAGES:

  public login_submitted() {
    // called by login page when all necessary login information was submitted on the login page
    this.G.L.entry("DataService.login_submitted");
    this.show_loading();
    if ((this.user_cache['db']||'')=='') {
      this.G.S.db = 'central';
    }
    this.email_and_password_exist();
  }

  // REMOTE CONNECTION METHODS:

  private get_remote_connection(server_url:string, public_password:string,
                                private_username:string, private_password:string
                                ): Promise<PouchDB> {
    // TODO: check network reachability!
    /* 
    Get a remote connection to a couchdb for storing user, poll, or voter data.
    For this, first connect as public user 'vodle', 
    check whether private user exist as db user,
    if necessary, generate it in the db, then connect again as this user,
    finally try creating/updating a timestamp file.
    */ 
    this.G.L.entry("DataService.get_remote_connection", server_url, public_password, private_username, private_password);
    // since all this may take some time,
    // make clear we are working:
    this.show_loading();

    // Then return a promise to start the process:
    let promise = new Promise((resolve, reject) => {

      // first connect to database "_users" with public credentials:
      let conn_as_public = this.get_couchdb(server_url+"/_users", "vodle", public_password);

      // ASYNC:
      // try to get info to see if credentials are valid:
      this.G.L.debug("DataService.get_remote_connection trying to get info for "+server_url+"/_users as user vodle");
      conn_as_public.info()
      .then(doc => { 

        this.G.L.debug("DataService logged into "+server_url+"/_users as user 'vodle'. Info:", doc);

        // then connect to database "vodle" with private credentials:
        let conn_as_private = this.get_couchdb(server_url+"/vodle", private_username, private_password);

        // ASYNC:
        // try to get info to see if credentials are valid:
        this.G.L.debug("DataService.get_remote_connection trying to get info for "+server_url+"/vodle as actual user "+private_username);
        conn_as_private.info()
        .then(doc => { 

          this.G.L.debug("DataService logged into "+server_url+" as actual user. Info:", doc);

          // ASYNC:
          this.test_remote_connection(conn_as_private, private_username, private_password)
          .then(success => {

            // RESOLVE:
            resolve(conn_as_private);

          }).catch(err => {

            // Since we could log in but not write, the db must be configured wrong:
            this.G.L.error("DataService.get_remote_connection could not write in database "+server_url+"/vodle as user "+private_username+ ". Please contact the database server admin!", err);

            // REJECT:
            reject(["write failed", err]);

          }) 

        }).catch(err => {

          this.G.L.debug("DataService.get_remote_connection could not log into "+server_url+"/vodle as actual user:", err);
          this.G.L.info("DataService.get_remote_connection: logging in for the first time as this user? Trying to register user "+private_username+" in database.");

          // ASYNC:
          // try to generate new user:
          conn_as_public.put({ 
            _id: "org.couchdb.user:"+private_username,
            name: private_username, 
            password: private_password,
            type: "user",
            roles: [],
            comment: "user generated by vodle"
          }).then(response => {

            this.G.L.debug("DataService.get_remote_connection generated user "+private_username);

            // connect again with private credentials:
            let conn_as_private = this.get_couchdb(server_url+"/vodle", private_username, private_password);
            this.G.L.debug("DataService.get_remote_connection trying to get info for "+server_url+"/vodle as actual user");

            // ASYNC:
            // try to get info to see if credentials are valid:
            conn_as_private.info()
            .then(doc => { 

              this.G.L.debug("DataService.get_remote_connection logged into "+server_url+" as new actual user. Info:", doc);

              // ASYNC:
              this.test_remote_connection(conn_as_private, private_username, private_password)
              .then(success => {

              // RESOLVE:
              resolve(conn_as_private);

              }).catch(err => {

                // Since we could log in but not write, the db must be configured wrong, so notify user of this:
                this.G.L.error("DataService could not write in database "+server_url+"/vodle as new user "+private_username+ ". Please contact the database server admin!", err);

                // REJECT:
                reject(["write failed", err]);

              }) 

            }).catch(err => {

              this.G.L.debug("DataService.get_remote_connection could not log into "+server_url+"/vodle as newly generated user:", err);
              reject(["private login failed", err]);

            });
          
          }).catch(err => {

            this.G.L.error("DataService.get_remote_connection could not generate user "+private_username, err);

            // REJECT:
            reject(["generate user failed", err]);

          });

        });

      }).catch(err => {

        this.G.L.error("DataService.get_remote_connection could not log into "+server_url+"/_users as user 'vodle':", err);

        // REJECT:
        reject(["public login failed", err]);

      });

    });

    this.G.L.exit("DataService.get_remote_connection");
    return promise;
  }
  private get_couchdb(url:string, username:string, password:string) {
    return new PouchDB(url, {
      auth: {username: username, password: password},
      skipSetup: true
    });
    // TODO: prevent Browser popup on 401?
  }
  private test_remote_connection(conn:PouchDB, private_username:string, private_password:string): Promise<boolean> {
    // FIXME: sometimes this gives an
    // ERROR Error: Uncaught (in promise): {"status":409,"name":"conflict","message":"Document update conflict"}
    return new Promise((resolve, reject) => {

      // TODO: try creating or updating a timestamp document
      let _id = "~"+private_username+":timestamp", value = encrypt((new Date()).toISOString(), private_password);

      // ASYNC:
      conn.get(_id)
      .then(doc => {

        // doc exists, try updating with current time:
        doc.value = value;
        conn.put(doc)
        .then(response => {

          resolve(true);

        }).catch(err => {

          reject(err);

        });

      }).catch(err => {

        // try generating new doc:
        conn.put({_id:_id, value:value})
        .then(response => {

          resolve(true);

        }).catch(err => {

          reject(err);
        });

      });

    });
  }

  // SYNCHRONISATION:

  private start_user_sync(): boolean {
    // try starting user data local <--> remote syncing:
    this.G.L.entry("DataService.start_user_sync");
    var result: boolean;

    if (this.remote_user_db) { 
      let email_and_pw_hash = this.email_and_pw_hash();
      this.G.L.info("DataService starting user data sync");

      // ASYNC:
      this.local_synced_user_db.sync(this.remote_user_db, {
        since: 0,
        live: true,
        retry: true,
        include_docs: true,
        filter: (doc, req) => (
          user_doc_id_prefix + email_and_pw_hash + ':' <= doc._id 
          && doc._id < user_doc_id_prefix + email_and_pw_hash + ';'   // ';' is the ASCII character after ':'
        ),
      }).on('change', this.handle_user_db_change.bind(this)
      ).on('paused', () => {
        // replication was paused, usually because of a lost connection
        this.G.L.info("DataService pausing user data sync");
      }).on('active', () => {
        // replication was resumed
        this.G.L.info("DataService resuming user data sync");
      }).on('denied', err => {
        // a document failed to replicate (e.g. due to permissions)
        this.G.L.error("DataService user data sync denied", err);
      }).on('complete', info => {
        // handle complete
        this.G.L.info("DataService completed user data sync", info);
      }).on('error', err => {
        // totally unhandled error (shouldn't happen)
        this.G.L.error("DataService error at user data sync", err);
      });

      result =  true;

    } else {

      result = false;

    }
    this.G.L.exit("DataService.start_user_sync", result);
    return result;
  }
  private start_poll_sync(pid:string): boolean {
    // try starting poll data local <--> remote syncing:
    this.G.L.entry("DataService.start_poll_sync", pid);
    var result: boolean;

    if (this.remote_poll_dbs[pid]) { 
      let email_and_pw_hash = this.email_and_pw_hash();
      this.G.L.info("DataService starting poll data sync", pid);

      // ASYNC:
      this.get_local_poll_db(pid).sync(this.remote_poll_dbs[pid], {
        since: 0,
        live: true,
        retry: true,
        include_docs: true,
        filter: (doc, req) => (
          // we want poll docs:
          (poll_doc_id_prefix + pid + ':' <= doc._id 
            && doc._id < poll_doc_id_prefix + pid + ';')   // ';' is the ASCII character after ':'
          // and voter docs:
          || (poll_doc_id_prefix + pid + '.voter.' <= doc._id 
              && doc._id < poll_doc_id_prefix + pid + '.voter/')  // '/' is the ASCII character after '.'
        ),
      }).on('change', change => {
        this.handle_poll_db_change.bind(this)(pid, change);
      }).on('paused', info => {
        // replication was paused, usually because of a lost connection
        this.G.L.info("DataService pausing poll data sync", pid, info);
      }).on('active', info => {
        // replication was resumed
        this.G.L.info("DataService resuming poll data syncing", pid, info);
      }).on('denied', err => {
        // a document failed to replicate (e.g. due to permissions)
        this.G.L.error("DataService poll data sync denied", pid, err);
      }).on('complete', info => {
        // handle complete
        this.G.L.info("DataService completed poll data sync", pid, info);
      }).on('error', err => {
        // totally unhandled error (shouldn't happen)
        this.G.L.error("DataService error at poll data sync", pid, err);
      });

      result =  true;

    } else {

      result = false;

    }
    this.G.L.exit("DataService.start_poll_sync", pid, result);
    return result;
  }

  // PUBLIC DATA ACCESS METHODS:

  public getu(key:string): string {
    // get user data item
    let value = this.user_cache[key] || '';
    if (!value && key=='language') {
      value = this.getu('local_language');
    }
    return value;
  }
  public setu(key:string, value:string): boolean {
    if (this.getu(key) == value) {
      return true;
    }
    // set user data item
    value = value || '';
    if (key=='language') {
      this.setu('local_language', value);
    } else if (key=='local_language') {
        this.translate.use(value!=''?value:environment.default_lang);
    }
    var old_values = {};
    if (keys_triggering_data_move.includes(key)) {
      // remember old credentials:
      for (let k of keys_triggering_data_move) {
        old_values[k] = this.user_cache[k];
      }
    }
    this.user_cache[key] = value;
    this.G.L.trace("DataService.setu", key, value);
    if (keys_triggering_data_move.includes(key)) {
      this.move_user_data(old_values);
    }
    return this.store_user_data(key, this.user_cache, key);
  }
  public delu(key:string) {
    // delete a user data item
    if (!(key in this.user_cache)) {
      this.G.L.trace("DataService.delp cannot delete unknown key", key);
      return;
    }
    delete this.user_cache[key];
    this.delete_user_data(key);
  }

  private pid_is_draft(pid): boolean {
    return this.user_cache[get_poll_key_prefix(pid) + 'state'] == 'draft';
  } 
  public getp(pid:string, key:string): string {
    // get poll data item
    var value = null;
    if (this.pid_is_draft(pid) || poll_keys_in_user_db.includes(key)) {
      // draft polls' data is stored in user's database:
      let ukey = get_poll_key_prefix(pid) + key;
      value = this.user_cache[ukey] || '';
    } else {
      // other polls' data is stored in poll's own database:
      this.ensure_poll_cache(pid);
      value = this.poll_caches[pid][key] || '';
    }
    return value;
  }
  public setp(pid:string, key:string, value:string): boolean {
    if (this.getp(pid, key) == value) {
      return true;
    }
    // set poll data item
    if (this.pid_is_draft(pid) || poll_keys_in_user_db.includes(key)) {
      return this._setp_in_userdb(pid, key, value);
    } else if (key.startsWith('option.')) {
      if (!(key in this.poll_caches[pid])) {
        return this._setp_in_polldb(pid, key, value);
      } else {
        this.G.L.error("DataService.setp change option attempted for existing entry", pid, key, value);
      }
    } else {
      this.G.L.error("DataService.setp non-local attempted for non-draft poll", pid, key, value);
    }
  }
  public delp(pid:string, key:string) {
    // delete a poll data item
    if (this.pid_is_draft(pid) || poll_keys_in_user_db.includes(key)) {
      // construct key for user db:
      let ukey = get_poll_key_prefix(pid) + key;
      this.delu(ukey);
    } else {
      if (!(pid in this.poll_caches) || !(key in this.poll_caches[pid])) {
        this.G.L.trace("DataService.delp cannot delete unknown combination", pid, key);
        return;
      }
      delete this.poll_caches[pid][key];
      this.delete_poll_data(pid, key);
    }      
  }

  public getv(pid:string, key:string): string {
    // get voter data item
    var value = null;
    if (voter_keys_in_user_db.includes(key)) {
      // construct key for user db:
      let ukey = get_poll_key_prefix(pid) + key;
      value = this.user_cache[ukey] || '';
    } else if (this.pid_is_draft(pid)) {
      // draft polls' data is stored in user's database.
      // construct key for user db:
      let ukey = get_poll_key_prefix(pid) + this.get_voter_key_prefix(pid) + key;
      value = this.user_cache[ukey] || '';
    } else {
      // other polls' data is stored in poll's own database.
      // construct key for poll db:
      let pkey = this.get_voter_key_prefix(pid) + key;
      this.ensure_poll_cache(pid);
      value = this.poll_caches[pid][pkey] || '';
    }
    return value;
  }
  public setv(pid:string, key:string, value:string): boolean {
    if (this.getv(pid, key) == value) {
      return true;
    }
    // set voter data item
    if (voter_keys_in_user_db.includes(key)) {
      // set voter data item in user db.
      value = value || '';
      // construct key for user db:
      let ukey = get_poll_key_prefix(pid) + key;
      this.G.L.trace("DataService._setv_in_userdb", pid, key, value);
      this.user_cache[ukey] = value;
      return this.store_user_data(ukey, this.user_cache, ukey);
    } else if (this.pid_is_draft(pid)) {
      return this._setv_in_userdb(pid, key, value);
    } else {
      return this._setv_in_polldb(pid, key, value);
    }
  }

  get_example_docs(): Promise<any> {
    let promise = this.remote_user_db.allDocs({
      include_docs: true,
      startkey: 'examples:;',
      endkey: 'examples;',
      inclusive_end: false,
      limit: 50
    });
    return promise;
  }

  // OTHER METHODS:

  private _setp_in_userdb(pid:string, key:string, value:string): boolean {
    // set poll data item in user db:
    value = value || '';
    // construct key for user db:
    let ukey = get_poll_key_prefix(pid) + key;
    this.G.L.trace("DataService._setp_in_userdb", pid, key, value);
    this.user_cache[ukey] = value;
    return this.store_user_data(ukey, this.user_cache, ukey);
  }
  private _setp_in_polldb(pid:string, key:string, value:string): boolean {
    // set poll data item in poll db:
    value = value || '';
    this.ensure_poll_cache(pid);
    this.G.L.trace("DataService._setp_in_polldb", pid, key, value);
    this.poll_caches[pid][key] = value;
    return this.store_poll_data(pid, key, this.poll_caches[pid], key);
  }
  private _setv_in_userdb(pid:string, key:string, value:string): boolean {
    // set voter data item in user db:
    value = value || '';
    // construct key for user db:
    let ukey = get_poll_key_prefix(pid) + this.get_voter_key_prefix(pid) + key;
    this.G.L.trace("DataService._setv_in_userdb", pid, key, value);
    this.user_cache[ukey] = value;
    return this.store_user_data(ukey, this.user_cache, ukey);
  }
  private _setv_in_polldb(pid:string, key:string, value:string): boolean {
    // set voter data item in poll db:
    value = value || '';
    // construct key for poll db:
    let pkey = this.get_voter_key_prefix(pid) + key;
    this.ensure_poll_cache(pid);
    this.G.L.trace("DataService._setv_in_polldb", pid, key, value);
    this.poll_caches[pid][pkey] = value;
    return this.store_poll_data(pid, pkey, this.poll_caches[pid], pkey);
  }

  private async show_loading() {
    this.G.L.entry("DataService.show_loading");
    this._loading = true;
    // start showing a loading animation which will be dismissed when initialization is finished
    this.loadingElement = await this.loadingController.create({
      spinner: 'crescent'
    });
    // since the previous operation might take some time,
    // only actually present the animation if data is not yet ready:
    if (this._loading && !this._ready) {
      // FIXME: why is the loadingElement not always dismissed?
      // await this.loadingElement.present();     
    }
    if (!this._loading) this.hide_loading();
    this.G.L.exit("DataService.show_loading");
  }
  private hide_loading() {
    if (this.loadingElement) this.loadingElement.dismiss();
    this._loading = false;
  }
  
  fix_url(url:string): string {
    // make sure remote db urls start with http:// or https://
    if (!url) return null;
    return (url.startsWith("http://")||url.startsWith("https://")) ? url : "http://" + url;
  }

  // DBs --> caches:

  private handle_user_db_change(change) {
    // called by PouchDB sync
    this.G.L.trace("DataService.handle_user_db_change");
    let local_changes = false;
    if (change.deleted){
      local_changes = this.handle_deleted_user_doc(change.doc);
    } else if (change.direction=='pull') {
      for (let doc of change.change.docs) {
        if (doc._deleted) {
          local_changes = this.handle_deleted_user_doc(doc);
        } else {
          var dummy;
          [local_changes, dummy] = this.doc2user_cache(doc);
        }
      }
    }
    if (local_changes) {
      this.after_changes();
      if (this._page.onDataChange) this._page.onDataChange();
    }
  }
  private handle_poll_db_change(pid, change) {
    // called by PouchDB sync
    this.G.L.trace("DataService.handle_poll_db_change", pid);
    let local_changes = false;
    if (change.deleted){
      local_changes = this.handle_deleted_poll_doc(pid, change.doc);
    } else if (change.direction=='pull') {
      for (let doc of change.change.docs) {
        if (doc._deleted) {
          local_changes = this.handle_deleted_poll_doc(pid, doc);
        } else {
          local_changes = this.doc2poll_cache(pid, doc);
        }
      }
    }
    if (local_changes) {
      this.after_changes();
      if (this._page.onDataChange) this._page.onDataChange();
    }
  }
  private handle_deleted_user_doc(doc): boolean {
    var _id = doc._id;
    if (_id.includes(':')) {
      var key = _id.slice(_id.indexOf(':') + 1);
      if (key in this.user_cache) {
        this.G.L.trace("DataService.handle_user_db_change deleting", key);
        delete this.user_cache[key];
        return true;    
      }  
    }
    return false;
  }
  private handle_deleted_poll_doc(pid:string, doc): boolean {
    // TODO: handle deleted rating (sets the rating to zero)
    if (!(pid in this.poll_caches)) {
      return false;
    }
    var _id = doc._id;
    if (_id.includes(pid)) {
      var key = _id.slice(_id.indexOf(pid) + pid.length + 1);
      if (key in this.poll_caches[pid]) {
        this.G.L.trace("DataService.handle_poll_db_change deleting", key);
        delete this.poll_caches[pid][key];
        return true;    
      }  
    }
    return false;
  }

  private after_changes() {
    this.G.L.entry("DataService.after_changes");
    var lang = this.getu('language');
    this.translate.use(lang!=''?lang:environment.default_lang);

    // process all known pids and, if necessary, generate Poll objects and connect to remote poll dbs:
    for (let pid of this._pids) {
      this.G.L.info("DataService.after_changes processing poll", pid);
      if (!(pid in this.G.P.polls)) {
        // poll object does not exist yet, so create it:
        this.G.L.debug("DataService.after_changes creating poll object", pid);
        let p = new Poll(this.G, pid);
      }
      if (!this.pid_is_draft(pid) && !(pid in this.remote_poll_dbs)) {
        // try syncing with remote db:
        // check if db credentials are set:
        if (this.poll_has_db_credentials(pid)) {
          this.G.L.trace("DataService.after_changes found remote poll db credentials");

          // ASYNC:
          // connect to remote and start sync:
          this.connect_to_remote_poll_db(pid)
          .catch(err => {

            this.G.L.warn("DataService.after_changes couldn't start poll db syncing", pid, err);
            // TODO: react somehow?

          });

        } else {

          this.G.L.warn("DataService.after_changes couldn't find remote poll db credentials", pid);
          // TODO: react somehow?

        }
      }
    }

    // process all known oids and, if necessary, generate Option objects:
    for (let [pid, oid] of this._pid_oids) {
      if (pid in this.G.P.polls) {
        let p = this.G.P.polls[pid];
        this.G.L.trace("DataService.after_changes processing option", pid, oid);
        if (!p.oids.includes(oid)) {
          // option object does not exist yet, so create it:
          this.G.L.trace("DataService.after_changes creating Option object", oid);
          let o = new Option(this.G, p, oid);
        }  
      } else {
        this.G.L.error("DataService.after_changes found an option for an unknown poll", pid, oid);
      }
    }

    this.G.L.exit("DataService.after_changes");
  }
  private poll_has_db_credentials(pid:string) {
    // return whether poll db credentials are nonempty:
    return this.getp(pid, 'db_server_url')!='' && this.getp(pid, 'db_password')!='' && this.getp(pid, 'vid')!='';
  }

  private ensure_poll_cache(pid:string) {
    if (!this.poll_caches[pid]) {
      this.poll_caches[pid] = {};
    }
  }

  private doc2user_cache(doc): [boolean, boolean] {
    // populate user cache with key, value from doc
    let _id = doc._id, prefix = user_doc_id_prefix + this.email_and_pw_hash() + ':';
    if (_id.startsWith(prefix)) {

      let key = _id.slice(prefix.length, _id.length);
      let value_changed = false, initializing_poll = false, cyphertext = doc['value'];
      this.G.L.trace("DataService.doc2user_cache cyphertext is", cyphertext);

      if (cyphertext) {

        // extract value and store in cache if changed:
        let value = decrypt(cyphertext, this.user_cache['password']);
        if (this.user_cache[key] != value) {
          this.user_cache[key] = value;
          value_changed = true;
        }
        this.G.L.trace("DataService.doc2user_cache key, value", key, value);

        if (this.check_whether_poll_or_option(key, value)) {
          initializing_poll = true;
        }

      } else {

        this.G.L.debug("DataService.doc2user_cache got corrupt doc", JSON.stringify(doc));

      }

      // RETURN whether the value actually changed.
      return [value_changed, initializing_poll];

    } else {

      this.G.L.error("DataService.doc2user_cache got corrupt doc _id", _id);
      // RETURN:
      return [false, false];

    }
  }

  private check_whether_poll_or_option(key:string, value:string): boolean {
    let initializing_poll = false;

    if (key.startsWith('poll.') && key.endsWith('.state')) {

      // it's a poll's state entry, so check whether we know this poll:
      let pid = key.slice('poll.'.length, key.indexOf('.state')), state = value;
      if (!this._pids.has(pid)) {
        this.G.L.trace("DataService.check_whether_poll_or_option found new poll", pid);
        if (state == 'draft') {
          this._pids.add(pid);
        } else {
          this.ensure_local_poll_data(pid);
          initializing_poll = true;
        }
      }

    } else if (key.startsWith('poll.') && key.includes('.option.') && key.endsWith('.name')) {

      // it's an option's oid entry, so check whether we know this option:
      let pid = key.slice('poll.'.length, key.indexOf('.option.')), 
          oid = key.slice(key.indexOf('.option.') + '.option.'.length, key.indexOf('.name'));
      if (!this._pid_oids.has([pid, oid])) {
        this.G.L.trace("DataService found new option", pid, oid);
        this._pid_oids.add([pid, oid]);
      }

    }
    return initializing_poll;
  }

  private doc2poll_cache(pid, doc): boolean {
    this.G.L.entry("DataService.doc2poll_cache", pid);
    let _id = doc._id, 
        poll_doc_prefix = poll_doc_id_prefix + pid + ':',
        voter_doc_prefix = poll_doc_id_prefix + pid + '.';
    var key, value_changed;

    if (_id.includes('due_and_state')) {
      // it's the combined due and state doc, so extract both:

      let prefix = get_poll_key_prefix(pid);
      let due = decrypt(doc['due'], this.user_cache[prefix + 'password']);
      let state = decrypt(doc['state'], this.user_cache[prefix + 'password']);
      value_changed = false;

      // store in cache if changed:
      this.ensure_poll_cache(pid);
      if (this.poll_caches[pid]['due'] != due) {
        this.poll_caches[pid]['due'] = due;
        value_changed = true;
      }  
      if (this.poll_caches[pid]['state'] != state) {
        this.poll_caches[pid]['state'] = state;
        // also set state in user db:
        this.setu(get_poll_key_prefix(pid) + 'state', state);
        if (pid in this.G.P.polls) {
          // also update poll's internal state cache:
          this.G.P.polls[pid]._state = state;
        }
        value_changed = true;
      }  

    } else {

      value_changed = false;
      let cyphertext = doc['value'];
      this.G.L.trace("DataService.doc2poll_cache cyphertext is", cyphertext);

      if (cyphertext) {

        // extract value:
        let value = decrypt(cyphertext, this.user_cache[get_poll_key_prefix(pid) + 'password']);

        // extract key depending on doc type:
        if (_id.startsWith(poll_doc_prefix)) {

          // it's a non-voter poll doc.
          key = _id.slice(poll_doc_prefix.length, _id.length);
          if (key.startsWith('option.') && key.endsWith('.oid')) {

            // it's an option's oid entry, so check whether we know this option:
            let oid = value;
            if (!this._pid_oids.has([pid, oid])) {
              this.G.L.trace("DataService.doc2poll_cache found new option", pid, oid);
              this._pid_oids.add([pid, oid]);
            }

          }

        } else if (_id.startsWith(voter_doc_prefix)) {

          // it's a voter doc.
          key = _id.slice(voter_doc_prefix.length, _id.length);

          let keyfromvid = key.slice('voter.'.length),
              vid = keyfromvid.slice(0, keyfromvid.indexOf(':')),
              subkey = keyfromvid.slice(vid.length + 1);
          this.G.L.trace("DataService.doc2poll_cache voter data item", pid, vid, subkey, value);
          if (subkey.startsWith("rating.")) {
            let oid = subkey.slice("rating.".length), r = Number.parseInt(value);
            this.G.P.update_rating(pid, vid, oid, r);
          }

        } else {

          // it's neither.
          this.G.L.error("DataService.doc2poll_cache got corrupt doc _id", pid, _id);
          this.G.L.exit("DataService.doc2poll_cache false");

          // RETURN:
          return false;

        }
        this.G.L.trace("DataService.doc2poll_cache key, value", pid, key, value);

        // store in cache if changed:
        this.ensure_poll_cache(pid);
        if (this.poll_caches[pid][key] != value) {
          this.poll_caches[pid][key] = value;
          if (key == "state" && pid in this.G.P.polls) {
            // update poll's internal state cache:
            this.G.P.polls[pid]._state = value;
          }
          value_changed = true;
        }  

      } else {

        this.G.L.warn("DataService.doc2poll_cache got corrupt doc", pid, JSON.stringify(doc));

      }
    }

    // returns whether the value actually changed.
    this.G.L.exit("DataService.doc2poll_cache value_changed", pid, value_changed);

    // RETURN:
    return value_changed;
  }

  // caches --> DBs:

  private store_all_userdata() {
    // stores user_cache in suitable DBs. 
    for (let [ukey, value] of Object.entries(this.user_cache)) {
      this.store_user_data(ukey, this.user_cache, ukey);
    }
  }

  private store_all_polldata(pid:string) {
    // stores poll_cache[pid] in suitable DBs. 
    for (let [key, value] of Object.entries(this.poll_caches[pid])) {
      this.store_poll_data(pid, key, this.poll_caches[pid], key);
    }
  }

  private store_user_data(key:string, dict, dict_key:string): boolean {
    // stores key and value = dict[dict_key] in user database. 
    this.G.L.trace("DataService.store_user_data", key, dict[dict_key]);
    var doc;

    if (local_only_user_keys.includes(key)) {

      // ASYNC:
      // simply use key as doc id and don't encrypt:
      this.local_only_user_DB.get(key)
      .then(doc => {
        // key existed in db, so update:

        let value = dict[dict_key];
        if (doc.value != value) {
          doc.value = value;
          this.local_only_user_DB.put(doc)
          .then(() => {
            this.G.L.trace("DataService.store_user_data local-only update", key, value);
          })
          .catch(err => {
            this.G.L.warn("DataService.store_user_data couldn't local-only update, will try again soon", key, value, doc, err);
            window.setTimeout(this.store_user_data.bind(this), environment.db_put_retry_delay_ms, key, dict, dict_key);
          });
        } else {
          this.G.L.trace("DataService.store_user_data local-only no need to update", key, value);
        }

      }).catch(err => {

        // key did not exist in db, so add:
        let value = dict[dict_key];
        doc = {_id: key, value: value};
        this.local_only_user_DB.put(doc)
        .then(response => {
          this.G.L.trace("DataService.store_user_data local-only new", key, value);
        })
        .catch(err => {
          this.G.L.warn("DataService.store_user_data couldn't local-only new, will try again soon", key, value, doc, err);
          // FIXME: why does this sometimes fail? Apparently the same item gets set twice in very close sequence. Why? 
          window.setTimeout(this.store_user_data.bind(this), environment.db_put_retry_delay_ms, key, dict, dict_key);
        });

      });

    } else {

      // store encrypted with suitable owner prefix in doc id:
      let email_and_pw_hash = this.email_and_pw_hash();
      if (!email_and_pw_hash) {
        this.G.L.warn("DataService.store_user_data couldn't set "+key+" since email or password are missing!");

        // RETURN:
        return false;
      }
      let _id = user_doc_id_prefix + email_and_pw_hash + ':' + key, 
          user_pw = this.user_cache['password'];

      // ASYNC:
      this.local_synced_user_db.get(_id)
      .then(doc => {

        // key existed in db, so update:
        let value = dict[dict_key], enc_value = encrypt(value, user_pw);
        if (decrypt(doc.value, user_pw) != value) {
          doc.value = enc_value;
          this.local_synced_user_db.put(doc)
          .then(response => {
            this.G.L.trace("DataService.store_user_data synced update", key, value);
          })
          .catch(err => {
            this.G.L.warn("DataService.store_user_data couldn't synced update, will try again soon", key, value, err);
            window.setTimeout(this.store_user_data.bind(this), environment.db_put_retry_delay_ms, key, dict, dict_key);
          });
        } else {
          this.G.L.trace("DataService.store_user_data synced no need to update", key, value);
        }

      }).catch(err => {

        // key did not exist in db, so add:
        let value = dict[dict_key], enc_value = encrypt(value, user_pw);
        doc = {
          '_id': _id, 
          'value': enc_value,
        };
        this.local_synced_user_db.put(doc)
        .then(response => {
          this.G.L.trace("DataService.store_user_data synced new", key, value);
        })
        .catch(err => {
          this.G.L.warn("DataService.store_user_data couldn't synced new, will try again soon", key, value, err);
          window.setTimeout(this.store_user_data.bind(this), environment.db_put_retry_delay_ms, key, dict, dict_key);
        });  

      });
    }

    // RETURN:
    return true;
  }
  private store_poll_data(pid:string, key:string, dict, dict_key:string): boolean {
    // stores key and value in poll database. 
    this.G.L.trace("DataService.store_poll_data", key, dict[dict_key]);
    var doc;

    // see what type of entry it is:
    if (key.indexOf(":") == -1) {

      // it's a non-voter data item.

      // store encrypted and with correct prefix:
      var _id, doc_value_key;
      if ((key == 'due') || (key == 'state')) {
        _id = poll_doc_id_prefix + pid + ':due_and_state';
        doc_value_key = key;
      } else {
        _id = poll_doc_id_prefix + pid + ':' + key;
        doc_value_key = 'value';
      }
      let poll_pw = this.user_cache[get_poll_key_prefix(pid) + 'password'];
      if ((poll_pw=='')||(!poll_pw)) {
        this.G.L.warn("DataService.store_poll_data couldn't set "+key+" in local_poll_DB since poll password is missing!");

        // RETURN:
        return false;
      }
      let db = this.get_local_poll_db(pid);

      // ASYNC:
      db.get(_id)
      .then(doc => {

        // key existed in poll db, check whether update is allowed.
        let value = dict[dict_key];
        let enc_value = encrypt(value, poll_pw);
          if ((doc_value_key == 'value') && (decrypt(doc.value, poll_pw) != value)) {
          // this is not allowed for poll docs!
          this.G.L.error("DataService.store_poll_data tried changing an existing poll data item", key, value);
        } else if ((doc_value_key == 'due') && (decrypt(doc.due, poll_pw) != value)) {
          // this is not allowed for poll docs!
          this.G.L.error("DataService.store_poll_data tried changing due time", key, value);
        } // TODO: also check state change against due time!

        // now update:
        if (decrypt(doc[doc_value_key], poll_pw) != value) {
          doc[doc_value_key] = enc_value;
          db.put(doc)
          .then(response => {
            this.G.L.trace("DataService.store_poll_data update", key, value);
          })
          .catch(err => {
            this.G.L.warn("DataService.store_poll_data couldn't update, will try again soon", key, value, doc, err);
            window.setTimeout(this.store_poll_data.bind(this), environment.db_put_retry_delay_ms, pid, key, dict, dict_key);
          });
        } else {
          this.G.L.trace("DataService.store_poll_data no need to update", key, value);
        }
        
      }).catch(err => {

        doc = {
          '_id': _id,
        };
        let value = dict[dict_key];
        let enc_value = encrypt(value, poll_pw);
        doc[doc_value_key] = enc_value;
        db.put(doc)
        .then(response => {
          this.G.L.trace("DataService.store_poll_data new", key, value);
        })
        .catch(err => {
          this.G.L.warn("DataService.store_poll_data couldn't new, will try again soon", key, value, doc, err);
          window.setTimeout(this.store_poll_data.bind(this), environment.db_put_retry_delay_ms, pid, key, dict, dict_key);
        });  

      });

      // RETURN:
      return true;

    } else {

      // it's a voter data item.

      // check which voter's data this is:
      let vid_prefix = key.slice(0, key.indexOf(':')),
          vid = this.user_cache[get_poll_key_prefix(pid) + 'vid'];
      if (vid_prefix != 'voter.' + vid) {
          // it is not allowed to alter other voters' data!
          this.G.L.error("DataService.store_poll_data tried changing another voter's data item", key);

          // RETURN: 
          return false;
      }

      let _id = poll_doc_id_prefix + pid + '.' + key,
          poll_pw = this.user_cache[get_poll_key_prefix(pid) + 'password'];
      if ((poll_pw=='')||(!poll_pw) || (vid=='')||(!vid)) {
        this.G.L.warn("DataService.store_poll_data couldn't set voter data "+key+" in local_poll_DB since poll password is missing!");

        // RETURN:
        return false;
      }

      // ASYNC:
      // try storing encrypted and with proper prefix:
      let value = dict[dict_key];
      let enc_value = encrypt(value, poll_pw);
      let db = this.get_local_poll_db(pid);
      db.get(_id)
      .then(doc => {

        // key existed in db, so update:
        if (decrypt(doc.value, poll_pw) != value) {
          doc.value = value;
          this.local_synced_user_db.put(doc)
          .then(response => {
            this.G.L.trace("DataService.store_poll_data update", key, value);
          })
          .catch(err => {
            this.G.L.warn("DataService.store_poll_data couldn't update, will try again soon", key, value, doc, err);
            window.setTimeout(this.store_poll_data.bind(this), environment.db_put_retry_delay_ms, pid, key, dict, dict_key);
          });
        } else {
          this.G.L.trace("DataService.store_poll_data no need to update", key, value);
        }

      }).catch(err => {

        // key did not exist in db, so add:
        let value = dict[dict_key];
        let enc_value = encrypt(value, poll_pw);
          doc = {
          '_id': _id,
          'value': enc_value,
        };
        db.put(doc)
        .then(response => {
          this.G.L.trace("DataService.store_poll_data new", key, value);
        })
        .catch(err => {
          this.G.L.warn("DataService.store_poll_data couldn't new, will try again soon", key, value, doc, err);
          window.setTimeout(this.store_poll_data.bind(this), environment.db_put_retry_delay_ms, pid, key, dict, dict_key);
        });  

      });

      // RETURN:
      return true;
    }
  }

  private delete_user_data(key:string): boolean {
    // deletes a key from the user database. 
    this.G.L.trace("DataService.delete_user_data", key);
    var db, _id;

    if (local_only_user_keys.includes(key)) {
      db = this.local_only_user_DB;
      // simply use key as doc id:
      _id = key;
    } else {
      db = this.local_synced_user_db;
      // compose id:
      let email_and_pw_hash = this.email_and_pw_hash();
      if (!email_and_pw_hash) {
        this.G.L.warn("DataService.delete_user_data couldn't delete "+key+" since email or password are missing!");

        // RETURN:
        return false;
      }
      _id = user_doc_id_prefix + email_and_pw_hash + ':' + key;
    }

    // ASYNC:
    db.get(_id)
    .then(doc => {
      // key existed in db, so delete:

      db.remove(doc)
      .then(() => {
        this.G.L.trace("DataService.delete_user_data local-only delete", key);
      })
      .catch(err => {
        this.G.L.warn("DataService.delete_user_data couldn't delete, will try again soon", key, doc, err);
        window.setTimeout(this.delete_user_data.bind(this), environment.db_put_retry_delay_ms, key);
      });

    }).catch(err => {

      // key did not exist in db:
      this.G.L.warn("DataService.delete_user_data no need to delete nonexistent key", key, err);

    });

    // RETURN:
    return true;
  }

  private delete_poll_data(pid:string, key:string): boolean {
    // deletes a key from a poll database. 
    this.G.L.trace("DataService.delete_poll_data", pid, key);

    let poll_pw = this.user_cache[get_poll_key_prefix(pid) + 'password'];
    var _id;

    // see what type of entry it is:
    if (key.indexOf(":") == -1) {

      // it's a non-voter data item.

      // use correct prefix:
      if ((key == 'due') || (key == 'state')) {
        _id = poll_doc_id_prefix + pid + ':due_and_state';
      } else {
        _id = poll_doc_id_prefix + pid + ':' + key;
      }
      if ((poll_pw=='')||(!poll_pw)) {
        this.G.L.warn("DataService.delete_poll_data couldn't delete "+key+" from local_poll_DB since poll password or voter id are missing!");

        // RETURN:
        return false;
      }

    } else {

      // it's a voter data item.

      // check which voter's data this is:
      let vid_prefix = key.slice(0, key.indexOf(':')),
          vid = this.user_cache[get_poll_key_prefix(pid) + 'vid'];
      if (vid_prefix != 'voter.' + vid) {
          // it is not allowed to alter other voters' data!
          this.G.L.error("DataService.delete_poll_data tried deleting another voter's data item", key);

          // RETURN: 
          return false;
      }

      _id = poll_doc_id_prefix + pid + '.' + key;
      if ((poll_pw=='')||(!poll_pw) || (vid=='')||(!vid)) {
        this.G.L.warn("DataService.delete_poll_data couldn't delete "+key+" from local_poll_DB since poll password or voter id are missing!");

        // RETURN:
        return false;
      }
    }

    let db = this.get_local_poll_db(pid);

    // ASYNC:
    db.get(_id)
    .then(doc => {
      // key existed in db, so delete:

      db.remove(doc)
      .then(() => {
        this.G.L.trace("DataService.delete_poll_data local-only delete", pid, key);
      })
      .catch(err => {
        this.G.L.warn("DataService.delete_poll_data couldn't delete, will try again soon", pid, key, doc, err);
        window.setTimeout(this.delete_poll_data.bind(this), environment.db_put_retry_delay_ms, pid, key);
      });

    }).catch(err => {

      // key did not exist in db:
      this.G.L.warn("DataService.delete_poll_data no need to delete nonexistent key", pid, key, err);

    });

    // RETURN:
    return true;

  }

  private email_and_pw_hash(): string {
    let email = this.user_cache['email'], pw = this.user_cache['password'];
    if ((email=='')||(!email) || (pw=='')||(!pw)) { return null; }
    let hash = myhash(email + ':' + pw);
//    this.G.L.trace("email_and_pw_hash:", email, pw, hash);
    return hash;
  }


  // DBs --> DBs:

  private move_user_data(old_values) {
    this.G.L.entry("DataService.move_user_data");
    // TODO!
  }

  // OTHER:

  get_voter_key_prefix(pid:string): string {
    return 'voter.' + this.getp(pid, 'vid') + ':';
  }
  
  format_date(date: Date): string {
    return date.toLocaleDateString(this.translate.currentLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }

}
