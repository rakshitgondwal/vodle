;
!function(n){var r=self.BENTO=self.BENTO||{};(r.bento=r.bento||[]).push((function(n){"use strict";function r(n,t){return(r=Object.setPrototypeOf||function(n,r){return n.__proto__=r,n})(n,t)}function t(n){return(t=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)})(n)}function o(n){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function e(n,r){if(r&&("object"===o(r)||"function"==typeof r))return r;if(void 0!==r)throw new TypeError("Derived constructors may only return object or undefined");return function(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}(n)}var i=(0,n.createContext)({slides:[],setSlides:function(n){}}),a=(0,n.contextProp)("base-carousel:1.0:context",{type:i,recursive:!0,defaultValue:null});function l(n,r,t){return r in n?Object.defineProperty(n,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[r]=t,n}function u(n,r){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable}))),t.push.apply(t,o)}return t}function c(n){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){l(n,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(n,r,Object.getOwnPropertyDescriptor(t,r))}))}return n}function s(n,r){(null==r||r>n.length)&&(r=n.length);for(var t=0,o=new Array(r);t<r;t++)o[t]=n[t];return o}function d(n,r){return function(n){if(Array.isArray(n))return n}(n)||function(n,r){var t=null==n?null:"undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(null!=t){var o,e,i=[],a=!0,l=!1;try{for(t=t.call(n);!(a=(o=t.next()).done)&&(i.push(o.value),!r||i.length!==r);a=!0);}catch(n){l=!0,e=n}finally{try{a||null==t.return||t.return()}finally{if(l)throw e}}return i}}(n,r)||function(n,r){if(n){if("string"==typeof n)return s(n,r);var t=Object.prototype.toString.call(n).slice(8,-1);return"Object"===t&&n.constructor&&(t=n.constructor.name),"Map"===t||"Set"===t?Array.from(n):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?s(n,r):void 0}}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var f={carousel:"carousel-d626044",scrollContainer:"scroll-container-d626044",hideScrollbar:"hide-scrollbar-d626044",horizontalScroll:"horizontal-scroll-d626044",verticalScroll:"vertical-scroll-d626044",slideElement:"slide-element-d626044",thumbnails:"thumbnails-d626044",startAlign:"start-align-d626044",centerAlign:"center-align-d626044",enableSnap:"enable-snap-d626044",disableSnap:"disable-snap-d626044",slideSizing:"slide-sizing-d626044",arrow:"arrow-d626044",ltr:"ltr-d626044",rtl:"rtl-d626044",arrowPrev:"arrow-prev-d626044",arrowNext:"arrow-next-d626044",arrowDisabled:"arrow-disabled-d626044",insetArrow:"inset-arrow-d626044",outsetArrow:"outset-arrow-d626044",defaultArrowButton:"default-arrow-button-d626044",arrowBaseStyle:"arrow-base-style-d626044",arrowFrosting:"arrow-frosting-d626044",arrowBackdrop:"arrow-backdrop-d626044",arrowBackground:"arrow-background-d626044",arrowIcon:"arrow-icon-d626044"},b="arrow-base-style-d626044";function p(n,r){if(null==n)return{};var t,o,e={},i=Object.keys(n);for(o=0;o<i.length;o++)t=i[o],r.indexOf(t)>=0||(e[t]=n[t]);return e}function v(){var n=0;return function(){return String(++n)}}Array.isArray;var h=Object.prototype;function w(n){return(n.ownerDocument||n).defaultView}function x(n,r){return n>0&&r>0?n%r:(n%r+r)%r}function m(r){var t=r.advance,o=r.as,e=void 0===o?g:o,i=r.by,a=r.disabled,l=r.outsetArrows,u=r.rtl,c=(0,n.useCallback)((function(){a||t()}),[t,a]);return(0,n.createElement)(e,{"aria-disabled":String(!!a),by:i,class:"arrow-d626044"+(a?" arrow-disabled-d626044":"")+(i<0?" arrow-prev-d626044":"")+(i>0?" arrow-next-d626044":"")+(l?" outset-arrow-d626044":"")+(l?"":" inset-arrow-d626044")+(u?" rtl-d626044":"")+(u?"":" ltr-d626044"),disabled:a,onClick:c,outsetArrows:l,rtl:u.toString()})}function g(r){var t=r["aria-disabled"],o=r.by,e=r.disabled,i=r.onClick,a=r.class;return(0,n.createElement)("div",{class:a},(0,n.createElement)("button",{"aria-disabled":t,"aria-label":o<0?"Previous item in carousel":"Next item in carousel",class:"default-arrow-button-d626044",disabled:e,onClick:i},(0,n.createElement)("div",{class:"".concat(b," ").concat("arrow-frosting-d626044")}),(0,n.createElement)("div",{class:"".concat(b," ").concat("arrow-backdrop-d626044")}),(0,n.createElement)("div",{class:"".concat(b," ").concat("arrow-background-d626044")}),(0,n.createElement)("svg",{class:"arrow-icon-d626044",viewBox:"0 0 24 24"},(0,n.createElement)("path",{d:o<0?"M14,7.4 L9.4,12 L14,16.6":"M10,7.4 L14.6,12 L10,16.6",fill:"none","stroke-width":"2px","stroke-linejoin":"round","stroke-linecap":"round"}))))}h.hasOwnProperty,h.toString;var y="start",k="horizontal";function C(n,r){var t=r.getBoundingClientRect(),o=t.bottom,e=t.height,i=t.left,a=t.right,l=t.top,u=t.width;return{start:Math.round(0==n?i:l),end:Math.round(0==n?a:o),length:Math.round(0==n?u:e)}}function A(n,r){var t=C(n,r),o=t.end;return(t.start+o)/2}function S(n,r){return C(n,r).start}function j(n,r,t){return r==y?S(n,t):A(n,t)}function O(n,r,t){var o=C(n,r),e=o.end;return o.start<=t&&t<e}function z(n,r){return 0==n?r.scrollLeft:r.scrollTop}function B(n,r){return 0==n?r.scrollWidth:r.scrollHeight}function M(n,r,t){!function(n,r,t){0==n?r.scrollLeft=t:r.scrollTop=t}(n,r,z(n,r)+t)}function L(n,r,t,o){var e=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,i=r==y,a=C(n,o).length,l=i?S(n,o):A(n,o),u=i?S(n,t):A(n,t),c=Math.round(l-u-e*a);M(n,t,c);var s=C(n,t).length+z(n,t)+c<B(n,t);return!!c&&s}var N,I={arrow:"arrow-066b665",auto:"auto-066b665",caption:"caption-066b665",captionText:"caption-text-066b665",clip:"clip-066b665",closeButton:"close-button-066b665",control:"control-066b665",controlsPanel:"controls-panel-066b665",expanded:"expanded-066b665",hideControls:"hide-controls-066b665",lightbox:"lightbox-066b665",gallery:"gallery-066b665",grid:"grid-066b665",nextArrow:"next-arrow-066b665",prevArrow:"prev-arrow-066b665",showControls:"show-controls-066b665",thumbnail:"thumbnail-066b665",topControl:"top-control-066b665"},P=("".concat(56,"px !important"),"".concat(80,"px !important"),"".concat(5,"px !important"),"0px ".concat(5,"px !important"),"".concat(56,"px !important"),"calc(100% - ".concat(56,"px) !important"),"repeat(4, calc(1024px/4 - ".concat(5,"px * 5 / 4))"),"".concat(80,"px !important"),"calc(100% - ".concat(80,"px) !important"),"".concat(40,"px !important"),"control-066b665"),R="gallery-066b665",E="top-control-066b665",T=["Webkit","webkit","Moz","moz","ms","O","o"];function D(n,r,t,o,e){var i=function(n,r,t){if(r.startsWith("--"))return r;var o;N||(o=Object.create(null),N=o);var e=N[r];if(!e||t){if(e=r,void 0===n[r]){var i=function(n){return n.charAt(0).toUpperCase()+n.slice(1)}(r),a=function(n,r){for(var t=0;t<T.length;t++){var o=T[t]+r;if(void 0!==n[o])return o}return""}(n,i);void 0!==n[a]&&(e=a)}t||(N[r]=e)}return e}(n.style,r,e);if(i){var a,l=o?t+o:t;n.style.setProperty((a=i.replace(/[A-Z]/g,(function(n){return"-"+n.toLowerCase()})),T.some((function(n){return a.startsWith(n+"-")}))?"-".concat(a):a),l)}}var F=["animation","children","closeButtonAs","onAfterClose","onAfterOpen","onBeforeOpen"],G={"fade-in":[{opacity:0,visibility:"visible"},{opacity:1,visibility:"visible"}],"fly-in-top":[{opacity:0,transform:"translate(0,-100%)",visibility:"visible"},{opacity:1,transform:"translate(0, 0)",visibility:"visible"}],"fly-in-bottom":[{opacity:0,transform:"translate(0, 100%)",visibility:"visible"},{opacity:1,transform:"translate(0, 0)",visibility:"visible"}]},Y={"part":"scroller"},Z=(0,n.forwardRef)((function(r,t){var o=r.animation,e=void 0===o?"fade-in":o,i=r.children,a=r.closeButtonAs,l=r.onAfterClose,u=r.onAfterOpen,s=r.onBeforeOpen,f=p(r,F),b=d((0,n.useState)(!1),2),v=b[0],h=b[1],w=d((0,n.useState)(!1),2),x=w[0],m=w[1],g=(0,n.useRef)(),y=(0,n.useValueRef)(e),k=(0,n.useValueRef)(s),C=(0,n.useValueRef)(l),A=(0,n.useValueRef)(u);return(0,n.useImperativeHandle)(t,(function(){return{open:function(){var n;null===(n=k.current)||void 0===n||n.call(k),h(!0),m(!0)},close:function(){return m(!1)}}}),[k]),(0,n.useLayoutEffect)((function(){var n=g.current;if(n){var r;if(D(n,"visibility",x?"hidden":"visible"),x){var t=function(){var r;D(n,"opacity",1),D(n,"visibility","visible"),function(n){try{n.focus()}catch(n){}}(n),null===(r=A.current)||void 0===r||r.call(A)};if(!n.animate)return void t();(r=n.animate(G[y.current],{duration:200,fill:"both",easing:"ease-in"})).onfinish=t}else{var o=function(){D(n,"opacity",0),D(n,"visibility","hidden"),C.current&&C.current(),r=null,h(!1)};if(!n.animate)return void o();(r=n.animate(G[y.current],{duration:200,direction:"reverse",fill:"both",easing:"ease-in"})).onfinish=o}return function(){r&&r.cancel()}}}),[x,y,C,A]),v&&(0,n.createElement)(n.ContainWrapper,c({ref:g,size:!0,layout:!0,paint:!0,part:"lightbox",contentClassName:"content-213f9e3",wrapperClassName:"wrapper-213f9e3",contentProps:Y,role:"dialog",tabindex:"0",onKeyDown:function(n){"Escape"===n.key&&m(!1)}},f),(0,n.createElement)(_,{as:a,onClick:function(){return m(!1)}}),i)}));function _(r){var t=r.onClick,o=r.as,e=void 0===o?V:o;return(0,n.createElement)(e,{"aria-label":"Close the modal",onClick:t})}function V(r){var t=r["aria-label"],o=r.onClick;return(0,n.createElement)("button",{"aria-label":t,class:"close-button-213f9e3",onClick:o,tabindex:-1})}Z.displayName="Lightbox";var K=(0,n.createContext)({deregister:function(){},register:function(){},open:function(){}}),U="default",W="auto",X="clip",$={"aria-label":"Toggle caption expanded state.","role":"button"},q=(0,n.forwardRef)((function(r,t){var o=r.children,e=r.onAfterClose,i=r.onAfterOpen,a=r.onBeforeOpen,l=r.onToggleCaption,u=r.onViewGrid,s=r.render,f=I,b=(0,n.useRef)(null),p=(0,n.useRef)(null),v=d((0,n.useState)(0),2),h=v[0],w=v[1],m=(0,n.useRef)({}),g=(0,n.useRef)({}),y=(0,n.useRef)({}),k=(0,n.useRef)({}),C=(0,n.useRef)({}),A=d((0,n.useState)(!0),2),S=A[0],j=A[1],O=d((0,n.useState)(!0),2),z=O[0],B=O[1],M=d((0,n.useState)(null),2),L=M[0],N=M[1],E=(0,n.useCallback)((function(r){var t=null!=r?r:Object.keys(m.current)[0];t&&(k.current[t]||(k.current[t]=[],C.current[t]=[],y.current[t]=0),m.current[t].forEach((function(r,o){if(!k.current[t][o]){var e=y.current[t];k.current[t][o]=r(),C.current[t][o]=(0,n.createElement)(nn,{onClick:function(){j(!0),w(e)},render:r}),y.current[t]+=1}})),N(t))}),[]),T=(0,n.useCallback)((function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:U,t=arguments.length>2?arguments[2]:void 0,o=arguments.length>3?arguments[3]:void 0;m.current[r]||(m.current[r]=[],g.current[r]=[]),m.current[r][n-1]=t,g.current[r][n-1]=o}),[]),D=(0,n.useCallback)((function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:U;delete m.current[r][n-1],delete g.current[r][n-1],delete k.current[r][n-1],y.current[r]--}),[]),F=(0,n.useCallback)((function(n,r){var t;E(r),B(!0),j(!0),null!=n&&w(n),null===(t=b.current)||void 0===t||t.open()}),[E]),G={deregister:D,register:T,open:F},Y=(0,n.useRef)(void 0),_=d((0,n.useState)(null),2),V=_[0],q=_[1],rn=d((0,n.useState)(W),2),tn=rn[0],on=rn[1];return(0,n.useLayoutEffect)((function(){var n;if(null===(n=p.current)||void 0===n||n.goToSlide(h),L){var r=m.current[L].length-y.current[L]+x(h,y.current[L]);q(g.current[L][r]),on(W)}}),[L,h]),(0,n.useLayoutEffect)((function(){var n,r=null!==(n=Y.current)&&void 0!==n?n:{},t=r.offsetHeight;r.scrollHeight>t+40&&on(X)}),[V]),(0,n.useImperativeHandle)(t,(function(){return{open:F,close:function(){var n;null===(n=b.current)||void 0===n||n.close()}}}),[F]),(0,n.createElement)(n.Fragment,null,(0,n.createElement)(Z,{class:"lightbox-066b665"+(z?" show-controls-066b665":"")+(z?"":" hide-controls-066b665"),closeButtonAs:H,onBeforeOpen:a,onAfterOpen:i,onAfterClose:e,ref:b},(0,n.createElement)("div",{class:"controls-panel-066b665"},(0,n.createElement)(Q,{onClick:function(){S&&(null==u||u()),j(!S)},showCarousel:S})),(0,n.createElement)(dn,{arrowPrevAs:J,arrowNextAs:J,class:R,defaultSlide:x(h,y.current[L])||0,hidden:!S,loop:!0,onClick:function(){return B(!z)},onSlideChange:function(n){return w(n)},ref:p},k.current[L]),(0,n.createElement)("div",c({hidden:!S,class:"caption-066b665 "+P+" "+f[tn],ref:Y},tn===W?null:c({onClick:function(){null==l||l(),on(tn===X?"expanded":X)}},$)),(0,n.createElement)("div",{class:"caption-text-066b665 amp-lightbox-gallery-caption",part:"caption"},V)),!S&&(0,n.createElement)("div",{class:R+" grid-066b665"},C.current[L])),(0,n.createElement)(K.Provider,{value:G},s?s():o))}));function H(r){var t=r.onClick;return(0,n.createElement)("svg",{"aria-label":"Close the lightbox",class:P+" "+E+" close-button-066b665",onClick:t,role:"button",tabindex:"0",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,n.createElement)("path",{d:"M6.4 6.4 L17.6 17.6 Z M17.6 6.4 L6.4 17.6 Z",stroke:"#fff","stroke-width":"2","stroke-linejoin":"round"}))}function J(r){var t=r["aria-disabled"],o=r.by,e=r.disabled,i=r.onClick;return(0,n.createElement)("svg",{"aria-disabled":t,class:"arrow-066b665 "+P+(o<0?" prev-arrow-066b665":"")+(o>0?" next-arrow-066b665":""),disabled:e,onClick:i,role:"button",tabindex:"0",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,n.createElement)("path",{d:o<0?"M14,7.4 L9.4,12 L14,16.6":"M10,7.4 L14.6,12 L10,16.6",fill:"none",stroke:"#fff","stroke-width":"2","stroke-linejoin":"round","stroke-linecap":"round"}))}function Q(r){var t=r.onClick,o=r.showCarousel;return(0,n.createElement)("svg",{"aria-label":o?"Switch to grid view":"Switch to carousel view",class:P+" "+E,onClick:t,role:"button",tabindex:"0",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},o?(0,n.createElement)("g",{fill:"#fff"},(0,n.createElement)("rect",{x:"3",y:"3",width:"6",height:"8",rx:"1",ry:"1"}),(0,n.createElement)("rect",{x:"15",y:"13",width:"6",height:"8",rx:"1",ry:"1"}),(0,n.createElement)("rect",{x:"11",y:"3",width:"10",height:"8",rx:"1",ry:"1"}),(0,n.createElement)("rect",{x:"3",y:"13",width:"10",height:"8",rx:"1",ry:"1"})):(0,n.createElement)(n.Fragment,null,(0,n.createElement)("rect",{x:"4",y:"4",width:"16",height:"16",rx:"1","stroke-width":"2",stroke:"#fff",fill:"none"}),(0,n.createElement)("circle",{fill:"#fff",cx:"15.5",cy:"8.5",r:"1.5"}),(0,n.createElement)("polygon",{fill:"#fff",points:"5,19 5,13 8,10 13,15 16,12 19,15 19,19"})))}function nn(r){var t=r.onClick,o=r.render;return(0,n.createElement)("div",{"aria-label":"View in carousel",class:"thumbnail-066b665",onClick:t,role:"button",tabindex:"0"},o())}q.displayName="BentoLightboxGalleryProvider";var rn=["alt","aria-label","as","caption","children","enableActivation","group","onMount","render","srcset"],tn=v(),on={"aria-label":"Open content in a lightbox view.",role:"button",tabIndex:0},en=function(r){return(0,n.cloneElement)(r)};function an(r){var t=r.alt,o=r["aria-label"],e=r.as,i=void 0===e?"div":e,a=r.caption,l=r.children,u=r.enableActivation,s=void 0===u||u,f=r.group,b=r.onMount,v=r.render,h=r.srcset,w=p(r,rn),x=d((0,n.useState)(tn),1)[0],m=(0,n.useContext)(K),g=m.deregister,y=m.open,k=m.register,C=(0,n.useCallback)((function(){return v?v():l?n.Children.map(l,en):(0,n.createElement)(i,{srcset:h})}),[l,v,h,i]),A=(0,n.useMemo)((function(){return a||t||o}),[t,o,a]);(0,n.useLayoutEffect)((function(){return k(x,f,C,A),function(){return g(x,f)}}),[A,x,f,g,k,C]),(0,n.useLayoutEffect)((function(){return null==b?void 0:b(Number(x)-1)}),[x,b]);var S=(0,n.useMemo)((function(){return s&&c(c({},on),{},{onClick:function(){y(Number(x)-1,f)}})}),[s,x,f,y]);return(0,n.createElement)(i,c(c({},S),{},{srcset:h},w),l)}var ln=(0,n.forwardRef)((function(r,t){var o=r._thumbnails,e=r.advanceCount,i=r.alignment,a=r.axis,l=r.children,u=r.lightboxGroup,c=r.loop,s=r.mixedLength,d=r.onClick,b=r.restingIndex,p=r.setRestingIndex,v=r.snap,h=r.snapBy,m=void 0===h?1:h,g=r.visibleCount,y=(0,n.useRef)(null),k=c?Math.floor(l.length/2):b,A=(0,n.useRef)(!1),S=(0,n.useCallback)((function(n){var r=y.current;r&&(I.current=x(I.current+n,l.length),M.current=0,L(a,i,r,r.children[x(k+n,r.children.length)],M.current)||p(I.current))}),[i,a,l.length,k,p]);(0,n.useImperativeHandle)(t,(function(){return{advance:S,next:function(){return S(e)},prev:function(){return S(-e)},get node(){return y.current}}}),[S,e]);var z=f,B=(0,n.useRef)(b),M=(0,n.useRef)(0),N=function(r,t){var o=r._thumbnails,e=r.alignment,i=r.children,a=r.lightboxGroup,l=r.loop,u=r.mixedLength,c=r.offsetRef,s=r.pivotIndex,d=r.restingIndex,f=r.snap,b=r.snapBy,p=r.visibleCount,v=i.length,h=a?an:"div",w=i.map((function(r,i){var l="slide-".concat(r.key||i);return(0,n.createElement)(h,{caption:r.props.caption,key:l,"data-slide":i,class:"".concat(t.slideSizing," ").concat(t.slideElement," ").concat(f&&0===x(i,b)?t.enableSnap:t.disableSnap," ").concat("center"===e?t.centerAlign:t.startAlign," ").concat(o?t.thumbnails:""," "),group:a||void 0,part:"slide",style:{flex:u?"0 0 auto":"0 0 ".concat(100/p,"%")}},r)}));if(!l)return w;var m=[],g=[],y=x(v-d+s,v);if(d<=s)for(var k=0;k<y;k++)m.unshift(w.pop());else for(var C=0;C<v-y;C++)g.push(w.shift());return c.current=m.length?m.length:-g.length,(0,n.createElement)(n.Fragment,null,m,w,g)}({alignment:i,children:l,loop:c,mixedLength:s,offsetRef:B,lightboxGroup:u,pivotIndex:k,restingIndex:b,snap:v,snapBy:m,visibleCount:g,_thumbnails:o},z),I=(0,n.useRef)(b),P=(0,n.useCallback)((function(){if(y.current&&y.current.children.length){var n=y.current;D(n,"scrollBehavior","auto"),A.current=!0,L(a,i,n,n.children[k],M.current),D(n,"scrollBehavior","smooth")}}),[i,a,k]);(0,n.useLayoutEffect)((function(){y.current&&c&&y.current.children.length&&P()}),[c,b,P]),(0,n.useLayoutEffect)((function(){if(y.current){var n=y.current;if(n){var r=w(n);if(r){var t=new r.ResizeObserver(P);return t.observe(n),function(){return t.disconnect()}}}}}),[P]);var R=(0,n.useMemo)((function(){return function(n,r,t){var o=0,e=0,i=null;function a(){o=0;var l,u=t-(n.Date.now()-e);u>0?o=n.setTimeout(a,u):(l=i,i=null,r.apply(null,l))}return function(){e=n.Date.now();for(var r=arguments.length,l=new Array(r),u=0;u<r;u++)l[u]=arguments[u];i=l,o||(o=n.setTimeout(a,t))}}(y.current?w(y.current):window,(function(){null!==I.current&&I.current!==b&&p(I.current)}),200)}),[b,p]);return(0,n.createElement)("div",{ref:y,onClick:d,onScroll:function(){A.current?A.current=!1:(function(){var n=y.current;if(n){var r=function(n,r,t,o,e){var i=j(n,r,t);if(O(n,o[e],i))return e;for(var a=1;a<=o.length/2;a++){var l=x(e+a,o.length),u=x(e-a,o.length);if(O(n,o[l],i))return l;if(O(n,o[u],i))return u}}(a,i,n,n.children,k);v||(M.current=function(n,r,t,o){return(j(n,r,o)-j(n,r,t))/C(n,o).length}(a,i,n,n.children[r])),I.current=x(r-B.current,l.length)}}(),R())},class:"".concat("scroll-container-d626044"," ").concat("hide-scrollbar-d626044"," ").concat(0===a?"horizontal-scroll-d626044":"vertical-scroll-d626044"),tabindex:0},N)}));ln.displayName="Scroller";var un=["advanceCount","arrowPrevAs","arrowNextAs","autoAdvance","autoAdvanceCount","autoAdvanceInterval","autoAdvanceLoops","children","controls","defaultSlide","dir","lightbox","loop","mixedLength","onClick","onFocus","onMouseEnter","onSlideChange","onTouchStart","orientation","outsetArrows","snap","snapAlign","snapBy","visibleCount","_thumbnails"],cn="auto",sn=v(),dn=(0,n.forwardRef)((function(r,t){var o,e,a=r.advanceCount,l=void 0===a?1:a,u=r.arrowPrevAs,s=r.arrowNextAs,f=r.autoAdvance,b=void 0!==f&&f,v=r.autoAdvanceCount,h=void 0===v?1:v,g=r.autoAdvanceInterval,A=void 0===g?1e3:g,S=r.autoAdvanceLoops,j=void 0===S?Number.POSITIVE_INFINITY:S,O=r.children,z=r.controls,M=void 0===z?"auto":z,L=r.defaultSlide,N=void 0===L?0:L,I=r.dir,P=void 0===I?cn:I,R=r.lightbox,E=void 0!==R&&R,T=r.loop,D=r.mixedLength,F=void 0!==D&&D,G=r.onClick,Y=r.onFocus,Z=r.onMouseEnter,_=r.onSlideChange,V=r.onTouchStart,K=r.orientation,U=void 0===K?k:K,W=r.outsetArrows,X=void 0!==W&&W,$=r.snap,q=void 0===$||$,H=r.snapAlign,J=void 0===H?y:H,Q=r.snapBy,nn=void 0===Q?1:Q,rn=r.visibleCount,tn=void 0===rn?1:rn,on=r._thumbnails,en=void 0!==on&&on,an=p(r,un),dn=(0,n.useMemo)((function(){return n.Children.toArray(O)}),[O]),fn=dn.length,bn=(0,n.useContext)(i),pn=d((0,n.useState)(Math.min(Math.max(N,0),fn)),2),vn=pn[0],hn=pn[1],wn=null!==(o=bn.currentSlide)&&void 0!==o?o:vn,xn=null!==(e=bn.setCurrentSlide)&&void 0!==e?e:hn,mn=en?vn:wn,gn=en?hn:xn,yn=(0,n.useRef)(mn),kn=U==k?0:1,Cn=d((0,n.useState)(sn),1)[0];(0,n.useLayoutEffect)((function(){gn(wn)}),[wn,gn]);var An=bn.setSlides,Sn=bn.slides,jn=(0,n.useRef)(null),On=(0,n.useRef)(null),zn=(0,n.useRef)(null),Bn=(0,n.useRef)(0),Mn=(0,n.useMemo)((function(){return Math.max(A,1e3)}),[A]),Ln=(0,n.useCallback)((function(){return!(Bn.current+tn/fn>=j||4!==En.current||(T||yn.current+tn<fn?(jn.current.advance(h),Bn.current+=h/fn):(jn.current.advance(-yn.current),Bn.current=Math.ceil(Bn.current)),0))}),[h,j,fn,T,tn]),Nn=(0,n.useCallback)((function(){return jn.current.next()}),[]),In=(0,n.useCallback)((function(){return jn.current.prev()}),[]);(0,n.useEffect)((function(){if(b&&On.current){var n=w(On.current),r=n.setInterval((function(){Ln()||n.clearInterval(r)}),Mn);return function(){return n.clearInterval(r)}}}),[Ln,Mn,b]);var Pn=(0,n.useCallback)((function(n){fn<=0||isNaN(n)||(n=T?x(n,fn):Math.min(Math.max(n,0),fn-1),gn(n),yn.current!==n&&(yn.current=n,_&&_(n)))}),[fn,T,gn,_]);(0,n.useImperativeHandle)(t,(function(){return{goToSlide:function(n){En.current=0,Pn(n)},next:function(){En.current=0,Nn()},prev:function(){En.current=0,In()},get root(){return On.current},get node(){return zn.current}}}),[Nn,In,Pn]),(0,n.useEffect)((function(){!en&&Sn&&Sn.length!==dn.length&&An(dn)}),[en,dn,An,Sn]);var Rn=function(n){if(T)return!1;if(mn+n<0)return!0;if(mn+tn+n>fn)return!0;if(F&&n>0){if(!jn.current)return!1;var r=jn.current.node;if(!r||!r.children.length)return!1;var t=B(kn,r),o=function(n,r){return 0==n?r.offsetLeft:r.offetTop}(kn,r.children[mn]),e=C(kn,r).length;if(e!==t&&e+o>=t)return!0}return!1},En=(0,n.useRef)(4),Tn=(0,n.useMemo)((function(){return"always"!==M&&!X&&("never"===M||3===En.current)}),[M,X]),Dn=d((0,n.useState)("rtl"===P),2),Fn=Dn[0],Gn=Dn[1];return(0,n.useLayoutEffect)((function(){if(On.current&&P===cn){var n=On.current.ownerDocument;n&&Gn(function(n){return"rtl"==(n.body.getAttribute("dir")||n.documentElement.getAttribute("dir")||"ltr")}(n))}}),[P,Gn]),(0,n.createElement)(n.ContainWrapper,c({size:!0,layout:!0,paint:!0,contentStyle:{display:"flex",direction:Fn?"rtl":"ltr"},ref:On,onFocus:function(n){Y&&Y(n),En.current=1},onMouseEnter:function(n){Z&&Z(n),En.current=2},onTouchStart:function(n){V&&V(n),En.current=3},tabindex:"0",wrapperClassName:"carousel-d626044",contentRef:zn},an),!Tn&&(0,n.createElement)(m,{advance:In,as:u,by:-l,disabled:Rn(-1),outsetArrows:X,rtl:Fn}),(0,n.createElement)(ln,{advanceCount:l,alignment:J,axis:kn,lightboxGroup:E&&"carousel"+Cn,loop:T,mixedLength:F,onClick:G,restingIndex:mn,setRestingIndex:Pn,snap:q,snapBy:nn,ref:jn,visibleCount:F?1:tn,_thumbnails:en},dn.map((function(r,t){var o=r.props,e=o.alt,i=o["aria-label"];return(0,n.createElement)(n.WithAmpContext,{caption:e||i,key:t,renderable:t==mn,playable:t==mn},(0,n.cloneElement)(r,c(c({},r.props),{},{thumbnailSrc:void 0})))}))),!Tn&&(0,n.createElement)(m,{advance:Nn,by:l,as:s,disabled:Rn(1),outsetArrows:X,rtl:Fn}))}));dn.displayName="BentoBaseCarousel";var fn=function(n){!function(n,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(t&&t.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),t&&r(n,t)}(l,n);var o,i,a=(o=l,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(n){return!1}}(),function(){var n,r=t(o);if(i){var a=t(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return e(this,n)});function l(n){var r;return(r=a.call(this,n)).Xnn=null,r}var u=l.prototype;return u.init=function(){var n=this,r=this.element;return this.Xnn=parseInt(r.getAttribute("slide"),10),{"defaultSlide":this.Xnn||0,"onSlideChange":function(t){n.triggerEvent(r,"slideChange",{"index":t})}}},u.mutationObserverCallback=function(){var n=parseInt(this.element.getAttribute("slide"),10);n!==this.Xnn&&(this.Xnn=n,isNaN(n)||this.api().goToSlide(n))},l}(n.PreactBaseElement);fn.Component=dn,fn.layoutSizeDefined=!0,fn.props={"advanceCount":{attr:"advance-count",type:"number",media:!0},"arrowPrevAs":{selector:'[slot="prev-arrow"]',single:!0,as:!0},"arrowNextAs":{selector:'[slot="next-arrow"]',single:!0,as:!0},"autoAdvance":{attr:"auto-advance",type:"boolean",media:!0},"autoAdvanceCount":{attr:"auto-advance-count",type:"number",media:!0},"autoAdvanceInterval":{attr:"auto-advance-interval",type:"number",media:!0},"autoAdvanceLoops":{attr:"auto-advance-loops",type:"number",media:!0},"controls":{attr:"controls",media:!0},"orientation":{attr:"orientation",media:!0,default:"horizontal"},"loop":{attr:"loop",type:"boolean",media:!0},"mixedLength":{attr:"mixed-length",type:"boolean",media:!0},"outsetArrows":{attr:"outset-arrows",type:"boolean",media:!0},"snap":{attr:"snap",type:"boolean",media:!0,default:!0},"snapBy":{attr:"snap-by",type:"number",media:!0},"snapAlign":{attr:"snap-align",media:!0},"visibleCount":{attr:"visible-count",type:"number",media:!0},"children":{props:{"thumbnailSrc":{attr:"data-thumbnail-src"}},selector:"*",single:!1}},fn.usesShadowDom=!0,fn.shadowCss=".carousel-d626044{-ms-scroll-chaining:none;overscroll-behavior:contain}.scroll-container-d626044{width:100%;height:100%;display:-ms-flexbox;display:flex;outline:none;position:relative;-ms-flex-positive:1;flex-grow:1;-ms-flex-wrap:nowrap;flex-wrap:nowrap;box-sizing:content-box!important;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}.hide-scrollbar-d626044{scrollbar-width:none}.hide-scrollbar-d626044::-webkit-scrollbar{display:none;box-sizing:content-box!important}.horizontal-scroll-d626044{overflow-x:auto;overflow-y:hidden;-ms-touch-action:pan-x pinch-zoom;touch-action:pan-x pinch-zoom;-ms-flex-direction:row;flex-direction:row;scroll-snap-type:x mandatory;scroll-snap-type-x:mandatory}.horizontal-scroll-d626044.hide-scrollbar-d626044{padding-bottom:20px}.vertical-scroll-d626044{overflow-x:hidden;-ms-touch-action:pan-y pinch-zoom;touch-action:pan-y pinch-zoom;-ms-flex-direction:column;flex-direction:column;scroll-snap-type:y mandatory;scroll-snap-type-y:mandatory}.slide-element-d626044{display:-ms-flexbox;display:flex;overflow:hidden;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.enable-snap-d626044{scroll-snap-stop:always}.enable-snap-d626044.start-align-d626044{scroll-snap-align:start}.enable-snap-d626044.center-align-d626044{scroll-snap-align:center}.disable-snap-d626044{scroll-snap-stop:none;scroll-snap-align:none;scroll-snap-coordinate:none}.slide-sizing-d626044>::slotted(*),.slide-sizing-d626044>:first-child{margin:0!important;max-width:100%;box-sizing:border-box!important;max-height:100%;-ms-flex-negative:0!important;flex-shrink:0!important}.slide-sizing-d626044>::slotted(*){width:100%}.slide-sizing-d626044.thumbnails-d626044{padding:0px 4px}.arrow-d626044{top:50%;display:-ms-flexbox;display:flex;z-index:1;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;pointer-events:auto;-ms-flex-pack:justify;justify-content:space-between}.arrow-d626044.ltr-d626044{transform:translateY(-50%)}.arrow-d626044.rtl-d626044{transform:scaleX(-1) translateY(-50%)}.arrow-d626044.arrow-next-d626044.rtl-d626044,.arrow-d626044.arrow-prev-d626044.ltr-d626044{left:0}.arrow-d626044.arrow-next-d626044.ltr-d626044,.arrow-d626044.arrow-prev-d626044.rtl-d626044{right:0}.arrow-disabled-d626044{pointer-events:none}.arrow-disabled-d626044.inset-arrow-d626044{opacity:0}.arrow-disabled-d626044.outset-arrow-d626044{opacity:0.5}.inset-arrow-d626044{padding:12px;position:absolute}.outset-arrow-d626044{top:50%;height:100%;position:relative;transform:translateY(-50%);-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0;border-radius:50%;pointer-events:auto;background-size:24px 24px}.outset-arrow-d626044.arrow-prev-d626044{margin-inline-end:10px;margin-inline-start:4px}.outset-arrow-d626044.arrow-next-d626044{margin-inline-end:4px;margin-inline-start:10px}.default-arrow-button-d626044{color:#fff;width:36px;border:none;height:36px;stroke:currentColor;display:-ms-flexbox;display:flex;outline:none;padding:0;position:relative;transition:stroke 200ms;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:transparent}.default-arrow-button-d626044:hover:not([disabled]){color:#222}.default-arrow-button-d626044:active:not([disabled]){transition-duration:0ms}.default-arrow-button-d626044:hover:not([disabled]) .arrow-background-d626044{background-color:hsla(0,0%,100%,0.8)}.default-arrow-button-d626044:active:not([disabled]) .arrow-background-d626044{background-color:#fff;transition-duration:0ms}.default-arrow-button-d626044:focus{border:1px solid #000;box-shadow:0 0 0 1pt #fff;border-radius:50%}.arrow-base-style-d626044{top:0;left:0;width:100%;height:100%;position:absolute;border-radius:50%}.arrow-frosting-d626044{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.arrow-backdrop-d626044{opacity:0.5;-webkit-backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8);backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8)}.arrow-background-d626044{box-shadow:inset 0 0 0px 1px rgba(0,0,0,0.08),0 1px 4px 1px rgba(0,0,0,0.2);transition:background-color 200ms;background-color:rgba(0,0,0,0.3)}.arrow-icon-d626044{width:24px;height:24px;position:relative}",fn.useContexts=[a],(0,n.defineBentoElement)("bento-base-carousel",fn,undefined)}))}();
//# sourceMappingURL=bento-base-carousel-1.0.js.map