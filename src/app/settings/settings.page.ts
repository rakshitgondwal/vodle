import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { IonInput, IonSelect } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { GlobalService } from "../global.service";
import { SelectServerComponent } from '../sharedcomponents/select-server/select-server.component';

/*
TODO:
- when changing password or server, alert that user needs to update password or server on other devices as well
*/

// custom validator to check that two fields match
export function passwords_match(control: AbstractControl): ValidationErrors | null {
  if (control) {
    const password = control.get('password');
    const confirm_password = control.get('confirm_password');
    if (password.errors) {
      return (password.errors);
    }
    if (confirm_password.value !== password.value) {
      return ({must_match: true});
    }
  }
  return null;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild(IonInput) retype_password: IonInput;
  @ViewChild(SelectServerComponent) select_server: SelectServerComponent;

  @ViewChildren(IonSelect) ionSelects: QueryList<IonSelect>;

  formGroup: FormGroup;
  editing_email: Boolean;
  editing_password: Boolean;
  showing_password: Boolean;
  showing_db_password: Boolean;

  constructor(
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public G: GlobalService) { }

  ngOnInit() {
    this.G.D.page = this;
    this.editing_email = false;
    this.editing_password = false;
    this.showing_password = false;
    this.showing_db_password = false;
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      pw: this.formBuilder.group({
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
        ])),
        confirm_password: new FormControl('', Validators.required),
      }, {
        validators: [passwords_match]
      }),
      language: new FormControl('', Validators.required),
      theme: new FormControl('', Validators.required),
    });
  }

  ionViewDidLoad() {
    this.select_server.parent = this; // FIXME!
    this.fill_form();
    this.ionSelects.map((select) => select.value = select.value);
  }

  pc_changed() {
    // called whenever data stored in pc has changed
    console.log("pc changed on settings page");
    this.fill_form();
  }

  fill_form() {
    // fill form fields with values from pc or defaults
    this.formGroup.setValue({
      email: this.G.settings.email||'',
      pw: {
        password: this.G.settings.password||'',
        confirm_password: this.G.settings.password||'',
      },
      language: this.G.settings.language||'en',
      theme: this.G.settings.theme||'light',
    });
    this.select_server.selectServerFormGroup.setValue({
      db: this.G.settings.db||'',
      db_from_pid: this.G.settings.db_from_pid||'',
      db_url: this.G.settings.db_url||'',
      db_username: this.G.settings.db_username||'',
      db_password: this.G.settings.db_password||'',
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'validation.email-required' },
      { type: 'email', message: 'validation.email-valid' }
    ],
    'password': [
      { type: 'required', message: 'validation.password-required' },
      { type: 'minlength', message: 'validation.password-length' },
      { type: 'pattern', message: 'validation.password-pattern' }  // verify that this is really what the validator tests
    ],
    'passwords_match': [
      { message: 'validation.passwords-match' }
    ],
  }
  
  set_email() {
    let c = this.formGroup.get('email');
    if (c.valid) this.G.settings.email = c.value; // will trigger data move
  }
  set_password() {
    let fg = this.formGroup.get('pw');
    if (fg.valid) this.G.settings.password = fg.get('password').value; // will trigger data move
  }
  set_db(value: string) {
    this.G.settings.db = value;
  }
  set_db_from_pid(value: string) {
    this.G.settings.db_from_pid = value;
  }
  set_db_url(value: string) {
    this.G.settings.db_url = value;
  }
  set_db_username(value: string) {
    this.G.settings.db_username = value;
  }
  set_db_password(value: string) {
    this.G.settings.db_password = value;
  }
  set_language() {
    let c = this.formGroup.get('language');
    if (c.valid) this.G.settings.language = c.value;
  }
  set_theme() {
    let c = this.formGroup.get('theme');
    if (c.valid) this.G.settings.theme = c.value;
  }

}