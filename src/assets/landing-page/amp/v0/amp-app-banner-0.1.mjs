;
(self.AMP=self.AMP||[]).push({m:1,v:"2203281422000",n:"amp-app-banner",ev:"0.1",l:!0,f:function(t,n){(()=>{function n(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,i=new Array(n);e<n;e++)i[e]=t[e];return i}function e(t,e){var i="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(i)return(i=i.call(t)).next.bind(i);if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return n(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);return"Object"===i&&t.constructor&&(i=t.constructor.name),"Map"===i||"Set"===i?Array.from(t):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?n(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var s=0;return function(){return s>=t.length?{done:!0}:{done:!1,value:t[s++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i;function s(){return i||(i=Promise.resolve(void 0))}var{hasOwnProperty:r,toString:o}=Object.prototype;function a(t){const n=Object.getOwnPropertyDescriptor(t,"message");if(null!=n&&n.writable)return t;const{message:e,stack:i}=t,s=new Error(e);for(const n in t)s[n]=t[n];return s.stack=i,s}function u(t){let n=null,i="";for(var s,r=e(arguments,!0);!(s=r()).done;){const t=s.value;t instanceof Error&&!n?n=a(t):(i&&(i+=" "),i+=t)}return n?i&&(n.message=i+": "+n.message):n=new Error(i),n}function l(t){var n,e;null===(n=(e=self).__AMP_REPORT_ERROR)||void 0===n||n.call(e,t)}var p=self.AMP_CONFIG||{},h=("string"==typeof p.thirdPartyFrameRegex?new RegExp(p.thirdPartyFrameRegex):p.thirdPartyFrameRegex,("string"==typeof p.cdnProxyRegex?new RegExp(p.cdnProxyRegex):p.cdnProxyRegex)||/^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/);function c(t){if(!self.document||!self.document.head)return null;if(self.location&&h.test(self.location.origin))return null;const n=self.document.head.querySelector(`meta[name="${t}"]`);return n&&n.getAttribute("content")||null}p.thirdPartyUrl,p.thirdPartyFrameHost,p.cdnUrl||c("runtime-host"),p.errorReportingUrl,p.betaErrorReportingUrl,p.localDev,p.geoApiUrl||c("amp-geo-api"),self.__AMP_LOG=self.__AMP_LOG||{user:null,dev:null,userForEmbed:null};var d=self.__AMP_LOG;function f(t,n){throw new Error("failed to call initLogConstructor")}function m(t){return d.user||(d.user=b()),function(t,n){return n&&n.ownerDocument.defaultView!=t}(d.user.win,t)?d.userForEmbed||(d.userForEmbed=b()):d.user}function b(t){return f()}function g(){return d.dev||(d.dev=f())}function v(t,n,e,i,s,r,o,a,u,l,p){return t}function _(t,n,e,i,s,r,o,a,u,l,p){return m().assert(t,n,e,i,s,r,o,a,u,l,p)}function x(t,n){return k(t=function(t){return t.__AMP_TOP||(t.__AMP_TOP=t)}(t),n)}function w(t,n){return k(y(P(t)),n)}function A(t,n){return function(t,n){const e=function(t,n){const e=E(t)[n];return e?e.promise?e.promise:(k(t,n),e.promise=Promise.resolve(e.obj)):null}(t,n);if(e)return e;const i=E(t);return i[n]=function(){const t=new class{constructor(){this.promise=new Promise(((t,n)=>{this.resolve=t,this.reject=n}))}},{promise:n,reject:e,resolve:i}=t;return n.catch((()=>{})),{obj:null,promise:n,resolve:i,reject:e,context:null,ctor:null}}(),i[n].promise}(y(t),n)}function P(t){return t.nodeType?(n=t,e=(n.ownerDocument||n).defaultView,x(e,"ampdoc")).getAmpDoc(t):t;var n,e}function y(t){const n=P(t);return n.isSingleDoc()?n.win:n}function k(t,n){v(I(t,n));const e=E(t)[n];return e.obj||(v(e.ctor),v(e.context),e.obj=new e.ctor(e.context),v(e.obj),e.context=null,e.resolve&&e.resolve(e.obj)),e.obj}function E(t){let n=t.__AMP_SERVICES;return n||(n=t.__AMP_SERVICES={}),n}function I(t,n){const e=t.__AMP_SERVICES&&t.__AMP_SERVICES[n];return!(!e||!e.ctor)}var T=t=>x(t,"platform"),M=t=>x(t,"preconnect"),C=t=>A(t,"storage"),R=t=>k(t,"timer"),V=t=>function(t,n){const e=y(P(t));return I(e,n)?k(e,n):null}(t,"url"),j=t=>w(t,"viewer");function $(t,n,e,i){let s;try{s=t.open(n,e,i)}catch(t){g().error("DOM","Failed to open url on target: ",e,t)}var r,o;return!s&&"_top"!=e&&("number"!=typeof o&&(o=0),o+"noopener".length>(r=i||"").length||-1===r.indexOf("noopener",o))&&(s=t.open(n,"_top")),s}var O="amp-app-banner",z=1500,B=class extends t.BaseElement{constructor(t){super(t),this.a$=null,this.l$=!1}openButtonClicked(t,n){}p$(t,n,e){t.addEventListener("click",(()=>{this.openButtonClicked(n,e)}))}h$(){const t=this.win.document.createElement("i-amphtml-app-banner-top-padding");this.element.appendChild(t);const n=this.win.document.createElement("button");n.classList.add("amp-app-banner-dismiss-button"),n.setAttribute("aria-label",this.element.getAttribute("data-dismiss-button-aria-label")||"Dismiss");const e=this.c$.bind(this);n.addEventListener("click",e),this.element.appendChild(n)}c$(){this.getVsync().run({measure:void 0,mutate:D},{element:this.element,viewport:this.getViewport(),storagePromise:C(this.getAmpDoc()),storageKey:this.d$()})}d$(){return"amp-app-banner:"+_(this.element.id,"amp-app-banner should have an id.")}isDismissed(){return C(this.getAmpDoc()).then((t=>t.get(this.d$()))).then((t=>!!t),(t=>(g().error(O,"Failed to read storage",t),!1)))}f$(){this.isDismissed().then((t=>{t?this.m$():(this.h$(),this.b$(),this.expand())}))}m$(){return this.getVsync().runPromise({measure:void 0,mutate:L},{element:this.element,viewport:this.getViewport()})}b$(){this.getVsync().run({measure:U,mutate:K},{element:this.element,viewport:this.getViewport()})}},F=class extends B{constructor(t){super(t),this.Ue=null,this.g$=null}preconnectCallback(t){this.element.parentNode&&M(this.win).url(this.getAmpDoc(),"https://itunes.apple.com",t)}buildCallback(){this.Ue=j(this.getAmpDoc());const t=T(this.win);this.l$=!this.Ue.isEmbedded()&&t.isSafari(),this.l$?this.m$():!this.Ue.isEmbedded()||this.Ue.hasCapability("navigateTo")?(this.g$=this.getAmpDoc().getMetaByName("apple-itunes-app"),null!==this.g$?(this.a$=_(this.element.querySelector("button[open-button]"),"<button open-button> is required inside %s: %s",O,this.element),this.v$(this.g$),this.f$()):this.m$()):this.m$()}layoutCallback(){return this.g$?(this.l$,s()):s()}openButtonClicked(t,n){this.Ue.isEmbedded()?(R(this.win).delay((()=>{this.Ue.sendMessage("navigateTo",{"url":n})}),z),this.Ue.sendMessage("navigateTo",{"url":t})):(R(this.win).delay((()=>{$(this.win,n,"_top")}),z),$(this.win,t,"_top"))}v$(t){const n=this.parseKeyValues(t),e=n["app-id"],i=n["app-argument"];i?_(V(this.element).isProtocolValid(i),"The url in app-argument has invalid protocol: %s",i):m().error(O,'<meta name="apple-itunes-app">\'s content should contain app-argument to allow opening an already installed application on iOS.');const s=`https://itunes.apple.com/us/app/id${e}`,r=i||s;this.p$(this.a$,r,s)}parseKeyValues(t){return t.replace(/\s/,"").split(",").reduce(((t,n)=>{const[e,i]=n.split("=");return t[e]=i,t}),{})}},S=class extends B{constructor(t){super(t),this._$=null,this.x$="",this.w$=!1}preconnectCallback(t){this.element.parentNode&&(M(this.win).url(this.getAmpDoc(),"https://play.google.com",t),this.x$&&M(this.win).preload(this.getAmpDoc(),this.x$))}buildCallback(){const{element:t,win:n}=this,e=j(this.getAmpDoc());this._$=n.document.head.querySelector("link[rel=manifest],link[rel=origin-manifest]");const i=T(n),s=V(t),r=i.isAndroid()&&i.isChrome(),o=s.isProxyOrigin(n.location);this.l$=!o&&!e.isEmbedded()&&r,this.l$?this.m$():(this.w$=i.isAndroid()&&!this._$,this.w$?this.m$():(this.x$=this._$.getAttribute("href"),s.assertHttpsUrl(this.x$,t,"manifest href"),this.a$=_(t.querySelector("button[open-button]"),"<button open-button> is required inside %s: %s",O,t),this.f$()))}layoutCallback(){return this.w$||this.l$?s():(t=this.win,x(t,"xhr")).fetchJson(this.x$,{}).then((t=>t.json())).then((t=>this.A$(t))).catch((t=>{this.m$(),function(t){const n=u.apply(null,arguments);setTimeout((()=>{throw l(n),n}))}(t)}));var t}openButtonClicked(t,n){R(this.win).delay((()=>{this.P$(n)}),z),$(this.win,t,"_top")}P$(t){this.win.top.location.assign(t)}A$(t){const n=t.related_applications;if(!n)return;const e=n.find((t=>"play"===t.platform));if(e){const t=`https://play.google.com/store/apps/details?id=${e.id}`,n=this.y$(e.id);this.p$(this.a$,n,t)}}y$(t){const{element:n}=this,{canonicalUrl:e}=w(n,"documentInfo").get(),i=V(n).parse(e),s=i.protocol.replace(":",""),{host:r,pathname:o}=i;return`android-app://${t}/${s}/${r}${o}`}};function D(t){L(t),t.storagePromise.then((n=>{n.set(t.storageKey,!0)}))}function L(t){var n,e;t.viewport.removeFromFixedLayer(t.element),null===(e=(n=t.element).parentElement)||void 0===e||e.removeChild(n),t.viewport.updatePaddingBottom(0)}function U(t){t.bannerHeight=t.viewport.getLayoutRect(t.element).height}function K(t){t.viewport.updatePaddingBottom(t.bannerHeight),t.viewport.addToFixedLayer(t.element)}t.registerElement(O,class extends B{constructor(t){super(t)}upgradeCallback(){const t=T(this.win);return t.isIos()?new F(this.element):t.isAndroid()?new S(this.element):null}layoutCallback(){return this.m$()}},'amp-app-banner{position:fixed!important;bottom:0!important;left:0;width:100%;max-height:100px!important;box-sizing:border-box;background:#fff;z-index:13;box-shadow:0 0 5px 0 rgba(0,0,0,0.2)!important}i-amphtml-app-banner-top-padding{position:absolute;top:0;left:0;right:0;background:#fff;height:4px;z-index:15}.amp-app-banner-dismiss-button{position:absolute;width:28px;height:28px;top:-28px;right:0;background-image:url(\'data:image/svg+xml;charset=utf-8,<svg width="13" height="13" viewBox="341 8 13 13" xmlns="http://www.w3.org/2000/svg"><path fill="%234F4F4F" d="M354 9.31 352.69 8l-5.19 5.19L342.31 8 341 9.31l5.19 5.19-5.19 5.19 1.31 1.31 5.19-5.19 5.19 5.19 1.31-1.31-5.19-5.19z" fill-rule="evenodd"/></svg>\');background-size:13px 13px;background-position:9px;background-color:#fff;background-repeat:no-repeat;z-index:14;box-shadow:0 -1px 1px 0 rgba(0,0,0,0.2);border:none;border-radius:12px 0 0 0}.amp-app-banner-dismiss-button:before{position:absolute;content:"";top:-20px;right:0;left:-20px;bottom:0}[dir=rtl] .amp-app-banner-dismiss-button{right:auto;left:0;border-top-left-radius:0;border-top-right-radius:12px;background-position:6px}[dir=rtl] .amp-app-banner-dismiss-button:before{right:-20px;left:0}\n/*# sourceURL=/extensions/amp-app-banner/0.1/amp-app-banner.css*/')})();
/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */}});
//# sourceMappingURL=amp-app-banner-0.1.mjs.map