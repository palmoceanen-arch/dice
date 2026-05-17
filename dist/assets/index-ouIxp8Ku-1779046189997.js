var Yc=Object.defineProperty;var jc=(a,e,t)=>e in a?Yc(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var N=(a,e,t)=>jc(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const Kc="modulepreload",Zc=function(a){return"/"+a},Hr={},Bi=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=o?.nonce||o?.getAttribute("nonce");i=Promise.allSettled(t.map(l=>{if(l=Zc(l),l in Hr)return;Hr[l]=!0;const c=l.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const h=document.createElement("link");if(h.rel=c?"stylesheet":Kc,c||(h.as="script"),h.crossOrigin="",h.href=l,r&&h.setAttribute("nonce",r),document.head.appendChild(h),c)return new Promise((u,m)=>{h.addEventListener("load",u),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return i.then(o=>{for(const r of o||[])r.status==="rejected"&&s(r.reason);return e().catch(s)})};/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const br="160",Jc=0,Gr=1,Qc=2,Yl=1,jl=2,Rn=3,Pn=0,Dt=1,Ln=2,$n=0,Oi=1,Vr=2,Wr=3,$r=4,ed=5,si=100,td=101,nd=102,qr=103,Xr=104,id=200,sd=201,od=202,rd=203,ar=204,lr=205,ad=206,ld=207,cd=208,dd=209,hd=210,ud=211,pd=212,fd=213,md=214,gd=0,vd=1,yd=2,no=3,xd=4,bd=5,_d=6,Md=7,Kl=0,wd=1,Sd=2,qn=0,Ed=1,Td=2,Cd=3,Ad=4,Rd=5,Ld=6,Zl=300,zi=301,Hi=302,cr=303,dr=304,ho=306,Vt=1e3,on=1001,hr=1002,It=1003,Yr=1004,_o=1005,Ot=1006,Id=1007,ls=1008,Xn=1009,Pd=1010,Dd=1011,_r=1012,Jl=1013,Gn=1014,Vn=1015,cs=1016,Ql=1017,ec=1018,li=1020,Fd=1021,rn=1023,Nd=1024,Ud=1025,ci=1026,Gi=1027,Bd=1028,tc=1029,Od=1030,nc=1031,ic=1033,Mo=33776,wo=33777,So=33778,Eo=33779,jr=35840,Kr=35841,Zr=35842,Jr=35843,sc=36196,Qr=37492,ea=37496,ta=37808,na=37809,ia=37810,sa=37811,oa=37812,ra=37813,aa=37814,la=37815,ca=37816,da=37817,ha=37818,ua=37819,pa=37820,fa=37821,To=36492,ma=36494,ga=36495,kd=36283,va=36284,ya=36285,xa=36286,oc=3e3,di=3001,zd=3200,Hd=3201,rc=0,Gd=1,Jt="",ft="srgb",Dn="srgb-linear",Mr="display-p3",uo="display-p3-linear",io="linear",st="srgb",so="rec709",oo="p3",gi=7680,ba=519,Vd=512,Wd=513,$d=514,ac=515,qd=516,Xd=517,Yd=518,jd=519,_a=35044,Ma="300 es",ur=1035,In=2e3,ro=2001;class Wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}}const St=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zs=Math.PI/180,ao=180/Math.PI;function us(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(St[a&255]+St[a>>8&255]+St[a>>16&255]+St[a>>24&255]+"-"+St[e&255]+St[e>>8&255]+"-"+St[e>>16&15|64]+St[e>>24&255]+"-"+St[t&63|128]+St[t>>8&255]+"-"+St[t>>16&255]+St[t>>24&255]+St[n&255]+St[n>>8&255]+St[n>>16&255]+St[n>>24&255]).toLowerCase()}function Pt(a,e,t){return Math.max(e,Math.min(t,a))}function Kd(a,e){return(a%e+e)%e}function Co(a,e,t){return(1-t)*a+t*e}function wa(a){return(a&a-1)===0&&a!==0}function pr(a){return Math.pow(2,Math.floor(Math.log(a)/Math.LN2))}function Yi(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("Invalid component type.")}}function Nt(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("Invalid component type.")}}class Ye{constructor(e=0,t=0){Ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qe{constructor(e,t,n,i,s,o,r,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,r,l,c)}set(e,t,n,i,s,o,r,l,c){const d=this.elements;return d[0]=e,d[1]=i,d[2]=r,d[3]=t,d[4]=s,d[5]=l,d[6]=n,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],r=n[3],l=n[6],c=n[1],d=n[4],h=n[7],u=n[2],m=n[5],g=n[8],v=i[0],f=i[3],p=i[6],y=i[1],x=i[4],_=i[7],R=i[2],S=i[5],L=i[8];return s[0]=o*v+r*y+l*R,s[3]=o*f+r*x+l*S,s[6]=o*p+r*_+l*L,s[1]=c*v+d*y+h*R,s[4]=c*f+d*x+h*S,s[7]=c*p+d*_+h*L,s[2]=u*v+m*y+g*R,s[5]=u*f+m*x+g*S,s[8]=u*p+m*_+g*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],r=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*r*c-n*s*d+n*r*l+i*s*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],r=e[5],l=e[6],c=e[7],d=e[8],h=d*o-r*c,u=r*l-d*s,m=c*s-o*l,g=t*h+n*u+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(i*c-d*n)*v,e[2]=(r*n-i*o)*v,e[3]=u*v,e[4]=(d*t-i*l)*v,e[5]=(i*s-r*t)*v,e[6]=m*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*r)+o+e,-i*c,i*l,-i*(-c*o+l*r)+r+t,0,0,1),this}scale(e,t){return this.premultiply(Ao.makeScale(e,t)),this}rotate(e){return this.premultiply(Ao.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ao=new qe;function lc(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function ds(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function Zd(){const a=ds("canvas");return a.style.display="block",a}const Sa={};function os(a){a in Sa||(Sa[a]=!0,console.warn(a))}const Ea=new qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ta=new qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),vs={[Dn]:{transfer:io,primaries:so,toReference:a=>a,fromReference:a=>a},[ft]:{transfer:st,primaries:so,toReference:a=>a.convertSRGBToLinear(),fromReference:a=>a.convertLinearToSRGB()},[uo]:{transfer:io,primaries:oo,toReference:a=>a.applyMatrix3(Ta),fromReference:a=>a.applyMatrix3(Ea)},[Mr]:{transfer:st,primaries:oo,toReference:a=>a.convertSRGBToLinear().applyMatrix3(Ta),fromReference:a=>a.applyMatrix3(Ea).convertLinearToSRGB()}},Jd=new Set([Dn,uo]),Qe={enabled:!0,_workingColorSpace:Dn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(a){if(!Jd.has(a))throw new Error(`Unsupported working color space, "${a}".`);this._workingColorSpace=a},convert:function(a,e,t){if(this.enabled===!1||e===t||!e||!t)return a;const n=vs[e].toReference,i=vs[t].fromReference;return i(n(a))},fromWorkingColorSpace:function(a,e){return this.convert(a,this._workingColorSpace,e)},toWorkingColorSpace:function(a,e){return this.convert(a,e,this._workingColorSpace)},getPrimaries:function(a){return vs[a].primaries},getTransfer:function(a){return a===Jt?io:vs[a].transfer}};function ki(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function Ro(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}let vi;class cc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{vi===void 0&&(vi=ds("canvas")),vi.width=e.width,vi.height=e.height;const n=vi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=vi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ds("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=ki(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ki(t[n]/255)*255):t[n]=ki(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Qd=0;class dc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=us(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,r=i.length;o<r;o++)i[o].isDataTexture?s.push(Lo(i[o].image)):s.push(Lo(i[o]))}else s=Lo(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Lo(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?cc.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eh=0;class Ft extends Wi{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,n=on,i=on,s=Ot,o=ls,r=rn,l=Xn,c=Ft.DEFAULT_ANISOTROPY,d=Jt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=us(),this.name="",this.source=new dc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof d=="string"?this.colorSpace=d:(os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=d===di?ft:Jt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vt:e.x=e.x-Math.floor(e.x);break;case on:e.x=e.x<0?0:1;break;case hr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vt:e.y=e.y-Math.floor(e.y);break;case on:e.y=e.y<0?0:1;break;case hr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ft?di:oc}set encoding(e){os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===di?ft:Jt}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=Zl;Ft.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,t=0,n=0,i=1){Mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],m=l[5],g=l[9],v=l[2],f=l[6],p=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-v)<.01&&Math.abs(g-f)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+v)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,_=(m+1)/2,R=(p+1)/2,S=(d+u)/4,L=(h+v)/4,q=(g+f)/4;return x>_&&x>R?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=S/n,s=L/n):_>R?_<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(_),n=S/i,s=q/i):R<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(R),n=L/s,i=q/s),this.set(n,i,s,t),this}let y=Math.sqrt((f-g)*(f-g)+(h-v)*(h-v)+(u-d)*(u-d));return Math.abs(y)<.001&&(y=1),this.x=(f-g)/y,this.y=(h-v)/y,this.z=(u-d)/y,this.w=Math.acos((c+m+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class th extends Wi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(os("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===di?ft:Jt),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ft(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new dc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends th{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class hc extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class nh extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}let Qt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,r){let l=n[i+0],c=n[i+1],d=n[i+2],h=n[i+3];const u=s[o+0],m=s[o+1],g=s[o+2],v=s[o+3];if(r===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(r===1){e[t+0]=u,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==u||c!==m||d!==g){let f=1-r;const p=l*u+c*m+d*g+h*v,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const R=Math.sqrt(x),S=Math.atan2(R,p*y);f=Math.sin(f*S)/R,r=Math.sin(r*S)/R}const _=r*y;if(l=l*f+u*_,c=c*f+m*_,d=d*f+g*_,h=h*f+v*_,f===1-r){const R=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=R,c*=R,d*=R,h*=R}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,o){const r=n[i],l=n[i+1],c=n[i+2],d=n[i+3],h=s[o],u=s[o+1],m=s[o+2],g=s[o+3];return e[t]=r*g+d*h+l*m-c*u,e[t+1]=l*g+d*u+c*h-r*m,e[t+2]=c*g+d*m+r*u-l*h,e[t+3]=d*g-r*h-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,o=e._order,r=Math.cos,l=Math.sin,c=r(n/2),d=r(i/2),h=r(s/2),u=l(n/2),m=l(i/2),g=l(s/2);switch(o){case"XYZ":this._x=u*d*h+c*m*g,this._y=c*m*h-u*d*g,this._z=c*d*g+u*m*h,this._w=c*d*h-u*m*g;break;case"YXZ":this._x=u*d*h+c*m*g,this._y=c*m*h-u*d*g,this._z=c*d*g-u*m*h,this._w=c*d*h+u*m*g;break;case"ZXY":this._x=u*d*h-c*m*g,this._y=c*m*h+u*d*g,this._z=c*d*g+u*m*h,this._w=c*d*h-u*m*g;break;case"ZYX":this._x=u*d*h-c*m*g,this._y=c*m*h+u*d*g,this._z=c*d*g-u*m*h,this._w=c*d*h+u*m*g;break;case"YZX":this._x=u*d*h+c*m*g,this._y=c*m*h+u*d*g,this._z=c*d*g-u*m*h,this._w=c*d*h-u*m*g;break;case"XZY":this._x=u*d*h-c*m*g,this._y=c*m*h-u*d*g,this._z=c*d*g+u*m*h,this._w=c*d*h+u*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],r=t[5],l=t[9],c=t[2],d=t[6],h=t[10],u=n+r+h;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(d-l)*m,this._y=(s-c)*m,this._z=(o-i)*m}else if(n>r&&n>h){const m=2*Math.sqrt(1+n-r-h);this._w=(d-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(s+c)/m}else if(r>h){const m=2*Math.sqrt(1+r-n-h);this._w=(s-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+h-n-r);this._w=(o-i)/m,this._x=(s+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,o=e._w,r=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+o*r+i*c-s*l,this._y=i*d+o*l+s*r-n*c,this._z=s*d+o*c+n*l-i*r,this._w=o*d-n*r-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,o=this._w;let r=o*e._w+n*e._x+i*e._y+s*e._z;if(r<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,r=-r):this.copy(e),r>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,r),h=Math.sin((1-t)*d)/c,u=Math.sin(t*d)/c;return this._w=o*h+this._w*u,this._x=n*h+this._x*u,this._y=i*h+this._y*u,this._z=s*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(s),n*Math.cos(s),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class k{constructor(e=0,t=0,n=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ca.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ca.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,r=e.z,l=e.w,c=2*(o*i-r*n),d=2*(r*t-s*i),h=2*(s*n-o*t);return this.x=t+l*c+o*h-r*d,this.y=n+l*d+r*c-s*h,this.z=i+l*h+s*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,o=t.x,r=t.y,l=t.z;return this.x=i*l-s*r,this.y=s*o-n*l,this.z=n*r-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Io.copy(this).projectOnVector(e),this.sub(Io)}reflect(e){return this.sub(Io.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Io=new k,Ca=new Qt;class ps{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(en.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(en.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=en.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)e.isMesh===!0?e.getVertexPosition(o,en):en.fromBufferAttribute(s,o),en.applyMatrix4(e.matrixWorld),this.expandByPoint(en);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ys.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ys.copy(n.boundingBox)),ys.applyMatrix4(e.matrixWorld),this.union(ys)}const i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,en),en.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ji),xs.subVectors(this.max,ji),yi.subVectors(e.a,ji),xi.subVectors(e.b,ji),bi.subVectors(e.c,ji),Fn.subVectors(xi,yi),Nn.subVectors(bi,xi),Kn.subVectors(yi,bi);let t=[0,-Fn.z,Fn.y,0,-Nn.z,Nn.y,0,-Kn.z,Kn.y,Fn.z,0,-Fn.x,Nn.z,0,-Nn.x,Kn.z,0,-Kn.x,-Fn.y,Fn.x,0,-Nn.y,Nn.x,0,-Kn.y,Kn.x,0];return!Po(t,yi,xi,bi,xs)||(t=[1,0,0,0,1,0,0,0,1],!Po(t,yi,xi,bi,xs))?!1:(bs.crossVectors(Fn,Nn),t=[bs.x,bs.y,bs.z],Po(t,yi,xi,bi,xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,en).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(en).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const xn=[new k,new k,new k,new k,new k,new k,new k,new k],en=new k,ys=new ps,yi=new k,xi=new k,bi=new k,Fn=new k,Nn=new k,Kn=new k,ji=new k,xs=new k,bs=new k,Zn=new k;function Po(a,e,t,n,i){for(let s=0,o=a.length-3;s<=o;s+=3){Zn.fromArray(a,s);const r=i.x*Math.abs(Zn.x)+i.y*Math.abs(Zn.y)+i.z*Math.abs(Zn.z),l=e.dot(Zn),c=t.dot(Zn),d=n.dot(Zn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>r)return!1}return!0}const ih=new ps,Ki=new k,Do=new k;class po{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ih.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ki.subVectors(e,this.center);const t=Ki.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ki,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Do.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ki.copy(e.center).add(Do)),this.expandByPoint(Ki.copy(e.center).sub(Do))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const bn=new k,Fo=new k,_s=new k,Un=new k,No=new k,Ms=new k,Uo=new k;let wr=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=bn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bn.copy(this.origin).addScaledVector(this.direction,t),bn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Fo.copy(e).add(t).multiplyScalar(.5),_s.copy(t).sub(e).normalize(),Un.copy(this.origin).sub(Fo);const s=e.distanceTo(t)*.5,o=-this.direction.dot(_s),r=Un.dot(this.direction),l=-Un.dot(_s),c=Un.lengthSq(),d=Math.abs(1-o*o);let h,u,m,g;if(d>0)if(h=o*l-r,u=o*r-l,g=s*d,h>=0)if(u>=-g)if(u<=g){const v=1/d;h*=v,u*=v,m=h*(h+o*u+2*r)+u*(o*h+u+2*l)+c}else u=s,h=Math.max(0,-(o*u+r)),m=-h*h+u*(u+2*l)+c;else u=-s,h=Math.max(0,-(o*u+r)),m=-h*h+u*(u+2*l)+c;else u<=-g?(h=Math.max(0,-(-o*s+r)),u=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+u*(u+2*l)+c):u<=g?(h=0,u=Math.min(Math.max(-s,-l),s),m=u*(u+2*l)+c):(h=Math.max(0,-(o*s+r)),u=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+u*(u+2*l)+c);else u=o>0?-s:s,h=Math.max(0,-(o*u+r)),m=-h*h+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Fo).addScaledVector(_s,u),m}intersectSphere(e,t){bn.subVectors(e.center,this.origin);const n=bn.dot(this.direction),i=bn.dot(bn)-n*n,s=e.radius*e.radius;if(i>s)return null;const o=Math.sqrt(s-i),r=n-o,l=n+o;return l<0?null:r<0?this.at(l,t):this.at(r,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,r,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),d>=0?(s=(e.min.y-u.y)*d,o=(e.max.y-u.y)*d):(s=(e.max.y-u.y)*d,o=(e.min.y-u.y)*d),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),h>=0?(r=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(r=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),n>l||r>i)||((r>n||n!==n)&&(n=r),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,bn)!==null}intersectTriangle(e,t,n,i,s){No.subVectors(t,e),Ms.subVectors(n,e),Uo.crossVectors(No,Ms);let o=this.direction.dot(Uo),r;if(o>0){if(i)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Un.subVectors(this.origin,e);const l=r*this.direction.dot(Ms.crossVectors(Un,Ms));if(l<0)return null;const c=r*this.direction.dot(No.cross(Un));if(c<0||l+c>o)return null;const d=-r*Un.dot(Uo);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class ut{constructor(e,t,n,i,s,o,r,l,c,d,h,u,m,g,v,f){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,r,l,c,d,h,u,m,g,v,f)}set(e,t,n,i,s,o,r,l,c,d,h,u,m,g,v,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=d,p[10]=h,p[14]=u,p[3]=m,p[7]=g,p[11]=v,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/_i.setFromMatrixColumn(e,0).length(),s=1/_i.setFromMatrixColumn(e,1).length(),o=1/_i.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),r=Math.sin(n),l=Math.cos(i),c=Math.sin(i),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const u=o*d,m=o*h,g=r*d,v=r*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=u-v*c,t[9]=-r*l,t[2]=v-u*c,t[6]=g+m*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*d,m=l*h,g=c*d,v=c*h;t[0]=u+v*r,t[4]=g*r-m,t[8]=o*c,t[1]=o*h,t[5]=o*d,t[9]=-r,t[2]=m*r-g,t[6]=v+u*r,t[10]=o*l}else if(e.order==="ZXY"){const u=l*d,m=l*h,g=c*d,v=c*h;t[0]=u-v*r,t[4]=-o*h,t[8]=g+m*r,t[1]=m+g*r,t[5]=o*d,t[9]=v-u*r,t[2]=-o*c,t[6]=r,t[10]=o*l}else if(e.order==="ZYX"){const u=o*d,m=o*h,g=r*d,v=r*h;t[0]=l*d,t[4]=g*c-m,t[8]=u*c+v,t[1]=l*h,t[5]=v*c+u,t[9]=m*c-g,t[2]=-c,t[6]=r*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,m=o*c,g=r*l,v=r*c;t[0]=l*d,t[4]=v-u*h,t[8]=g*h+m,t[1]=h,t[5]=o*d,t[9]=-r*d,t[2]=-c*d,t[6]=m*h+g,t[10]=u-v*h}else if(e.order==="XZY"){const u=o*l,m=o*c,g=r*l,v=r*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=u*h+v,t[5]=o*d,t[9]=m*h-g,t[2]=g*h-m,t[6]=r*d,t[10]=v*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sh,e,oh)}lookAt(e,t,n){const i=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Bn.crossVectors(n,zt),Bn.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Bn.crossVectors(n,zt)),Bn.normalize(),ws.crossVectors(zt,Bn),i[0]=Bn.x,i[4]=ws.x,i[8]=zt.x,i[1]=Bn.y,i[5]=ws.y,i[9]=zt.y,i[2]=Bn.z,i[6]=ws.z,i[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],r=n[4],l=n[8],c=n[12],d=n[1],h=n[5],u=n[9],m=n[13],g=n[2],v=n[6],f=n[10],p=n[14],y=n[3],x=n[7],_=n[11],R=n[15],S=i[0],L=i[4],q=i[8],w=i[12],E=i[1],G=i[5],J=i[9],H=i[13],I=i[2],F=i[6],B=i[10],te=i[14],Y=i[3],X=i[7],P=i[11],C=i[15];return s[0]=o*S+r*E+l*I+c*Y,s[4]=o*L+r*G+l*F+c*X,s[8]=o*q+r*J+l*B+c*P,s[12]=o*w+r*H+l*te+c*C,s[1]=d*S+h*E+u*I+m*Y,s[5]=d*L+h*G+u*F+m*X,s[9]=d*q+h*J+u*B+m*P,s[13]=d*w+h*H+u*te+m*C,s[2]=g*S+v*E+f*I+p*Y,s[6]=g*L+v*G+f*F+p*X,s[10]=g*q+v*J+f*B+p*P,s[14]=g*w+v*H+f*te+p*C,s[3]=y*S+x*E+_*I+R*Y,s[7]=y*L+x*G+_*F+R*X,s[11]=y*q+x*J+_*B+R*P,s[15]=y*w+x*H+_*te+R*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],r=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],m=e[14],g=e[3],v=e[7],f=e[11],p=e[15];return g*(+s*l*h-i*c*h-s*r*u+n*c*u+i*r*m-n*l*m)+v*(+t*l*m-t*c*u+s*o*u-i*o*m+i*c*d-s*l*d)+f*(+t*c*h-t*r*m-s*o*h+n*o*m+s*r*d-n*c*d)+p*(-i*r*d-t*l*h+t*r*u+i*o*h-n*o*u+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],r=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],m=e[11],g=e[12],v=e[13],f=e[14],p=e[15],y=h*f*c-v*u*c+v*l*m-r*f*m-h*l*p+r*u*p,x=g*u*c-d*f*c-g*l*m+o*f*m+d*l*p-o*u*p,_=d*v*c-g*h*c+g*r*m-o*v*m-d*r*p+o*h*p,R=g*h*l-d*v*l-g*r*u+o*v*u+d*r*f-o*h*f,S=t*y+n*x+i*_+s*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/S;return e[0]=y*L,e[1]=(v*u*s-h*f*s-v*i*m+n*f*m+h*i*p-n*u*p)*L,e[2]=(r*f*s-v*l*s+v*i*c-n*f*c-r*i*p+n*l*p)*L,e[3]=(h*l*s-r*u*s-h*i*c+n*u*c+r*i*m-n*l*m)*L,e[4]=x*L,e[5]=(d*f*s-g*u*s+g*i*m-t*f*m-d*i*p+t*u*p)*L,e[6]=(g*l*s-o*f*s-g*i*c+t*f*c+o*i*p-t*l*p)*L,e[7]=(o*u*s-d*l*s+d*i*c-t*u*c-o*i*m+t*l*m)*L,e[8]=_*L,e[9]=(g*h*s-d*v*s-g*n*m+t*v*m+d*n*p-t*h*p)*L,e[10]=(o*v*s-g*r*s+g*n*c-t*v*c-o*n*p+t*r*p)*L,e[11]=(d*r*s-o*h*s-d*n*c+t*h*c+o*n*m-t*r*m)*L,e[12]=R*L,e[13]=(d*v*i-g*h*i+g*n*u-t*v*u-d*n*f+t*h*f)*L,e[14]=(g*r*i-o*v*i-g*n*l+t*v*l+o*n*f-t*r*f)*L,e[15]=(o*h*i-d*r*i+d*n*l-t*h*l-o*n*u+t*r*u)*L,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,r=e.y,l=e.z,c=s*o,d=s*r;return this.set(c*o+n,c*r-i*l,c*l+i*r,0,c*r+i*l,d*r+n,d*l-i*o,0,c*l-i*r,d*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,o=t._y,r=t._z,l=t._w,c=s+s,d=o+o,h=r+r,u=s*c,m=s*d,g=s*h,v=o*d,f=o*h,p=r*h,y=l*c,x=l*d,_=l*h,R=n.x,S=n.y,L=n.z;return i[0]=(1-(v+p))*R,i[1]=(m+_)*R,i[2]=(g-x)*R,i[3]=0,i[4]=(m-_)*S,i[5]=(1-(u+p))*S,i[6]=(f+y)*S,i[7]=0,i[8]=(g+x)*L,i[9]=(f-y)*L,i[10]=(1-(u+v))*L,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=_i.set(i[0],i[1],i[2]).length();const o=_i.set(i[4],i[5],i[6]).length(),r=_i.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],tn.copy(this);const c=1/s,d=1/o,h=1/r;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=d,tn.elements[5]*=d,tn.elements[6]*=d,tn.elements[8]*=h,tn.elements[9]*=h,tn.elements[10]*=h,t.setFromRotationMatrix(tn),n.x=s,n.y=o,n.z=r,this}makePerspective(e,t,n,i,s,o,r=In){const l=this.elements,c=2*s/(t-e),d=2*s/(n-i),h=(t+e)/(t-e),u=(n+i)/(n-i);let m,g;if(r===In)m=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===ro)m=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,o,r=In){const l=this.elements,c=1/(t-e),d=1/(n-i),h=1/(o-s),u=(t+e)*c,m=(n+i)*d;let g,v;if(r===In)g=(o+s)*h,v=-2*h;else if(r===ro)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const _i=new k,tn=new ut,sh=new k(0,0,0),oh=new k(1,1,1),Bn=new k,ws=new k,zt=new k,Aa=new ut,Ra=new Qt;class pn{constructor(e=0,t=0,n=0,i=pn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],o=i[4],r=i[8],l=i[1],c=i[5],d=i[9],h=i[2],u=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(Pt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Pt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(r,m));break;case"XZY":this._z=Math.asin(-Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Aa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Aa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ra.setFromEuler(this),this.setFromQuaternion(Ra,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pn.DEFAULT_ORDER="XYZ";class Sr{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let rh=0;const La=new k,Mi=new Qt,_n=new ut,Ss=new k,Zi=new k,ah=new k,lh=new Qt,Ia=new k(1,0,0),Pa=new k(0,1,0),Da=new k(0,0,1),ch={type:"added"},dh={type:"removed"};class mt extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rh++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mt.DEFAULT_UP.clone();const e=new k,t=new pn,n=new Qt,i=new k(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ut},normalMatrix:{value:new qe}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Ia,e)}rotateY(e){return this.rotateOnAxis(Pa,e)}rotateZ(e){return this.rotateOnAxis(Da,e)}translateOnAxis(e,t){return La.copy(e).applyQuaternion(this.quaternion),this.position.add(La.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ia,e)}translateY(e){return this.translateOnAxis(Pa,e)}translateZ(e){return this.translateOnAxis(Da,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ss.copy(e):Ss.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Zi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Zi,Ss,this.up):_n.lookAt(Ss,Zi,this.up),this.quaternion.setFromRotationMatrix(_n),i&&(_n.extractRotation(i.matrixWorld),Mi.setFromRotationMatrix(_n),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(ch)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dh)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,e,ah),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,lh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const s=t[n];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++){const r=i[s];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(e.materials,this.material[l]));i.material=r}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];i.animations.push(s(e.animations,l))}}if(t){const r=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),h=o(e.shapes),u=o(e.skeletons),m=o(e.animations),g=o(e.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(r){const l=[];for(const c in r){const d=r[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}mt.DEFAULT_UP=new k(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new k,Mn=new k,Bo=new k,wn=new k,wi=new k,Si=new k,Fa=new k,Oo=new k,ko=new k,zo=new k;let Es=!1;class Zt{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),nn.subVectors(e,t),i.cross(nn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){nn.subVectors(i,t),Mn.subVectors(n,t),Bo.subVectors(e,t);const o=nn.dot(nn),r=nn.dot(Mn),l=nn.dot(Bo),c=Mn.dot(Mn),d=Mn.dot(Bo),h=o*c-r*r;if(h===0)return s.set(0,0,0),null;const u=1/h,m=(c*l-r*d)*u,g=(o*d-r*l)*u;return s.set(1-m-g,g,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getUV(e,t,n,i,s,o,r,l){return Es===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Es=!0),this.getInterpolation(e,t,n,i,s,o,r,l)}static getInterpolation(e,t,n,i,s,o,r,l){return this.getBarycoord(e,t,n,i,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,wn.x),l.addScaledVector(o,wn.y),l.addScaledVector(r,wn.z),l)}static isFrontFacing(e,t,n,i){return nn.subVectors(n,t),Mn.subVectors(e,t),nn.cross(Mn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return nn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),nn.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Zt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,s){return Es===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Es=!0),Zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}getInterpolation(e,t,n,i,s){return Zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let o,r;wi.subVectors(i,n),Si.subVectors(s,n),Oo.subVectors(e,n);const l=wi.dot(Oo),c=Si.dot(Oo);if(l<=0&&c<=0)return t.copy(n);ko.subVectors(e,i);const d=wi.dot(ko),h=Si.dot(ko);if(d>=0&&h<=d)return t.copy(i);const u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(n).addScaledVector(wi,o);zo.subVectors(e,s);const m=wi.dot(zo),g=Si.dot(zo);if(g>=0&&m<=g)return t.copy(s);const v=m*c-l*g;if(v<=0&&c>=0&&g<=0)return r=c/(c-g),t.copy(n).addScaledVector(Si,r);const f=d*g-m*h;if(f<=0&&h-d>=0&&m-g>=0)return Fa.subVectors(s,i),r=(h-d)/(h-d+(m-g)),t.copy(i).addScaledVector(Fa,r);const p=1/(f+v+u);return o=v*p,r=u*p,t.copy(n).addScaledVector(wi,o).addScaledVector(Si,r)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const uc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},Ts={h:0,s:0,l:0};function Ho(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class Oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Qe.workingColorSpace){if(e=Kd(e,1),t=Pt(t,0,1),n=Pt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Ho(o,s,e+1/3),this.g=Ho(o,s,e),this.b=Ho(o,s,e-1/3)}return Qe.toWorkingColorSpace(this,i),this}setStyle(e,t=ft){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=i[1],r=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ft){const n=uc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}copyLinearToSRGB(e){return this.r=Ro(e.r),this.g=Ro(e.g),this.b=Ro(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ft){return Qe.fromWorkingColorSpace(Et.copy(this),e),Math.round(Pt(Et.r*255,0,255))*65536+Math.round(Pt(Et.g*255,0,255))*256+Math.round(Pt(Et.b*255,0,255))}getHexString(e=ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Et.copy(this),t);const n=Et.r,i=Et.g,s=Et.b,o=Math.max(n,i,s),r=Math.min(n,i,s);let l,c;const d=(r+o)/2;if(r===o)l=0,c=0;else{const h=o-r;switch(c=d<=.5?h/(o+r):h/(2-o-r),o){case n:l=(i-s)/h+(i<s?6:0);break;case i:l=(s-n)/h+2;break;case s:l=(n-i)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=ft){Qe.fromWorkingColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,i=Et.b;return e!==ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(On),this.setHSL(On.h+e,On.s+t,On.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(On),e.getHSL(Ts);const n=Co(On.h,Ts.h,t),i=Co(On.s,Ts.s,t),s=Co(On.l,Ts.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Oe;Oe.NAMES=uc;let hh=0,$i=class extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hh++}),this.uuid=us(),this.name="",this.type="Material",this.blending=Oi,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ar,this.blendDst=lr,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=no,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ba,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ar&&(n.blendSrc=this.blendSrc),this.blendDst!==lr&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==no&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ba&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(t){const s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};class fo extends $i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Kl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new k,Cs=new Ye;class gn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=_a,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Cs.fromBufferAttribute(this,t),Cs.applyMatrix3(e),this.setXY(t,Cs.x,Cs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),i=Nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),i=Nt(i,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_a&&(e.usage=this.usage),e}}class pc extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class fc extends gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class qt extends gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let uh=0;const jt=new ut,Go=new mt,Ei=new k,Ht=new ps,Ji=new ps,bt=new k;class vn extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uh++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lc(e)?fc:pc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return jt.makeRotationFromQuaternion(e),this.applyMatrix4(jt),this}rotateX(e){return jt.makeRotationX(e),this.applyMatrix4(jt),this}rotateY(e){return jt.makeRotationY(e),this.applyMatrix4(jt),this}rotateZ(e){return jt.makeRotationZ(e),this.applyMatrix4(jt),this}translate(e,t,n){return jt.makeTranslation(e,t,n),this.applyMatrix4(jt),this}scale(e,t,n){return jt.makeScale(e,t,n),this.applyMatrix4(jt),this}lookAt(e){return Go.lookAt(e),Go.updateMatrix(),this.applyMatrix4(Go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new qt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Ht.setFromBufferAttribute(s),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Ht.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Ht.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Ht.min),this.boundingBox.expandByPoint(Ht.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new po);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new k,1/0);return}if(e){const n=this.boundingSphere.center;if(Ht.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const r=t[s];Ji.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(Ht.min,Ji.min),Ht.expandByPoint(bt),bt.addVectors(Ht.max,Ji.max),Ht.expandByPoint(bt)):(Ht.expandByPoint(Ji.min),Ht.expandByPoint(Ji.max))}Ht.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)bt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(bt));if(t)for(let s=0,o=t.length;s<o;s++){const r=t[s],l=this.morphTargetsRelative;for(let c=0,d=r.count;c<d;c++)bt.fromBufferAttribute(r,c),l&&(Ei.fromBufferAttribute(e,c),bt.add(Ei)),i=Math.max(i,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,s=t.normal.array,o=t.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gn(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],d=[];for(let E=0;E<r;E++)c[E]=new k,d[E]=new k;const h=new k,u=new k,m=new k,g=new Ye,v=new Ye,f=new Ye,p=new k,y=new k;function x(E,G,J){h.fromArray(i,E*3),u.fromArray(i,G*3),m.fromArray(i,J*3),g.fromArray(o,E*2),v.fromArray(o,G*2),f.fromArray(o,J*2),u.sub(h),m.sub(h),v.sub(g),f.sub(g);const H=1/(v.x*f.y-f.x*v.y);isFinite(H)&&(p.copy(u).multiplyScalar(f.y).addScaledVector(m,-v.y).multiplyScalar(H),y.copy(m).multiplyScalar(v.x).addScaledVector(u,-f.x).multiplyScalar(H),c[E].add(p),c[G].add(p),c[J].add(p),d[E].add(y),d[G].add(y),d[J].add(y))}let _=this.groups;_.length===0&&(_=[{start:0,count:n.length}]);for(let E=0,G=_.length;E<G;++E){const J=_[E],H=J.start,I=J.count;for(let F=H,B=H+I;F<B;F+=3)x(n[F+0],n[F+1],n[F+2])}const R=new k,S=new k,L=new k,q=new k;function w(E){L.fromArray(s,E*3),q.copy(L);const G=c[E];R.copy(G),R.sub(L.multiplyScalar(L.dot(G))).normalize(),S.crossVectors(q,G);const H=S.dot(d[E])<0?-1:1;l[E*4]=R.x,l[E*4+1]=R.y,l[E*4+2]=R.z,l[E*4+3]=H}for(let E=0,G=_.length;E<G;++E){const J=_[E],H=J.start,I=J.count;for(let F=H,B=H+I;F<B;F+=3)w(n[F+0]),w(n[F+1]),w(n[F+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const i=new k,s=new k,o=new k,r=new k,l=new k,c=new k,d=new k,h=new k;if(e)for(let u=0,m=e.count;u<m;u+=3){const g=e.getX(u+0),v=e.getX(u+1),f=e.getX(u+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,f),d.subVectors(o,s),h.subVectors(i,s),d.cross(h),r.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,f),r.add(d),l.add(d),c.add(d),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)i.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),d.subVectors(o,s),h.subVectors(i,s),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(r,l){const c=r.array,d=r.itemSize,h=r.normalized,u=new c.constructor(l.length*d);let m=0,g=0;for(let v=0,f=l.length;v<f;v++){r.isInterleavedBufferAttribute?m=l[v]*r.data.stride+r.offset:m=l[v]*d;for(let p=0;p<d;p++)u[g++]=c[m++]}return new gn(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vn,n=this.index.array,i=this.attributes;for(const r in i){const l=i[r],c=e(l,n);t.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let d=0,h=c.length;d<h;d++){const u=c[d],m=e(u,n);l.push(m)}t.morphAttributes[r]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){const m=c[h];d.push(m.toJSON(e.data))}d.length>0&&(i[l]=d,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(e.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const d=i[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let u=0,m=h.length;u<m;u++)d.push(h[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const r=e.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Na=new ut,Jn=new wr,As=new po,Ua=new k,Ti=new k,Ci=new k,Ai=new k,Vo=new k,Rs=new k,Ls=new Ye,Is=new Ye,Ps=new Ye,Ba=new k,Oa=new k,ka=new k,Ds=new k,Fs=new k;class _t extends mt{constructor(e=new vn,t=new fo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const r=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const r=this.morphTargetInfluences;if(s&&r){Rs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=r[l],h=s[l];d!==0&&(Vo.fromBufferAttribute(h,e),o?Rs.addScaledVector(Vo,d):Rs.addScaledVector(Vo.sub(t),d))}t.add(Rs)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),As.copy(n.boundingSphere),As.applyMatrix4(s),Jn.copy(e.ray).recast(e.near),!(As.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(As,Ua)===null||Jn.origin.distanceToSquared(Ua)>(e.far-e.near)**2))&&(Na.copy(s).invert(),Jn.copy(e.ray).applyMatrix4(Na),!(n.boundingBox!==null&&Jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,n){let i;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,u=s.groups,m=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const f=u[g],p=o[f.materialIndex],y=Math.max(f.start,m.start),x=Math.min(r.count,Math.min(f.start+f.count,m.start+m.count));for(let _=y,R=x;_<R;_+=3){const S=r.getX(_),L=r.getX(_+1),q=r.getX(_+2);i=Ns(this,p,e,n,c,d,h,S,L,q),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=f.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),v=Math.min(r.count,m.start+m.count);for(let f=g,p=v;f<p;f+=3){const y=r.getX(f),x=r.getX(f+1),_=r.getX(f+2);i=Ns(this,o,e,n,c,d,h,y,x,_),i&&(i.faceIndex=Math.floor(f/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const f=u[g],p=o[f.materialIndex],y=Math.max(f.start,m.start),x=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let _=y,R=x;_<R;_+=3){const S=_,L=_+1,q=_+2;i=Ns(this,p,e,n,c,d,h,S,L,q),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=f.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let f=g,p=v;f<p;f+=3){const y=f,x=f+1,_=f+2;i=Ns(this,o,e,n,c,d,h,y,x,_),i&&(i.faceIndex=Math.floor(f/3),t.push(i))}}}}function ph(a,e,t,n,i,s,o,r){let l;if(e.side===Dt?l=n.intersectTriangle(o,s,i,!0,r):l=n.intersectTriangle(i,s,o,e.side===Pn,r),l===null)return null;Fs.copy(r),Fs.applyMatrix4(a.matrixWorld);const c=t.ray.origin.distanceTo(Fs);return c<t.near||c>t.far?null:{distance:c,point:Fs.clone(),object:a}}function Ns(a,e,t,n,i,s,o,r,l,c){a.getVertexPosition(r,Ti),a.getVertexPosition(l,Ci),a.getVertexPosition(c,Ai);const d=ph(a,e,t,n,Ti,Ci,Ai,Ds);if(d){i&&(Ls.fromBufferAttribute(i,r),Is.fromBufferAttribute(i,l),Ps.fromBufferAttribute(i,c),d.uv=Zt.getInterpolation(Ds,Ti,Ci,Ai,Ls,Is,Ps,new Ye)),s&&(Ls.fromBufferAttribute(s,r),Is.fromBufferAttribute(s,l),Ps.fromBufferAttribute(s,c),d.uv1=Zt.getInterpolation(Ds,Ti,Ci,Ai,Ls,Is,Ps,new Ye),d.uv2=d.uv1),o&&(Ba.fromBufferAttribute(o,r),Oa.fromBufferAttribute(o,l),ka.fromBufferAttribute(o,c),d.normal=Zt.getInterpolation(Ds,Ti,Ci,Ai,Ba,Oa,ka,new k),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:l,c,normal:new k,materialIndex:0};Zt.getNormal(Ti,Ci,Ai,h.normal),d.face=h}return d}class ln extends vn{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const r=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],h=[];let u=0,m=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new qt(c,3)),this.setAttribute("normal",new qt(d,3)),this.setAttribute("uv",new qt(h,2));function g(v,f,p,y,x,_,R,S,L,q,w){const E=_/L,G=R/q,J=_/2,H=R/2,I=S/2,F=L+1,B=q+1;let te=0,Y=0;const X=new k;for(let P=0;P<B;P++){const C=P*G-H;for(let V=0;V<F;V++){const z=V*E-J;X[v]=z*y,X[f]=C*x,X[p]=I,c.push(X.x,X.y,X.z),X[v]=0,X[f]=0,X[p]=S>0?1:-1,d.push(X.x,X.y,X.z),h.push(V/L),h.push(1-P/q),te+=1}}for(let P=0;P<q;P++)for(let C=0;C<L;C++){const V=u+C+F*P,z=u+C+F*(P+1),Z=u+(C+1)+F*(P+1),ne=u+(C+1)+F*P;l.push(V,z,ne),l.push(z,Z,ne),Y+=6}r.addGroup(m,Y,w),m+=Y,u+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ln(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vi(a){const e={};for(const t in a){e[t]={};for(const n in a[t]){const i=a[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Lt(a){const e={};for(let t=0;t<a.length;t++){const n=Vi(a[t]);for(const i in n)e[i]=n[i]}return e}function fh(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function mc(a){return a.getRenderTarget()===null?a.outputColorSpace:Qe.workingColorSpace}const mh={clone:Vi,merge:Lt};var gh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mi extends $i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gh,this.fragmentShader=vh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vi(e.uniforms),this.uniformsGroups=fh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class gc extends mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=In}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Wt extends gc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ao*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ao*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const r=this.filmOffset;r!==0&&(s+=e*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ri=-90,Li=1;class vc extends mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Wt(Ri,Li,e,t);i.layers=this.layers,this.add(i);const s=new Wt(Ri,Li,e,t);s.layers=this.layers,this.add(s);const o=new Wt(Ri,Li,e,t);o.layers=this.layers,this.add(o);const r=new Wt(Ri,Li,e,t);r.layers=this.layers,this.add(r);const l=new Wt(Ri,Li,e,t);l.layers=this.layers,this.add(l);const c=new Wt(Ri,Li,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,r,l]=t;for(const c of t)this.remove(c);if(e===In)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ro)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,r),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(h,u,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yc extends Ft{constructor(e,t,n,i,s,o,r,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:zi,super(e,t,n,i,s,o,r,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class xc extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(os("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===di?ft:Jt),this.texture=new yc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ot}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ln(5,5,5),s=new mi({name:"CubemapFromEquirect",uniforms:Vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:$n});s.uniforms.tEquirect.value=t;const o=new _t(i,s),r=t.minFilter;return t.minFilter===ls&&(t.minFilter=Ot),new vc(1,10,this).update(e,o),t.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}}const Wo=new k,yh=new k,xh=new qe;let ni=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Wo.subVectors(n,t).cross(yh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Wo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||xh.getNormalMatrix(e),i=this.coplanarPoint(Wo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}};const Qn=new po,Us=new k;class Er{constructor(e=new ni,t=new ni,n=new ni,i=new ni,s=new ni,o=new ni){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){const r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(n),r[3].copy(i),r[4].copy(s),r[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=In){const n=this.planes,i=e.elements,s=i[0],o=i[1],r=i[2],l=i[3],c=i[4],d=i[5],h=i[6],u=i[7],m=i[8],g=i[9],v=i[10],f=i[11],p=i[12],y=i[13],x=i[14],_=i[15];if(n[0].setComponents(l-s,u-c,f-m,_-p).normalize(),n[1].setComponents(l+s,u+c,f+m,_+p).normalize(),n[2].setComponents(l+o,u+d,f+g,_+y).normalize(),n[3].setComponents(l-o,u-d,f-g,_-y).normalize(),n[4].setComponents(l-r,u-h,f-v,_-x).normalize(),t===In)n[5].setComponents(l+r,u+h,f+v,_+x).normalize();else if(t===ro)n[5].setComponents(r,h,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){return Qn.center.set(0,0,0),Qn.radius=.7071067811865476,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Us.x=i.normal.x>0?e.max.x:e.min.x,Us.y=i.normal.y>0?e.max.y:e.min.y,Us.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Us)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function bc(){let a=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=a.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=a.requestAnimationFrame(i),e=!0)},stop:function(){a.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){a=s}}}function bh(a,e){const t=e.isWebGL2,n=new WeakMap;function i(c,d){const h=c.array,u=c.usage,m=h.byteLength,g=a.createBuffer();a.bindBuffer(d,g),a.bufferData(d,h,u),c.onUploadCallback();let v;if(h instanceof Float32Array)v=a.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)v=a.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=a.UNSIGNED_SHORT;else if(h instanceof Int16Array)v=a.SHORT;else if(h instanceof Uint32Array)v=a.UNSIGNED_INT;else if(h instanceof Int32Array)v=a.INT;else if(h instanceof Int8Array)v=a.BYTE;else if(h instanceof Uint8Array)v=a.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)v=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:v,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:m}}function s(c,d,h){const u=d.array,m=d._updateRange,g=d.updateRanges;if(a.bindBuffer(h,c),m.count===-1&&g.length===0&&a.bufferSubData(h,0,u),g.length!==0){for(let v=0,f=g.length;v<f;v++){const p=g[v];t?a.bufferSubData(h,p.start*u.BYTES_PER_ELEMENT,u,p.start,p.count):a.bufferSubData(h,p.start*u.BYTES_PER_ELEMENT,u.subarray(p.start,p.start+p.count))}d.clearUpdateRanges()}m.count!==-1&&(t?a.bufferSubData(h,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):a.bufferSubData(h,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),d.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const d=n.get(c);d&&(a.deleteBuffer(d.buffer),n.delete(c))}function l(c,d){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);if(h===void 0)n.set(c,i(c,d));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,c,d),h.version=c.version}}return{get:o,remove:r,update:l}}class hi extends vn{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,o=t/2,r=Math.floor(n),l=Math.floor(i),c=r+1,d=l+1,h=e/r,u=t/l,m=[],g=[],v=[],f=[];for(let p=0;p<d;p++){const y=p*u-o;for(let x=0;x<c;x++){const _=x*h-s;g.push(_,-y,0),v.push(0,0,1),f.push(x/r),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,_=y+c*(p+1),R=y+1+c*(p+1),S=y+1+c*p;m.push(x,_,S),m.push(_,R,S)}this.setIndex(m),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(v,3)),this.setAttribute("uv",new qt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.width,e.height,e.widthSegments,e.heightSegments)}}var _h=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Eh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Th=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ch=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ah=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rh=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ih=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ph=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Nh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Uh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Bh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Oh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Vh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Wh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$h=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,qh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jh=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Qh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,eu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,nu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,iu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,su=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ou=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ru=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,au=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,du=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,fu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,mu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,yu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,_u=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Su=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Eu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Cu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Au=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ru=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Iu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Du=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fu=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Uu=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Bu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Ou=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ku=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,zu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$u=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ju=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ku=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ju=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,np=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,sp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,op=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ap=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,dp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,up=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,yp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_p=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Cp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Ap=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ip=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Np=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Hp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Gp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$p=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:_h,alphahash_pars_fragment:Mh,alphamap_fragment:wh,alphamap_pars_fragment:Sh,alphatest_fragment:Eh,alphatest_pars_fragment:Th,aomap_fragment:Ch,aomap_pars_fragment:Ah,batching_pars_vertex:Rh,batching_vertex:Lh,begin_vertex:Ih,beginnormal_vertex:Ph,bsdfs:Dh,iridescence_fragment:Fh,bumpmap_pars_fragment:Nh,clipping_planes_fragment:Uh,clipping_planes_pars_fragment:Bh,clipping_planes_pars_vertex:Oh,clipping_planes_vertex:kh,color_fragment:zh,color_pars_fragment:Hh,color_pars_vertex:Gh,color_vertex:Vh,common:Wh,cube_uv_reflection_fragment:$h,defaultnormal_vertex:qh,displacementmap_pars_vertex:Xh,displacementmap_vertex:Yh,emissivemap_fragment:jh,emissivemap_pars_fragment:Kh,colorspace_fragment:Zh,colorspace_pars_fragment:Jh,envmap_fragment:Qh,envmap_common_pars_fragment:eu,envmap_pars_fragment:tu,envmap_pars_vertex:nu,envmap_physical_pars_fragment:fu,envmap_vertex:iu,fog_vertex:su,fog_pars_vertex:ou,fog_fragment:ru,fog_pars_fragment:au,gradientmap_pars_fragment:lu,lightmap_fragment:cu,lightmap_pars_fragment:du,lights_lambert_fragment:hu,lights_lambert_pars_fragment:uu,lights_pars_begin:pu,lights_toon_fragment:mu,lights_toon_pars_fragment:gu,lights_phong_fragment:vu,lights_phong_pars_fragment:yu,lights_physical_fragment:xu,lights_physical_pars_fragment:bu,lights_fragment_begin:_u,lights_fragment_maps:Mu,lights_fragment_end:wu,logdepthbuf_fragment:Su,logdepthbuf_pars_fragment:Eu,logdepthbuf_pars_vertex:Tu,logdepthbuf_vertex:Cu,map_fragment:Au,map_pars_fragment:Ru,map_particle_fragment:Lu,map_particle_pars_fragment:Iu,metalnessmap_fragment:Pu,metalnessmap_pars_fragment:Du,morphcolor_vertex:Fu,morphnormal_vertex:Nu,morphtarget_pars_vertex:Uu,morphtarget_vertex:Bu,normal_fragment_begin:Ou,normal_fragment_maps:ku,normal_pars_fragment:zu,normal_pars_vertex:Hu,normal_vertex:Gu,normalmap_pars_fragment:Vu,clearcoat_normal_fragment_begin:Wu,clearcoat_normal_fragment_maps:$u,clearcoat_pars_fragment:qu,iridescence_pars_fragment:Xu,opaque_fragment:Yu,packing:ju,premultiplied_alpha_fragment:Ku,project_vertex:Zu,dithering_fragment:Ju,dithering_pars_fragment:Qu,roughnessmap_fragment:ep,roughnessmap_pars_fragment:tp,shadowmap_pars_fragment:np,shadowmap_pars_vertex:ip,shadowmap_vertex:sp,shadowmask_pars_fragment:op,skinbase_vertex:rp,skinning_pars_vertex:ap,skinning_vertex:lp,skinnormal_vertex:cp,specularmap_fragment:dp,specularmap_pars_fragment:hp,tonemapping_fragment:up,tonemapping_pars_fragment:pp,transmission_fragment:fp,transmission_pars_fragment:mp,uv_pars_fragment:gp,uv_pars_vertex:vp,uv_vertex:yp,worldpos_vertex:xp,background_vert:bp,background_frag:_p,backgroundCube_vert:Mp,backgroundCube_frag:wp,cube_vert:Sp,cube_frag:Ep,depth_vert:Tp,depth_frag:Cp,distanceRGBA_vert:Ap,distanceRGBA_frag:Rp,equirect_vert:Lp,equirect_frag:Ip,linedashed_vert:Pp,linedashed_frag:Dp,meshbasic_vert:Fp,meshbasic_frag:Np,meshlambert_vert:Up,meshlambert_frag:Bp,meshmatcap_vert:Op,meshmatcap_frag:kp,meshnormal_vert:zp,meshnormal_frag:Hp,meshphong_vert:Gp,meshphong_frag:Vp,meshphysical_vert:Wp,meshphysical_frag:$p,meshtoon_vert:qp,meshtoon_frag:Xp,points_vert:Yp,points_frag:jp,shadow_vert:Kp,shadow_frag:Zp,sprite_vert:Jp,sprite_frag:Qp},ue={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},fn={basic:{uniforms:Lt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Lt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Oe(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Lt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Lt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Lt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Oe(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Lt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Lt([ue.points,ue.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Lt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Lt([ue.common,ue.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Lt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Lt([ue.sprite,ue.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:Lt([ue.common,ue.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:Lt([ue.lights,ue.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};fn.physical={uniforms:Lt([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Bs={r:0,b:0,g:0};function ef(a,e,t,n,i,s,o){const r=new Oe(0);let l=s===!0?0:1,c,d,h=null,u=0,m=null;function g(f,p){let y=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?t:e).get(x)),x===null?v(r,l):x&&x.isColor&&(v(x,1),y=!0);const _=a.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,o):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(a.autoClear||y)&&a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil),x&&(x.isCubeTexture||x.mapping===ho)?(d===void 0&&(d=new _t(new ln(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:Vi(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(R,S,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),d.material.uniforms.envMap.value=x,d.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,d.material.toneMapped=Qe.getTransfer(x.colorSpace)!==st,(h!==x||u!==x.version||m!==a.toneMapping)&&(d.material.needsUpdate=!0,h=x,u=x.version,m=a.toneMapping),d.layers.enableAll(),f.unshift(d,d.geometry,d.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new _t(new hi(2,2),new mi({name:"BackgroundMaterial",uniforms:Vi(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(x.colorSpace)!==st,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||m!==a.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,m=a.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null))}function v(f,p){f.getRGB(Bs,mc(a)),n.buffers.color.setClear(Bs.r,Bs.g,Bs.b,p,o)}return{getClearColor:function(){return r},setClearColor:function(f,p=1){r.set(f),l=p,v(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(f){l=f,v(r,l)},render:g}}function tf(a,e,t,n){const i=a.getParameter(a.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||s!==null,r={},l=f(null);let c=l,d=!1;function h(I,F,B,te,Y){let X=!1;if(o){const P=v(te,B,F);c!==P&&(c=P,m(c.object)),X=p(I,te,B,Y),X&&y(I,te,B,Y)}else{const P=F.wireframe===!0;(c.geometry!==te.id||c.program!==B.id||c.wireframe!==P)&&(c.geometry=te.id,c.program=B.id,c.wireframe=P,X=!0)}Y!==null&&t.update(Y,a.ELEMENT_ARRAY_BUFFER),(X||d)&&(d=!1,q(I,F,B,te),Y!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function u(){return n.isWebGL2?a.createVertexArray():s.createVertexArrayOES()}function m(I){return n.isWebGL2?a.bindVertexArray(I):s.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?a.deleteVertexArray(I):s.deleteVertexArrayOES(I)}function v(I,F,B){const te=B.wireframe===!0;let Y=r[I.id];Y===void 0&&(Y={},r[I.id]=Y);let X=Y[F.id];X===void 0&&(X={},Y[F.id]=X);let P=X[te];return P===void 0&&(P=f(u()),X[te]=P),P}function f(I){const F=[],B=[],te=[];for(let Y=0;Y<i;Y++)F[Y]=0,B[Y]=0,te[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:te,object:I,attributes:{},index:null}}function p(I,F,B,te){const Y=c.attributes,X=F.attributes;let P=0;const C=B.getAttributes();for(const V in C)if(C[V].location>=0){const Z=Y[V];let ne=X[V];if(ne===void 0&&(V==="instanceMatrix"&&I.instanceMatrix&&(ne=I.instanceMatrix),V==="instanceColor"&&I.instanceColor&&(ne=I.instanceColor)),Z===void 0||Z.attribute!==ne||ne&&Z.data!==ne.data)return!0;P++}return c.attributesNum!==P||c.index!==te}function y(I,F,B,te){const Y={},X=F.attributes;let P=0;const C=B.getAttributes();for(const V in C)if(C[V].location>=0){let Z=X[V];Z===void 0&&(V==="instanceMatrix"&&I.instanceMatrix&&(Z=I.instanceMatrix),V==="instanceColor"&&I.instanceColor&&(Z=I.instanceColor));const ne={};ne.attribute=Z,Z&&Z.data&&(ne.data=Z.data),Y[V]=ne,P++}c.attributes=Y,c.attributesNum=P,c.index=te}function x(){const I=c.newAttributes;for(let F=0,B=I.length;F<B;F++)I[F]=0}function _(I){R(I,0)}function R(I,F){const B=c.newAttributes,te=c.enabledAttributes,Y=c.attributeDivisors;B[I]=1,te[I]===0&&(a.enableVertexAttribArray(I),te[I]=1),Y[I]!==F&&((n.isWebGL2?a:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,F),Y[I]=F)}function S(){const I=c.newAttributes,F=c.enabledAttributes;for(let B=0,te=F.length;B<te;B++)F[B]!==I[B]&&(a.disableVertexAttribArray(B),F[B]=0)}function L(I,F,B,te,Y,X,P){P===!0?a.vertexAttribIPointer(I,F,B,Y,X):a.vertexAttribPointer(I,F,B,te,Y,X)}function q(I,F,B,te){if(n.isWebGL2===!1&&(I.isInstancedMesh||te.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();const Y=te.attributes,X=B.getAttributes(),P=F.defaultAttributeValues;for(const C in X){const V=X[C];if(V.location>=0){let z=Y[C];if(z===void 0&&(C==="instanceMatrix"&&I.instanceMatrix&&(z=I.instanceMatrix),C==="instanceColor"&&I.instanceColor&&(z=I.instanceColor)),z!==void 0){const Z=z.normalized,ne=z.itemSize,re=t.get(z);if(re===void 0)continue;const ie=re.buffer,pe=re.type,xe=re.bytesPerElement,ve=n.isWebGL2===!0&&(pe===a.INT||pe===a.UNSIGNED_INT||z.gpuType===Jl);if(z.isInterleavedBufferAttribute){const Se=z.data,W=Se.stride,je=z.offset;if(Se.isInstancedInterleavedBuffer){for(let de=0;de<V.locationSize;de++)R(V.location+de,Se.meshPerAttribute);I.isInstancedMesh!==!0&&te._maxInstanceCount===void 0&&(te._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let de=0;de<V.locationSize;de++)_(V.location+de);a.bindBuffer(a.ARRAY_BUFFER,ie);for(let de=0;de<V.locationSize;de++)L(V.location+de,ne/V.locationSize,pe,Z,W*xe,(je+ne/V.locationSize*de)*xe,ve)}else{if(z.isInstancedBufferAttribute){for(let Se=0;Se<V.locationSize;Se++)R(V.location+Se,z.meshPerAttribute);I.isInstancedMesh!==!0&&te._maxInstanceCount===void 0&&(te._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let Se=0;Se<V.locationSize;Se++)_(V.location+Se);a.bindBuffer(a.ARRAY_BUFFER,ie);for(let Se=0;Se<V.locationSize;Se++)L(V.location+Se,ne/V.locationSize,pe,Z,ne*xe,ne/V.locationSize*Se*xe,ve)}}else if(P!==void 0){const Z=P[C];if(Z!==void 0)switch(Z.length){case 2:a.vertexAttrib2fv(V.location,Z);break;case 3:a.vertexAttrib3fv(V.location,Z);break;case 4:a.vertexAttrib4fv(V.location,Z);break;default:a.vertexAttrib1fv(V.location,Z)}}}}S()}function w(){J();for(const I in r){const F=r[I];for(const B in F){const te=F[B];for(const Y in te)g(te[Y].object),delete te[Y];delete F[B]}delete r[I]}}function E(I){if(r[I.id]===void 0)return;const F=r[I.id];for(const B in F){const te=F[B];for(const Y in te)g(te[Y].object),delete te[Y];delete F[B]}delete r[I.id]}function G(I){for(const F in r){const B=r[F];if(B[I.id]===void 0)continue;const te=B[I.id];for(const Y in te)g(te[Y].object),delete te[Y];delete B[I.id]}}function J(){H(),d=!0,c!==l&&(c=l,m(c.object))}function H(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:J,resetDefaultState:H,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:G,initAttributes:x,enableAttribute:_,disableUnusedAttributes:S}}function nf(a,e,t,n){const i=n.isWebGL2;let s;function o(d){s=d}function r(d,h){a.drawArrays(s,d,h),t.update(h,s,1)}function l(d,h,u){if(u===0)return;let m,g;if(i)m=a,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](s,d,h,u),t.update(h,s,u)}function c(d,h,u){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<u;g++)this.render(d[g],h[g]);else{m.multiDrawArraysWEBGL(s,d,0,h,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v];t.update(g,s,1)}}this.setMode=o,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function sf(a,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");n=a.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(L){if(L==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&a.constructor.name==="WebGL2RenderingContext";let r=t.precision!==void 0?t.precision:"highp";const l=s(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=o||e.has("WEBGL_draw_buffers"),d=t.logarithmicDepthBuffer===!0,h=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),u=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=a.getParameter(a.MAX_TEXTURE_SIZE),g=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),v=a.getParameter(a.MAX_VERTEX_ATTRIBS),f=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),p=a.getParameter(a.MAX_VARYING_VECTORS),y=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),x=u>0,_=o||e.has("OES_texture_float"),R=x&&_,S=o?a.getParameter(a.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:s,precision:r,logarithmicDepthBuffer:d,maxTextures:h,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:f,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:x,floatFragmentTextures:_,floatVertexTextures:R,maxSamples:S}}function of(a){const e=this;let t=null,n=0,i=!1,s=!1;const o=new ni,r=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const m=h.length!==0||u||n!==0||i;return i=u,n=h.length,m},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,m){const g=h.clippingPlanes,v=h.clipIntersection,f=h.clipShadows,p=a.get(h);if(!i||g===null||g.length===0||s&&!f)s?d(null):c();else{const y=s?0:n,x=y*4;let _=p.clippingState||null;l.value=_,_=d(g,u,x,m);for(let R=0;R!==x;++R)_[R]=t[R];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,u,m,g){const v=h!==null?h.length:0;let f=null;if(v!==0){if(f=l.value,g!==!0||f===null){const p=m+v*4,y=u.matrixWorldInverse;r.getNormalMatrix(y),(f===null||f.length<p)&&(f=new Float32Array(p));for(let x=0,_=m;x!==v;++x,_+=4)o.copy(h[x]).applyMatrix4(y,r),o.normal.toArray(f,_),f[_+3]=o.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,f}}function rf(a){let e=new WeakMap;function t(o,r){return r===cr?o.mapping=zi:r===dr&&(o.mapping=Hi),o}function n(o){if(o&&o.isTexture){const r=o.mapping;if(r===cr||r===dr)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new xc(l.height/2);return c.fromEquirectangularTexture(a,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const r=o.target;r.removeEventListener("dispose",i);const l=e.get(r);l!==void 0&&(e.delete(r),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class _c extends gc{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,o=n+e,r=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=d*this.view.offsetY,l=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ni=4,za=[.125,.215,.35,.446,.526,.582],oi=20,$o=new _c,Ha=new Oe;let qo=null,Xo=0,Yo=0;const ii=(1+Math.sqrt(5))/2,Ii=1/ii,Ga=[new k(1,1,1),new k(-1,1,1),new k(1,1,-1),new k(-1,1,-1),new k(0,ii,Ii),new k(0,ii,-Ii),new k(Ii,0,ii),new k(-Ii,0,ii),new k(ii,Ii,0),new k(-ii,Ii,0)];class fr{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){qo=this._renderer.getRenderTarget(),Xo=this._renderer.getActiveCubeFace(),Yo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$a(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qo,Xo,Yo),e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zi||e.mapping===Hi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qo=this._renderer.getRenderTarget(),Xo=this._renderer.getActiveCubeFace(),Yo=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:cs,format:rn,colorSpace:Dn,depthBuffer:!1},i=Va(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Va(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=af(s)),this._blurMaterial=lf(s,e,t)}return i}_compileMaterial(e){const t=new _t(this._lodPlanes[0],e);this._renderer.compile(t,$o)}_sceneToCubeUV(e,t,n,i){const r=new Wt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,u=d.toneMapping;d.getClearColor(Ha),d.toneMapping=qn,d.autoClear=!1;const m=new fo({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),g=new _t(new ln,m);let v=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,v=!0):(m.color.copy(Ha),v=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Os(i,y*x,p>2?x:0,x,x),d.setRenderTarget(i),v&&d.render(g,r),d.render(e,r)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=u,d.autoClear=h,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===zi||e.mapping===Hi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=$a()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wa());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new _t(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=e;const l=this._cubeSize;Os(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,$o)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const s=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=Ga[(i-1)%Ga.length];this._blur(e,i-1,i,s,o)}t.autoClear=n}_blur(e,t,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new _t(this._lodPlanes[i],c),u=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*oi-1),v=s/g,f=isFinite(s)?1+Math.floor(d*v):oi;f>oi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${oi}`);const p=[];let y=0;for(let L=0;L<oi;++L){const q=L/v,w=Math.exp(-q*q/2);p.push(w),L===0?y+=w:L<f&&(y+=2*w)}for(let L=0;L<p.length;L++)p[L]=p[L]/y;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=p,u.latitudinal.value=o==="latitudinal",r&&(u.poleAxis.value=r);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const _=this._sizeLods[i],R=3*_*(i>x-Ni?i-x+Ni:0),S=4*(this._cubeSize-_);Os(t,R,S,3*_,2*_),l.setRenderTarget(t),l.render(h,$o)}}function af(a){const e=[],t=[],n=[];let i=a;const s=a-Ni+1+za.length;for(let o=0;o<s;o++){const r=Math.pow(2,i);t.push(r);let l=1/r;o>a-Ni?l=za[o-a+Ni-1]:o===0&&(l=0),n.push(l);const c=1/(r-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],m=6,g=6,v=3,f=2,p=1,y=new Float32Array(v*g*m),x=new Float32Array(f*g*m),_=new Float32Array(p*g*m);for(let S=0;S<m;S++){const L=S%3*2/3-1,q=S>2?0:-1,w=[L,q,0,L+2/3,q,0,L+2/3,q+1,0,L,q,0,L+2/3,q+1,0,L,q+1,0];y.set(w,v*g*S),x.set(u,f*g*S);const E=[S,S,S,S,S,S];_.set(E,p*g*S)}const R=new vn;R.setAttribute("position",new gn(y,v)),R.setAttribute("uv",new gn(x,f)),R.setAttribute("faceIndex",new gn(_,p)),e.push(R),i>Ni&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Va(a,e,t){const n=new fi(a,e,t);return n.texture.mapping=ho,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(a,e,t,n,i){a.viewport.set(e,t,n,i),a.scissor.set(e,t,n,i)}function lf(a,e,t){const n=new Float32Array(oi),i=new k(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Wa(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function $a(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Tr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function cf(a){let e=new WeakMap,t=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===cr||l===dr,d=l===zi||l===Hi;if(c||d)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let h=e.get(r);return t===null&&(t=new fr(a)),h=c?t.fromEquirectangular(r,h):t.fromCubemap(r,h),e.set(r,h),h.texture}else{if(e.has(r))return e.get(r).texture;{const h=r.image;if(c&&h&&h.height>0||d&&h&&i(h)){t===null&&(t=new fr(a));const u=c?t.fromEquirectangular(r):t.fromCubemap(r);return e.set(r,u),r.addEventListener("dispose",s),u.texture}else return null}}}return r}function i(r){let l=0;const c=6;for(let d=0;d<c;d++)r[d]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function df(a){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=a.getExtension("WEBGL_depth_texture")||a.getExtension("MOZ_WEBGL_depth_texture")||a.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("MOZ_EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=a.getExtension("WEBGL_compressed_texture_s3tc")||a.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=a.getExtension("WEBGL_compressed_texture_pvrtc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=a.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function hf(a,e,t,n){const i={},s=new WeakMap;function o(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const v=u.morphAttributes[g];for(let f=0,p=v.length;f<p;f++)e.remove(v[f])}u.removeEventListener("dispose",o),delete i[u.id];const m=s.get(u);m&&(e.remove(m),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function r(h,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,t.memory.geometries++),u}function l(h){const u=h.attributes;for(const g in u)e.update(u[g],a.ARRAY_BUFFER);const m=h.morphAttributes;for(const g in m){const v=m[g];for(let f=0,p=v.length;f<p;f++)e.update(v[f],a.ARRAY_BUFFER)}}function c(h){const u=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const y=m.array;v=m.version;for(let x=0,_=y.length;x<_;x+=3){const R=y[x+0],S=y[x+1],L=y[x+2];u.push(R,S,S,L,L,R)}}else if(g!==void 0){const y=g.array;v=g.version;for(let x=0,_=y.length/3-1;x<_;x+=3){const R=x+0,S=x+1,L=x+2;u.push(R,S,S,L,L,R)}}else return;const f=new(lc(u)?fc:pc)(u,1);f.version=v;const p=s.get(h);p&&e.remove(p),s.set(h,f)}function d(h){const u=s.get(h);if(u){const m=h.index;m!==null&&u.version<m.version&&c(h)}else c(h);return s.get(h)}return{get:r,update:l,getWireframeAttribute:d}}function uf(a,e,t,n){const i=n.isWebGL2;let s;function o(m){s=m}let r,l;function c(m){r=m.type,l=m.bytesPerElement}function d(m,g){a.drawElements(s,g,r,m*l),t.update(g,s,1)}function h(m,g,v){if(v===0)return;let f,p;if(i)f=a,p="drawElementsInstanced";else if(f=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",f===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[p](s,g,r,m*l,v),t.update(g,s,v)}function u(m,g,v){if(v===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<v;p++)this.render(m[p]/l,g[p]);else{f.multiDrawElementsWEBGL(s,g,0,r,m,0,v);let p=0;for(let y=0;y<v;y++)p+=g[y];t.update(p,s,1)}}this.setMode=o,this.setIndex=c,this.render=d,this.renderInstances=h,this.renderMultiDraw=u}function pf(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,r){switch(t.calls++,o){case a.TRIANGLES:t.triangles+=r*(s/3);break;case a.LINES:t.lines+=r*(s/2);break;case a.LINE_STRIP:t.lines+=r*(s-1);break;case a.LINE_LOOP:t.lines+=r*s;break;case a.POINTS:t.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function ff(a,e){return a[0]-e[0]}function mf(a,e){return Math.abs(e[1])-Math.abs(a[1])}function gf(a,e,t){const n={},i=new Float32Array(8),s=new WeakMap,o=new Mt,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,d,h){const u=c.morphTargetInfluences;if(e.isWebGL2===!0){const m=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,g=m!==void 0?m.length:0;let v=s.get(d);if(v===void 0||v.count!==g){let I=function(){J.dispose(),s.delete(d),d.removeEventListener("dispose",I)};v!==void 0&&v.texture.dispose();const y=d.morphAttributes.position!==void 0,x=d.morphAttributes.normal!==void 0,_=d.morphAttributes.color!==void 0,R=d.morphAttributes.position||[],S=d.morphAttributes.normal||[],L=d.morphAttributes.color||[];let q=0;y===!0&&(q=1),x===!0&&(q=2),_===!0&&(q=3);let w=d.attributes.position.count*q,E=1;w>e.maxTextureSize&&(E=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const G=new Float32Array(w*E*4*g),J=new hc(G,w,E,g);J.type=Vn,J.needsUpdate=!0;const H=q*4;for(let F=0;F<g;F++){const B=R[F],te=S[F],Y=L[F],X=w*E*4*F;for(let P=0;P<B.count;P++){const C=P*H;y===!0&&(o.fromBufferAttribute(B,P),G[X+C+0]=o.x,G[X+C+1]=o.y,G[X+C+2]=o.z,G[X+C+3]=0),x===!0&&(o.fromBufferAttribute(te,P),G[X+C+4]=o.x,G[X+C+5]=o.y,G[X+C+6]=o.z,G[X+C+7]=0),_===!0&&(o.fromBufferAttribute(Y,P),G[X+C+8]=o.x,G[X+C+9]=o.y,G[X+C+10]=o.z,G[X+C+11]=Y.itemSize===4?o.w:1)}}v={count:g,texture:J,size:new Ye(w,E)},s.set(d,v),d.addEventListener("dispose",I)}let f=0;for(let y=0;y<u.length;y++)f+=u[y];const p=d.morphTargetsRelative?1:1-f;h.getUniforms().setValue(a,"morphTargetBaseInfluence",p),h.getUniforms().setValue(a,"morphTargetInfluences",u),h.getUniforms().setValue(a,"morphTargetsTexture",v.texture,t),h.getUniforms().setValue(a,"morphTargetsTextureSize",v.size)}else{const m=u===void 0?0:u.length;let g=n[d.id];if(g===void 0||g.length!==m){g=[];for(let x=0;x<m;x++)g[x]=[x,0];n[d.id]=g}for(let x=0;x<m;x++){const _=g[x];_[0]=x,_[1]=u[x]}g.sort(mf);for(let x=0;x<8;x++)x<m&&g[x][1]?(r[x][0]=g[x][0],r[x][1]=g[x][1]):(r[x][0]=Number.MAX_SAFE_INTEGER,r[x][1]=0);r.sort(ff);const v=d.morphAttributes.position,f=d.morphAttributes.normal;let p=0;for(let x=0;x<8;x++){const _=r[x],R=_[0],S=_[1];R!==Number.MAX_SAFE_INTEGER&&S?(v&&d.getAttribute("morphTarget"+x)!==v[R]&&d.setAttribute("morphTarget"+x,v[R]),f&&d.getAttribute("morphNormal"+x)!==f[R]&&d.setAttribute("morphNormal"+x,f[R]),i[x]=S,p+=S):(v&&d.hasAttribute("morphTarget"+x)===!0&&d.deleteAttribute("morphTarget"+x),f&&d.hasAttribute("morphNormal"+x)===!0&&d.deleteAttribute("morphNormal"+x),i[x]=0)}const y=d.morphTargetsRelative?1:1-p;h.getUniforms().setValue(a,"morphTargetBaseInfluence",y),h.getUniforms().setValue(a,"morphTargetInfluences",i)}}return{update:l}}function vf(a,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,d=l.geometry,h=e.get(l,d);if(i.get(h)!==c&&(e.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),i.get(l)!==c&&(t.update(l.instanceMatrix,a.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,a.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return h}function o(){i=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Mc extends Ft{constructor(e,t,n,i,s,o,r,l,c,d){if(d=d!==void 0?d:ci,d!==ci&&d!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===ci&&(n=Gn),n===void 0&&d===Gi&&(n=li),super(null,i,s,o,r,l,d,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=r!==void 0?r:It,this.minFilter=l!==void 0?l:It,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const wc=new Ft,Sc=new Mc(1,1);Sc.compareFunction=ac;const Ec=new hc,Tc=new nh,Cc=new yc,qa=[],Xa=[],Ya=new Float32Array(16),ja=new Float32Array(9),Ka=new Float32Array(4);function qi(a,e,t){const n=a[0];if(n<=0||n>0)return a;const i=e*t;let s=qa[i];if(s===void 0&&(s=new Float32Array(i),qa[i]=s),e!==0){n.toArray(s,0);for(let o=1,r=0;o!==e;++o)r+=t,a[o].toArray(s,r)}return s}function gt(a,e){if(a.length!==e.length)return!1;for(let t=0,n=a.length;t<n;t++)if(a[t]!==e[t])return!1;return!0}function vt(a,e){for(let t=0,n=e.length;t<n;t++)a[t]=e[t]}function mo(a,e){let t=Xa[e];t===void 0&&(t=new Int32Array(e),Xa[e]=t);for(let n=0;n!==e;++n)t[n]=a.allocateTextureUnit();return t}function yf(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function xf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;a.uniform2fv(this.addr,e),vt(t,e)}}function bf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gt(t,e))return;a.uniform3fv(this.addr,e),vt(t,e)}}function _f(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;a.uniform4fv(this.addr,e),vt(t,e)}}function Mf(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;Ka.set(n),a.uniformMatrix2fv(this.addr,!1,Ka),vt(t,n)}}function wf(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;ja.set(n),a.uniformMatrix3fv(this.addr,!1,ja),vt(t,n)}}function Sf(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;Ya.set(n),a.uniformMatrix4fv(this.addr,!1,Ya),vt(t,n)}}function Ef(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function Tf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;a.uniform2iv(this.addr,e),vt(t,e)}}function Cf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;a.uniform3iv(this.addr,e),vt(t,e)}}function Af(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;a.uniform4iv(this.addr,e),vt(t,e)}}function Rf(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function Lf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;a.uniform2uiv(this.addr,e),vt(t,e)}}function If(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;a.uniform3uiv(this.addr,e),vt(t,e)}}function Pf(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;a.uniform4uiv(this.addr,e),vt(t,e)}}function Df(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i);const s=this.type===a.SAMPLER_2D_SHADOW?Sc:wc;t.setTexture2D(e||s,i)}function Ff(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Tc,i)}function Nf(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Cc,i)}function Uf(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ec,i)}function Bf(a){switch(a){case 5126:return yf;case 35664:return xf;case 35665:return bf;case 35666:return _f;case 35674:return Mf;case 35675:return wf;case 35676:return Sf;case 5124:case 35670:return Ef;case 35667:case 35671:return Tf;case 35668:case 35672:return Cf;case 35669:case 35673:return Af;case 5125:return Rf;case 36294:return Lf;case 36295:return If;case 36296:return Pf;case 35678:case 36198:case 36298:case 36306:case 35682:return Df;case 35679:case 36299:case 36307:return Ff;case 35680:case 36300:case 36308:case 36293:return Nf;case 36289:case 36303:case 36311:case 36292:return Uf}}function Of(a,e){a.uniform1fv(this.addr,e)}function kf(a,e){const t=qi(e,this.size,2);a.uniform2fv(this.addr,t)}function zf(a,e){const t=qi(e,this.size,3);a.uniform3fv(this.addr,t)}function Hf(a,e){const t=qi(e,this.size,4);a.uniform4fv(this.addr,t)}function Gf(a,e){const t=qi(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function Vf(a,e){const t=qi(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function Wf(a,e){const t=qi(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function $f(a,e){a.uniform1iv(this.addr,e)}function qf(a,e){a.uniform2iv(this.addr,e)}function Xf(a,e){a.uniform3iv(this.addr,e)}function Yf(a,e){a.uniform4iv(this.addr,e)}function jf(a,e){a.uniform1uiv(this.addr,e)}function Kf(a,e){a.uniform2uiv(this.addr,e)}function Zf(a,e){a.uniform3uiv(this.addr,e)}function Jf(a,e){a.uniform4uiv(this.addr,e)}function Qf(a,e,t){const n=this.cache,i=e.length,s=mo(t,i);gt(n,s)||(a.uniform1iv(this.addr,s),vt(n,s));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||wc,s[o])}function em(a,e,t){const n=this.cache,i=e.length,s=mo(t,i);gt(n,s)||(a.uniform1iv(this.addr,s),vt(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Tc,s[o])}function tm(a,e,t){const n=this.cache,i=e.length,s=mo(t,i);gt(n,s)||(a.uniform1iv(this.addr,s),vt(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Cc,s[o])}function nm(a,e,t){const n=this.cache,i=e.length,s=mo(t,i);gt(n,s)||(a.uniform1iv(this.addr,s),vt(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Ec,s[o])}function im(a){switch(a){case 5126:return Of;case 35664:return kf;case 35665:return zf;case 35666:return Hf;case 35674:return Gf;case 35675:return Vf;case 35676:return Wf;case 5124:case 35670:return $f;case 35667:case 35671:return qf;case 35668:case 35672:return Xf;case 35669:case 35673:return Yf;case 5125:return jf;case 36294:return Kf;case 36295:return Zf;case 36296:return Jf;case 35678:case 36198:case 36298:case 36306:case 35682:return Qf;case 35679:case 36299:case 36307:return em;case 35680:case 36300:case 36308:case 36293:return tm;case 36289:case 36303:case 36311:case 36292:return nm}}class sm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Bf(t.type)}}class om{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=im(t.type)}}class rm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const r=i[s];r.setValue(e,t[r.id],n)}}}const jo=/(\w+)(\])?(\[|\.)?/g;function Za(a,e){a.seq.push(e),a.map[e.id]=e}function am(a,e,t){const n=a.name,i=n.length;for(jo.lastIndex=0;;){const s=jo.exec(n),o=jo.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===i){Za(t,c===void 0?new sm(r,a,e):new om(r,a,e));break}else{let h=t.map[r];h===void 0&&(h=new rm(r),Za(t,h)),t=h}}}class Js{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),o=e.getUniformLocation(t,s.name);am(s,o,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){const r=t[s],l=n[r.id];l.needsUpdate!==!1&&r.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Ja(a,e,t){const n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),n}const lm=37297;let cm=0;function dm(a,e){const t=a.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){const r=o+1;n.push(`${r===e?">":" "} ${r}: ${t[o]}`)}return n.join(`
`)}function hm(a){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(a);let n;switch(e===t?n="":e===oo&&t===so?n="LinearDisplayP3ToLinearSRGB":e===so&&t===oo&&(n="LinearSRGBToLinearDisplayP3"),a){case Dn:case uo:return[n,"LinearTransferOETF"];case ft:case Mr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",a),[n,"LinearTransferOETF"]}}function Qa(a,e,t){const n=a.getShaderParameter(e,a.COMPILE_STATUS),i=a.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+dm(a.getShaderSource(e),o)}else return i}function um(a,e){const t=hm(e);return`vec4 ${a}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function pm(a,e){let t;switch(e){case Ed:t="Linear";break;case Td:t="Reinhard";break;case Cd:t="OptimizedCineon";break;case Ad:t="ACESFilmic";break;case Ld:t="AgX";break;case Rd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function fm(a){return[a.extensionDerivatives||a.envMapCubeUVHeight||a.bumpMap||a.normalMapTangentSpace||a.clearcoatNormalMap||a.flatShading||a.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(a.extensionFragDepth||a.logarithmicDepthBuffer)&&a.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",a.extensionDrawBuffers&&a.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(a.extensionShaderTextureLOD||a.envMap||a.transmission)&&a.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ui).join(`
`)}function mm(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ui).join(`
`)}function gm(a){const e=[];for(const t in a){const n=a[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function vm(a,e){const t={},n=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=a.getActiveAttrib(e,i),o=s.name;let r=1;s.type===a.FLOAT_MAT2&&(r=2),s.type===a.FLOAT_MAT3&&(r=3),s.type===a.FLOAT_MAT4&&(r=4),t[o]={type:s.type,location:a.getAttribLocation(e,o),locationSize:r}}return t}function Ui(a){return a!==""}function el(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tl(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ym=/^[ \t]*#include +<([\w\d./]+)>/gm;function mr(a){return a.replace(ym,bm)}const xm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function bm(a,e){let t=He[e];if(t===void 0){const n=xm.get(e);if(n!==void 0)t=He[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return mr(t)}const _m=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nl(a){return a.replace(_m,Mm)}function Mm(a,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function il(a){let e="precision "+a.precision+` float;
precision `+a.precision+" int;";return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function wm(a){let e="SHADOWMAP_TYPE_BASIC";return a.shadowMapType===Yl?e="SHADOWMAP_TYPE_PCF":a.shadowMapType===jl?e="SHADOWMAP_TYPE_PCF_SOFT":a.shadowMapType===Rn&&(e="SHADOWMAP_TYPE_VSM"),e}function Sm(a){let e="ENVMAP_TYPE_CUBE";if(a.envMap)switch(a.envMapMode){case zi:case Hi:e="ENVMAP_TYPE_CUBE";break;case ho:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Em(a){let e="ENVMAP_MODE_REFLECTION";if(a.envMap)switch(a.envMapMode){case Hi:e="ENVMAP_MODE_REFRACTION";break}return e}function Tm(a){let e="ENVMAP_BLENDING_NONE";if(a.envMap)switch(a.combine){case Kl:e="ENVMAP_BLENDING_MULTIPLY";break;case wd:e="ENVMAP_BLENDING_MIX";break;case Sd:e="ENVMAP_BLENDING_ADD";break}return e}function Cm(a){const e=a.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Am(a,e,t,n){const i=a.getContext(),s=t.defines;let o=t.vertexShader,r=t.fragmentShader;const l=wm(t),c=Sm(t),d=Em(t),h=Tm(t),u=Cm(t),m=t.isWebGL2?"":fm(t),g=mm(t),v=gm(s),f=i.createProgram();let p,y,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ui).join(`
`),p.length>0&&(p+=`
`),y=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ui).join(`
`),y.length>0&&(y+=`
`)):(p=[il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ui).join(`
`),y=[m,il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?He.tonemapping_pars_fragment:"",t.toneMapping!==qn?pm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,um("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ui).join(`
`)),o=mr(o),o=el(o,t),o=tl(o,t),r=mr(r),r=el(r,t),r=tl(r,t),o=nl(o),r=nl(r),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Ma?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ma?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const _=x+p+o,R=x+y+r,S=Ja(i,i.VERTEX_SHADER,_),L=Ja(i,i.FRAGMENT_SHADER,R);i.attachShader(f,S),i.attachShader(f,L),t.index0AttributeName!==void 0?i.bindAttribLocation(f,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(f,0,"position"),i.linkProgram(f);function q(J){if(a.debug.checkShaderErrors){const H=i.getProgramInfoLog(f).trim(),I=i.getShaderInfoLog(S).trim(),F=i.getShaderInfoLog(L).trim();let B=!0,te=!0;if(i.getProgramParameter(f,i.LINK_STATUS)===!1)if(B=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(i,f,S,L);else{const Y=Qa(i,S,"vertex"),X=Qa(i,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(f,i.VALIDATE_STATUS)+`

Program Info Log: `+H+`
`+Y+`
`+X)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(I===""||F==="")&&(te=!1);te&&(J.diagnostics={runnable:B,programLog:H,vertexShader:{log:I,prefix:p},fragmentShader:{log:F,prefix:y}})}i.deleteShader(S),i.deleteShader(L),w=new Js(i,f),E=vm(i,f)}let w;this.getUniforms=function(){return w===void 0&&q(this),w};let E;this.getAttributes=function(){return E===void 0&&q(this),E};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=i.getProgramParameter(f,lm)),G},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(f),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cm++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=S,this.fragmentShader=L,this}let Rm=0;class Lm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Im(e),t.set(e,n)),n}}class Im{constructor(e){this.id=Rm++,this.code=e,this.usedTimes=0}}function Pm(a,e,t,n,i,s,o){const r=new Sr,l=new Lm,c=[],d=i.isWebGL2,h=i.logarithmicDepthBuffer,u=i.vertexTextures;let m=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return w===0?"uv":`uv${w}`}function f(w,E,G,J,H){const I=J.fog,F=H.geometry,B=w.isMeshStandardMaterial?J.environment:null,te=(w.isMeshStandardMaterial?t:e).get(w.envMap||B),Y=te&&te.mapping===ho?te.image.height:null,X=g[w.type];w.precision!==null&&(m=i.getMaxPrecision(w.precision),m!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const P=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,C=P!==void 0?P.length:0;let V=0;F.morphAttributes.position!==void 0&&(V=1),F.morphAttributes.normal!==void 0&&(V=2),F.morphAttributes.color!==void 0&&(V=3);let z,Z,ne,re;if(X){const Ct=fn[X];z=Ct.vertexShader,Z=Ct.fragmentShader}else z=w.vertexShader,Z=w.fragmentShader,l.update(w),ne=l.getVertexShaderID(w),re=l.getFragmentShaderID(w);const ie=a.getRenderTarget(),pe=H.isInstancedMesh===!0,xe=H.isBatchedMesh===!0,ve=!!w.map,Se=!!w.matcap,W=!!te,je=!!w.aoMap,de=!!w.lightMap,Ee=!!w.bumpMap,ye=!!w.normalMap,Xe=!!w.displacementMap,Re=!!w.emissiveMap,A=!!w.metalnessMap,M=!!w.roughnessMap,j=w.anisotropy>0,ae=w.clearcoat>0,oe=w.iridescence>0,le=w.sheen>0,Te=w.transmission>0,fe=j&&!!w.anisotropyMap,Me=ae&&!!w.clearcoatMap,Le=ae&&!!w.clearcoatNormalMap,Ue=ae&&!!w.clearcoatRoughnessMap,se=oe&&!!w.iridescenceMap,Ke=oe&&!!w.iridescenceThicknessMap,Ge=le&&!!w.sheenColorMap,Fe=le&&!!w.sheenRoughnessMap,Ae=!!w.specularMap,we=!!w.specularColorMap,ze=!!w.specularIntensityMap,Je=Te&&!!w.transmissionMap,rt=Te&&!!w.thicknessMap,We=!!w.gradientMap,he=!!w.alphaMap,O=w.alphaTest>0,me=!!w.alphaHash,ge=!!w.extensions,De=!!F.attributes.uv1,Ie=!!F.attributes.uv2,et=!!F.attributes.uv3;let tt=qn;return w.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(tt=a.toneMapping),{isWebGL2:d,shaderID:X,shaderType:w.type,shaderName:w.name,vertexShader:z,fragmentShader:Z,defines:w.defines,customVertexShaderID:ne,customFragmentShaderID:re,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:xe,instancing:pe,instancingColor:pe&&H.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:ie===null?a.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Dn,map:ve,matcap:Se,envMap:W,envMapMode:W&&te.mapping,envMapCubeUVHeight:Y,aoMap:je,lightMap:de,bumpMap:Ee,normalMap:ye,displacementMap:u&&Xe,emissiveMap:Re,normalMapObjectSpace:ye&&w.normalMapType===Gd,normalMapTangentSpace:ye&&w.normalMapType===rc,metalnessMap:A,roughnessMap:M,anisotropy:j,anisotropyMap:fe,clearcoat:ae,clearcoatMap:Me,clearcoatNormalMap:Le,clearcoatRoughnessMap:Ue,iridescence:oe,iridescenceMap:se,iridescenceThicknessMap:Ke,sheen:le,sheenColorMap:Ge,sheenRoughnessMap:Fe,specularMap:Ae,specularColorMap:we,specularIntensityMap:ze,transmission:Te,transmissionMap:Je,thicknessMap:rt,gradientMap:We,opaque:w.transparent===!1&&w.blending===Oi,alphaMap:he,alphaTest:O,alphaHash:me,combine:w.combine,mapUv:ve&&v(w.map.channel),aoMapUv:je&&v(w.aoMap.channel),lightMapUv:de&&v(w.lightMap.channel),bumpMapUv:Ee&&v(w.bumpMap.channel),normalMapUv:ye&&v(w.normalMap.channel),displacementMapUv:Xe&&v(w.displacementMap.channel),emissiveMapUv:Re&&v(w.emissiveMap.channel),metalnessMapUv:A&&v(w.metalnessMap.channel),roughnessMapUv:M&&v(w.roughnessMap.channel),anisotropyMapUv:fe&&v(w.anisotropyMap.channel),clearcoatMapUv:Me&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:Le&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ue&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:se&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ke&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&v(w.sheenRoughnessMap.channel),specularMapUv:Ae&&v(w.specularMap.channel),specularColorMapUv:we&&v(w.specularColorMap.channel),specularIntensityMapUv:ze&&v(w.specularIntensityMap.channel),transmissionMapUv:Je&&v(w.transmissionMap.channel),thicknessMapUv:rt&&v(w.thicknessMap.channel),alphaMapUv:he&&v(w.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ye||j),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:De,vertexUv2s:Ie,vertexUv3s:et,pointsUvs:H.isPoints===!0&&!!F.attributes.uv&&(ve||he),fog:!!I,useFog:w.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:H.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:C,morphTextureStride:V,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:a.shadowMap.enabled&&G.length>0,shadowMapType:a.shadowMap.type,toneMapping:tt,useLegacyLights:a._useLegacyLights,decodeVideoTexture:ve&&w.map.isVideoTexture===!0&&Qe.getTransfer(w.map.colorSpace)===st,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Ln,flipSided:w.side===Dt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionDerivatives:ge&&w.extensions.derivatives===!0,extensionFragDepth:ge&&w.extensions.fragDepth===!0,extensionDrawBuffers:ge&&w.extensions.drawBuffers===!0,extensionShaderTextureLOD:ge&&w.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ge&&w.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()}}function p(w){const E=[];if(w.shaderID?E.push(w.shaderID):(E.push(w.customVertexShaderID),E.push(w.customFragmentShaderID)),w.defines!==void 0)for(const G in w.defines)E.push(G),E.push(w.defines[G]);return w.isRawShaderMaterial===!1&&(y(E,w),x(E,w),E.push(a.outputColorSpace)),E.push(w.customProgramCacheKey),E.join()}function y(w,E){w.push(E.precision),w.push(E.outputColorSpace),w.push(E.envMapMode),w.push(E.envMapCubeUVHeight),w.push(E.mapUv),w.push(E.alphaMapUv),w.push(E.lightMapUv),w.push(E.aoMapUv),w.push(E.bumpMapUv),w.push(E.normalMapUv),w.push(E.displacementMapUv),w.push(E.emissiveMapUv),w.push(E.metalnessMapUv),w.push(E.roughnessMapUv),w.push(E.anisotropyMapUv),w.push(E.clearcoatMapUv),w.push(E.clearcoatNormalMapUv),w.push(E.clearcoatRoughnessMapUv),w.push(E.iridescenceMapUv),w.push(E.iridescenceThicknessMapUv),w.push(E.sheenColorMapUv),w.push(E.sheenRoughnessMapUv),w.push(E.specularMapUv),w.push(E.specularColorMapUv),w.push(E.specularIntensityMapUv),w.push(E.transmissionMapUv),w.push(E.thicknessMapUv),w.push(E.combine),w.push(E.fogExp2),w.push(E.sizeAttenuation),w.push(E.morphTargetsCount),w.push(E.morphAttributeCount),w.push(E.numDirLights),w.push(E.numPointLights),w.push(E.numSpotLights),w.push(E.numSpotLightMaps),w.push(E.numHemiLights),w.push(E.numRectAreaLights),w.push(E.numDirLightShadows),w.push(E.numPointLightShadows),w.push(E.numSpotLightShadows),w.push(E.numSpotLightShadowsWithMaps),w.push(E.numLightProbes),w.push(E.shadowMapType),w.push(E.toneMapping),w.push(E.numClippingPlanes),w.push(E.numClipIntersection),w.push(E.depthPacking)}function x(w,E){r.disableAll(),E.isWebGL2&&r.enable(0),E.supportsVertexTextures&&r.enable(1),E.instancing&&r.enable(2),E.instancingColor&&r.enable(3),E.matcap&&r.enable(4),E.envMap&&r.enable(5),E.normalMapObjectSpace&&r.enable(6),E.normalMapTangentSpace&&r.enable(7),E.clearcoat&&r.enable(8),E.iridescence&&r.enable(9),E.alphaTest&&r.enable(10),E.vertexColors&&r.enable(11),E.vertexAlphas&&r.enable(12),E.vertexUv1s&&r.enable(13),E.vertexUv2s&&r.enable(14),E.vertexUv3s&&r.enable(15),E.vertexTangents&&r.enable(16),E.anisotropy&&r.enable(17),E.alphaHash&&r.enable(18),E.batching&&r.enable(19),w.push(r.mask),r.disableAll(),E.fog&&r.enable(0),E.useFog&&r.enable(1),E.flatShading&&r.enable(2),E.logarithmicDepthBuffer&&r.enable(3),E.skinning&&r.enable(4),E.morphTargets&&r.enable(5),E.morphNormals&&r.enable(6),E.morphColors&&r.enable(7),E.premultipliedAlpha&&r.enable(8),E.shadowMapEnabled&&r.enable(9),E.useLegacyLights&&r.enable(10),E.doubleSided&&r.enable(11),E.flipSided&&r.enable(12),E.useDepthPacking&&r.enable(13),E.dithering&&r.enable(14),E.transmission&&r.enable(15),E.sheen&&r.enable(16),E.opaque&&r.enable(17),E.pointsUvs&&r.enable(18),E.decodeVideoTexture&&r.enable(19),w.push(r.mask)}function _(w){const E=g[w.type];let G;if(E){const J=fn[E];G=mh.clone(J.uniforms)}else G=w.uniforms;return G}function R(w,E){let G;for(let J=0,H=c.length;J<H;J++){const I=c[J];if(I.cacheKey===E){G=I,++G.usedTimes;break}}return G===void 0&&(G=new Am(a,E,w,s),c.push(G)),G}function S(w){if(--w.usedTimes===0){const E=c.indexOf(w);c[E]=c[c.length-1],c.pop(),w.destroy()}}function L(w){l.remove(w)}function q(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:S,releaseShaderCache:L,programs:c,dispose:q}}function Dm(){let a=new WeakMap;function e(s){let o=a.get(s);return o===void 0&&(o={},a.set(s,o)),o}function t(s){a.delete(s)}function n(s,o,r){a.get(s)[o]=r}function i(){a=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Fm(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.z!==e.z?a.z-e.z:a.id-e.id}function sl(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function ol(){const a=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(h,u,m,g,v,f){let p=a[e];return p===void 0?(p={id:h.id,object:h,geometry:u,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:f},a[e]=p):(p.id=h.id,p.object=h,p.geometry=u,p.material=m,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=f),e++,p}function r(h,u,m,g,v,f){const p=o(h,u,m,g,v,f);m.transmission>0?n.push(p):m.transparent===!0?i.push(p):t.push(p)}function l(h,u,m,g,v,f){const p=o(h,u,m,g,v,f);m.transmission>0?n.unshift(p):m.transparent===!0?i.unshift(p):t.unshift(p)}function c(h,u){t.length>1&&t.sort(h||Fm),n.length>1&&n.sort(u||sl),i.length>1&&i.sort(u||sl)}function d(){for(let h=e,u=a.length;h<u;h++){const m=a[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:r,unshift:l,finish:d,sort:c}}function Nm(){let a=new WeakMap;function e(n,i){const s=a.get(n);let o;return s===void 0?(o=new ol,a.set(n,[o])):i>=s.length?(o=new ol,s.push(o)):o=s[i],o}function t(){a=new WeakMap}return{get:e,dispose:t}}function Um(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Oe};break;case"SpotLight":t={position:new k,direction:new k,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new k,halfWidth:new k,halfHeight:new k};break}return a[e.id]=t,t}}}function Bm(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let Om=0;function km(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function zm(a,e){const t=new Um,n=Bm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new k);const s=new k,o=new ut,r=new ut;function l(d,h){let u=0,m=0,g=0;for(let J=0;J<9;J++)i.probe[J].set(0,0,0);let v=0,f=0,p=0,y=0,x=0,_=0,R=0,S=0,L=0,q=0,w=0;d.sort(km);const E=h===!0?Math.PI:1;for(let J=0,H=d.length;J<H;J++){const I=d[J],F=I.color,B=I.intensity,te=I.distance,Y=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=F.r*B*E,m+=F.g*B*E,g+=F.b*B*E;else if(I.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(I.sh.coefficients[X],B);w++}else if(I.isDirectionalLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*E),I.castShadow){const P=I.shadow,C=n.get(I);C.shadowBias=P.bias,C.shadowNormalBias=P.normalBias,C.shadowRadius=P.radius,C.shadowMapSize=P.mapSize,i.directionalShadow[v]=C,i.directionalShadowMap[v]=Y,i.directionalShadowMatrix[v]=I.shadow.matrix,_++}i.directional[v]=X,v++}else if(I.isSpotLight){const X=t.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(F).multiplyScalar(B*E),X.distance=te,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,i.spot[p]=X;const P=I.shadow;if(I.map&&(i.spotLightMap[L]=I.map,L++,P.updateMatrices(I),I.castShadow&&q++),i.spotLightMatrix[p]=P.matrix,I.castShadow){const C=n.get(I);C.shadowBias=P.bias,C.shadowNormalBias=P.normalBias,C.shadowRadius=P.radius,C.shadowMapSize=P.mapSize,i.spotShadow[p]=C,i.spotShadowMap[p]=Y,S++}p++}else if(I.isRectAreaLight){const X=t.get(I);X.color.copy(F).multiplyScalar(B),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),i.rectArea[y]=X,y++}else if(I.isPointLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*E),X.distance=I.distance,X.decay=I.decay,I.castShadow){const P=I.shadow,C=n.get(I);C.shadowBias=P.bias,C.shadowNormalBias=P.normalBias,C.shadowRadius=P.radius,C.shadowMapSize=P.mapSize,C.shadowCameraNear=P.camera.near,C.shadowCameraFar=P.camera.far,i.pointShadow[f]=C,i.pointShadowMap[f]=Y,i.pointShadowMatrix[f]=I.shadow.matrix,R++}i.point[f]=X,f++}else if(I.isHemisphereLight){const X=t.get(I);X.skyColor.copy(I.color).multiplyScalar(B*E),X.groundColor.copy(I.groundColor).multiplyScalar(B*E),i.hemi[x]=X,x++}}y>0&&(e.isWebGL2?a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):a.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=m,i.ambient[2]=g;const G=i.hash;(G.directionalLength!==v||G.pointLength!==f||G.spotLength!==p||G.rectAreaLength!==y||G.hemiLength!==x||G.numDirectionalShadows!==_||G.numPointShadows!==R||G.numSpotShadows!==S||G.numSpotMaps!==L||G.numLightProbes!==w)&&(i.directional.length=v,i.spot.length=p,i.rectArea.length=y,i.point.length=f,i.hemi.length=x,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=S+L-q,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=q,i.numLightProbes=w,G.directionalLength=v,G.pointLength=f,G.spotLength=p,G.rectAreaLength=y,G.hemiLength=x,G.numDirectionalShadows=_,G.numPointShadows=R,G.numSpotShadows=S,G.numSpotMaps=L,G.numLightProbes=w,i.version=Om++)}function c(d,h){let u=0,m=0,g=0,v=0,f=0;const p=h.matrixWorldInverse;for(let y=0,x=d.length;y<x;y++){const _=d[y];if(_.isDirectionalLight){const R=i.directional[u];R.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),u++}else if(_.isSpotLight){const R=i.spot[g];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),g++}else if(_.isRectAreaLight){const R=i.rectArea[v];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),r.identity(),o.copy(_.matrixWorld),o.premultiply(p),r.extractRotation(o),R.halfWidth.set(_.width*.5,0,0),R.halfHeight.set(0,_.height*.5,0),R.halfWidth.applyMatrix4(r),R.halfHeight.applyMatrix4(r),v++}else if(_.isPointLight){const R=i.point[m];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),m++}else if(_.isHemisphereLight){const R=i.hemi[f];R.direction.setFromMatrixPosition(_.matrixWorld),R.direction.transformDirection(p),f++}}}return{setup:l,setupView:c,state:i}}function rl(a,e){const t=new zm(a,e),n=[],i=[];function s(){n.length=0,i.length=0}function o(h){n.push(h)}function r(h){i.push(h)}function l(h){t.setup(n,h)}function c(h){t.setupView(n,h)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:r}}function Hm(a,e){let t=new WeakMap;function n(s,o=0){const r=t.get(s);let l;return r===void 0?(l=new rl(a,e),t.set(s,[l])):o>=r.length?(l=new rl(a,e),r.push(l)):l=r[o],l}function i(){t=new WeakMap}return{get:n,dispose:i}}class Gm extends $i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Vm extends $i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Wm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$m=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function qm(a,e,t){let n=new Er;const i=new Ye,s=new Ye,o=new Mt,r=new Gm({depthPacking:Hd}),l=new Vm,c={},d=t.maxTextureSize,h={[Pn]:Dt,[Dt]:Pn,[Ln]:Ln},u=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:Wm,fragmentShader:$m}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new vn;g.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new _t(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yl;let p=this.type;this.render=function(S,L,q){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||S.length===0)return;const w=a.getRenderTarget(),E=a.getActiveCubeFace(),G=a.getActiveMipmapLevel(),J=a.state;J.setBlending($n),J.buffers.color.setClear(1,1,1,1),J.buffers.depth.setTest(!0),J.setScissorTest(!1);const H=p!==Rn&&this.type===Rn,I=p===Rn&&this.type!==Rn;for(let F=0,B=S.length;F<B;F++){const te=S[F],Y=te.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;i.copy(Y.mapSize);const X=Y.getFrameExtents();if(i.multiply(X),s.copy(Y.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(s.x=Math.floor(d/X.x),i.x=s.x*X.x,Y.mapSize.x=s.x),i.y>d&&(s.y=Math.floor(d/X.y),i.y=s.y*X.y,Y.mapSize.y=s.y)),Y.map===null||H===!0||I===!0){const C=this.type!==Rn?{minFilter:It,magFilter:It}:{};Y.map!==null&&Y.map.dispose(),Y.map=new fi(i.x,i.y,C),Y.map.texture.name=te.name+".shadowMap",Y.camera.updateProjectionMatrix()}a.setRenderTarget(Y.map),a.clear();const P=Y.getViewportCount();for(let C=0;C<P;C++){const V=Y.getViewport(C);o.set(s.x*V.x,s.y*V.y,s.x*V.z,s.y*V.w),J.viewport(o),Y.updateMatrices(te,C),n=Y.getFrustum(),_(L,q,Y.camera,te,this.type)}Y.isPointLightShadow!==!0&&this.type===Rn&&y(Y,q),Y.needsUpdate=!1}p=this.type,f.needsUpdate=!1,a.setRenderTarget(w,E,G)};function y(S,L){const q=e.update(v);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new fi(i.x,i.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,a.setRenderTarget(S.mapPass),a.clear(),a.renderBufferDirect(L,null,q,u,v,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,a.setRenderTarget(S.map),a.clear(),a.renderBufferDirect(L,null,q,m,v,null)}function x(S,L,q,w){let E=null;const G=q.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(G!==void 0)E=G;else if(E=q.isPointLight===!0?l:r,a.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const J=E.uuid,H=L.uuid;let I=c[J];I===void 0&&(I={},c[J]=I);let F=I[H];F===void 0&&(F=E.clone(),I[H]=F,L.addEventListener("dispose",R)),E=F}if(E.visible=L.visible,E.wireframe=L.wireframe,w===Rn?E.side=L.shadowSide!==null?L.shadowSide:L.side:E.side=L.shadowSide!==null?L.shadowSide:h[L.side],E.alphaMap=L.alphaMap,E.alphaTest=L.alphaTest,E.map=L.map,E.clipShadows=L.clipShadows,E.clippingPlanes=L.clippingPlanes,E.clipIntersection=L.clipIntersection,E.displacementMap=L.displacementMap,E.displacementScale=L.displacementScale,E.displacementBias=L.displacementBias,E.wireframeLinewidth=L.wireframeLinewidth,E.linewidth=L.linewidth,q.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const J=a.properties.get(E);J.light=q}return E}function _(S,L,q,w,E){if(S.visible===!1)return;if(S.layers.test(L.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&E===Rn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,S.matrixWorld);const H=e.update(S),I=S.material;if(Array.isArray(I)){const F=H.groups;for(let B=0,te=F.length;B<te;B++){const Y=F[B],X=I[Y.materialIndex];if(X&&X.visible){const P=x(S,X,w,E);S.onBeforeShadow(a,S,L,q,H,P,Y),a.renderBufferDirect(q,null,H,P,S,Y),S.onAfterShadow(a,S,L,q,H,P,Y)}}}else if(I.visible){const F=x(S,I,w,E);S.onBeforeShadow(a,S,L,q,H,F,null),a.renderBufferDirect(q,null,H,F,S,null),S.onAfterShadow(a,S,L,q,H,F,null)}}const J=S.children;for(let H=0,I=J.length;H<I;H++)_(J[H],L,q,w,E)}function R(S){S.target.removeEventListener("dispose",R);for(const q in c){const w=c[q],E=S.target.uuid;E in w&&(w[E].dispose(),delete w[E])}}}function Xm(a,e,t){const n=t.isWebGL2;function i(){let O=!1;const me=new Mt;let ge=null;const De=new Mt(0,0,0,0);return{setMask:function(Ie){ge!==Ie&&!O&&(a.colorMask(Ie,Ie,Ie,Ie),ge=Ie)},setLocked:function(Ie){O=Ie},setClear:function(Ie,et,tt,yt,Ct){Ct===!0&&(Ie*=yt,et*=yt,tt*=yt),me.set(Ie,et,tt,yt),De.equals(me)===!1&&(a.clearColor(Ie,et,tt,yt),De.copy(me))},reset:function(){O=!1,ge=null,De.set(-1,0,0,0)}}}function s(){let O=!1,me=null,ge=null,De=null;return{setTest:function(Ie){Ie?xe(a.DEPTH_TEST):ve(a.DEPTH_TEST)},setMask:function(Ie){me!==Ie&&!O&&(a.depthMask(Ie),me=Ie)},setFunc:function(Ie){if(ge!==Ie){switch(Ie){case gd:a.depthFunc(a.NEVER);break;case vd:a.depthFunc(a.ALWAYS);break;case yd:a.depthFunc(a.LESS);break;case no:a.depthFunc(a.LEQUAL);break;case xd:a.depthFunc(a.EQUAL);break;case bd:a.depthFunc(a.GEQUAL);break;case _d:a.depthFunc(a.GREATER);break;case Md:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}ge=Ie}},setLocked:function(Ie){O=Ie},setClear:function(Ie){De!==Ie&&(a.clearDepth(Ie),De=Ie)},reset:function(){O=!1,me=null,ge=null,De=null}}}function o(){let O=!1,me=null,ge=null,De=null,Ie=null,et=null,tt=null,yt=null,Ct=null;return{setTest:function(nt){O||(nt?xe(a.STENCIL_TEST):ve(a.STENCIL_TEST))},setMask:function(nt){me!==nt&&!O&&(a.stencilMask(nt),me=nt)},setFunc:function(nt,At,cn){(ge!==nt||De!==At||Ie!==cn)&&(a.stencilFunc(nt,At,cn),ge=nt,De=At,Ie=cn)},setOp:function(nt,At,cn){(et!==nt||tt!==At||yt!==cn)&&(a.stencilOp(nt,At,cn),et=nt,tt=At,yt=cn)},setLocked:function(nt){O=nt},setClear:function(nt){Ct!==nt&&(a.clearStencil(nt),Ct=nt)},reset:function(){O=!1,me=null,ge=null,De=null,Ie=null,et=null,tt=null,yt=null,Ct=null}}}const r=new i,l=new s,c=new o,d=new WeakMap,h=new WeakMap;let u={},m={},g=new WeakMap,v=[],f=null,p=!1,y=null,x=null,_=null,R=null,S=null,L=null,q=null,w=new Oe(0,0,0),E=0,G=!1,J=null,H=null,I=null,F=null,B=null;const te=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,X=0;const P=a.getParameter(a.VERSION);P.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(P)[1]),Y=X>=1):P.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),Y=X>=2);let C=null,V={};const z=a.getParameter(a.SCISSOR_BOX),Z=a.getParameter(a.VIEWPORT),ne=new Mt().fromArray(z),re=new Mt().fromArray(Z);function ie(O,me,ge,De){const Ie=new Uint8Array(4),et=a.createTexture();a.bindTexture(O,et),a.texParameteri(O,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(O,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let tt=0;tt<ge;tt++)n&&(O===a.TEXTURE_3D||O===a.TEXTURE_2D_ARRAY)?a.texImage3D(me,0,a.RGBA,1,1,De,0,a.RGBA,a.UNSIGNED_BYTE,Ie):a.texImage2D(me+tt,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,Ie);return et}const pe={};pe[a.TEXTURE_2D]=ie(a.TEXTURE_2D,a.TEXTURE_2D,1),pe[a.TEXTURE_CUBE_MAP]=ie(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(pe[a.TEXTURE_2D_ARRAY]=ie(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),pe[a.TEXTURE_3D]=ie(a.TEXTURE_3D,a.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),xe(a.DEPTH_TEST),l.setFunc(no),Re(!1),A(Gr),xe(a.CULL_FACE),ye($n);function xe(O){u[O]!==!0&&(a.enable(O),u[O]=!0)}function ve(O){u[O]!==!1&&(a.disable(O),u[O]=!1)}function Se(O,me){return m[O]!==me?(a.bindFramebuffer(O,me),m[O]=me,n&&(O===a.DRAW_FRAMEBUFFER&&(m[a.FRAMEBUFFER]=me),O===a.FRAMEBUFFER&&(m[a.DRAW_FRAMEBUFFER]=me)),!0):!1}function W(O,me){let ge=v,De=!1;if(O)if(ge=g.get(me),ge===void 0&&(ge=[],g.set(me,ge)),O.isWebGLMultipleRenderTargets){const Ie=O.texture;if(ge.length!==Ie.length||ge[0]!==a.COLOR_ATTACHMENT0){for(let et=0,tt=Ie.length;et<tt;et++)ge[et]=a.COLOR_ATTACHMENT0+et;ge.length=Ie.length,De=!0}}else ge[0]!==a.COLOR_ATTACHMENT0&&(ge[0]=a.COLOR_ATTACHMENT0,De=!0);else ge[0]!==a.BACK&&(ge[0]=a.BACK,De=!0);De&&(t.isWebGL2?a.drawBuffers(ge):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ge))}function je(O){return f!==O?(a.useProgram(O),f=O,!0):!1}const de={[si]:a.FUNC_ADD,[td]:a.FUNC_SUBTRACT,[nd]:a.FUNC_REVERSE_SUBTRACT};if(n)de[qr]=a.MIN,de[Xr]=a.MAX;else{const O=e.get("EXT_blend_minmax");O!==null&&(de[qr]=O.MIN_EXT,de[Xr]=O.MAX_EXT)}const Ee={[id]:a.ZERO,[sd]:a.ONE,[od]:a.SRC_COLOR,[ar]:a.SRC_ALPHA,[hd]:a.SRC_ALPHA_SATURATE,[cd]:a.DST_COLOR,[ad]:a.DST_ALPHA,[rd]:a.ONE_MINUS_SRC_COLOR,[lr]:a.ONE_MINUS_SRC_ALPHA,[dd]:a.ONE_MINUS_DST_COLOR,[ld]:a.ONE_MINUS_DST_ALPHA,[ud]:a.CONSTANT_COLOR,[pd]:a.ONE_MINUS_CONSTANT_COLOR,[fd]:a.CONSTANT_ALPHA,[md]:a.ONE_MINUS_CONSTANT_ALPHA};function ye(O,me,ge,De,Ie,et,tt,yt,Ct,nt){if(O===$n){p===!0&&(ve(a.BLEND),p=!1);return}if(p===!1&&(xe(a.BLEND),p=!0),O!==ed){if(O!==y||nt!==G){if((x!==si||S!==si)&&(a.blendEquation(a.FUNC_ADD),x=si,S=si),nt)switch(O){case Oi:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case Vr:a.blendFunc(a.ONE,a.ONE);break;case Wr:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case $r:a.blendFuncSeparate(a.ZERO,a.SRC_COLOR,a.ZERO,a.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Oi:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case Vr:a.blendFunc(a.SRC_ALPHA,a.ONE);break;case Wr:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case $r:a.blendFunc(a.ZERO,a.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}_=null,R=null,L=null,q=null,w.set(0,0,0),E=0,y=O,G=nt}return}Ie=Ie||me,et=et||ge,tt=tt||De,(me!==x||Ie!==S)&&(a.blendEquationSeparate(de[me],de[Ie]),x=me,S=Ie),(ge!==_||De!==R||et!==L||tt!==q)&&(a.blendFuncSeparate(Ee[ge],Ee[De],Ee[et],Ee[tt]),_=ge,R=De,L=et,q=tt),(yt.equals(w)===!1||Ct!==E)&&(a.blendColor(yt.r,yt.g,yt.b,Ct),w.copy(yt),E=Ct),y=O,G=!1}function Xe(O,me){O.side===Ln?ve(a.CULL_FACE):xe(a.CULL_FACE);let ge=O.side===Dt;me&&(ge=!ge),Re(ge),O.blending===Oi&&O.transparent===!1?ye($n):ye(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),r.setMask(O.colorWrite);const De=O.stencilWrite;c.setTest(De),De&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),j(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?xe(a.SAMPLE_ALPHA_TO_COVERAGE):ve(a.SAMPLE_ALPHA_TO_COVERAGE)}function Re(O){J!==O&&(O?a.frontFace(a.CW):a.frontFace(a.CCW),J=O)}function A(O){O!==Jc?(xe(a.CULL_FACE),O!==H&&(O===Gr?a.cullFace(a.BACK):O===Qc?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):ve(a.CULL_FACE),H=O}function M(O){O!==I&&(Y&&a.lineWidth(O),I=O)}function j(O,me,ge){O?(xe(a.POLYGON_OFFSET_FILL),(F!==me||B!==ge)&&(a.polygonOffset(me,ge),F=me,B=ge)):ve(a.POLYGON_OFFSET_FILL)}function ae(O){O?xe(a.SCISSOR_TEST):ve(a.SCISSOR_TEST)}function oe(O){O===void 0&&(O=a.TEXTURE0+te-1),C!==O&&(a.activeTexture(O),C=O)}function le(O,me,ge){ge===void 0&&(C===null?ge=a.TEXTURE0+te-1:ge=C);let De=V[ge];De===void 0&&(De={type:void 0,texture:void 0},V[ge]=De),(De.type!==O||De.texture!==me)&&(C!==ge&&(a.activeTexture(ge),C=ge),a.bindTexture(O,me||pe[O]),De.type=O,De.texture=me)}function Te(){const O=V[C];O!==void 0&&O.type!==void 0&&(a.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function fe(){try{a.compressedTexImage2D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Me(){try{a.compressedTexImage3D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Le(){try{a.texSubImage2D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ue(){try{a.texSubImage3D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function se(){try{a.compressedTexSubImage2D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ke(){try{a.compressedTexSubImage3D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ge(){try{a.texStorage2D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Fe(){try{a.texStorage3D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ae(){try{a.texImage2D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function we(){try{a.texImage3D.apply(a,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ze(O){ne.equals(O)===!1&&(a.scissor(O.x,O.y,O.z,O.w),ne.copy(O))}function Je(O){re.equals(O)===!1&&(a.viewport(O.x,O.y,O.z,O.w),re.copy(O))}function rt(O,me){let ge=h.get(me);ge===void 0&&(ge=new WeakMap,h.set(me,ge));let De=ge.get(O);De===void 0&&(De=a.getUniformBlockIndex(me,O.name),ge.set(O,De))}function We(O,me){const De=h.get(me).get(O);d.get(me)!==De&&(a.uniformBlockBinding(me,De,O.__bindingPointIndex),d.set(me,De))}function he(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),n===!0&&(a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null)),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),u={},C=null,V={},m={},g=new WeakMap,v=[],f=null,p=!1,y=null,x=null,_=null,R=null,S=null,L=null,q=null,w=new Oe(0,0,0),E=0,G=!1,J=null,H=null,I=null,F=null,B=null,ne.set(0,0,a.canvas.width,a.canvas.height),re.set(0,0,a.canvas.width,a.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:xe,disable:ve,bindFramebuffer:Se,drawBuffers:W,useProgram:je,setBlending:ye,setMaterial:Xe,setFlipSided:Re,setCullFace:A,setLineWidth:M,setPolygonOffset:j,setScissorTest:ae,activeTexture:oe,bindTexture:le,unbindTexture:Te,compressedTexImage2D:fe,compressedTexImage3D:Me,texImage2D:Ae,texImage3D:we,updateUBOMapping:rt,uniformBlockBinding:We,texStorage2D:Ge,texStorage3D:Fe,texSubImage2D:Le,texSubImage3D:Ue,compressedTexSubImage2D:se,compressedTexSubImage3D:Ke,scissor:ze,viewport:Je,reset:he}}function Ym(a,e,t,n,i,s,o){const r=i.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new WeakMap;let h;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,M){return m?new OffscreenCanvas(A,M):ds("canvas")}function v(A,M,j,ae){let oe=1;if((A.width>ae||A.height>ae)&&(oe=ae/Math.max(A.width,A.height)),oe<1||M===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const le=M?pr:Math.floor,Te=le(oe*A.width),fe=le(oe*A.height);h===void 0&&(h=g(Te,fe));const Me=j?g(Te,fe):h;return Me.width=Te,Me.height=fe,Me.getContext("2d").drawImage(A,0,0,Te,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+Te+"x"+fe+")."),Me}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function f(A){return wa(A.width)&&wa(A.height)}function p(A){return r?!1:A.wrapS!==on||A.wrapT!==on||A.minFilter!==It&&A.minFilter!==Ot}function y(A,M){return A.generateMipmaps&&M&&A.minFilter!==It&&A.minFilter!==Ot}function x(A){a.generateMipmap(A)}function _(A,M,j,ae,oe=!1){if(r===!1)return M;if(A!==null){if(a[A]!==void 0)return a[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let le=M;if(M===a.RED&&(j===a.FLOAT&&(le=a.R32F),j===a.HALF_FLOAT&&(le=a.R16F),j===a.UNSIGNED_BYTE&&(le=a.R8)),M===a.RED_INTEGER&&(j===a.UNSIGNED_BYTE&&(le=a.R8UI),j===a.UNSIGNED_SHORT&&(le=a.R16UI),j===a.UNSIGNED_INT&&(le=a.R32UI),j===a.BYTE&&(le=a.R8I),j===a.SHORT&&(le=a.R16I),j===a.INT&&(le=a.R32I)),M===a.RG&&(j===a.FLOAT&&(le=a.RG32F),j===a.HALF_FLOAT&&(le=a.RG16F),j===a.UNSIGNED_BYTE&&(le=a.RG8)),M===a.RGBA){const Te=oe?io:Qe.getTransfer(ae);j===a.FLOAT&&(le=a.RGBA32F),j===a.HALF_FLOAT&&(le=a.RGBA16F),j===a.UNSIGNED_BYTE&&(le=Te===st?a.SRGB8_ALPHA8:a.RGBA8),j===a.UNSIGNED_SHORT_4_4_4_4&&(le=a.RGBA4),j===a.UNSIGNED_SHORT_5_5_5_1&&(le=a.RGB5_A1)}return(le===a.R16F||le===a.R32F||le===a.RG16F||le===a.RG32F||le===a.RGBA16F||le===a.RGBA32F)&&e.get("EXT_color_buffer_float"),le}function R(A,M,j){return y(A,j)===!0||A.isFramebufferTexture&&A.minFilter!==It&&A.minFilter!==Ot?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function S(A){return A===It||A===Yr||A===_o?a.NEAREST:a.LINEAR}function L(A){const M=A.target;M.removeEventListener("dispose",L),w(M),M.isVideoTexture&&d.delete(M)}function q(A){const M=A.target;M.removeEventListener("dispose",q),G(M)}function w(A){const M=n.get(A);if(M.__webglInit===void 0)return;const j=A.source,ae=u.get(j);if(ae){const oe=ae[M.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&E(A),Object.keys(ae).length===0&&u.delete(j)}n.remove(A)}function E(A){const M=n.get(A);a.deleteTexture(M.__webglTexture);const j=A.source,ae=u.get(j);delete ae[M.__cacheKey],o.memory.textures--}function G(A){const M=A.texture,j=n.get(A),ae=n.get(M);if(ae.__webglTexture!==void 0&&(a.deleteTexture(ae.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(j.__webglFramebuffer[oe]))for(let le=0;le<j.__webglFramebuffer[oe].length;le++)a.deleteFramebuffer(j.__webglFramebuffer[oe][le]);else a.deleteFramebuffer(j.__webglFramebuffer[oe]);j.__webglDepthbuffer&&a.deleteRenderbuffer(j.__webglDepthbuffer[oe])}else{if(Array.isArray(j.__webglFramebuffer))for(let oe=0;oe<j.__webglFramebuffer.length;oe++)a.deleteFramebuffer(j.__webglFramebuffer[oe]);else a.deleteFramebuffer(j.__webglFramebuffer);if(j.__webglDepthbuffer&&a.deleteRenderbuffer(j.__webglDepthbuffer),j.__webglMultisampledFramebuffer&&a.deleteFramebuffer(j.__webglMultisampledFramebuffer),j.__webglColorRenderbuffer)for(let oe=0;oe<j.__webglColorRenderbuffer.length;oe++)j.__webglColorRenderbuffer[oe]&&a.deleteRenderbuffer(j.__webglColorRenderbuffer[oe]);j.__webglDepthRenderbuffer&&a.deleteRenderbuffer(j.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let oe=0,le=M.length;oe<le;oe++){const Te=n.get(M[oe]);Te.__webglTexture&&(a.deleteTexture(Te.__webglTexture),o.memory.textures--),n.remove(M[oe])}n.remove(M),n.remove(A)}let J=0;function H(){J=0}function I(){const A=J;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),J+=1,A}function F(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function B(A,M){const j=n.get(A);if(A.isVideoTexture&&Xe(A),A.isRenderTargetTexture===!1&&A.version>0&&j.__version!==A.version){const ae=A.image;if(ae===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(j,A,M);return}}t.bindTexture(a.TEXTURE_2D,j.__webglTexture,a.TEXTURE0+M)}function te(A,M){const j=n.get(A);if(A.version>0&&j.__version!==A.version){ne(j,A,M);return}t.bindTexture(a.TEXTURE_2D_ARRAY,j.__webglTexture,a.TEXTURE0+M)}function Y(A,M){const j=n.get(A);if(A.version>0&&j.__version!==A.version){ne(j,A,M);return}t.bindTexture(a.TEXTURE_3D,j.__webglTexture,a.TEXTURE0+M)}function X(A,M){const j=n.get(A);if(A.version>0&&j.__version!==A.version){re(j,A,M);return}t.bindTexture(a.TEXTURE_CUBE_MAP,j.__webglTexture,a.TEXTURE0+M)}const P={[Vt]:a.REPEAT,[on]:a.CLAMP_TO_EDGE,[hr]:a.MIRRORED_REPEAT},C={[It]:a.NEAREST,[Yr]:a.NEAREST_MIPMAP_NEAREST,[_o]:a.NEAREST_MIPMAP_LINEAR,[Ot]:a.LINEAR,[Id]:a.LINEAR_MIPMAP_NEAREST,[ls]:a.LINEAR_MIPMAP_LINEAR},V={[Vd]:a.NEVER,[jd]:a.ALWAYS,[Wd]:a.LESS,[ac]:a.LEQUAL,[$d]:a.EQUAL,[Yd]:a.GEQUAL,[qd]:a.GREATER,[Xd]:a.NOTEQUAL};function z(A,M,j){if(j?(a.texParameteri(A,a.TEXTURE_WRAP_S,P[M.wrapS]),a.texParameteri(A,a.TEXTURE_WRAP_T,P[M.wrapT]),(A===a.TEXTURE_3D||A===a.TEXTURE_2D_ARRAY)&&a.texParameteri(A,a.TEXTURE_WRAP_R,P[M.wrapR]),a.texParameteri(A,a.TEXTURE_MAG_FILTER,C[M.magFilter]),a.texParameteri(A,a.TEXTURE_MIN_FILTER,C[M.minFilter])):(a.texParameteri(A,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(A,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),(A===a.TEXTURE_3D||A===a.TEXTURE_2D_ARRAY)&&a.texParameteri(A,a.TEXTURE_WRAP_R,a.CLAMP_TO_EDGE),(M.wrapS!==on||M.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),a.texParameteri(A,a.TEXTURE_MAG_FILTER,S(M.magFilter)),a.texParameteri(A,a.TEXTURE_MIN_FILTER,S(M.minFilter)),M.minFilter!==It&&M.minFilter!==Ot&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(a.texParameteri(A,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(A,a.TEXTURE_COMPARE_FUNC,V[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ae=e.get("EXT_texture_filter_anisotropic");if(M.magFilter===It||M.minFilter!==_o&&M.minFilter!==ls||M.type===Vn&&e.has("OES_texture_float_linear")===!1||r===!1&&M.type===cs&&e.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||n.get(M).__currentAnisotropy)&&(a.texParameterf(A,ae.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy)}}function Z(A,M){let j=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",L));const ae=M.source;let oe=u.get(ae);oe===void 0&&(oe={},u.set(ae,oe));const le=F(M);if(le!==A.__cacheKey){oe[le]===void 0&&(oe[le]={texture:a.createTexture(),usedTimes:0},o.memory.textures++,j=!0),oe[le].usedTimes++;const Te=oe[A.__cacheKey];Te!==void 0&&(oe[A.__cacheKey].usedTimes--,Te.usedTimes===0&&E(M)),A.__cacheKey=le,A.__webglTexture=oe[le].texture}return j}function ne(A,M,j){let ae=a.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ae=a.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ae=a.TEXTURE_3D);const oe=Z(A,M),le=M.source;t.bindTexture(ae,A.__webglTexture,a.TEXTURE0+j);const Te=n.get(le);if(le.version!==Te.__version||oe===!0){t.activeTexture(a.TEXTURE0+j);const fe=Qe.getPrimaries(Qe.workingColorSpace),Me=M.colorSpace===Jt?null:Qe.getPrimaries(M.colorSpace),Le=M.colorSpace===Jt||fe===Me?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,M.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,M.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);const Ue=p(M)&&f(M.image)===!1;let se=v(M.image,Ue,!1,i.maxTextureSize);se=Re(M,se);const Ke=f(se)||r,Ge=s.convert(M.format,M.colorSpace);let Fe=s.convert(M.type),Ae=_(M.internalFormat,Ge,Fe,M.colorSpace,M.isVideoTexture);z(ae,M,Ke);let we;const ze=M.mipmaps,Je=r&&M.isVideoTexture!==!0&&Ae!==sc,rt=Te.__version===void 0||oe===!0,We=R(M,se,Ke);if(M.isDepthTexture)Ae=a.DEPTH_COMPONENT,r?M.type===Vn?Ae=a.DEPTH_COMPONENT32F:M.type===Gn?Ae=a.DEPTH_COMPONENT24:M.type===li?Ae=a.DEPTH24_STENCIL8:Ae=a.DEPTH_COMPONENT16:M.type===Vn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===ci&&Ae===a.DEPTH_COMPONENT&&M.type!==_r&&M.type!==Gn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=Gn,Fe=s.convert(M.type)),M.format===Gi&&Ae===a.DEPTH_COMPONENT&&(Ae=a.DEPTH_STENCIL,M.type!==li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=li,Fe=s.convert(M.type))),rt&&(Je?t.texStorage2D(a.TEXTURE_2D,1,Ae,se.width,se.height):t.texImage2D(a.TEXTURE_2D,0,Ae,se.width,se.height,0,Ge,Fe,null));else if(M.isDataTexture)if(ze.length>0&&Ke){Je&&rt&&t.texStorage2D(a.TEXTURE_2D,We,Ae,ze[0].width,ze[0].height);for(let he=0,O=ze.length;he<O;he++)we=ze[he],Je?t.texSubImage2D(a.TEXTURE_2D,he,0,0,we.width,we.height,Ge,Fe,we.data):t.texImage2D(a.TEXTURE_2D,he,Ae,we.width,we.height,0,Ge,Fe,we.data);M.generateMipmaps=!1}else Je?(rt&&t.texStorage2D(a.TEXTURE_2D,We,Ae,se.width,se.height),t.texSubImage2D(a.TEXTURE_2D,0,0,0,se.width,se.height,Ge,Fe,se.data)):t.texImage2D(a.TEXTURE_2D,0,Ae,se.width,se.height,0,Ge,Fe,se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Je&&rt&&t.texStorage3D(a.TEXTURE_2D_ARRAY,We,Ae,ze[0].width,ze[0].height,se.depth);for(let he=0,O=ze.length;he<O;he++)we=ze[he],M.format!==rn?Ge!==null?Je?t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,he,0,0,0,we.width,we.height,se.depth,Ge,we.data,0,0):t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,he,Ae,we.width,we.height,se.depth,0,we.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?t.texSubImage3D(a.TEXTURE_2D_ARRAY,he,0,0,0,we.width,we.height,se.depth,Ge,Fe,we.data):t.texImage3D(a.TEXTURE_2D_ARRAY,he,Ae,we.width,we.height,se.depth,0,Ge,Fe,we.data)}else{Je&&rt&&t.texStorage2D(a.TEXTURE_2D,We,Ae,ze[0].width,ze[0].height);for(let he=0,O=ze.length;he<O;he++)we=ze[he],M.format!==rn?Ge!==null?Je?t.compressedTexSubImage2D(a.TEXTURE_2D,he,0,0,we.width,we.height,Ge,we.data):t.compressedTexImage2D(a.TEXTURE_2D,he,Ae,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?t.texSubImage2D(a.TEXTURE_2D,he,0,0,we.width,we.height,Ge,Fe,we.data):t.texImage2D(a.TEXTURE_2D,he,Ae,we.width,we.height,0,Ge,Fe,we.data)}else if(M.isDataArrayTexture)Je?(rt&&t.texStorage3D(a.TEXTURE_2D_ARRAY,We,Ae,se.width,se.height,se.depth),t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,Ge,Fe,se.data)):t.texImage3D(a.TEXTURE_2D_ARRAY,0,Ae,se.width,se.height,se.depth,0,Ge,Fe,se.data);else if(M.isData3DTexture)Je?(rt&&t.texStorage3D(a.TEXTURE_3D,We,Ae,se.width,se.height,se.depth),t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,Ge,Fe,se.data)):t.texImage3D(a.TEXTURE_3D,0,Ae,se.width,se.height,se.depth,0,Ge,Fe,se.data);else if(M.isFramebufferTexture){if(rt)if(Je)t.texStorage2D(a.TEXTURE_2D,We,Ae,se.width,se.height);else{let he=se.width,O=se.height;for(let me=0;me<We;me++)t.texImage2D(a.TEXTURE_2D,me,Ae,he,O,0,Ge,Fe,null),he>>=1,O>>=1}}else if(ze.length>0&&Ke){Je&&rt&&t.texStorage2D(a.TEXTURE_2D,We,Ae,ze[0].width,ze[0].height);for(let he=0,O=ze.length;he<O;he++)we=ze[he],Je?t.texSubImage2D(a.TEXTURE_2D,he,0,0,Ge,Fe,we):t.texImage2D(a.TEXTURE_2D,he,Ae,Ge,Fe,we);M.generateMipmaps=!1}else Je?(rt&&t.texStorage2D(a.TEXTURE_2D,We,Ae,se.width,se.height),t.texSubImage2D(a.TEXTURE_2D,0,0,0,Ge,Fe,se)):t.texImage2D(a.TEXTURE_2D,0,Ae,Ge,Fe,se);y(M,Ke)&&x(ae),Te.__version=le.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function re(A,M,j){if(M.image.length!==6)return;const ae=Z(A,M),oe=M.source;t.bindTexture(a.TEXTURE_CUBE_MAP,A.__webglTexture,a.TEXTURE0+j);const le=n.get(oe);if(oe.version!==le.__version||ae===!0){t.activeTexture(a.TEXTURE0+j);const Te=Qe.getPrimaries(Qe.workingColorSpace),fe=M.colorSpace===Jt?null:Qe.getPrimaries(M.colorSpace),Me=M.colorSpace===Jt||Te===fe?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,M.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,M.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Le=M.isCompressedTexture||M.image[0].isCompressedTexture,Ue=M.image[0]&&M.image[0].isDataTexture,se=[];for(let he=0;he<6;he++)!Le&&!Ue?se[he]=v(M.image[he],!1,!0,i.maxCubemapSize):se[he]=Ue?M.image[he].image:M.image[he],se[he]=Re(M,se[he]);const Ke=se[0],Ge=f(Ke)||r,Fe=s.convert(M.format,M.colorSpace),Ae=s.convert(M.type),we=_(M.internalFormat,Fe,Ae,M.colorSpace),ze=r&&M.isVideoTexture!==!0,Je=le.__version===void 0||ae===!0;let rt=R(M,Ke,Ge);z(a.TEXTURE_CUBE_MAP,M,Ge);let We;if(Le){ze&&Je&&t.texStorage2D(a.TEXTURE_CUBE_MAP,rt,we,Ke.width,Ke.height);for(let he=0;he<6;he++){We=se[he].mipmaps;for(let O=0;O<We.length;O++){const me=We[O];M.format!==rn?Fe!==null?ze?t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O,0,0,me.width,me.height,Fe,me.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O,we,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O,0,0,me.width,me.height,Fe,Ae,me.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O,we,me.width,me.height,0,Fe,Ae,me.data)}}}else{We=M.mipmaps,ze&&Je&&(We.length>0&&rt++,t.texStorage2D(a.TEXTURE_CUBE_MAP,rt,we,se[0].width,se[0].height));for(let he=0;he<6;he++)if(Ue){ze?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,se[he].width,se[he].height,Fe,Ae,se[he].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,we,se[he].width,se[he].height,0,Fe,Ae,se[he].data);for(let O=0;O<We.length;O++){const ge=We[O].image[he].image;ze?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O+1,0,0,ge.width,ge.height,Fe,Ae,ge.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O+1,we,ge.width,ge.height,0,Fe,Ae,ge.data)}}else{ze?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Fe,Ae,se[he]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,we,Fe,Ae,se[he]);for(let O=0;O<We.length;O++){const me=We[O];ze?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O+1,0,0,Fe,Ae,me.image[he]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+he,O+1,we,Fe,Ae,me.image[he])}}}y(M,Ge)&&x(a.TEXTURE_CUBE_MAP),le.__version=oe.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function ie(A,M,j,ae,oe,le){const Te=s.convert(j.format,j.colorSpace),fe=s.convert(j.type),Me=_(j.internalFormat,Te,fe,j.colorSpace);if(!n.get(M).__hasExternalTextures){const Ue=Math.max(1,M.width>>le),se=Math.max(1,M.height>>le);oe===a.TEXTURE_3D||oe===a.TEXTURE_2D_ARRAY?t.texImage3D(oe,le,Me,Ue,se,M.depth,0,Te,fe,null):t.texImage2D(oe,le,Me,Ue,se,0,Te,fe,null)}t.bindFramebuffer(a.FRAMEBUFFER,A),ye(M)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,ae,oe,n.get(j).__webglTexture,0,Ee(M)):(oe===a.TEXTURE_2D||oe>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,ae,oe,n.get(j).__webglTexture,le),t.bindFramebuffer(a.FRAMEBUFFER,null)}function pe(A,M,j){if(a.bindRenderbuffer(a.RENDERBUFFER,A),M.depthBuffer&&!M.stencilBuffer){let ae=r===!0?a.DEPTH_COMPONENT24:a.DEPTH_COMPONENT16;if(j||ye(M)){const oe=M.depthTexture;oe&&oe.isDepthTexture&&(oe.type===Vn?ae=a.DEPTH_COMPONENT32F:oe.type===Gn&&(ae=a.DEPTH_COMPONENT24));const le=Ee(M);ye(M)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,le,ae,M.width,M.height):a.renderbufferStorageMultisample(a.RENDERBUFFER,le,ae,M.width,M.height)}else a.renderbufferStorage(a.RENDERBUFFER,ae,M.width,M.height);a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,A)}else if(M.depthBuffer&&M.stencilBuffer){const ae=Ee(M);j&&ye(M)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,ae,a.DEPTH24_STENCIL8,M.width,M.height):ye(M)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,ae,a.DEPTH24_STENCIL8,M.width,M.height):a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_STENCIL,M.width,M.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,A)}else{const ae=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let oe=0;oe<ae.length;oe++){const le=ae[oe],Te=s.convert(le.format,le.colorSpace),fe=s.convert(le.type),Me=_(le.internalFormat,Te,fe,le.colorSpace),Le=Ee(M);j&&ye(M)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,Le,Me,M.width,M.height):ye(M)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Le,Me,M.width,M.height):a.renderbufferStorage(a.RENDERBUFFER,Me,M.width,M.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function xe(A,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(a.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),B(M.depthTexture,0);const ae=n.get(M.depthTexture).__webglTexture,oe=Ee(M);if(M.depthTexture.format===ci)ye(M)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,ae,0,oe):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,ae,0);else if(M.depthTexture.format===Gi)ye(M)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,ae,0,oe):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function ve(A){const M=n.get(A),j=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");xe(M.__webglFramebuffer,A)}else if(j){M.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)t.bindFramebuffer(a.FRAMEBUFFER,M.__webglFramebuffer[ae]),M.__webglDepthbuffer[ae]=a.createRenderbuffer(),pe(M.__webglDepthbuffer[ae],A,!1)}else t.bindFramebuffer(a.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=a.createRenderbuffer(),pe(M.__webglDepthbuffer,A,!1);t.bindFramebuffer(a.FRAMEBUFFER,null)}function Se(A,M,j){const ae=n.get(A);M!==void 0&&ie(ae.__webglFramebuffer,A,A.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),j!==void 0&&ve(A)}function W(A){const M=A.texture,j=n.get(A),ae=n.get(M);A.addEventListener("dispose",q),A.isWebGLMultipleRenderTargets!==!0&&(ae.__webglTexture===void 0&&(ae.__webglTexture=a.createTexture()),ae.__version=M.version,o.memory.textures++);const oe=A.isWebGLCubeRenderTarget===!0,le=A.isWebGLMultipleRenderTargets===!0,Te=f(A)||r;if(oe){j.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(r&&M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer[fe]=[];for(let Me=0;Me<M.mipmaps.length;Me++)j.__webglFramebuffer[fe][Me]=a.createFramebuffer()}else j.__webglFramebuffer[fe]=a.createFramebuffer()}else{if(r&&M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer=[];for(let fe=0;fe<M.mipmaps.length;fe++)j.__webglFramebuffer[fe]=a.createFramebuffer()}else j.__webglFramebuffer=a.createFramebuffer();if(le)if(i.drawBuffers){const fe=A.texture;for(let Me=0,Le=fe.length;Me<Le;Me++){const Ue=n.get(fe[Me]);Ue.__webglTexture===void 0&&(Ue.__webglTexture=a.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&A.samples>0&&ye(A)===!1){const fe=le?M:[M];j.__webglMultisampledFramebuffer=a.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Me=0;Me<fe.length;Me++){const Le=fe[Me];j.__webglColorRenderbuffer[Me]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,j.__webglColorRenderbuffer[Me]);const Ue=s.convert(Le.format,Le.colorSpace),se=s.convert(Le.type),Ke=_(Le.internalFormat,Ue,se,Le.colorSpace,A.isXRRenderTarget===!0),Ge=Ee(A);a.renderbufferStorageMultisample(a.RENDERBUFFER,Ge,Ke,A.width,A.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+Me,a.RENDERBUFFER,j.__webglColorRenderbuffer[Me])}a.bindRenderbuffer(a.RENDERBUFFER,null),A.depthBuffer&&(j.__webglDepthRenderbuffer=a.createRenderbuffer(),pe(j.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(oe){t.bindTexture(a.TEXTURE_CUBE_MAP,ae.__webglTexture),z(a.TEXTURE_CUBE_MAP,M,Te);for(let fe=0;fe<6;fe++)if(r&&M.mipmaps&&M.mipmaps.length>0)for(let Me=0;Me<M.mipmaps.length;Me++)ie(j.__webglFramebuffer[fe][Me],A,M,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Me);else ie(j.__webglFramebuffer[fe],A,M,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);y(M,Te)&&x(a.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){const fe=A.texture;for(let Me=0,Le=fe.length;Me<Le;Me++){const Ue=fe[Me],se=n.get(Ue);t.bindTexture(a.TEXTURE_2D,se.__webglTexture),z(a.TEXTURE_2D,Ue,Te),ie(j.__webglFramebuffer,A,Ue,a.COLOR_ATTACHMENT0+Me,a.TEXTURE_2D,0),y(Ue,Te)&&x(a.TEXTURE_2D)}t.unbindTexture()}else{let fe=a.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(r?fe=A.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(fe,ae.__webglTexture),z(fe,M,Te),r&&M.mipmaps&&M.mipmaps.length>0)for(let Me=0;Me<M.mipmaps.length;Me++)ie(j.__webglFramebuffer[Me],A,M,a.COLOR_ATTACHMENT0,fe,Me);else ie(j.__webglFramebuffer,A,M,a.COLOR_ATTACHMENT0,fe,0);y(M,Te)&&x(fe),t.unbindTexture()}A.depthBuffer&&ve(A)}function je(A){const M=f(A)||r,j=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let ae=0,oe=j.length;ae<oe;ae++){const le=j[ae];if(y(le,M)){const Te=A.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:a.TEXTURE_2D,fe=n.get(le).__webglTexture;t.bindTexture(Te,fe),x(Te),t.unbindTexture()}}}function de(A){if(r&&A.samples>0&&ye(A)===!1){const M=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],j=A.width,ae=A.height;let oe=a.COLOR_BUFFER_BIT;const le=[],Te=A.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,fe=n.get(A),Me=A.isWebGLMultipleRenderTargets===!0;if(Me)for(let Le=0;Le<M.length;Le++)t.bindFramebuffer(a.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+Le,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,fe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+Le,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let Le=0;Le<M.length;Le++){le.push(a.COLOR_ATTACHMENT0+Le),A.depthBuffer&&le.push(Te);const Ue=fe.__ignoreDepthValues!==void 0?fe.__ignoreDepthValues:!1;if(Ue===!1&&(A.depthBuffer&&(oe|=a.DEPTH_BUFFER_BIT),A.stencilBuffer&&(oe|=a.STENCIL_BUFFER_BIT)),Me&&a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,fe.__webglColorRenderbuffer[Le]),Ue===!0&&(a.invalidateFramebuffer(a.READ_FRAMEBUFFER,[Te]),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[Te])),Me){const se=n.get(M[Le]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,se,0)}a.blitFramebuffer(0,0,j,ae,0,0,j,ae,oe,a.NEAREST),c&&a.invalidateFramebuffer(a.READ_FRAMEBUFFER,le)}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),Me)for(let Le=0;Le<M.length;Le++){t.bindFramebuffer(a.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+Le,a.RENDERBUFFER,fe.__webglColorRenderbuffer[Le]);const Ue=n.get(M[Le]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,fe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+Le,a.TEXTURE_2D,Ue,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}}function Ee(A){return Math.min(i.maxSamples,A.samples)}function ye(A){const M=n.get(A);return r&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Xe(A){const M=o.render.frame;d.get(A)!==M&&(d.set(A,M),A.update())}function Re(A,M){const j=A.colorSpace,ae=A.format,oe=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===ur||j!==Dn&&j!==Jt&&(Qe.getTransfer(j)===st?r===!1?e.has("EXT_sRGB")===!0&&ae===rn?(A.format=ur,A.minFilter=Ot,A.generateMipmaps=!1):M=cc.sRGBToLinear(M):(ae!==rn||oe!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),M}this.allocateTextureUnit=I,this.resetTextureUnits=H,this.setTexture2D=B,this.setTexture2DArray=te,this.setTexture3D=Y,this.setTextureCube=X,this.rebindTextures=Se,this.setupRenderTarget=W,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=ye}function jm(a,e,t){const n=t.isWebGL2;function i(s,o=Jt){let r;const l=Qe.getTransfer(o);if(s===Xn)return a.UNSIGNED_BYTE;if(s===Ql)return a.UNSIGNED_SHORT_4_4_4_4;if(s===ec)return a.UNSIGNED_SHORT_5_5_5_1;if(s===Pd)return a.BYTE;if(s===Dd)return a.SHORT;if(s===_r)return a.UNSIGNED_SHORT;if(s===Jl)return a.INT;if(s===Gn)return a.UNSIGNED_INT;if(s===Vn)return a.FLOAT;if(s===cs)return n?a.HALF_FLOAT:(r=e.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(s===Fd)return a.ALPHA;if(s===rn)return a.RGBA;if(s===Nd)return a.LUMINANCE;if(s===Ud)return a.LUMINANCE_ALPHA;if(s===ci)return a.DEPTH_COMPONENT;if(s===Gi)return a.DEPTH_STENCIL;if(s===ur)return r=e.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(s===Bd)return a.RED;if(s===tc)return a.RED_INTEGER;if(s===Od)return a.RG;if(s===nc)return a.RG_INTEGER;if(s===ic)return a.RGBA_INTEGER;if(s===Mo||s===wo||s===So||s===Eo)if(l===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(s===Mo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(s===Mo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===wo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===So)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===jr||s===Kr||s===Zr||s===Jr)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(s===jr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Kr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Zr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Jr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===sc)return r=e.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Qr||s===ea)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(s===Qr)return l===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(s===ea)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===ta||s===na||s===ia||s===sa||s===oa||s===ra||s===aa||s===la||s===ca||s===da||s===ha||s===ua||s===pa||s===fa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(s===ta)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===na)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===ia)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===sa)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===oa)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ra)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===aa)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===la)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===ca)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===da)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ha)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===ua)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===pa)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===fa)return l===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===To||s===ma||s===ga)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(s===To)return l===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===ma)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===kd||s===va||s===ya||s===xa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(s===To)return r.COMPRESSED_RED_RGTC1_EXT;if(s===va)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===xa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===li?n?a.UNSIGNED_INT_24_8:(r=e.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):a[s]!==void 0?a[s]:null}return{convert:i}}class Km extends Wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ks extends mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zm={type:"move"};class Ko{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ks,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ks,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ks,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const f=t.getJointPose(v,n),p=this._getHandJoint(c,v);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&u>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Zm)))}return r!==null&&(r.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ks;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Jm extends Wi{constructor(e,t){super();const n=this;let i=null,s=1,o=null,r="local-floor",l=1,c=null,d=null,h=null,u=null,m=null,g=null;const v=t.getContextAttributes();let f=null,p=null;const y=[],x=[],_=new Ye;let R=null;const S=new Wt;S.layers.enable(1),S.viewport=new Mt;const L=new Wt;L.layers.enable(2),L.viewport=new Mt;const q=[S,L],w=new Km;w.layers.enable(1),w.layers.enable(2);let E=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let Z=y[z];return Z===void 0&&(Z=new Ko,y[z]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(z){let Z=y[z];return Z===void 0&&(Z=new Ko,y[z]=Z),Z.getGripSpace()},this.getHand=function(z){let Z=y[z];return Z===void 0&&(Z=new Ko,y[z]=Z),Z.getHandSpace()};function J(z){const Z=x.indexOf(z.inputSource);if(Z===-1)return;const ne=y[Z];ne!==void 0&&(ne.update(z.inputSource,z.frame,c||o),ne.dispatchEvent({type:z.type,data:z.inputSource}))}function H(){i.removeEventListener("select",J),i.removeEventListener("selectstart",J),i.removeEventListener("selectend",J),i.removeEventListener("squeeze",J),i.removeEventListener("squeezestart",J),i.removeEventListener("squeezeend",J),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",I);for(let z=0;z<y.length;z++){const Z=x[z];Z!==null&&(x[z]=null,y[z].disconnect(Z))}E=null,G=null,e.setRenderTarget(f),m=null,u=null,h=null,i=null,p=null,V.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(_.width,_.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){s=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){r=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(z){c=z},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(z){if(i=z,i!==null){if(f=e.getRenderTarget(),i.addEventListener("select",J),i.addEventListener("selectstart",J),i.addEventListener("selectend",J),i.addEventListener("squeeze",J),i.addEventListener("squeezestart",J),i.addEventListener("squeezeend",J),i.addEventListener("end",H),i.addEventListener("inputsourceschange",I),v.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(_),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:i.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(i,t,Z),i.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),p=new fi(m.framebufferWidth,m.framebufferHeight,{format:rn,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let Z=null,ne=null,re=null;v.depth&&(re=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=v.stencil?Gi:ci,ne=v.stencil?li:Gn);const ie={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:s};h=new XRWebGLBinding(i,t),u=h.createProjectionLayer(ie),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),p=new fi(u.textureWidth,u.textureHeight,{format:rn,type:Xn,depthTexture:new Mc(u.textureWidth,u.textureHeight,ne,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const pe=e.properties.get(p);pe.__ignoreDepthValues=u.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(r),V.setContext(i),V.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function I(z){for(let Z=0;Z<z.removed.length;Z++){const ne=z.removed[Z],re=x.indexOf(ne);re>=0&&(x[re]=null,y[re].disconnect(ne))}for(let Z=0;Z<z.added.length;Z++){const ne=z.added[Z];let re=x.indexOf(ne);if(re===-1){for(let pe=0;pe<y.length;pe++)if(pe>=x.length){x.push(ne),re=pe;break}else if(x[pe]===null){x[pe]=ne,re=pe;break}if(re===-1)break}const ie=y[re];ie&&ie.connect(ne)}}const F=new k,B=new k;function te(z,Z,ne){F.setFromMatrixPosition(Z.matrixWorld),B.setFromMatrixPosition(ne.matrixWorld);const re=F.distanceTo(B),ie=Z.projectionMatrix.elements,pe=ne.projectionMatrix.elements,xe=ie[14]/(ie[10]-1),ve=ie[14]/(ie[10]+1),Se=(ie[9]+1)/ie[5],W=(ie[9]-1)/ie[5],je=(ie[8]-1)/ie[0],de=(pe[8]+1)/pe[0],Ee=xe*je,ye=xe*de,Xe=re/(-je+de),Re=Xe*-je;Z.matrixWorld.decompose(z.position,z.quaternion,z.scale),z.translateX(Re),z.translateZ(Xe),z.matrixWorld.compose(z.position,z.quaternion,z.scale),z.matrixWorldInverse.copy(z.matrixWorld).invert();const A=xe+Xe,M=ve+Xe,j=Ee-Re,ae=ye+(re-Re),oe=Se*ve/M*A,le=W*ve/M*A;z.projectionMatrix.makePerspective(j,ae,oe,le,A,M),z.projectionMatrixInverse.copy(z.projectionMatrix).invert()}function Y(z,Z){Z===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(Z.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(i===null)return;w.near=L.near=S.near=z.near,w.far=L.far=S.far=z.far,(E!==w.near||G!==w.far)&&(i.updateRenderState({depthNear:w.near,depthFar:w.far}),E=w.near,G=w.far);const Z=z.parent,ne=w.cameras;Y(w,Z);for(let re=0;re<ne.length;re++)Y(ne[re],Z);ne.length===2?te(w,S,L):w.projectionMatrix.copy(S.projectionMatrix),X(z,w,Z)};function X(z,Z,ne){ne===null?z.matrix.copy(Z.matrixWorld):(z.matrix.copy(ne.matrixWorld),z.matrix.invert(),z.matrix.multiply(Z.matrixWorld)),z.matrix.decompose(z.position,z.quaternion,z.scale),z.updateMatrixWorld(!0),z.projectionMatrix.copy(Z.projectionMatrix),z.projectionMatrixInverse.copy(Z.projectionMatrixInverse),z.isPerspectiveCamera&&(z.fov=ao*2*Math.atan(1/z.projectionMatrix.elements[5]),z.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(z){l=z,u!==null&&(u.fixedFoveation=z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=z)};let P=null;function C(z,Z){if(d=Z.getViewerPose(c||o),g=Z,d!==null){const ne=d.views;m!==null&&(e.setRenderTargetFramebuffer(p,m.framebuffer),e.setRenderTarget(p));let re=!1;ne.length!==w.cameras.length&&(w.cameras.length=0,re=!0);for(let ie=0;ie<ne.length;ie++){const pe=ne[ie];let xe=null;if(m!==null)xe=m.getViewport(pe);else{const Se=h.getViewSubImage(u,pe);xe=Se.viewport,ie===0&&(e.setRenderTargetTextures(p,Se.colorTexture,u.ignoreDepthValues?void 0:Se.depthStencilTexture),e.setRenderTarget(p))}let ve=q[ie];ve===void 0&&(ve=new Wt,ve.layers.enable(ie),ve.viewport=new Mt,q[ie]=ve),ve.matrix.fromArray(pe.transform.matrix),ve.matrix.decompose(ve.position,ve.quaternion,ve.scale),ve.projectionMatrix.fromArray(pe.projectionMatrix),ve.projectionMatrixInverse.copy(ve.projectionMatrix).invert(),ve.viewport.set(xe.x,xe.y,xe.width,xe.height),ie===0&&(w.matrix.copy(ve.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),re===!0&&w.cameras.push(ve)}}for(let ne=0;ne<y.length;ne++){const re=x[ne],ie=y[ne];re!==null&&ie!==void 0&&ie.update(re,Z,c||o)}P&&P(z,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const V=new bc;V.setAnimationLoop(C),this.setAnimationLoop=function(z){P=z},this.dispose=function(){}}}function Qm(a,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,mc(a)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function i(f,p,y,x,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(f,p):p.isMeshToonMaterial?(s(f,p),h(f,p)):p.isMeshPhongMaterial?(s(f,p),d(f,p)):p.isMeshStandardMaterial?(s(f,p),u(f,p),p.isMeshPhysicalMaterial&&m(f,p,_)):p.isMeshMatcapMaterial?(s(f,p),g(f,p)):p.isMeshDepthMaterial?s(f,p):p.isMeshDistanceMaterial?(s(f,p),v(f,p)):p.isMeshNormalMaterial?s(f,p):p.isLineBasicMaterial?(o(f,p),p.isLineDashedMaterial&&r(f,p)):p.isPointsMaterial?l(f,p,y,x):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Dt&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Dt&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const y=e.get(p).envMap;if(y&&(f.envMap.value=y,f.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap){f.lightMap.value=p.lightMap;const x=a._useLegacyLights===!0?Math.PI:1;f.lightMapIntensity.value=p.lightMapIntensity*x,t(p.lightMap,f.lightMapTransform)}p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function o(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function r(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,y,x){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*y,f.scale.value=x*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function d(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function h(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function u(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),e.get(p).envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,y){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Dt&&f.clearcoatNormalScale.value.negate())),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=y.texture,f.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function v(f,p){const y=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(y.matrixWorld),f.nearDistance.value=y.shadow.camera.near,f.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function eg(a,e,t,n){let i={},s={},o=[];const r=t.isWebGL2?a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,x){const _=x.program;n.uniformBlockBinding(y,_)}function c(y,x){let _=i[y.id];_===void 0&&(g(y),_=d(y),i[y.id]=_,y.addEventListener("dispose",f));const R=x.program;n.updateUBOMapping(y,R);const S=e.render.frame;s[y.id]!==S&&(u(y),s[y.id]=S)}function d(y){const x=h();y.__bindingPointIndex=x;const _=a.createBuffer(),R=y.__size,S=y.usage;return a.bindBuffer(a.UNIFORM_BUFFER,_),a.bufferData(a.UNIFORM_BUFFER,R,S),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,x,_),_}function h(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const x=i[y.id],_=y.uniforms,R=y.__cache;a.bindBuffer(a.UNIFORM_BUFFER,x);for(let S=0,L=_.length;S<L;S++){const q=Array.isArray(_[S])?_[S]:[_[S]];for(let w=0,E=q.length;w<E;w++){const G=q[w];if(m(G,S,w,R)===!0){const J=G.__offset,H=Array.isArray(G.value)?G.value:[G.value];let I=0;for(let F=0;F<H.length;F++){const B=H[F],te=v(B);typeof B=="number"||typeof B=="boolean"?(G.__data[0]=B,a.bufferSubData(a.UNIFORM_BUFFER,J+I,G.__data)):B.isMatrix3?(G.__data[0]=B.elements[0],G.__data[1]=B.elements[1],G.__data[2]=B.elements[2],G.__data[3]=0,G.__data[4]=B.elements[3],G.__data[5]=B.elements[4],G.__data[6]=B.elements[5],G.__data[7]=0,G.__data[8]=B.elements[6],G.__data[9]=B.elements[7],G.__data[10]=B.elements[8],G.__data[11]=0):(B.toArray(G.__data,I),I+=te.storage/Float32Array.BYTES_PER_ELEMENT)}a.bufferSubData(a.UNIFORM_BUFFER,J,G.__data)}}}a.bindBuffer(a.UNIFORM_BUFFER,null)}function m(y,x,_,R){const S=y.value,L=x+"_"+_;if(R[L]===void 0)return typeof S=="number"||typeof S=="boolean"?R[L]=S:R[L]=S.clone(),!0;{const q=R[L];if(typeof S=="number"||typeof S=="boolean"){if(q!==S)return R[L]=S,!0}else if(q.equals(S)===!1)return q.copy(S),!0}return!1}function g(y){const x=y.uniforms;let _=0;const R=16;for(let L=0,q=x.length;L<q;L++){const w=Array.isArray(x[L])?x[L]:[x[L]];for(let E=0,G=w.length;E<G;E++){const J=w[E],H=Array.isArray(J.value)?J.value:[J.value];for(let I=0,F=H.length;I<F;I++){const B=H[I],te=v(B),Y=_%R;Y!==0&&R-Y<te.boundary&&(_+=R-Y),J.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),J.__offset=_,_+=te.storage}}}const S=_%R;return S>0&&(_+=R-S),y.__size=_,y.__cache={},this}function v(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function f(y){const x=y.target;x.removeEventListener("dispose",f);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),a.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function p(){for(const y in i)a.deleteBuffer(i[y]);o=[],i={},s={}}return{bind:l,update:c,dispose:p}}class Ac{constructor(e={}){const{canvas:t=Zd(),context:n=null,depth:i=!0,stencil:s=!0,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=o;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,f=null;const p=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ft,this._useLegacyLights=!1,this.toneMapping=qn,this.toneMappingExposure=1;const x=this;let _=!1,R=0,S=0,L=null,q=-1,w=null;const E=new Mt,G=new Mt;let J=null;const H=new Oe(0);let I=0,F=t.width,B=t.height,te=1,Y=null,X=null;const P=new Mt(0,0,F,B),C=new Mt(0,0,F,B);let V=!1;const z=new Er;let Z=!1,ne=!1,re=null;const ie=new ut,pe=new Ye,xe=new k,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Se(){return L===null?te:1}let W=n;function je(T,$){for(let Q=0;Q<T.length;Q++){const ee=T[Q],K=t.getContext(ee,$);if(K!==null)return K}return null}try{const T={alpha:!0,depth:i,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${br}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",O,!1),t.addEventListener("webglcontextcreationerror",me,!1),W===null){const $=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&$.shift(),W=je($,T),W===null)throw je($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let de,Ee,ye,Xe,Re,A,M,j,ae,oe,le,Te,fe,Me,Le,Ue,se,Ke,Ge,Fe,Ae,we,ze,Je;function rt(){de=new df(W),Ee=new sf(W,de,e),de.init(Ee),we=new jm(W,de,Ee),ye=new Xm(W,de,Ee),Xe=new pf(W),Re=new Dm,A=new Ym(W,de,ye,Re,Ee,we,Xe),M=new rf(x),j=new cf(x),ae=new bh(W,Ee),ze=new tf(W,de,ae,Ee),oe=new hf(W,ae,Xe,ze),le=new vf(W,oe,ae,Xe),Ge=new gf(W,Ee,A),Ue=new of(Re),Te=new Pm(x,M,j,de,Ee,ze,Ue),fe=new Qm(x,Re),Me=new Nm,Le=new Hm(de,Ee),Ke=new ef(x,M,j,ye,le,u,l),se=new qm(x,le,Ee),Je=new eg(W,Xe,Ee,ye),Fe=new nf(W,de,Xe,Ee),Ae=new uf(W,de,Xe,Ee),Xe.programs=Te.programs,x.capabilities=Ee,x.extensions=de,x.properties=Re,x.renderLists=Me,x.shadowMap=se,x.state=ye,x.info=Xe}rt();const We=new Jm(x,W);this.xr=We,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const T=de.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=de.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(T){T!==void 0&&(te=T,this.setSize(F,B,!1))},this.getSize=function(T){return T.set(F,B)},this.setSize=function(T,$,Q=!0){if(We.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,B=$,t.width=Math.floor(T*te),t.height=Math.floor($*te),Q===!0&&(t.style.width=T+"px",t.style.height=$+"px"),this.setViewport(0,0,T,$)},this.getDrawingBufferSize=function(T){return T.set(F*te,B*te).floor()},this.setDrawingBufferSize=function(T,$,Q){F=T,B=$,te=Q,t.width=Math.floor(T*Q),t.height=Math.floor($*Q),this.setViewport(0,0,T,$)},this.getCurrentViewport=function(T){return T.copy(E)},this.getViewport=function(T){return T.copy(P)},this.setViewport=function(T,$,Q,ee){T.isVector4?P.set(T.x,T.y,T.z,T.w):P.set(T,$,Q,ee),ye.viewport(E.copy(P).multiplyScalar(te).floor())},this.getScissor=function(T){return T.copy(C)},this.setScissor=function(T,$,Q,ee){T.isVector4?C.set(T.x,T.y,T.z,T.w):C.set(T,$,Q,ee),ye.scissor(G.copy(C).multiplyScalar(te).floor())},this.getScissorTest=function(){return V},this.setScissorTest=function(T){ye.setScissorTest(V=T)},this.setOpaqueSort=function(T){Y=T},this.setTransparentSort=function(T){X=T},this.getClearColor=function(T){return T.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor.apply(Ke,arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha.apply(Ke,arguments)},this.clear=function(T=!0,$=!0,Q=!0){let ee=0;if(T){let K=!1;if(L!==null){const be=L.texture.format;K=be===ic||be===nc||be===tc}if(K){const be=L.texture.type,Ce=be===Xn||be===Gn||be===_r||be===li||be===Ql||be===ec,Pe=Ke.getClearColor(),Ne=Ke.getClearAlpha(),Ve=Pe.r,Be=Pe.g,ke=Pe.b;Ce?(m[0]=Ve,m[1]=Be,m[2]=ke,m[3]=Ne,W.clearBufferuiv(W.COLOR,0,m)):(g[0]=Ve,g[1]=Be,g[2]=ke,g[3]=Ne,W.clearBufferiv(W.COLOR,0,g))}else ee|=W.COLOR_BUFFER_BIT}$&&(ee|=W.DEPTH_BUFFER_BIT),Q&&(ee|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(ee)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",O,!1),t.removeEventListener("webglcontextcreationerror",me,!1),Me.dispose(),Le.dispose(),Re.dispose(),M.dispose(),j.dispose(),le.dispose(),ze.dispose(),Je.dispose(),Te.dispose(),We.dispose(),We.removeEventListener("sessionstart",Ct),We.removeEventListener("sessionend",nt),re&&(re.dispose(),re=null),At.stop()};function he(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function O(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const T=Xe.autoReset,$=se.enabled,Q=se.autoUpdate,ee=se.needsUpdate,K=se.type;rt(),Xe.autoReset=T,se.enabled=$,se.autoUpdate=Q,se.needsUpdate=ee,se.type=K}function me(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ge(T){const $=T.target;$.removeEventListener("dispose",ge),De($)}function De(T){Ie(T),Re.remove(T)}function Ie(T){const $=Re.get(T).programs;$!==void 0&&($.forEach(function(Q){Te.releaseProgram(Q)}),T.isShaderMaterial&&Te.releaseShaderCache(T))}this.renderBufferDirect=function(T,$,Q,ee,K,be){$===null&&($=ve);const Ce=K.isMesh&&K.matrixWorld.determinant()<0,Pe=Wc(T,$,Q,ee,K);ye.setMaterial(ee,Ce);let Ne=Q.index,Ve=1;if(ee.wireframe===!0){if(Ne=oe.getWireframeAttribute(Q),Ne===void 0)return;Ve=2}const Be=Q.drawRange,ke=Q.attributes.position;let lt=Be.start*Ve,kt=(Be.start+Be.count)*Ve;be!==null&&(lt=Math.max(lt,be.start*Ve),kt=Math.min(kt,(be.start+be.count)*Ve)),Ne!==null?(lt=Math.max(lt,0),kt=Math.min(kt,Ne.count)):ke!=null&&(lt=Math.max(lt,0),kt=Math.min(kt,ke.count));const xt=kt-lt;if(xt<0||xt===1/0)return;ze.setup(K,ee,Pe,Q,Ne);let yn,ot=Fe;if(Ne!==null&&(yn=ae.get(Ne),ot=Ae,ot.setIndex(yn)),K.isMesh)ee.wireframe===!0?(ye.setLineWidth(ee.wireframeLinewidth*Se()),ot.setMode(W.LINES)):ot.setMode(W.TRIANGLES);else if(K.isLine){let $e=ee.linewidth;$e===void 0&&($e=1),ye.setLineWidth($e*Se()),K.isLineSegments?ot.setMode(W.LINES):K.isLineLoop?ot.setMode(W.LINE_LOOP):ot.setMode(W.LINE_STRIP)}else K.isPoints?ot.setMode(W.POINTS):K.isSprite&&ot.setMode(W.TRIANGLES);if(K.isBatchedMesh)ot.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else if(K.isInstancedMesh)ot.renderInstances(lt,xt,K.count);else if(Q.isInstancedBufferGeometry){const $e=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,vo=Math.min(Q.instanceCount,$e);ot.renderInstances(lt,xt,vo)}else ot.render(lt,xt)};function et(T,$,Q){T.transparent===!0&&T.side===Ln&&T.forceSinglePass===!1?(T.side=Dt,T.needsUpdate=!0,gs(T,$,Q),T.side=Pn,T.needsUpdate=!0,gs(T,$,Q),T.side=Ln):gs(T,$,Q)}this.compile=function(T,$,Q=null){Q===null&&(Q=T),f=Le.get(Q),f.init(),y.push(f),Q.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(f.pushLight(K),K.castShadow&&f.pushShadow(K))}),T!==Q&&T.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(f.pushLight(K),K.castShadow&&f.pushShadow(K))}),f.setupLights(x._useLegacyLights);const ee=new Set;return T.traverse(function(K){const be=K.material;if(be)if(Array.isArray(be))for(let Ce=0;Ce<be.length;Ce++){const Pe=be[Ce];et(Pe,Q,K),ee.add(Pe)}else et(be,Q,K),ee.add(be)}),y.pop(),f=null,ee},this.compileAsync=function(T,$,Q=null){const ee=this.compile(T,$,Q);return new Promise(K=>{function be(){if(ee.forEach(function(Ce){Re.get(Ce).currentProgram.isReady()&&ee.delete(Ce)}),ee.size===0){K(T);return}setTimeout(be,10)}de.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let tt=null;function yt(T){tt&&tt(T)}function Ct(){At.stop()}function nt(){At.start()}const At=new bc;At.setAnimationLoop(yt),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(T){tt=T,We.setAnimationLoop(T),T===null?At.stop():At.start()},We.addEventListener("sessionstart",Ct),We.addEventListener("sessionend",nt),this.render=function(T,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(We.cameraAutoUpdate===!0&&We.updateCamera($),$=We.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,$,L),f=Le.get(T,y.length),f.init(),y.push(f),ie.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),z.setFromProjectionMatrix(ie),ne=this.localClippingEnabled,Z=Ue.init(this.clippingPlanes,ne),v=Me.get(T,p.length),v.init(),p.push(v),cn(T,$,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(Y,X),this.info.render.frame++,Z===!0&&Ue.beginShadows();const Q=f.state.shadowsArray;if(se.render(Q,T,$),Z===!0&&Ue.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ke.render(v,T),f.setupLights(x._useLegacyLights),$.isArrayCamera){const ee=$.cameras;for(let K=0,be=ee.length;K<be;K++){const Ce=ee[K];Nr(v,T,Ce,Ce.viewport)}}else Nr(v,T,$);L!==null&&(A.updateMultisampleRenderTarget(L),A.updateRenderTargetMipmap(L)),T.isScene===!0&&T.onAfterRender(x,T,$),ze.resetDefaultState(),q=-1,w=null,y.pop(),y.length>0?f=y[y.length-1]:f=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function cn(T,$,Q,ee){if(T.visible===!1)return;if(T.layers.test($.layers)){if(T.isGroup)Q=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update($);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||z.intersectsSprite(T)){ee&&xe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ie);const Ce=le.update(T),Pe=T.material;Pe.visible&&v.push(T,Ce,Pe,Q,xe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||z.intersectsObject(T))){const Ce=le.update(T),Pe=T.material;if(ee&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),xe.copy(T.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),xe.copy(Ce.boundingSphere.center)),xe.applyMatrix4(T.matrixWorld).applyMatrix4(ie)),Array.isArray(Pe)){const Ne=Ce.groups;for(let Ve=0,Be=Ne.length;Ve<Be;Ve++){const ke=Ne[Ve],lt=Pe[ke.materialIndex];lt&&lt.visible&&v.push(T,Ce,lt,Q,xe.z,ke)}}else Pe.visible&&v.push(T,Ce,Pe,Q,xe.z,null)}}const be=T.children;for(let Ce=0,Pe=be.length;Ce<Pe;Ce++)cn(be[Ce],$,Q,ee)}function Nr(T,$,Q,ee){const K=T.opaque,be=T.transmissive,Ce=T.transparent;f.setupLightsView(Q),Z===!0&&Ue.setGlobalState(x.clippingPlanes,Q),be.length>0&&Vc(K,be,$,Q),ee&&ye.viewport(E.copy(ee)),K.length>0&&ms(K,$,Q),be.length>0&&ms(be,$,Q),Ce.length>0&&ms(Ce,$,Q),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function Vc(T,$,Q,ee){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;const be=Ee.isWebGL2;re===null&&(re=new fi(1,1,{generateMipmaps:!0,type:de.has("EXT_color_buffer_half_float")?cs:Xn,minFilter:ls,samples:be?4:0})),x.getDrawingBufferSize(pe),be?re.setSize(pe.x,pe.y):re.setSize(pr(pe.x),pr(pe.y));const Ce=x.getRenderTarget();x.setRenderTarget(re),x.getClearColor(H),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const Pe=x.toneMapping;x.toneMapping=qn,ms(T,Q,ee),A.updateMultisampleRenderTarget(re),A.updateRenderTargetMipmap(re);let Ne=!1;for(let Ve=0,Be=$.length;Ve<Be;Ve++){const ke=$[Ve],lt=ke.object,kt=ke.geometry,xt=ke.material,yn=ke.group;if(xt.side===Ln&&lt.layers.test(ee.layers)){const ot=xt.side;xt.side=Dt,xt.needsUpdate=!0,Ur(lt,Q,ee,kt,xt,yn),xt.side=ot,xt.needsUpdate=!0,Ne=!0}}Ne===!0&&(A.updateMultisampleRenderTarget(re),A.updateRenderTargetMipmap(re)),x.setRenderTarget(Ce),x.setClearColor(H,I),x.toneMapping=Pe}function ms(T,$,Q){const ee=$.isScene===!0?$.overrideMaterial:null;for(let K=0,be=T.length;K<be;K++){const Ce=T[K],Pe=Ce.object,Ne=Ce.geometry,Ve=ee===null?Ce.material:ee,Be=Ce.group;Pe.layers.test(Q.layers)&&Ur(Pe,$,Q,Ne,Ve,Be)}}function Ur(T,$,Q,ee,K,be){T.onBeforeRender(x,$,Q,ee,K,be),T.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),K.onBeforeRender(x,$,Q,ee,T,be),K.transparent===!0&&K.side===Ln&&K.forceSinglePass===!1?(K.side=Dt,K.needsUpdate=!0,x.renderBufferDirect(Q,$,ee,K,T,be),K.side=Pn,K.needsUpdate=!0,x.renderBufferDirect(Q,$,ee,K,T,be),K.side=Ln):x.renderBufferDirect(Q,$,ee,K,T,be),T.onAfterRender(x,$,Q,ee,K,be)}function gs(T,$,Q){$.isScene!==!0&&($=ve);const ee=Re.get(T),K=f.state.lights,be=f.state.shadowsArray,Ce=K.state.version,Pe=Te.getParameters(T,K.state,be,$,Q),Ne=Te.getProgramCacheKey(Pe);let Ve=ee.programs;ee.environment=T.isMeshStandardMaterial?$.environment:null,ee.fog=$.fog,ee.envMap=(T.isMeshStandardMaterial?j:M).get(T.envMap||ee.environment),Ve===void 0&&(T.addEventListener("dispose",ge),Ve=new Map,ee.programs=Ve);let Be=Ve.get(Ne);if(Be!==void 0){if(ee.currentProgram===Be&&ee.lightsStateVersion===Ce)return Or(T,Pe),Be}else Pe.uniforms=Te.getUniforms(T),T.onBuild(Q,Pe,x),T.onBeforeCompile(Pe,x),Be=Te.acquireProgram(Pe,Ne),Ve.set(Ne,Be),ee.uniforms=Pe.uniforms;const ke=ee.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ke.clippingPlanes=Ue.uniform),Or(T,Pe),ee.needsLights=qc(T),ee.lightsStateVersion=Ce,ee.needsLights&&(ke.ambientLightColor.value=K.state.ambient,ke.lightProbe.value=K.state.probe,ke.directionalLights.value=K.state.directional,ke.directionalLightShadows.value=K.state.directionalShadow,ke.spotLights.value=K.state.spot,ke.spotLightShadows.value=K.state.spotShadow,ke.rectAreaLights.value=K.state.rectArea,ke.ltc_1.value=K.state.rectAreaLTC1,ke.ltc_2.value=K.state.rectAreaLTC2,ke.pointLights.value=K.state.point,ke.pointLightShadows.value=K.state.pointShadow,ke.hemisphereLights.value=K.state.hemi,ke.directionalShadowMap.value=K.state.directionalShadowMap,ke.directionalShadowMatrix.value=K.state.directionalShadowMatrix,ke.spotShadowMap.value=K.state.spotShadowMap,ke.spotLightMatrix.value=K.state.spotLightMatrix,ke.spotLightMap.value=K.state.spotLightMap,ke.pointShadowMap.value=K.state.pointShadowMap,ke.pointShadowMatrix.value=K.state.pointShadowMatrix),ee.currentProgram=Be,ee.uniformsList=null,Be}function Br(T){if(T.uniformsList===null){const $=T.currentProgram.getUniforms();T.uniformsList=Js.seqWithValue($.seq,T.uniforms)}return T.uniformsList}function Or(T,$){const Q=Re.get(T);Q.outputColorSpace=$.outputColorSpace,Q.batching=$.batching,Q.instancing=$.instancing,Q.instancingColor=$.instancingColor,Q.skinning=$.skinning,Q.morphTargets=$.morphTargets,Q.morphNormals=$.morphNormals,Q.morphColors=$.morphColors,Q.morphTargetsCount=$.morphTargetsCount,Q.numClippingPlanes=$.numClippingPlanes,Q.numIntersection=$.numClipIntersection,Q.vertexAlphas=$.vertexAlphas,Q.vertexTangents=$.vertexTangents,Q.toneMapping=$.toneMapping}function Wc(T,$,Q,ee,K){$.isScene!==!0&&($=ve),A.resetTextureUnits();const be=$.fog,Ce=ee.isMeshStandardMaterial?$.environment:null,Pe=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Dn,Ne=(ee.isMeshStandardMaterial?j:M).get(ee.envMap||Ce),Ve=ee.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Be=!!Q.attributes.tangent&&(!!ee.normalMap||ee.anisotropy>0),ke=!!Q.morphAttributes.position,lt=!!Q.morphAttributes.normal,kt=!!Q.morphAttributes.color;let xt=qn;ee.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(xt=x.toneMapping);const yn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ot=yn!==void 0?yn.length:0,$e=Re.get(ee),vo=f.state.lights;if(Z===!0&&(ne===!0||T!==w)){const Yt=T===w&&ee.id===q;Ue.setState(ee,T,Yt)}let at=!1;ee.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==vo.state.version||$e.outputColorSpace!==Pe||K.isBatchedMesh&&$e.batching===!1||!K.isBatchedMesh&&$e.batching===!0||K.isInstancedMesh&&$e.instancing===!1||!K.isInstancedMesh&&$e.instancing===!0||K.isSkinnedMesh&&$e.skinning===!1||!K.isSkinnedMesh&&$e.skinning===!0||K.isInstancedMesh&&$e.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&$e.instancingColor===!1&&K.instanceColor!==null||$e.envMap!==Ne||ee.fog===!0&&$e.fog!==be||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==Ue.numPlanes||$e.numIntersection!==Ue.numIntersection)||$e.vertexAlphas!==Ve||$e.vertexTangents!==Be||$e.morphTargets!==ke||$e.morphNormals!==lt||$e.morphColors!==kt||$e.toneMapping!==xt||Ee.isWebGL2===!0&&$e.morphTargetsCount!==ot)&&(at=!0):(at=!0,$e.__version=ee.version);let Yn=$e.currentProgram;at===!0&&(Yn=gs(ee,$,K));let kr=!1,Xi=!1,yo=!1;const wt=Yn.getUniforms(),jn=$e.uniforms;if(ye.useProgram(Yn.program)&&(kr=!0,Xi=!0,yo=!0),ee.id!==q&&(q=ee.id,Xi=!0),kr||w!==T){wt.setValue(W,"projectionMatrix",T.projectionMatrix),wt.setValue(W,"viewMatrix",T.matrixWorldInverse);const Yt=wt.map.cameraPosition;Yt!==void 0&&Yt.setValue(W,xe.setFromMatrixPosition(T.matrixWorld)),Ee.logarithmicDepthBuffer&&wt.setValue(W,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(ee.isMeshPhongMaterial||ee.isMeshToonMaterial||ee.isMeshLambertMaterial||ee.isMeshBasicMaterial||ee.isMeshStandardMaterial||ee.isShaderMaterial)&&wt.setValue(W,"isOrthographic",T.isOrthographicCamera===!0),w!==T&&(w=T,Xi=!0,yo=!0)}if(K.isSkinnedMesh){wt.setOptional(W,K,"bindMatrix"),wt.setOptional(W,K,"bindMatrixInverse");const Yt=K.skeleton;Yt&&(Ee.floatVertexTextures?(Yt.boneTexture===null&&Yt.computeBoneTexture(),wt.setValue(W,"boneTexture",Yt.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}K.isBatchedMesh&&(wt.setOptional(W,K,"batchingTexture"),wt.setValue(W,"batchingTexture",K._matricesTexture,A));const xo=Q.morphAttributes;if((xo.position!==void 0||xo.normal!==void 0||xo.color!==void 0&&Ee.isWebGL2===!0)&&Ge.update(K,Q,Yn),(Xi||$e.receiveShadow!==K.receiveShadow)&&($e.receiveShadow=K.receiveShadow,wt.setValue(W,"receiveShadow",K.receiveShadow)),ee.isMeshGouraudMaterial&&ee.envMap!==null&&(jn.envMap.value=Ne,jn.flipEnvMap.value=Ne.isCubeTexture&&Ne.isRenderTargetTexture===!1?-1:1),Xi&&(wt.setValue(W,"toneMappingExposure",x.toneMappingExposure),$e.needsLights&&$c(jn,yo),be&&ee.fog===!0&&fe.refreshFogUniforms(jn,be),fe.refreshMaterialUniforms(jn,ee,te,B,re),Js.upload(W,Br($e),jn,A)),ee.isShaderMaterial&&ee.uniformsNeedUpdate===!0&&(Js.upload(W,Br($e),jn,A),ee.uniformsNeedUpdate=!1),ee.isSpriteMaterial&&wt.setValue(W,"center",K.center),wt.setValue(W,"modelViewMatrix",K.modelViewMatrix),wt.setValue(W,"normalMatrix",K.normalMatrix),wt.setValue(W,"modelMatrix",K.matrixWorld),ee.isShaderMaterial||ee.isRawShaderMaterial){const Yt=ee.uniformsGroups;for(let bo=0,Xc=Yt.length;bo<Xc;bo++)if(Ee.isWebGL2){const zr=Yt[bo];Je.update(zr,Yn),Je.bind(zr,Yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Yn}function $c(T,$){T.ambientLightColor.needsUpdate=$,T.lightProbe.needsUpdate=$,T.directionalLights.needsUpdate=$,T.directionalLightShadows.needsUpdate=$,T.pointLights.needsUpdate=$,T.pointLightShadows.needsUpdate=$,T.spotLights.needsUpdate=$,T.spotLightShadows.needsUpdate=$,T.rectAreaLights.needsUpdate=$,T.hemisphereLights.needsUpdate=$}function qc(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,$,Q){Re.get(T.texture).__webglTexture=$,Re.get(T.depthTexture).__webglTexture=Q;const ee=Re.get(T);ee.__hasExternalTextures=!0,ee.__hasExternalTextures&&(ee.__autoAllocateDepthBuffer=Q===void 0,ee.__autoAllocateDepthBuffer||de.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ee.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,$){const Q=Re.get(T);Q.__webglFramebuffer=$,Q.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(T,$=0,Q=0){L=T,R=$,S=Q;let ee=!0,K=null,be=!1,Ce=!1;if(T){const Ne=Re.get(T);Ne.__useDefaultFramebuffer!==void 0?(ye.bindFramebuffer(W.FRAMEBUFFER,null),ee=!1):Ne.__webglFramebuffer===void 0?A.setupRenderTarget(T):Ne.__hasExternalTextures&&A.rebindTextures(T,Re.get(T.texture).__webglTexture,Re.get(T.depthTexture).__webglTexture);const Ve=T.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(Ce=!0);const Be=Re.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Be[$])?K=Be[$][Q]:K=Be[$],be=!0):Ee.isWebGL2&&T.samples>0&&A.useMultisampledRTT(T)===!1?K=Re.get(T).__webglMultisampledFramebuffer:Array.isArray(Be)?K=Be[Q]:K=Be,E.copy(T.viewport),G.copy(T.scissor),J=T.scissorTest}else E.copy(P).multiplyScalar(te).floor(),G.copy(C).multiplyScalar(te).floor(),J=V;if(ye.bindFramebuffer(W.FRAMEBUFFER,K)&&Ee.drawBuffers&&ee&&ye.drawBuffers(T,K),ye.viewport(E),ye.scissor(G),ye.setScissorTest(J),be){const Ne=Re.get(T.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ne.__webglTexture,Q)}else if(Ce){const Ne=Re.get(T.texture),Ve=$||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ne.__webglTexture,Q||0,Ve)}q=-1},this.readRenderTargetPixels=function(T,$,Q,ee,K,be,Ce){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=Re.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ce!==void 0&&(Pe=Pe[Ce]),Pe){ye.bindFramebuffer(W.FRAMEBUFFER,Pe);try{const Ne=T.texture,Ve=Ne.format,Be=Ne.type;if(Ve!==rn&&we.convert(Ve)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ke=Be===cs&&(de.has("EXT_color_buffer_half_float")||Ee.isWebGL2&&de.has("EXT_color_buffer_float"));if(Be!==Xn&&we.convert(Be)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Be===Vn&&(Ee.isWebGL2||de.has("OES_texture_float")||de.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=T.width-ee&&Q>=0&&Q<=T.height-K&&W.readPixels($,Q,ee,K,we.convert(Ve),we.convert(Be),be)}finally{const Ne=L!==null?Re.get(L).__webglFramebuffer:null;ye.bindFramebuffer(W.FRAMEBUFFER,Ne)}}},this.copyFramebufferToTexture=function(T,$,Q=0){const ee=Math.pow(2,-Q),K=Math.floor($.image.width*ee),be=Math.floor($.image.height*ee);A.setTexture2D($,0),W.copyTexSubImage2D(W.TEXTURE_2D,Q,0,0,T.x,T.y,K,be),ye.unbindTexture()},this.copyTextureToTexture=function(T,$,Q,ee=0){const K=$.image.width,be=$.image.height,Ce=we.convert(Q.format),Pe=we.convert(Q.type);A.setTexture2D(Q,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,Q.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,Q.unpackAlignment),$.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,ee,T.x,T.y,K,be,Ce,Pe,$.image.data):$.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,ee,T.x,T.y,$.mipmaps[0].width,$.mipmaps[0].height,Ce,$.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,ee,T.x,T.y,Ce,Pe,$.image),ee===0&&Q.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),ye.unbindTexture()},this.copyTextureToTexture3D=function(T,$,Q,ee,K=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const be=T.max.x-T.min.x+1,Ce=T.max.y-T.min.y+1,Pe=T.max.z-T.min.z+1,Ne=we.convert(ee.format),Ve=we.convert(ee.type);let Be;if(ee.isData3DTexture)A.setTexture3D(ee,0),Be=W.TEXTURE_3D;else if(ee.isDataArrayTexture||ee.isCompressedArrayTexture)A.setTexture2DArray(ee,0),Be=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,ee.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,ee.unpackAlignment);const ke=W.getParameter(W.UNPACK_ROW_LENGTH),lt=W.getParameter(W.UNPACK_IMAGE_HEIGHT),kt=W.getParameter(W.UNPACK_SKIP_PIXELS),xt=W.getParameter(W.UNPACK_SKIP_ROWS),yn=W.getParameter(W.UNPACK_SKIP_IMAGES),ot=Q.isCompressedTexture?Q.mipmaps[K]:Q.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,ot.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,ot.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,T.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,T.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,T.min.z),Q.isDataTexture||Q.isData3DTexture?W.texSubImage3D(Be,K,$.x,$.y,$.z,be,Ce,Pe,Ne,Ve,ot.data):Q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(Be,K,$.x,$.y,$.z,be,Ce,Pe,Ne,ot.data)):W.texSubImage3D(Be,K,$.x,$.y,$.z,be,Ce,Pe,Ne,Ve,ot),W.pixelStorei(W.UNPACK_ROW_LENGTH,ke),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,lt),W.pixelStorei(W.UNPACK_SKIP_PIXELS,kt),W.pixelStorei(W.UNPACK_SKIP_ROWS,xt),W.pixelStorei(W.UNPACK_SKIP_IMAGES,yn),K===0&&ee.generateMipmaps&&W.generateMipmap(Be),ye.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?A.setTextureCube(T,0):T.isData3DTexture?A.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?A.setTexture2DArray(T,0):A.setTexture2D(T,0),ye.unbindTexture()},this.resetState=function(){R=0,S=0,L=null,ye.reset(),ze.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Mr?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===uo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ft?di:oc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===di?ft:Dn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class tg extends Ac{}tg.prototype.isWebGL1Renderer=!0;class al extends mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Rc extends $i{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ll=new k,cl=new k,dl=new ut,Zo=new wr,zs=new po;class ng extends mt{constructor(e=new vn,t=new Rc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)ll.fromBufferAttribute(t,i-1),cl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ll.distanceTo(cl);e.setAttribute("lineDistance",new qt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(i),zs.radius+=s,e.ray.intersectsSphere(zs)===!1)return;dl.copy(i).invert(),Zo.copy(e.ray).applyMatrix4(dl);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=new k,d=new k,h=new k,u=new k,m=this.isLineSegments?2:1,g=n.index,f=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),y=Math.min(g.count,o.start+o.count);for(let x=p,_=y-1;x<_;x+=m){const R=g.getX(x),S=g.getX(x+1);if(c.fromBufferAttribute(f,R),d.fromBufferAttribute(f,S),Zo.distanceSqToSegment(c,d,u,h)>l)continue;u.applyMatrix4(this.matrixWorld);const q=e.ray.origin.distanceTo(u);q<e.near||q>e.far||t.push({distance:q,point:h.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),y=Math.min(f.count,o.start+o.count);for(let x=p,_=y-1;x<_;x+=m){if(c.fromBufferAttribute(f,x),d.fromBufferAttribute(f,x+1),Zo.distanceSqToSegment(c,d,u,h)>l)continue;u.applyMatrix4(this.matrixWorld);const S=e.ray.origin.distanceTo(u);S<e.near||S>e.far||t.push({distance:S,point:h.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const r=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}const hl=new k,ul=new k;class ig extends ng{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)hl.fromBufferAttribute(t,i),ul.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+hl.distanceTo(ul);e.setAttribute("lineDistance",new qt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hs extends Ft{constructor(e,t,n,i,s,o,r,l,c){super(e,t,n,i,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}const Hs=new k,Gs=new k,Jo=new k,Vs=new Zt;class pl extends vn{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),s=Math.cos(Zs*t),o=e.getIndex(),r=e.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],d=["a","b","c"],h=new Array(3),u={},m=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:f,c:p}=Vs;if(v.fromBufferAttribute(r,c[0]),f.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),Vs.getNormal(Jo),h[0]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,h[1]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,h[2]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let y=0;y<3;y++){const x=(y+1)%3,_=h[y],R=h[x],S=Vs[d[y]],L=Vs[d[x]],q=`${_}_${R}`,w=`${R}_${_}`;w in u&&u[w]?(Jo.dot(u[w].normal)<=s&&(m.push(S.x,S.y,S.z),m.push(L.x,L.y,L.z)),u[w]=null):q in u||(u[q]={index0:c[y],index1:c[x],normal:Jo.clone()})}}for(const g in u)if(u[g]){const{index0:v,index1:f}=u[g];Hs.fromBufferAttribute(r,v),Gs.fromBufferAttribute(r,f),m.push(Hs.x,Hs.y,Hs.z),m.push(Gs.x,Gs.y,Gs.z)}this.setAttribute("position",new qt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Cr extends vn{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,o=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:r},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+r,Math.PI);let c=0;const d=[],h=new k,u=new k,m=[],g=[],v=[],f=[];for(let p=0;p<=n;p++){const y=[],x=p/n;let _=0;p===0&&o===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let R=0;R<=t;R++){const S=R/t;h.x=-e*Math.cos(i+S*s)*Math.sin(o+x*r),h.y=e*Math.cos(o+x*r),h.z=e*Math.sin(i+S*s)*Math.sin(o+x*r),g.push(h.x,h.y,h.z),u.copy(h).normalize(),v.push(u.x,u.y,u.z),f.push(S+_,1-x),y.push(c++)}d.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){const x=d[p][y+1],_=d[p][y],R=d[p+1][y],S=d[p+1][y+1];(p!==0||o>0)&&m.push(x,_,S),(p!==n-1||l<Math.PI)&&m.push(_,R,S)}this.setIndex(m),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(v,3)),this.setAttribute("uv",new qt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Qs extends $i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new Ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Lc extends Qs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Pt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const fl={enabled:!1,files:{},add:function(a,e){this.enabled!==!1&&(this.files[a]=e)},get:function(a){if(this.enabled!==!1)return this.files[a]},remove:function(a){delete this.files[a]},clear:function(){this.files={}}};class sg{constructor(e,t,n){const i=this;let s=!1,o=0,r=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){r++,s===!1&&i.onStart!==void 0&&i.onStart(d,o,r),s=!0},this.itemEnd=function(d){o++,i.onProgress!==void 0&&i.onProgress(d,o,r),o===r&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(d){i.onError!==void 0&&i.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,h){return c.push(d,h),this},this.removeHandler=function(d){const h=c.indexOf(d);return h!==-1&&c.splice(h,2),this},this.getHandler=function(d){for(let h=0,u=c.length;h<u;h+=2){const m=c[h],g=c[h+1];if(m.global&&(m.lastIndex=0),m.test(d))return g}return null}}}const og=new sg;class Ar{constructor(e){this.manager=e!==void 0?e:og,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ar.DEFAULT_MATERIAL_NAME="__DEFAULT";class rg extends Ar{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=fl.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const r=ds("img");function l(){d(),fl.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(h){d(),i&&i(h),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){r.removeEventListener("load",l,!1),r.removeEventListener("error",c,!1)}return r.addEventListener("load",l,!1),r.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(r.crossOrigin=this.crossOrigin),s.manager.itemStart(e),r.src=e,r}}class ag extends Ar{constructor(e){super(e)}load(e,t,n,i){const s=new Ft,o=new rg(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(r){s.image=r,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Rr extends mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Qo=new ut,ml=new k,gl=new k;class Ic{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ye(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Er,this._frameExtents=new Ye(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ml.setFromMatrixPosition(e.matrixWorld),t.position.copy(ml),gl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gl),t.updateMatrixWorld(),Qo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Qo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class lg extends Ic{constructor(){super(new Wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ao*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class cg extends Rr{constructor(e,t,n=0,i=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new lg}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class dg extends Ic{constructor(){super(new _c(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hg extends Rr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.shadow=new dg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ug extends Rr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class pg{constructor(e,t,n=0,i=1/0){this.ray=new wr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Sr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return gr(e,this,n,t),n.sort(vl),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)gr(e[i],this,n,t);return n.sort(vl),n}}function vl(a,e){return a.distance-e.distance}function gr(a,e,t,n){if(a.layers.test(e.layers)&&a.raycast(e,t),n===!0){const i=a.children;for(let s=0,o=i.length;s<o;s++)gr(i[s],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:br}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=br);class an{constructor(e){e===void 0&&(e=[0,0,0,0,0,0,0,0,0]),this.elements=e}identity(){const e=this.elements;e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1}setZero(){const e=this.elements;e[0]=0,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e[8]=0}setTrace(e){const t=this.elements;t[0]=e.x,t[4]=e.y,t[8]=e.z}getTrace(e){e===void 0&&(e=new b);const t=this.elements;return e.x=t[0],e.y=t[4],e.z=t[8],e}vmult(e,t){t===void 0&&(t=new b);const n=this.elements,i=e.x,s=e.y,o=e.z;return t.x=n[0]*i+n[1]*s+n[2]*o,t.y=n[3]*i+n[4]*s+n[5]*o,t.z=n[6]*i+n[7]*s+n[8]*o,t}smult(e){for(let t=0;t<this.elements.length;t++)this.elements[t]*=e}mmult(e,t){t===void 0&&(t=new an);const n=this.elements,i=e.elements,s=t.elements,o=n[0],r=n[1],l=n[2],c=n[3],d=n[4],h=n[5],u=n[6],m=n[7],g=n[8],v=i[0],f=i[1],p=i[2],y=i[3],x=i[4],_=i[5],R=i[6],S=i[7],L=i[8];return s[0]=o*v+r*y+l*R,s[1]=o*f+r*x+l*S,s[2]=o*p+r*_+l*L,s[3]=c*v+d*y+h*R,s[4]=c*f+d*x+h*S,s[5]=c*p+d*_+h*L,s[6]=u*v+m*y+g*R,s[7]=u*f+m*x+g*S,s[8]=u*p+m*_+g*L,t}scale(e,t){t===void 0&&(t=new an);const n=this.elements,i=t.elements;for(let s=0;s!==3;s++)i[3*s+0]=e.x*n[3*s+0],i[3*s+1]=e.y*n[3*s+1],i[3*s+2]=e.z*n[3*s+2];return t}solve(e,t){t===void 0&&(t=new b);const n=3,i=4,s=[];let o,r;for(o=0;o<n*i;o++)s.push(0);for(o=0;o<3;o++)for(r=0;r<3;r++)s[o+i*r]=this.elements[o+3*r];s[3+4*0]=e.x,s[3+4*1]=e.y,s[3+4*2]=e.z;let l=3;const c=l;let d;const h=4;let u;do{if(o=c-l,s[o+i*o]===0){for(r=o+1;r<c;r++)if(s[o+i*r]!==0){d=h;do u=h-d,s[u+i*o]+=s[u+i*r];while(--d);break}}if(s[o+i*o]!==0)for(r=o+1;r<c;r++){const m=s[o+i*r]/s[o+i*o];d=h;do u=h-d,s[u+i*r]=u<=o?0:s[u+i*r]-s[u+i*o]*m;while(--d)}}while(--l);if(t.z=s[2*i+3]/s[2*i+2],t.y=(s[1*i+3]-s[1*i+2]*t.z)/s[1*i+1],t.x=(s[0*i+3]-s[0*i+2]*t.z-s[0*i+1]*t.y)/s[0*i+0],isNaN(t.x)||isNaN(t.y)||isNaN(t.z)||t.x===1/0||t.y===1/0||t.z===1/0)throw`Could not solve equation! Got x=[${t.toString()}], b=[${e.toString()}], A=[${this.toString()}]`;return t}e(e,t,n){if(n===void 0)return this.elements[t+3*e];this.elements[t+3*e]=n}copy(e){for(let t=0;t<e.elements.length;t++)this.elements[t]=e.elements[t];return this}toString(){let e="";const t=",";for(let n=0;n<9;n++)e+=this.elements[n]+t;return e}reverse(e){e===void 0&&(e=new an);const t=3,n=6,i=fg;let s,o;for(s=0;s<3;s++)for(o=0;o<3;o++)i[s+n*o]=this.elements[s+3*o];i[3+6*0]=1,i[3+6*1]=0,i[3+6*2]=0,i[4+6*0]=0,i[4+6*1]=1,i[4+6*2]=0,i[5+6*0]=0,i[5+6*1]=0,i[5+6*2]=1;let r=3;const l=r;let c;const d=n;let h;do{if(s=l-r,i[s+n*s]===0){for(o=s+1;o<l;o++)if(i[s+n*o]!==0){c=d;do h=d-c,i[h+n*s]+=i[h+n*o];while(--c);break}}if(i[s+n*s]!==0)for(o=s+1;o<l;o++){const u=i[s+n*o]/i[s+n*s];c=d;do h=d-c,i[h+n*o]=h<=s?0:i[h+n*o]-i[h+n*s]*u;while(--c)}}while(--r);s=2;do{o=s-1;do{const u=i[s+n*o]/i[s+n*s];c=n;do h=n-c,i[h+n*o]=i[h+n*o]-i[h+n*s]*u;while(--c)}while(o--)}while(--s);s=2;do{const u=1/i[s+n*s];c=n;do h=n-c,i[h+n*s]=i[h+n*s]*u;while(--c)}while(s--);s=2;do{o=2;do{if(h=i[t+o+n*s],isNaN(h)||h===1/0)throw`Could not reverse! A=[${this.toString()}]`;e.e(s,o,h)}while(o--)}while(s--);return e}setRotationFromQuaternion(e){const t=e.x,n=e.y,i=e.z,s=e.w,o=t+t,r=n+n,l=i+i,c=t*o,d=t*r,h=t*l,u=n*r,m=n*l,g=i*l,v=s*o,f=s*r,p=s*l,y=this.elements;return y[3*0+0]=1-(u+g),y[3*0+1]=d-p,y[3*0+2]=h+f,y[3*1+0]=d+p,y[3*1+1]=1-(c+g),y[3*1+2]=m-v,y[3*2+0]=h-f,y[3*2+1]=m+v,y[3*2+2]=1-(c+u),this}transpose(e){e===void 0&&(e=new an);const t=this.elements,n=e.elements;let i;return n[0]=t[0],n[4]=t[4],n[8]=t[8],i=t[1],n[1]=t[3],n[3]=i,i=t[2],n[2]=t[6],n[6]=i,i=t[5],n[5]=t[7],n[7]=i,e}}const fg=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class b{constructor(e,t,n){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),this.x=e,this.y=t,this.z=n}cross(e,t){t===void 0&&(t=new b);const n=e.x,i=e.y,s=e.z,o=this.x,r=this.y,l=this.z;return t.x=r*s-l*i,t.y=l*n-o*s,t.z=o*i-r*n,t}set(e,t,n){return this.x=e,this.y=t,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(e,t){if(t)t.x=e.x+this.x,t.y=e.y+this.y,t.z=e.z+this.z;else return new b(this.x+e.x,this.y+e.y,this.z+e.z)}vsub(e,t){if(t)t.x=this.x-e.x,t.y=this.y-e.y,t.z=this.z-e.z;else return new b(this.x-e.x,this.y-e.y,this.z-e.z)}crossmat(){return new an([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const e=this.x,t=this.y,n=this.z,i=Math.sqrt(e*e+t*t+n*n);if(i>0){const s=1/i;this.x*=s,this.y*=s,this.z*=s}else this.x=0,this.y=0,this.z=0;return i}unit(e){e===void 0&&(e=new b);const t=this.x,n=this.y,i=this.z;let s=Math.sqrt(t*t+n*n+i*i);return s>0?(s=1/s,e.x=t*s,e.y=n*s,e.z=i*s):(e.x=1,e.y=0,e.z=0),e}length(){const e=this.x,t=this.y,n=this.z;return Math.sqrt(e*e+t*t+n*n)}lengthSquared(){return this.dot(this)}distanceTo(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,r=e.z;return Math.sqrt((s-t)*(s-t)+(o-n)*(o-n)+(r-i)*(r-i))}distanceSquared(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,r=e.z;return(s-t)*(s-t)+(o-n)*(o-n)+(r-i)*(r-i)}scale(e,t){t===void 0&&(t=new b);const n=this.x,i=this.y,s=this.z;return t.x=e*n,t.y=e*i,t.z=e*s,t}vmul(e,t){return t===void 0&&(t=new b),t.x=e.x*this.x,t.y=e.y*this.y,t.z=e.z*this.z,t}addScaledVector(e,t,n){return n===void 0&&(n=new b),n.x=this.x+e*t.x,n.y=this.y+e*t.y,n.z=this.z+e*t.z,n}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(e){return e===void 0&&(e=new b),e.x=-this.x,e.y=-this.y,e.z=-this.z,e}tangents(e,t){const n=this.length();if(n>0){const i=mg,s=1/n;i.set(this.x*s,this.y*s,this.z*s);const o=gg;Math.abs(i.x)<.9?(o.set(1,0,0),i.cross(o,e)):(o.set(0,1,0),i.cross(o,e)),i.cross(e,t)}else e.set(1,0,0),t.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}lerp(e,t,n){const i=this.x,s=this.y,o=this.z;n.x=i+(e.x-i)*t,n.y=s+(e.y-s)*t,n.z=o+(e.z-o)*t}almostEquals(e,t){return t===void 0&&(t=1e-6),!(Math.abs(this.x-e.x)>t||Math.abs(this.y-e.y)>t||Math.abs(this.z-e.z)>t)}almostZero(e){return e===void 0&&(e=1e-6),!(Math.abs(this.x)>e||Math.abs(this.y)>e||Math.abs(this.z)>e)}isAntiparallelTo(e,t){return this.negate(yl),yl.almostEquals(e,t)}clone(){return new b(this.x,this.y,this.z)}}b.ZERO=new b(0,0,0);b.UNIT_X=new b(1,0,0);b.UNIT_Y=new b(0,1,0);b.UNIT_Z=new b(0,0,1);const mg=new b,gg=new b,yl=new b;class Xt{constructor(e){e===void 0&&(e={}),this.lowerBound=new b,this.upperBound=new b,e.lowerBound&&this.lowerBound.copy(e.lowerBound),e.upperBound&&this.upperBound.copy(e.upperBound)}setFromPoints(e,t,n,i){const s=this.lowerBound,o=this.upperBound,r=n;s.copy(e[0]),r&&r.vmult(s,s),o.copy(s);for(let l=1;l<e.length;l++){let c=e[l];r&&(r.vmult(c,xl),c=xl),c.x>o.x&&(o.x=c.x),c.x<s.x&&(s.x=c.x),c.y>o.y&&(o.y=c.y),c.y<s.y&&(s.y=c.y),c.z>o.z&&(o.z=c.z),c.z<s.z&&(s.z=c.z)}return t&&(t.vadd(s,s),t.vadd(o,o)),i&&(s.x-=i,s.y-=i,s.z-=i,o.x+=i,o.y+=i,o.z+=i),this}copy(e){return this.lowerBound.copy(e.lowerBound),this.upperBound.copy(e.upperBound),this}clone(){return new Xt().copy(this)}extend(e){this.lowerBound.x=Math.min(this.lowerBound.x,e.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,e.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,e.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,e.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,e.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,e.upperBound.z)}overlaps(e){const t=this.lowerBound,n=this.upperBound,i=e.lowerBound,s=e.upperBound,o=i.x<=n.x&&n.x<=s.x||t.x<=s.x&&s.x<=n.x,r=i.y<=n.y&&n.y<=s.y||t.y<=s.y&&s.y<=n.y,l=i.z<=n.z&&n.z<=s.z||t.z<=s.z&&s.z<=n.z;return o&&r&&l}volume(){const e=this.lowerBound,t=this.upperBound;return(t.x-e.x)*(t.y-e.y)*(t.z-e.z)}contains(e){const t=this.lowerBound,n=this.upperBound,i=e.lowerBound,s=e.upperBound;return t.x<=i.x&&n.x>=s.x&&t.y<=i.y&&n.y>=s.y&&t.z<=i.z&&n.z>=s.z}getCorners(e,t,n,i,s,o,r,l){const c=this.lowerBound,d=this.upperBound;e.copy(c),t.set(d.x,c.y,c.z),n.set(d.x,d.y,c.z),i.set(c.x,d.y,d.z),s.set(d.x,c.y,d.z),o.set(c.x,d.y,c.z),r.set(c.x,c.y,d.z),l.copy(d)}toLocalFrame(e,t){const n=bl,i=n[0],s=n[1],o=n[2],r=n[3],l=n[4],c=n[5],d=n[6],h=n[7];this.getCorners(i,s,o,r,l,c,d,h);for(let u=0;u!==8;u++){const m=n[u];e.pointToLocal(m,m)}return t.setFromPoints(n)}toWorldFrame(e,t){const n=bl,i=n[0],s=n[1],o=n[2],r=n[3],l=n[4],c=n[5],d=n[6],h=n[7];this.getCorners(i,s,o,r,l,c,d,h);for(let u=0;u!==8;u++){const m=n[u];e.pointToWorld(m,m)}return t.setFromPoints(n)}overlapsRay(e){const{direction:t,from:n}=e,i=1/t.x,s=1/t.y,o=1/t.z,r=(this.lowerBound.x-n.x)*i,l=(this.upperBound.x-n.x)*i,c=(this.lowerBound.y-n.y)*s,d=(this.upperBound.y-n.y)*s,h=(this.lowerBound.z-n.z)*o,u=(this.upperBound.z-n.z)*o,m=Math.max(Math.max(Math.min(r,l),Math.min(c,d)),Math.min(h,u)),g=Math.min(Math.min(Math.max(r,l),Math.max(c,d)),Math.max(h,u));return!(g<0||m>g)}}const xl=new b,bl=[new b,new b,new b,new b,new b,new b,new b,new b];class _l{constructor(){this.matrix=[]}get(e,t){let{index:n}=e,{index:i}=t;if(i>n){const s=i;i=n,n=s}return this.matrix[(n*(n+1)>>1)+i-1]}set(e,t,n){let{index:i}=e,{index:s}=t;if(s>i){const o=s;s=i,i=o}this.matrix[(i*(i+1)>>1)+s-1]=n?1:0}reset(){for(let e=0,t=this.matrix.length;e!==t;e++)this.matrix[e]=0}setNumObjects(e){this.matrix.length=e*(e-1)>>1}}class Pc{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[e]===void 0&&(n[e]=[]),n[e].includes(t)||n[e].push(t),this}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[e]!==void 0&&n[e].includes(t))}hasAnyEventListener(e){return this._listeners===void 0?!1:this._listeners[e]!==void 0}removeEventListener(e,t){if(this._listeners===void 0)return this;const n=this._listeners;if(n[e]===void 0)return this;const i=n[e].indexOf(t);return i!==-1&&n[e].splice(i,1),this}dispatchEvent(e){if(this._listeners===void 0)return this;const n=this._listeners[e.type];if(n!==void 0){e.target=this;for(let i=0,s=n.length;i<s;i++)n[i].call(this,e)}return this}}class ht{constructor(e,t,n,i){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),i===void 0&&(i=1),this.x=e,this.y=t,this.z=n,this.w=i}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(e,t){const n=Math.sin(t*.5);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=Math.cos(t*.5),this}toAxisAngle(e){e===void 0&&(e=new b),this.normalize();const t=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(e.x=this.x,e.y=this.y,e.z=this.z):(e.x=this.x/n,e.y=this.y/n,e.z=this.z/n),[e,t]}setFromVectors(e,t){if(e.isAntiparallelTo(t)){const n=vg,i=yg;e.tangents(n,i),this.setFromAxisAngle(n,Math.PI)}else{const n=e.cross(t);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(e.length()**2*t.length()**2)+e.dot(t),this.normalize()}return this}mult(e,t){t===void 0&&(t=new ht);const n=this.x,i=this.y,s=this.z,o=this.w,r=e.x,l=e.y,c=e.z,d=e.w;return t.x=n*d+o*r+i*c-s*l,t.y=i*d+o*l+s*r-n*c,t.z=s*d+o*c+n*l-i*r,t.w=o*d-n*r-i*l-s*c,t}inverse(e){e===void 0&&(e=new ht);const t=this.x,n=this.y,i=this.z,s=this.w;this.conjugate(e);const o=1/(t*t+n*n+i*i+s*s);return e.x*=o,e.y*=o,e.z*=o,e.w*=o,e}conjugate(e){return e===void 0&&(e=new ht),e.x=-this.x,e.y=-this.y,e.z=-this.z,e.w=this.w,e}normalize(){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}normalizeFast(){const e=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}vmult(e,t){t===void 0&&(t=new b);const n=e.x,i=e.y,s=e.z,o=this.x,r=this.y,l=this.z,c=this.w,d=c*n+r*s-l*i,h=c*i+l*n-o*s,u=c*s+o*i-r*n,m=-o*n-r*i-l*s;return t.x=d*c+m*-o+h*-l-u*-r,t.y=h*c+m*-r+u*-o-d*-l,t.z=u*c+m*-l+d*-r-h*-o,t}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}toEuler(e,t){t===void 0&&(t="YZX");let n,i,s;const o=this.x,r=this.y,l=this.z,c=this.w;switch(t){case"YZX":const d=o*r+l*c;if(d>.499&&(n=2*Math.atan2(o,c),i=Math.PI/2,s=0),d<-.499&&(n=-2*Math.atan2(o,c),i=-Math.PI/2,s=0),n===void 0){const h=o*o,u=r*r,m=l*l;n=Math.atan2(2*r*c-2*o*l,1-2*u-2*m),i=Math.asin(2*d),s=Math.atan2(2*o*c-2*r*l,1-2*h-2*m)}break;default:throw new Error(`Euler order ${t} not supported yet.`)}e.y=n,e.z=i,e.x=s}setFromEuler(e,t,n,i){i===void 0&&(i="XYZ");const s=Math.cos(e/2),o=Math.cos(t/2),r=Math.cos(n/2),l=Math.sin(e/2),c=Math.sin(t/2),d=Math.sin(n/2);return i==="XYZ"?(this.x=l*o*r+s*c*d,this.y=s*c*r-l*o*d,this.z=s*o*d+l*c*r,this.w=s*o*r-l*c*d):i==="YXZ"?(this.x=l*o*r+s*c*d,this.y=s*c*r-l*o*d,this.z=s*o*d-l*c*r,this.w=s*o*r+l*c*d):i==="ZXY"?(this.x=l*o*r-s*c*d,this.y=s*c*r+l*o*d,this.z=s*o*d+l*c*r,this.w=s*o*r-l*c*d):i==="ZYX"?(this.x=l*o*r-s*c*d,this.y=s*c*r+l*o*d,this.z=s*o*d-l*c*r,this.w=s*o*r+l*c*d):i==="YZX"?(this.x=l*o*r+s*c*d,this.y=s*c*r+l*o*d,this.z=s*o*d-l*c*r,this.w=s*o*r-l*c*d):i==="XZY"&&(this.x=l*o*r-s*c*d,this.y=s*c*r-l*o*d,this.z=s*o*d+l*c*r,this.w=s*o*r+l*c*d),this}clone(){return new ht(this.x,this.y,this.z,this.w)}slerp(e,t,n){n===void 0&&(n=new ht);const i=this.x,s=this.y,o=this.z,r=this.w;let l=e.x,c=e.y,d=e.z,h=e.w,u,m,g,v,f;return m=i*l+s*c+o*d+r*h,m<0&&(m=-m,l=-l,c=-c,d=-d,h=-h),1-m>1e-6?(u=Math.acos(m),g=Math.sin(u),v=Math.sin((1-t)*u)/g,f=Math.sin(t*u)/g):(v=1-t,f=t),n.x=v*i+f*l,n.y=v*s+f*c,n.z=v*o+f*d,n.w=v*r+f*h,n}integrate(e,t,n,i){i===void 0&&(i=new ht);const s=e.x*n.x,o=e.y*n.y,r=e.z*n.z,l=this.x,c=this.y,d=this.z,h=this.w,u=t*.5;return i.x+=u*(s*h+o*d-r*c),i.y+=u*(o*h+r*l-s*d),i.z+=u*(r*h+s*c-o*l),i.w+=u*(-s*l-o*c-r*d),i}}const vg=new b,yg=new b,xg={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class _e{constructor(e){e===void 0&&(e={}),this.id=_e.idCounter++,this.type=e.type||0,this.boundingSphereRadius=0,this.collisionResponse=e.collisionResponse?e.collisionResponse:!0,this.collisionFilterGroup=e.collisionFilterGroup!==void 0?e.collisionFilterGroup:1,this.collisionFilterMask=e.collisionFilterMask!==void 0?e.collisionFilterMask:-1,this.material=e.material?e.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(e,t){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(e,t,n,i){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}_e.idCounter=0;_e.types=xg;class Ze{constructor(e){e===void 0&&(e={}),this.position=new b,this.quaternion=new ht,e.position&&this.position.copy(e.position),e.quaternion&&this.quaternion.copy(e.quaternion)}pointToLocal(e,t){return Ze.pointToLocalFrame(this.position,this.quaternion,e,t)}pointToWorld(e,t){return Ze.pointToWorldFrame(this.position,this.quaternion,e,t)}vectorToWorldFrame(e,t){return t===void 0&&(t=new b),this.quaternion.vmult(e,t),t}static pointToLocalFrame(e,t,n,i){return i===void 0&&(i=new b),n.vsub(e,i),t.conjugate(Ml),Ml.vmult(i,i),i}static pointToWorldFrame(e,t,n,i){return i===void 0&&(i=new b),t.vmult(n,i),i.vadd(e,i),i}static vectorToWorldFrame(e,t,n){return n===void 0&&(n=new b),e.vmult(t,n),n}static vectorToLocalFrame(e,t,n,i){return i===void 0&&(i=new b),t.w*=-1,t.vmult(n,i),t.w*=-1,i}}const Ml=new ht;class rs extends _e{constructor(e){e===void 0&&(e={});const{vertices:t=[],faces:n=[],normals:i=[],axes:s,boundingSphereRadius:o}=e;super({type:_e.types.CONVEXPOLYHEDRON}),this.vertices=t,this.faces=n,this.faceNormals=i,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=s?s.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const e=this.faces,t=this.vertices,n=this.uniqueEdges;n.length=0;const i=new b;for(let s=0;s!==e.length;s++){const o=e[s],r=o.length;for(let l=0;l!==r;l++){const c=(l+1)%r;t[o[l]].vsub(t[o[c]],i),i.normalize();let d=!1;for(let h=0;h!==n.length;h++)if(n[h].almostEquals(i)||n[h].almostEquals(i)){d=!0;break}d||n.push(i.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let e=0;e<this.faces.length;e++){for(let i=0;i<this.faces[e].length;i++)if(!this.vertices[this.faces[e][i]])throw new Error(`Vertex ${this.faces[e][i]} not found!`);const t=this.faceNormals[e]||new b;this.getFaceNormal(e,t),t.negate(t),this.faceNormals[e]=t;const n=this.vertices[this.faces[e][0]];if(t.dot(n)<0){console.error(`.faceNormals[${e}] = Vec3(${t.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let i=0;i<this.faces[e].length;i++)console.warn(`.vertices[${this.faces[e][i]}] = Vec3(${this.vertices[this.faces[e][i]].toString()})`)}}}getFaceNormal(e,t){const n=this.faces[e],i=this.vertices[n[0]],s=this.vertices[n[1]],o=this.vertices[n[2]];rs.computeNormal(i,s,o,t)}static computeNormal(e,t,n,i){const s=new b,o=new b;t.vsub(e,o),n.vsub(t,s),s.cross(o,i),i.isZero()||i.normalize()}clipAgainstHull(e,t,n,i,s,o,r,l,c){const d=new b;let h=-1,u=-Number.MAX_VALUE;for(let g=0;g<n.faces.length;g++){d.copy(n.faceNormals[g]),s.vmult(d,d);const v=d.dot(o);v>u&&(u=v,h=g)}const m=[];for(let g=0;g<n.faces[h].length;g++){const v=n.vertices[n.faces[h][g]],f=new b;f.copy(v),s.vmult(f,f),i.vadd(f,f),m.push(f)}h>=0&&this.clipFaceAgainstHull(o,e,t,m,r,l,c)}findSeparatingAxis(e,t,n,i,s,o,r,l){const c=new b,d=new b,h=new b,u=new b,m=new b,g=new b;let v=Number.MAX_VALUE;const f=this;if(f.uniqueAxes)for(let p=0;p!==f.uniqueAxes.length;p++){n.vmult(f.uniqueAxes[p],c);const y=f.testSepAxis(c,e,t,n,i,s);if(y===!1)return!1;y<v&&(v=y,o.copy(c))}else{const p=r?r.length:f.faces.length;for(let y=0;y<p;y++){const x=r?r[y]:y;c.copy(f.faceNormals[x]),n.vmult(c,c);const _=f.testSepAxis(c,e,t,n,i,s);if(_===!1)return!1;_<v&&(v=_,o.copy(c))}}if(e.uniqueAxes)for(let p=0;p!==e.uniqueAxes.length;p++){s.vmult(e.uniqueAxes[p],d);const y=f.testSepAxis(d,e,t,n,i,s);if(y===!1)return!1;y<v&&(v=y,o.copy(d))}else{const p=l?l.length:e.faces.length;for(let y=0;y<p;y++){const x=l?l[y]:y;d.copy(e.faceNormals[x]),s.vmult(d,d);const _=f.testSepAxis(d,e,t,n,i,s);if(_===!1)return!1;_<v&&(v=_,o.copy(d))}}for(let p=0;p!==f.uniqueEdges.length;p++){n.vmult(f.uniqueEdges[p],u);for(let y=0;y!==e.uniqueEdges.length;y++)if(s.vmult(e.uniqueEdges[y],m),u.cross(m,g),!g.almostZero()){g.normalize();const x=f.testSepAxis(g,e,t,n,i,s);if(x===!1)return!1;x<v&&(v=x,o.copy(g))}}return i.vsub(t,h),h.dot(o)>0&&o.negate(o),!0}testSepAxis(e,t,n,i,s,o){const r=this;rs.project(r,e,n,i,er),rs.project(t,e,s,o,tr);const l=er[0],c=er[1],d=tr[0],h=tr[1];if(l<h||d<c)return!1;const u=l-h,m=d-c;return u<m?u:m}calculateLocalInertia(e,t){const n=new b,i=new b;this.computeLocalAABB(i,n);const s=n.x-i.x,o=n.y-i.y,r=n.z-i.z;t.x=1/12*e*(2*o*2*o+2*r*2*r),t.y=1/12*e*(2*s*2*s+2*r*2*r),t.z=1/12*e*(2*o*2*o+2*s*2*s)}getPlaneConstantOfFace(e){const t=this.faces[e],n=this.faceNormals[e],i=this.vertices[t[0]];return-n.dot(i)}clipFaceAgainstHull(e,t,n,i,s,o,r){const l=new b,c=new b,d=new b,h=new b,u=new b,m=new b,g=new b,v=new b,f=this,p=[],y=i,x=p;let _=-1,R=Number.MAX_VALUE;for(let E=0;E<f.faces.length;E++){l.copy(f.faceNormals[E]),n.vmult(l,l);const G=l.dot(e);G<R&&(R=G,_=E)}if(_<0)return;const S=f.faces[_];S.connectedFaces=[];for(let E=0;E<f.faces.length;E++)for(let G=0;G<f.faces[E].length;G++)S.indexOf(f.faces[E][G])!==-1&&E!==_&&S.connectedFaces.indexOf(E)===-1&&S.connectedFaces.push(E);const L=S.length;for(let E=0;E<L;E++){const G=f.vertices[S[E]],J=f.vertices[S[(E+1)%L]];G.vsub(J,c),d.copy(c),n.vmult(d,d),t.vadd(d,d),h.copy(this.faceNormals[_]),n.vmult(h,h),t.vadd(h,h),d.cross(h,u),u.negate(u),m.copy(G),n.vmult(m,m),t.vadd(m,m);const H=S.connectedFaces[E];g.copy(this.faceNormals[H]);const I=this.getPlaneConstantOfFace(H);v.copy(g),n.vmult(v,v);const F=I-v.dot(t);for(this.clipFaceAgainstPlane(y,x,v,F);y.length;)y.shift();for(;x.length;)y.push(x.shift())}g.copy(this.faceNormals[_]);const q=this.getPlaneConstantOfFace(_);v.copy(g),n.vmult(v,v);const w=q-v.dot(t);for(let E=0;E<y.length;E++){let G=v.dot(y[E])+w;if(G<=s&&(console.log(`clamped: depth=${G} to minDist=${s}`),G=s),G<=o){const J=y[E];if(G<=1e-6){const H={point:J,normal:v,depth:G};r.push(H)}}}}clipFaceAgainstPlane(e,t,n,i){let s,o;const r=e.length;if(r<2)return t;let l=e[e.length-1],c=e[0];s=n.dot(l)+i;for(let d=0;d<r;d++){if(c=e[d],o=n.dot(c)+i,s<0)if(o<0){const h=new b;h.copy(c),t.push(h)}else{const h=new b;l.lerp(c,s/(s-o),h),t.push(h)}else if(o<0){const h=new b;l.lerp(c,s/(s-o),h),t.push(h),t.push(c)}l=c,s=o}return t}computeWorldVertices(e,t){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new b);const n=this.vertices,i=this.worldVertices;for(let s=0;s!==this.vertices.length;s++)t.vmult(n[s],i[s]),e.vadd(i[s],i[s]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(e,t){const n=this.vertices;e.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),t.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let i=0;i<this.vertices.length;i++){const s=n[i];s.x<e.x?e.x=s.x:s.x>t.x&&(t.x=s.x),s.y<e.y?e.y=s.y:s.y>t.y&&(t.y=s.y),s.z<e.z?e.z=s.z:s.z>t.z&&(t.z=s.z)}}computeWorldFaceNormals(e){const t=this.faceNormals.length;for(;this.worldFaceNormals.length<t;)this.worldFaceNormals.push(new b);const n=this.faceNormals,i=this.worldFaceNormals;for(let s=0;s!==t;s++)e.vmult(n[s],i[s]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let e=0;const t=this.vertices;for(let n=0;n!==t.length;n++){const i=t[n].lengthSquared();i>e&&(e=i)}this.boundingSphereRadius=Math.sqrt(e)}calculateWorldAABB(e,t,n,i){const s=this.vertices;let o,r,l,c,d,h,u=new b;for(let m=0;m<s.length;m++){u.copy(s[m]),t.vmult(u,u),e.vadd(u,u);const g=u;(o===void 0||g.x<o)&&(o=g.x),(c===void 0||g.x>c)&&(c=g.x),(r===void 0||g.y<r)&&(r=g.y),(d===void 0||g.y>d)&&(d=g.y),(l===void 0||g.z<l)&&(l=g.z),(h===void 0||g.z>h)&&(h=g.z)}n.set(o,r,l),i.set(c,d,h)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(e){e===void 0&&(e=new b);const t=this.vertices;for(let n=0;n<t.length;n++)e.vadd(t[n],e);return e.scale(1/t.length,e),e}transformAllPoints(e,t){const n=this.vertices.length,i=this.vertices;if(t){for(let s=0;s<n;s++){const o=i[s];t.vmult(o,o)}for(let s=0;s<this.faceNormals.length;s++){const o=this.faceNormals[s];t.vmult(o,o)}}if(e)for(let s=0;s<n;s++){const o=i[s];o.vadd(e,o)}}pointIsInside(e){const t=this.vertices,n=this.faces,i=this.faceNormals,s=new b;this.getAveragePointLocal(s);for(let o=0;o<this.faces.length;o++){let r=i[o];const l=t[n[o][0]],c=new b;e.vsub(l,c);const d=r.dot(c),h=new b;s.vsub(l,h);const u=r.dot(h);if(d<0&&u>0||d>0&&u<0)return!1}return-1}static project(e,t,n,i,s){const o=e.vertices.length,r=bg;let l=0,c=0;const d=_g,h=e.vertices;d.setZero(),Ze.vectorToLocalFrame(n,i,t,r),Ze.pointToLocalFrame(n,i,d,d);const u=d.dot(r);c=l=h[0].dot(r);for(let m=1;m<o;m++){const g=h[m].dot(r);g>l&&(l=g),g<c&&(c=g)}if(c-=u,l-=u,c>l){const m=c;c=l,l=m}s[0]=l,s[1]=c}}const er=[],tr=[];new b;const bg=new b,_g=new b;class go extends _e{constructor(e){super({type:_e.types.BOX}),this.halfExtents=e,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const e=this.halfExtents.x,t=this.halfExtents.y,n=this.halfExtents.z,i=b,s=[new i(-e,-t,-n),new i(e,-t,-n),new i(e,t,-n),new i(-e,t,-n),new i(-e,-t,n),new i(e,-t,n),new i(e,t,n),new i(-e,t,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],r=[new i(0,0,1),new i(0,1,0),new i(1,0,0)],l=new rs({vertices:s,faces:o,axes:r});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(e,t){return t===void 0&&(t=new b),go.calculateInertia(this.halfExtents,e,t),t}static calculateInertia(e,t,n){const i=e;n.x=1/12*t*(2*i.y*2*i.y+2*i.z*2*i.z),n.y=1/12*t*(2*i.x*2*i.x+2*i.z*2*i.z),n.z=1/12*t*(2*i.y*2*i.y+2*i.x*2*i.x)}getSideNormals(e,t){const n=e,i=this.halfExtents;if(n[0].set(i.x,0,0),n[1].set(0,i.y,0),n[2].set(0,0,i.z),n[3].set(-i.x,0,0),n[4].set(0,-i.y,0),n[5].set(0,0,-i.z),t!==void 0)for(let s=0;s!==n.length;s++)t.vmult(n[s],n[s]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(e,t,n){const i=this.halfExtents,s=[[i.x,i.y,i.z],[-i.x,i.y,i.z],[-i.x,-i.y,i.z],[-i.x,-i.y,-i.z],[i.x,-i.y,-i.z],[i.x,i.y,-i.z],[-i.x,i.y,-i.z],[i.x,-i.y,i.z]];for(let o=0;o<s.length;o++)kn.set(s[o][0],s[o][1],s[o][2]),t.vmult(kn,kn),e.vadd(kn,kn),n(kn.x,kn.y,kn.z)}calculateWorldAABB(e,t,n,i){const s=this.halfExtents;dn[0].set(s.x,s.y,s.z),dn[1].set(-s.x,s.y,s.z),dn[2].set(-s.x,-s.y,s.z),dn[3].set(-s.x,-s.y,-s.z),dn[4].set(s.x,-s.y,-s.z),dn[5].set(s.x,s.y,-s.z),dn[6].set(-s.x,s.y,-s.z),dn[7].set(s.x,-s.y,s.z);const o=dn[0];t.vmult(o,o),e.vadd(o,o),i.copy(o),n.copy(o);for(let r=1;r<8;r++){const l=dn[r];t.vmult(l,l),e.vadd(l,l);const c=l.x,d=l.y,h=l.z;c>i.x&&(i.x=c),d>i.y&&(i.y=d),h>i.z&&(i.z=h),c<n.x&&(n.x=c),d<n.y&&(n.y=d),h<n.z&&(n.z=h)}}}const kn=new b,dn=[new b,new b,new b,new b,new b,new b,new b,new b],Lr={DYNAMIC:1,STATIC:2,KINEMATIC:4},Ir={AWAKE:0,SLEEPY:1,SLEEPING:2};class ce extends Pc{constructor(e){e===void 0&&(e={}),super(),this.id=ce.idCounter++,this.index=-1,this.world=null,this.vlambda=new b,this.collisionFilterGroup=typeof e.collisionFilterGroup=="number"?e.collisionFilterGroup:1,this.collisionFilterMask=typeof e.collisionFilterMask=="number"?e.collisionFilterMask:-1,this.collisionResponse=typeof e.collisionResponse=="boolean"?e.collisionResponse:!0,this.position=new b,this.previousPosition=new b,this.interpolatedPosition=new b,this.initPosition=new b,e.position&&(this.position.copy(e.position),this.previousPosition.copy(e.position),this.interpolatedPosition.copy(e.position),this.initPosition.copy(e.position)),this.velocity=new b,e.velocity&&this.velocity.copy(e.velocity),this.initVelocity=new b,this.force=new b;const t=typeof e.mass=="number"?e.mass:0;this.mass=t,this.invMass=t>0?1/t:0,this.material=e.material||null,this.linearDamping=typeof e.linearDamping=="number"?e.linearDamping:.01,this.type=t<=0?ce.STATIC:ce.DYNAMIC,typeof e.type==typeof ce.STATIC&&(this.type=e.type),this.allowSleep=typeof e.allowSleep<"u"?e.allowSleep:!0,this.sleepState=ce.AWAKE,this.sleepSpeedLimit=typeof e.sleepSpeedLimit<"u"?e.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof e.sleepTimeLimit<"u"?e.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new b,this.quaternion=new ht,this.initQuaternion=new ht,this.previousQuaternion=new ht,this.interpolatedQuaternion=new ht,e.quaternion&&(this.quaternion.copy(e.quaternion),this.initQuaternion.copy(e.quaternion),this.previousQuaternion.copy(e.quaternion),this.interpolatedQuaternion.copy(e.quaternion)),this.angularVelocity=new b,e.angularVelocity&&this.angularVelocity.copy(e.angularVelocity),this.initAngularVelocity=new b,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new b,this.invInertia=new b,this.invInertiaWorld=new an,this.invMassSolve=0,this.invInertiaSolve=new b,this.invInertiaWorldSolve=new an,this.fixedRotation=typeof e.fixedRotation<"u"?e.fixedRotation:!1,this.angularDamping=typeof e.angularDamping<"u"?e.angularDamping:.01,this.linearFactor=new b(1,1,1),e.linearFactor&&this.linearFactor.copy(e.linearFactor),this.angularFactor=new b(1,1,1),e.angularFactor&&this.angularFactor.copy(e.angularFactor),this.aabb=new Xt,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new b,this.isTrigger=!!e.isTrigger,e.shape&&this.addShape(e.shape),this.updateMassProperties()}wakeUp(){const e=this.sleepState;this.sleepState=ce.AWAKE,this.wakeUpAfterNarrowphase=!1,e===ce.SLEEPING&&this.dispatchEvent(ce.wakeupEvent)}sleep(){this.sleepState=ce.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(e){if(this.allowSleep){const t=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),i=this.sleepSpeedLimit**2;t===ce.AWAKE&&n<i?(this.sleepState=ce.SLEEPY,this.timeLastSleepy=e,this.dispatchEvent(ce.sleepyEvent)):t===ce.SLEEPY&&n>i?this.wakeUp():t===ce.SLEEPY&&e-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(ce.sleepEvent))}}updateSolveMassProperties(){this.sleepState===ce.SLEEPING||this.type===ce.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(e,t){return t===void 0&&(t=new b),e.vsub(this.position,t),this.quaternion.conjugate().vmult(t,t),t}vectorToLocalFrame(e,t){return t===void 0&&(t=new b),this.quaternion.conjugate().vmult(e,t),t}pointToWorldFrame(e,t){return t===void 0&&(t=new b),this.quaternion.vmult(e,t),t.vadd(this.position,t),t}vectorToWorldFrame(e,t){return t===void 0&&(t=new b),this.quaternion.vmult(e,t),t}addShape(e,t,n){const i=new b,s=new ht;return t&&i.copy(t),n&&s.copy(n),this.shapes.push(e),this.shapeOffsets.push(i),this.shapeOrientations.push(s),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=this,this}removeShape(e){const t=this.shapes.indexOf(e);return t===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(t,1),this.shapeOffsets.splice(t,1),this.shapeOrientations.splice(t,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=null,this)}updateBoundingRadius(){const e=this.shapes,t=this.shapeOffsets,n=e.length;let i=0;for(let s=0;s!==n;s++){const o=e[s];o.updateBoundingSphereRadius();const r=t[s].length(),l=o.boundingSphereRadius;r+l>i&&(i=r+l)}this.boundingRadius=i}updateAABB(){const e=this.shapes,t=this.shapeOffsets,n=this.shapeOrientations,i=e.length,s=Mg,o=wg,r=this.quaternion,l=this.aabb,c=Sg;for(let d=0;d!==i;d++){const h=e[d];r.vmult(t[d],s),s.vadd(this.position,s),r.mult(n[d],o),h.calculateWorldAABB(s,o,c.lowerBound,c.upperBound),d===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(e){const t=this.invInertia;if(!(t.x===t.y&&t.y===t.z&&!e)){const n=Eg,i=Tg;n.setRotationFromQuaternion(this.quaternion),n.transpose(i),n.scale(t,n),n.mmult(i,this.invInertiaWorld)}}applyForce(e,t){if(t===void 0&&(t=new b),this.type!==ce.DYNAMIC)return;this.sleepState===ce.SLEEPING&&this.wakeUp();const n=Cg;t.cross(e,n),this.force.vadd(e,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(e,t){if(t===void 0&&(t=new b),this.type!==ce.DYNAMIC)return;const n=Ag,i=Rg;this.vectorToWorldFrame(e,n),this.vectorToWorldFrame(t,i),this.applyForce(n,i)}applyTorque(e){this.type===ce.DYNAMIC&&(this.sleepState===ce.SLEEPING&&this.wakeUp(),this.torque.vadd(e,this.torque))}applyImpulse(e,t){if(t===void 0&&(t=new b),this.type!==ce.DYNAMIC)return;this.sleepState===ce.SLEEPING&&this.wakeUp();const n=t,i=Lg;i.copy(e),i.scale(this.invMass,i),this.velocity.vadd(i,this.velocity);const s=Ig;n.cross(e,s),this.invInertiaWorld.vmult(s,s),this.angularVelocity.vadd(s,this.angularVelocity)}applyLocalImpulse(e,t){if(t===void 0&&(t=new b),this.type!==ce.DYNAMIC)return;const n=Pg,i=Dg;this.vectorToWorldFrame(e,n),this.vectorToWorldFrame(t,i),this.applyImpulse(n,i)}updateMassProperties(){const e=Fg;this.invMass=this.mass>0?1/this.mass:0;const t=this.inertia,n=this.fixedRotation;this.updateAABB(),e.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),go.calculateInertia(e,this.mass,t),this.invInertia.set(t.x>0&&!n?1/t.x:0,t.y>0&&!n?1/t.y:0,t.z>0&&!n?1/t.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(e,t){const n=new b;return e.vsub(this.position,n),this.angularVelocity.cross(n,t),this.velocity.vadd(t,t),t}integrate(e,t,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===ce.DYNAMIC||this.type===ce.KINEMATIC)||this.sleepState===ce.SLEEPING)return;const i=this.velocity,s=this.angularVelocity,o=this.position,r=this.force,l=this.torque,c=this.quaternion,d=this.invMass,h=this.invInertiaWorld,u=this.linearFactor,m=d*e;i.x+=r.x*m*u.x,i.y+=r.y*m*u.y,i.z+=r.z*m*u.z;const g=h.elements,v=this.angularFactor,f=l.x*v.x,p=l.y*v.y,y=l.z*v.z;s.x+=e*(g[0]*f+g[1]*p+g[2]*y),s.y+=e*(g[3]*f+g[4]*p+g[5]*y),s.z+=e*(g[6]*f+g[7]*p+g[8]*y),o.x+=i.x*e,o.y+=i.y*e,o.z+=i.z*e,c.integrate(this.angularVelocity,e,this.angularFactor,c),t&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}ce.idCounter=0;ce.COLLIDE_EVENT_NAME="collide";ce.DYNAMIC=Lr.DYNAMIC;ce.STATIC=Lr.STATIC;ce.KINEMATIC=Lr.KINEMATIC;ce.AWAKE=Ir.AWAKE;ce.SLEEPY=Ir.SLEEPY;ce.SLEEPING=Ir.SLEEPING;ce.wakeupEvent={type:"wakeup"};ce.sleepyEvent={type:"sleepy"};ce.sleepEvent={type:"sleep"};const Mg=new b,wg=new ht,Sg=new Xt,Eg=new an,Tg=new an;new an;const Cg=new b,Ag=new b,Rg=new b,Lg=new b,Ig=new b,Pg=new b,Dg=new b,Fg=new b;class Ng{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(e,t,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(e,t){return!(!(e.collisionFilterGroup&t.collisionFilterMask)||!(t.collisionFilterGroup&e.collisionFilterMask)||(e.type&ce.STATIC||e.sleepState===ce.SLEEPING)&&(t.type&ce.STATIC||t.sleepState===ce.SLEEPING))}intersectionTest(e,t,n,i){this.useBoundingBoxes?this.doBoundingBoxBroadphase(e,t,n,i):this.doBoundingSphereBroadphase(e,t,n,i)}doBoundingSphereBroadphase(e,t,n,i){const s=Ug;t.position.vsub(e.position,s);const o=(e.boundingRadius+t.boundingRadius)**2;s.lengthSquared()<o&&(n.push(e),i.push(t))}doBoundingBoxBroadphase(e,t,n,i){e.aabbNeedsUpdate&&e.updateAABB(),t.aabbNeedsUpdate&&t.updateAABB(),e.aabb.overlaps(t.aabb)&&(n.push(e),i.push(t))}makePairsUnique(e,t){const n=Bg,i=Og,s=kg,o=e.length;for(let r=0;r!==o;r++)i[r]=e[r],s[r]=t[r];e.length=0,t.length=0;for(let r=0;r!==o;r++){const l=i[r].id,c=s[r].id,d=l<c?`${l},${c}`:`${c},${l}`;n[d]=r,n.keys.push(d)}for(let r=0;r!==n.keys.length;r++){const l=n.keys.pop(),c=n[l];e.push(i[c]),t.push(s[c]),delete n[l]}}setWorld(e){}static boundingSphereCheck(e,t){const n=new b;e.position.vsub(t.position,n);const i=e.shapes[0],s=t.shapes[0];return Math.pow(i.boundingSphereRadius+s.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(e,t,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const Ug=new b;new b;new ht;new b;const Bg={keys:[]},Og=[],kg=[];new b;new b;new b;class zg extends Ng{constructor(){super()}collisionPairs(e,t,n){const i=e.bodies,s=i.length;let o,r;for(let l=0;l!==s;l++)for(let c=0;c!==l;c++)o=i[l],r=i[c],this.needBroadphaseCollision(o,r)&&this.intersectionTest(o,r,t,n)}aabbQuery(e,t,n){n===void 0&&(n=[]);for(let i=0;i<e.bodies.length;i++){const s=e.bodies[i];s.aabbNeedsUpdate&&s.updateAABB(),s.aabb.overlaps(t)&&n.push(s)}return n}}class lo{constructor(){this.rayFromWorld=new b,this.rayToWorld=new b,this.hitNormalWorld=new b,this.hitPointWorld=new b,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(e,t,n,i,s,o,r){this.rayFromWorld.copy(e),this.rayToWorld.copy(t),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(i),this.shape=s,this.body=o,this.distance=r}}let Dc,Fc,Nc,Uc,Bc,Oc,kc;const Pr={CLOSEST:1,ANY:2,ALL:4};Dc=_e.types.SPHERE;Fc=_e.types.PLANE;Nc=_e.types.BOX;Uc=_e.types.CYLINDER;Bc=_e.types.CONVEXPOLYHEDRON;Oc=_e.types.HEIGHTFIELD;kc=_e.types.TRIMESH;class dt{get[Dc](){return this._intersectSphere}get[Fc](){return this._intersectPlane}get[Nc](){return this._intersectBox}get[Uc](){return this._intersectConvex}get[Bc](){return this._intersectConvex}get[Oc](){return this._intersectHeightfield}get[kc](){return this._intersectTrimesh}constructor(e,t){e===void 0&&(e=new b),t===void 0&&(t=new b),this.from=e.clone(),this.to=t.clone(),this.direction=new b,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=dt.ANY,this.result=new lo,this.hasHit=!1,this.callback=n=>{}}intersectWorld(e,t){return this.mode=t.mode||dt.ANY,this.result=t.result||new lo,this.skipBackfaces=!!t.skipBackfaces,this.collisionFilterMask=typeof t.collisionFilterMask<"u"?t.collisionFilterMask:-1,this.collisionFilterGroup=typeof t.collisionFilterGroup<"u"?t.collisionFilterGroup:-1,this.checkCollisionResponse=typeof t.checkCollisionResponse<"u"?t.checkCollisionResponse:!0,t.from&&this.from.copy(t.from),t.to&&this.to.copy(t.to),this.callback=t.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(wl),nr.length=0,e.broadphase.aabbQuery(e,wl,nr),this.intersectBodies(nr),this.hasHit}intersectBody(e,t){t&&(this.result=t,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!e.collisionResponse||!(this.collisionFilterGroup&e.collisionFilterMask)||!(e.collisionFilterGroup&this.collisionFilterMask))return;const i=Hg,s=Gg;for(let o=0,r=e.shapes.length;o<r;o++){const l=e.shapes[o];if(!(n&&!l.collisionResponse)&&(e.quaternion.mult(e.shapeOrientations[o],s),e.quaternion.vmult(e.shapeOffsets[o],i),i.vadd(e.position,i),this.intersectShape(l,s,i,e),this.result.shouldStop))break}}intersectBodies(e,t){t&&(this.result=t,this.updateDirection());for(let n=0,i=e.length;!this.result.shouldStop&&n<i;n++)this.intersectBody(e[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(e,t,n,i){const s=this.from;if(nv(s,this.direction,n)>e.boundingSphereRadius)return;const r=this[e.type];r&&r.call(this,e,t,n,i,e)}_intersectBox(e,t,n,i,s){return this._intersectConvex(e.convexPolyhedronRepresentation,t,n,i,s)}_intersectPlane(e,t,n,i,s){const o=this.from,r=this.to,l=this.direction,c=new b(0,0,1);t.vmult(c,c);const d=new b;o.vsub(n,d);const h=d.dot(c);r.vsub(n,d);const u=d.dot(c);if(h*u>0||o.distanceTo(r)<h)return;const m=c.dot(l);if(Math.abs(m)<this.precision)return;const g=new b,v=new b,f=new b;o.vsub(n,g);const p=-c.dot(g)/m;l.scale(p,v),o.vadd(v,f),this.reportIntersection(c,f,s,i,-1)}getAABB(e){const{lowerBound:t,upperBound:n}=e,i=this.to,s=this.from;t.x=Math.min(i.x,s.x),t.y=Math.min(i.y,s.y),t.z=Math.min(i.z,s.z),n.x=Math.max(i.x,s.x),n.y=Math.max(i.y,s.y),n.z=Math.max(i.z,s.z)}_intersectHeightfield(e,t,n,i,s){e.data,e.elementSize;const o=Vg;o.from.copy(this.from),o.to.copy(this.to),Ze.pointToLocalFrame(n,t,o.from,o.from),Ze.pointToLocalFrame(n,t,o.to,o.to),o.updateDirection();const r=Wg;let l,c,d,h;l=c=0,d=h=e.data.length-1;const u=new Xt;o.getAABB(u),e.getIndexOfPosition(u.lowerBound.x,u.lowerBound.y,r,!0),l=Math.max(l,r[0]),c=Math.max(c,r[1]),e.getIndexOfPosition(u.upperBound.x,u.upperBound.y,r,!0),d=Math.min(d,r[0]+1),h=Math.min(h,r[1]+1);for(let m=l;m<d;m++)for(let g=c;g<h;g++){if(this.result.shouldStop)return;if(e.getAabbAtIndex(m,g,u),!!u.overlapsRay(o)){if(e.getConvexTrianglePillar(m,g,!1),Ze.pointToWorldFrame(n,t,e.pillarOffset,Ws),this._intersectConvex(e.pillarConvex,t,Ws,i,s,Sl),this.result.shouldStop)return;e.getConvexTrianglePillar(m,g,!0),Ze.pointToWorldFrame(n,t,e.pillarOffset,Ws),this._intersectConvex(e.pillarConvex,t,Ws,i,s,Sl)}}}_intersectSphere(e,t,n,i,s){const o=this.from,r=this.to,l=e.radius,c=(r.x-o.x)**2+(r.y-o.y)**2+(r.z-o.z)**2,d=2*((r.x-o.x)*(o.x-n.x)+(r.y-o.y)*(o.y-n.y)+(r.z-o.z)*(o.z-n.z)),h=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,u=d**2-4*c*h,m=$g,g=qg;if(!(u<0))if(u===0)o.lerp(r,u,m),m.vsub(n,g),g.normalize(),this.reportIntersection(g,m,s,i,-1);else{const v=(-d-Math.sqrt(u))/(2*c),f=(-d+Math.sqrt(u))/(2*c);if(v>=0&&v<=1&&(o.lerp(r,v,m),m.vsub(n,g),g.normalize(),this.reportIntersection(g,m,s,i,-1)),this.result.shouldStop)return;f>=0&&f<=1&&(o.lerp(r,f,m),m.vsub(n,g),g.normalize(),this.reportIntersection(g,m,s,i,-1))}}_intersectConvex(e,t,n,i,s,o){const r=Xg,l=El,c=o&&o.faceList||null,d=e.faces,h=e.vertices,u=e.faceNormals,m=this.direction,g=this.from,v=this.to,f=g.distanceTo(v),p=c?c.length:d.length,y=this.result;for(let x=0;!y.shouldStop&&x<p;x++){const _=c?c[x]:x,R=d[_],S=u[_],L=t,q=n;l.copy(h[R[0]]),L.vmult(l,l),l.vadd(q,l),l.vsub(g,l),L.vmult(S,r);const w=m.dot(r);if(Math.abs(w)<this.precision)continue;const E=r.dot(l)/w;if(!(E<0)){m.scale(E,Ut),Ut.vadd(g,Ut),sn.copy(h[R[0]]),L.vmult(sn,sn),q.vadd(sn,sn);for(let G=1;!y.shouldStop&&G<R.length-1;G++){hn.copy(h[R[G]]),un.copy(h[R[G+1]]),L.vmult(hn,hn),L.vmult(un,un),q.vadd(hn,hn),q.vadd(un,un);const J=Ut.distanceTo(g);!(dt.pointInTriangle(Ut,sn,hn,un)||dt.pointInTriangle(Ut,hn,sn,un))||J>f||this.reportIntersection(r,Ut,s,i,_)}}}}_intersectTrimesh(e,t,n,i,s,o){const r=Yg,l=ev,c=tv,d=El,h=jg,u=Kg,m=Zg,g=Qg,v=Jg,f=e.indices;e.vertices;const p=this.from,y=this.to,x=this.direction;c.position.copy(n),c.quaternion.copy(t),Ze.vectorToLocalFrame(n,t,x,h),Ze.pointToLocalFrame(n,t,p,u),Ze.pointToLocalFrame(n,t,y,m),m.x*=e.scale.x,m.y*=e.scale.y,m.z*=e.scale.z,u.x*=e.scale.x,u.y*=e.scale.y,u.z*=e.scale.z,m.vsub(u,h),h.normalize();const _=u.distanceSquared(m);e.tree.rayQuery(this,c,l);for(let R=0,S=l.length;!this.result.shouldStop&&R!==S;R++){const L=l[R];e.getNormal(L,r),e.getVertex(f[L*3],sn),sn.vsub(u,d);const q=h.dot(r),w=r.dot(d)/q;if(w<0)continue;h.scale(w,Ut),Ut.vadd(u,Ut),e.getVertex(f[L*3+1],hn),e.getVertex(f[L*3+2],un);const E=Ut.distanceSquared(u);!(dt.pointInTriangle(Ut,hn,sn,un)||dt.pointInTriangle(Ut,sn,hn,un))||E>_||(Ze.vectorToWorldFrame(t,r,v),Ze.pointToWorldFrame(n,t,Ut,g),this.reportIntersection(v,g,s,i,L))}l.length=0}reportIntersection(e,t,n,i,s){const o=this.from,r=this.to,l=o.distanceTo(t),c=this.result;if(!(this.skipBackfaces&&e.dot(this.direction)>0))switch(c.hitFaceIndex=typeof s<"u"?s:-1,this.mode){case dt.ALL:this.hasHit=!0,c.set(o,r,e,t,n,i,l),c.hasHit=!0,this.callback(c);break;case dt.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,r,e,t,n,i,l));break;case dt.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,r,e,t,n,i,l),c.shouldStop=!0;break}}static pointInTriangle(e,t,n,i){i.vsub(t,ri),n.vsub(t,Qi),e.vsub(t,ir);const s=ri.dot(ri),o=ri.dot(Qi),r=ri.dot(ir),l=Qi.dot(Qi),c=Qi.dot(ir);let d,h;return(d=l*r-o*c)>=0&&(h=s*c-o*r)>=0&&d+h<s*l-o*o}}dt.CLOSEST=Pr.CLOSEST;dt.ANY=Pr.ANY;dt.ALL=Pr.ALL;const wl=new Xt,nr=[],Qi=new b,ir=new b,Hg=new b,Gg=new ht,Ut=new b,sn=new b,hn=new b,un=new b;new b;new lo;const Sl={faceList:[0]},Ws=new b,Vg=new dt,Wg=[],$g=new b,qg=new b,Xg=new b;new b;new b;const El=new b,Yg=new b,jg=new b,Kg=new b,Zg=new b,Jg=new b,Qg=new b;new Xt;const ev=[],tv=new Ze,ri=new b,$s=new b;function nv(a,e,t){t.vsub(a,ri);const n=ri.dot(e);return e.scale(n,$s),$s.vadd(a,$s),t.distanceTo($s)}class iv{static defaults(e,t){e===void 0&&(e={});for(let n in t)n in e||(e[n]=t[n]);return e}}class Tl{constructor(){this.spatial=new b,this.rotational=new b}multiplyElement(e){return e.spatial.dot(this.spatial)+e.rotational.dot(this.rotational)}multiplyVectors(e,t){return e.dot(this.spatial)+t.dot(this.rotational)}}class fs{constructor(e,t,n,i){n===void 0&&(n=-1e6),i===void 0&&(i=1e6),this.id=fs.idCounter++,this.minForce=n,this.maxForce=i,this.bi=e,this.bj=t,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new Tl,this.jacobianElementB=new Tl,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(e,t,n){const i=t,s=e,o=n;this.a=4/(o*(1+4*i)),this.b=4*i/(1+4*i),this.eps=4/(o*o*s*(1+4*i))}computeB(e,t,n){const i=this.computeGW(),s=this.computeGq(),o=this.computeGiMf();return-s*e-i*t-o*n}computeGq(){const e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,i=this.bj,s=n.position,o=i.position;return e.spatial.dot(s)+t.spatial.dot(o)}computeGW(){const e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,i=this.bj,s=n.velocity,o=i.velocity,r=n.angularVelocity,l=i.angularVelocity;return e.multiplyVectors(s,r)+t.multiplyVectors(o,l)}computeGWlambda(){const e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,i=this.bj,s=n.vlambda,o=i.vlambda,r=n.wlambda,l=i.wlambda;return e.multiplyVectors(s,r)+t.multiplyVectors(o,l)}computeGiMf(){const e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,i=this.bj,s=n.force,o=n.torque,r=i.force,l=i.torque,c=n.invMassSolve,d=i.invMassSolve;return s.scale(c,Cl),r.scale(d,Al),n.invInertiaWorldSolve.vmult(o,Rl),i.invInertiaWorldSolve.vmult(l,Ll),e.multiplyVectors(Cl,Rl)+t.multiplyVectors(Al,Ll)}computeGiMGt(){const e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,i=this.bj,s=n.invMassSolve,o=i.invMassSolve,r=n.invInertiaWorldSolve,l=i.invInertiaWorldSolve;let c=s+o;return r.vmult(e.rotational,qs),c+=qs.dot(e.rotational),l.vmult(t.rotational,qs),c+=qs.dot(t.rotational),c}addToWlambda(e){const t=this.jacobianElementA,n=this.jacobianElementB,i=this.bi,s=this.bj,o=sv;i.vlambda.addScaledVector(i.invMassSolve*e,t.spatial,i.vlambda),s.vlambda.addScaledVector(s.invMassSolve*e,n.spatial,s.vlambda),i.invInertiaWorldSolve.vmult(t.rotational,o),i.wlambda.addScaledVector(e,o,i.wlambda),s.invInertiaWorldSolve.vmult(n.rotational,o),s.wlambda.addScaledVector(e,o,s.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}fs.idCounter=0;const Cl=new b,Al=new b,Rl=new b,Ll=new b,qs=new b,sv=new b;class ov extends fs{constructor(e,t,n){n===void 0&&(n=1e6),super(e,t,0,n),this.restitution=0,this.ri=new b,this.rj=new b,this.ni=new b}computeB(e){const t=this.a,n=this.b,i=this.bi,s=this.bj,o=this.ri,r=this.rj,l=rv,c=av,d=i.velocity,h=i.angularVelocity;i.force,i.torque;const u=s.velocity,m=s.angularVelocity;s.force,s.torque;const g=lv,v=this.jacobianElementA,f=this.jacobianElementB,p=this.ni;o.cross(p,l),r.cross(p,c),p.negate(v.spatial),l.negate(v.rotational),f.spatial.copy(p),f.rotational.copy(c),g.copy(s.position),g.vadd(r,g),g.vsub(i.position,g),g.vsub(o,g);const y=p.dot(g),x=this.restitution+1,_=x*u.dot(p)-x*d.dot(p)+m.dot(c)-h.dot(l),R=this.computeGiMf();return-y*t-_*n-e*R}getImpactVelocityAlongNormal(){const e=cv,t=dv,n=hv,i=uv,s=pv;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,i),this.bi.getVelocityAtWorldPoint(n,e),this.bj.getVelocityAtWorldPoint(i,t),e.vsub(t,s),this.ni.dot(s)}}const rv=new b,av=new b,lv=new b,cv=new b,dv=new b,hv=new b,uv=new b,pv=new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;class Il extends fs{constructor(e,t,n){super(e,t,-n,n),this.ri=new b,this.rj=new b,this.t=new b}computeB(e){this.a;const t=this.b;this.bi,this.bj;const n=this.ri,i=this.rj,s=fv,o=mv,r=this.t;n.cross(r,s),i.cross(r,o);const l=this.jacobianElementA,c=this.jacobianElementB;r.negate(l.spatial),s.negate(l.rotational),c.spatial.copy(r),c.rotational.copy(o);const d=this.computeGW(),h=this.computeGiMf();return-d*t-e*h}}const fv=new b,mv=new b;class ui{constructor(e,t,n){n=iv.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=ui.idCounter++,this.materials=[e,t],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}ui.idCounter=0;class pi{constructor(e){e===void 0&&(e={});let t="";typeof e=="string"&&(t=e,e={}),this.name=t,this.id=pi.idCounter++,this.friction=typeof e.friction<"u"?e.friction:-1,this.restitution=typeof e.restitution<"u"?e.restitution:-1}}pi.idCounter=0;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new dt;new b;new b;new b;new b(1,0,0),new b(0,1,0),new b(0,0,1);new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;class ei extends _e{constructor(){super({type:_e.types.PLANE}),this.worldNormal=new b,this.worldNormalNeedsUpdate=!0,this.boundingSphereRadius=Number.MAX_VALUE}computeWorldNormal(e){const t=this.worldNormal;t.set(0,0,1),e.vmult(t,t),this.worldNormalNeedsUpdate=!1}calculateLocalInertia(e,t){return t===void 0&&(t=new b),t}volume(){return Number.MAX_VALUE}calculateWorldAABB(e,t,n,i){Sn.set(0,0,1),t.vmult(Sn,Sn);const s=Number.MAX_VALUE;n.set(-s,-s,-s),i.set(s,s,s),Sn.x===1?i.x=e.x:Sn.x===-1&&(n.x=e.x),Sn.y===1?i.y=e.y:Sn.y===-1&&(n.y=e.y),Sn.z===1?i.z=e.z:Sn.z===-1&&(n.z=e.z)}updateBoundingSphereRadius(){this.boundingSphereRadius=Number.MAX_VALUE}}const Sn=new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new Xt;new b;new Xt;new b;new b;new b;new b;new b;new b;new b;new Xt;new b;new Ze;new Xt;class gv{constructor(){this.equations=[]}solve(e,t){return 0}addEquation(e){e.enabled&&!e.bi.isTrigger&&!e.bj.isTrigger&&this.equations.push(e)}removeEquation(e){const t=this.equations,n=t.indexOf(e);n!==-1&&t.splice(n,1)}removeAllEquations(){this.equations.length=0}}class vv extends gv{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(e,t){let n=0;const i=this.iterations,s=this.tolerance*this.tolerance,o=this.equations,r=o.length,l=t.bodies,c=l.length,d=e;let h,u,m,g,v,f;if(r!==0)for(let _=0;_!==c;_++)l[_].updateSolveMassProperties();const p=xv,y=bv,x=yv;p.length=r,y.length=r,x.length=r;for(let _=0;_!==r;_++){const R=o[_];x[_]=0,y[_]=R.computeB(d),p[_]=1/R.computeC()}if(r!==0){for(let S=0;S!==c;S++){const L=l[S],q=L.vlambda,w=L.wlambda;q.set(0,0,0),w.set(0,0,0)}for(n=0;n!==i;n++){g=0;for(let S=0;S!==r;S++){const L=o[S];h=y[S],u=p[S],f=x[S],v=L.computeGWlambda(),m=u*(h-v-L.eps*f),f+m<L.minForce?m=L.minForce-f:f+m>L.maxForce&&(m=L.maxForce-f),x[S]+=m,g+=m>0?m:-m,L.addToWlambda(m)}if(g*g<s)break}for(let S=0;S!==c;S++){const L=l[S],q=L.velocity,w=L.angularVelocity;L.vlambda.vmul(L.linearFactor,L.vlambda),q.vadd(L.vlambda,q),L.wlambda.vmul(L.angularFactor,L.wlambda),w.vadd(L.wlambda,w)}let _=o.length;const R=1/d;for(;_--;)o[_].multiplier=x[_]*R}return n}}const yv=[],xv=[],bv=[];class _v{constructor(){this.objects=[],this.type=Object}release(){const e=arguments.length;for(let t=0;t!==e;t++)this.objects.push(t<0||arguments.length<=t?void 0:arguments[t]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(e){const t=this.objects;for(;t.length>e;)t.pop();for(;t.length<e;)t.push(this.constructObject());return this}}class Mv extends _v{constructor(){super(...arguments),this.type=b}constructObject(){return new b}}const it={sphereSphere:_e.types.SPHERE,spherePlane:_e.types.SPHERE|_e.types.PLANE,boxBox:_e.types.BOX|_e.types.BOX,sphereBox:_e.types.SPHERE|_e.types.BOX,planeBox:_e.types.PLANE|_e.types.BOX,convexConvex:_e.types.CONVEXPOLYHEDRON,sphereConvex:_e.types.SPHERE|_e.types.CONVEXPOLYHEDRON,planeConvex:_e.types.PLANE|_e.types.CONVEXPOLYHEDRON,boxConvex:_e.types.BOX|_e.types.CONVEXPOLYHEDRON,sphereHeightfield:_e.types.SPHERE|_e.types.HEIGHTFIELD,boxHeightfield:_e.types.BOX|_e.types.HEIGHTFIELD,convexHeightfield:_e.types.CONVEXPOLYHEDRON|_e.types.HEIGHTFIELD,sphereParticle:_e.types.PARTICLE|_e.types.SPHERE,planeParticle:_e.types.PLANE|_e.types.PARTICLE,boxParticle:_e.types.BOX|_e.types.PARTICLE,convexParticle:_e.types.PARTICLE|_e.types.CONVEXPOLYHEDRON,cylinderCylinder:_e.types.CYLINDER,sphereCylinder:_e.types.SPHERE|_e.types.CYLINDER,planeCylinder:_e.types.PLANE|_e.types.CYLINDER,boxCylinder:_e.types.BOX|_e.types.CYLINDER,convexCylinder:_e.types.CONVEXPOLYHEDRON|_e.types.CYLINDER,heightfieldCylinder:_e.types.HEIGHTFIELD|_e.types.CYLINDER,particleCylinder:_e.types.PARTICLE|_e.types.CYLINDER,sphereTrimesh:_e.types.SPHERE|_e.types.TRIMESH,planeTrimesh:_e.types.PLANE|_e.types.TRIMESH};class wv{get[it.sphereSphere](){return this.sphereSphere}get[it.spherePlane](){return this.spherePlane}get[it.boxBox](){return this.boxBox}get[it.sphereBox](){return this.sphereBox}get[it.planeBox](){return this.planeBox}get[it.convexConvex](){return this.convexConvex}get[it.sphereConvex](){return this.sphereConvex}get[it.planeConvex](){return this.planeConvex}get[it.boxConvex](){return this.boxConvex}get[it.sphereHeightfield](){return this.sphereHeightfield}get[it.boxHeightfield](){return this.boxHeightfield}get[it.convexHeightfield](){return this.convexHeightfield}get[it.sphereParticle](){return this.sphereParticle}get[it.planeParticle](){return this.planeParticle}get[it.boxParticle](){return this.boxParticle}get[it.convexParticle](){return this.convexParticle}get[it.cylinderCylinder](){return this.convexConvex}get[it.sphereCylinder](){return this.sphereConvex}get[it.planeCylinder](){return this.planeConvex}get[it.boxCylinder](){return this.boxConvex}get[it.convexCylinder](){return this.convexConvex}get[it.heightfieldCylinder](){return this.heightfieldCylinder}get[it.particleCylinder](){return this.particleCylinder}get[it.sphereTrimesh](){return this.sphereTrimesh}get[it.planeTrimesh](){return this.planeTrimesh}constructor(e){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new Mv,this.world=e,this.currentContactMaterial=e.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(e,t,n,i,s,o){let r;this.contactPointPool.length?(r=this.contactPointPool.pop(),r.bi=e,r.bj=t):r=new ov(e,t),r.enabled=e.collisionResponse&&t.collisionResponse&&n.collisionResponse&&i.collisionResponse;const l=this.currentContactMaterial;r.restitution=l.restitution,r.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||e.material,d=i.material||t.material;return c&&d&&c.restitution>=0&&d.restitution>=0&&(r.restitution=c.restitution*d.restitution),r.si=s||n,r.sj=o||i,r}createFrictionEquationsFromContact(e,t){const n=e.bi,i=e.bj,s=e.si,o=e.sj,r=this.world,l=this.currentContactMaterial;let c=l.friction;const d=s.material||n.material,h=o.material||i.material;if(d&&h&&d.friction>=0&&h.friction>=0&&(c=d.friction*h.friction),c>0){const u=c*(r.frictionGravity||r.gravity).length();let m=n.invMass+i.invMass;m>0&&(m=1/m);const g=this.frictionEquationPool,v=g.length?g.pop():new Il(n,i,u*m),f=g.length?g.pop():new Il(n,i,u*m);return v.bi=f.bi=n,v.bj=f.bj=i,v.minForce=f.minForce=-u*m,v.maxForce=f.maxForce=u*m,v.ri.copy(e.ri),v.rj.copy(e.rj),f.ri.copy(e.ri),f.rj.copy(e.rj),e.ni.tangents(v.t,f.t),v.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,r.dt),f.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,r.dt),v.enabled=f.enabled=e.enabled,t.push(v,f),!0}return!1}createFrictionFromAverage(e){let t=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(t,this.frictionResult)||e===1)return;const n=this.frictionResult[this.frictionResult.length-2],i=this.frictionResult[this.frictionResult.length-1];ti.setZero(),Pi.setZero(),Di.setZero();const s=t.bi;t.bj;for(let r=0;r!==e;r++)t=this.result[this.result.length-1-r],t.bi!==s?(ti.vadd(t.ni,ti),Pi.vadd(t.ri,Pi),Di.vadd(t.rj,Di)):(ti.vsub(t.ni,ti),Pi.vadd(t.rj,Pi),Di.vadd(t.ri,Di));const o=1/e;Pi.scale(o,n.ri),Di.scale(o,n.rj),i.ri.copy(n.ri),i.rj.copy(n.rj),ti.normalize(),ti.tangents(n.t,i.t)}getContacts(e,t,n,i,s,o,r){this.contactPointPool=s,this.frictionEquationPool=r,this.result=i,this.frictionResult=o;const l=Tv,c=Cv,d=Sv,h=Ev;for(let u=0,m=e.length;u!==m;u++){const g=e[u],v=t[u];let f=null;g.material&&v.material&&(f=n.getContactMaterial(g.material,v.material)||null);const p=g.type&ce.KINEMATIC&&v.type&ce.STATIC||g.type&ce.STATIC&&v.type&ce.KINEMATIC||g.type&ce.KINEMATIC&&v.type&ce.KINEMATIC;for(let y=0;y<g.shapes.length;y++){g.quaternion.mult(g.shapeOrientations[y],l),g.quaternion.vmult(g.shapeOffsets[y],d),d.vadd(g.position,d);const x=g.shapes[y];for(let _=0;_<v.shapes.length;_++){v.quaternion.mult(v.shapeOrientations[_],c),v.quaternion.vmult(v.shapeOffsets[_],h),h.vadd(v.position,h);const R=v.shapes[_];if(!(x.collisionFilterMask&R.collisionFilterGroup&&R.collisionFilterMask&x.collisionFilterGroup)||d.distanceTo(h)>x.boundingSphereRadius+R.boundingSphereRadius)continue;let S=null;x.material&&R.material&&(S=n.getContactMaterial(x.material,R.material)||null),this.currentContactMaterial=S||f||n.defaultContactMaterial;const L=x.type|R.type,q=this[L];if(q){let w=!1;x.type<R.type?w=q.call(this,x,R,d,h,l,c,g,v,x,R,p):w=q.call(this,R,x,h,d,c,l,v,g,x,R,p),w&&p&&(n.shapeOverlapKeeper.set(x.id,R.id),n.bodyOverlapKeeper.set(g.id,v.id))}}}}}sphereSphere(e,t,n,i,s,o,r,l,c,d,h){if(h)return n.distanceSquared(i)<(e.radius+t.radius)**2;const u=this.createContactEquation(r,l,e,t,c,d);i.vsub(n,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.scale(e.radius,u.ri),u.rj.scale(-t.radius,u.rj),u.ri.vadd(n,u.ri),u.ri.vsub(r.position,u.ri),u.rj.vadd(i,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}spherePlane(e,t,n,i,s,o,r,l,c,d,h){const u=this.createContactEquation(r,l,e,t,c,d);if(u.ni.set(0,0,1),o.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.scale(e.radius,u.ri),n.vsub(i,Xs),u.ni.scale(u.ni.dot(Xs),Pl),Xs.vsub(Pl,u.rj),-Xs.dot(u.ni)<=e.radius){if(h)return!0;const m=u.ri,g=u.rj;m.vadd(n,m),m.vsub(r.position,m),g.vadd(i,g),g.vsub(l.position,g),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}}boxBox(e,t,n,i,s,o,r,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t.convexPolyhedronRepresentation,n,i,s,o,r,l,e,t,h)}sphereBox(e,t,n,i,s,o,r,l,c,d,h){const u=this.v3pool,m=Qv;n.vsub(i,Ys),t.getSideNormals(m,o);const g=e.radius;let v=!1;const f=t0,p=n0,y=i0;let x=null,_=0,R=0,S=0,L=null;for(let B=0,te=m.length;B!==te&&v===!1;B++){const Y=Kv;Y.copy(m[B]);const X=Y.length();Y.normalize();const P=Ys.dot(Y);if(P<X+g&&P>0){const C=Zv,V=Jv;C.copy(m[(B+1)%3]),V.copy(m[(B+2)%3]);const z=C.length(),Z=V.length();C.normalize(),V.normalize();const ne=Ys.dot(C),re=Ys.dot(V);if(ne<z&&ne>-z&&re<Z&&re>-Z){const ie=Math.abs(P-X-g);if((L===null||ie<L)&&(L=ie,R=ne,S=re,x=X,f.copy(Y),p.copy(C),y.copy(V),_++,h))return!0}}}if(_){v=!0;const B=this.createContactEquation(r,l,e,t,c,d);f.scale(-g,B.ri),B.ni.copy(f),B.ni.negate(B.ni),f.scale(x,f),p.scale(R,p),f.vadd(p,f),y.scale(S,y),f.vadd(y,B.rj),B.ri.vadd(n,B.ri),B.ri.vsub(r.position,B.ri),B.rj.vadd(i,B.rj),B.rj.vsub(l.position,B.rj),this.result.push(B),this.createFrictionEquationsFromContact(B,this.frictionResult)}let q=u.get();const w=e0;for(let B=0;B!==2&&!v;B++)for(let te=0;te!==2&&!v;te++)for(let Y=0;Y!==2&&!v;Y++)if(q.set(0,0,0),B?q.vadd(m[0],q):q.vsub(m[0],q),te?q.vadd(m[1],q):q.vsub(m[1],q),Y?q.vadd(m[2],q):q.vsub(m[2],q),i.vadd(q,w),w.vsub(n,w),w.lengthSquared()<g*g){if(h)return!0;v=!0;const X=this.createContactEquation(r,l,e,t,c,d);X.ri.copy(w),X.ri.normalize(),X.ni.copy(X.ri),X.ri.scale(g,X.ri),X.rj.copy(q),X.ri.vadd(n,X.ri),X.ri.vsub(r.position,X.ri),X.rj.vadd(i,X.rj),X.rj.vsub(l.position,X.rj),this.result.push(X),this.createFrictionEquationsFromContact(X,this.frictionResult)}u.release(q),q=null;const E=u.get(),G=u.get(),J=u.get(),H=u.get(),I=u.get(),F=m.length;for(let B=0;B!==F&&!v;B++)for(let te=0;te!==F&&!v;te++)if(B%3!==te%3){m[te].cross(m[B],E),E.normalize(),m[B].vadd(m[te],G),J.copy(n),J.vsub(G,J),J.vsub(i,J);const Y=J.dot(E);E.scale(Y,H);let X=0;for(;X===B%3||X===te%3;)X++;I.copy(n),I.vsub(H,I),I.vsub(G,I),I.vsub(i,I);const P=Math.abs(Y),C=I.length();if(P<m[X].length()&&C<g){if(h)return!0;v=!0;const V=this.createContactEquation(r,l,e,t,c,d);G.vadd(H,V.rj),V.rj.copy(V.rj),I.negate(V.ni),V.ni.normalize(),V.ri.copy(V.rj),V.ri.vadd(i,V.ri),V.ri.vsub(n,V.ri),V.ri.normalize(),V.ri.scale(g,V.ri),V.ri.vadd(n,V.ri),V.ri.vsub(r.position,V.ri),V.rj.vadd(i,V.rj),V.rj.vsub(l.position,V.rj),this.result.push(V),this.createFrictionEquationsFromContact(V,this.frictionResult)}}u.release(E,G,J,H,I)}planeBox(e,t,n,i,s,o,r,l,c,d,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,t.convexPolyhedronRepresentation.id=t.id,this.planeConvex(e,t.convexPolyhedronRepresentation,n,i,s,o,r,l,e,t,h)}convexConvex(e,t,n,i,s,o,r,l,c,d,h,u,m){const g=y0;if(!(n.distanceTo(i)>e.boundingSphereRadius+t.boundingSphereRadius)&&e.findSeparatingAxis(t,n,s,i,o,g,u,m)){const v=[],f=x0;e.clipAgainstHull(n,s,t,i,o,g,-100,100,v);let p=0;for(let y=0;y!==v.length;y++){if(h)return!0;const x=this.createContactEquation(r,l,e,t,c,d),_=x.ri,R=x.rj;g.negate(x.ni),v[y].normal.negate(f),f.scale(v[y].depth,f),v[y].point.vadd(f,_),R.copy(v[y].point),_.vsub(n,_),R.vsub(i,R),_.vadd(n,_),_.vsub(r.position,_),R.vadd(i,R),R.vsub(l.position,R),this.result.push(x),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(x,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}}sphereConvex(e,t,n,i,s,o,r,l,c,d,h){const u=this.v3pool;n.vsub(i,s0);const m=t.faceNormals,g=t.faces,v=t.vertices,f=e.radius;let p=!1;for(let y=0;y!==v.length;y++){const x=v[y],_=l0;o.vmult(x,_),i.vadd(_,_);const R=a0;if(_.vsub(n,R),R.lengthSquared()<f*f){if(h)return!0;p=!0;const S=this.createContactEquation(r,l,e,t,c,d);S.ri.copy(R),S.ri.normalize(),S.ni.copy(S.ri),S.ri.scale(f,S.ri),_.vsub(i,S.rj),S.ri.vadd(n,S.ri),S.ri.vsub(r.position,S.ri),S.rj.vadd(i,S.rj),S.rj.vsub(l.position,S.rj),this.result.push(S),this.createFrictionEquationsFromContact(S,this.frictionResult);return}}for(let y=0,x=g.length;y!==x&&p===!1;y++){const _=m[y],R=g[y],S=c0;o.vmult(_,S);const L=d0;o.vmult(v[R[0]],L),L.vadd(i,L);const q=h0;S.scale(-f,q),n.vadd(q,q);const w=u0;q.vsub(L,w);const E=w.dot(S),G=p0;if(n.vsub(L,G),E<0&&G.dot(S)>0){const J=[];for(let H=0,I=R.length;H!==I;H++){const F=u.get();o.vmult(v[R[H]],F),i.vadd(F,F),J.push(F)}if(jv(J,S,n)){if(h)return!0;p=!0;const H=this.createContactEquation(r,l,e,t,c,d);S.scale(-f,H.ri),S.negate(H.ni);const I=u.get();S.scale(-E,I);const F=u.get();S.scale(-f,F),n.vsub(i,H.rj),H.rj.vadd(F,H.rj),H.rj.vadd(I,H.rj),H.rj.vadd(i,H.rj),H.rj.vsub(l.position,H.rj),H.ri.vadd(n,H.ri),H.ri.vsub(r.position,H.ri),u.release(I),u.release(F),this.result.push(H),this.createFrictionEquationsFromContact(H,this.frictionResult);for(let B=0,te=J.length;B!==te;B++)u.release(J[B]);return}else for(let H=0;H!==R.length;H++){const I=u.get(),F=u.get();o.vmult(v[R[(H+1)%R.length]],I),o.vmult(v[R[(H+2)%R.length]],F),i.vadd(I,I),i.vadd(F,F);const B=o0;F.vsub(I,B);const te=r0;B.unit(te);const Y=u.get(),X=u.get();n.vsub(I,X);const P=X.dot(te);te.scale(P,Y),Y.vadd(I,Y);const C=u.get();if(Y.vsub(n,C),P>0&&P*P<B.lengthSquared()&&C.lengthSquared()<f*f){if(h)return!0;const V=this.createContactEquation(r,l,e,t,c,d);Y.vsub(i,V.rj),Y.vsub(n,V.ni),V.ni.normalize(),V.ni.scale(f,V.ri),V.rj.vadd(i,V.rj),V.rj.vsub(l.position,V.rj),V.ri.vadd(n,V.ri),V.ri.vsub(r.position,V.ri),this.result.push(V),this.createFrictionEquationsFromContact(V,this.frictionResult);for(let z=0,Z=J.length;z!==Z;z++)u.release(J[z]);u.release(I),u.release(F),u.release(Y),u.release(C),u.release(X);return}u.release(I),u.release(F),u.release(Y),u.release(C),u.release(X)}for(let H=0,I=J.length;H!==I;H++)u.release(J[H])}}}planeConvex(e,t,n,i,s,o,r,l,c,d,h){const u=f0,m=m0;m.set(0,0,1),s.vmult(m,m);let g=0;const v=g0;for(let f=0;f!==t.vertices.length;f++)if(u.copy(t.vertices[f]),o.vmult(u,u),i.vadd(u,u),u.vsub(n,v),m.dot(v)<=0){if(h)return!0;const y=this.createContactEquation(r,l,e,t,c,d),x=v0;m.scale(m.dot(v),x),u.vsub(x,x),x.vsub(n,y.ri),y.ni.copy(m),u.vsub(i,y.rj),y.ri.vadd(n,y.ri),y.ri.vsub(r.position,y.ri),y.rj.vadd(i,y.rj),y.rj.vsub(l.position,y.rj),this.result.push(y),g++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(y,this.frictionResult)}this.enableFrictionReduction&&g&&this.createFrictionFromAverage(g)}boxConvex(e,t,n,i,s,o,r,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t,n,i,s,o,r,l,e,t,h)}sphereHeightfield(e,t,n,i,s,o,r,l,c,d,h){const u=t.data,m=e.radius,g=t.elementSize,v=I0,f=L0;Ze.pointToLocalFrame(i,o,n,f);let p=Math.floor((f.x-m)/g)-1,y=Math.ceil((f.x+m)/g)+1,x=Math.floor((f.y-m)/g)-1,_=Math.ceil((f.y+m)/g)+1;if(y<0||_<0||p>u.length||x>u[0].length)return;p<0&&(p=0),y<0&&(y=0),x<0&&(x=0),_<0&&(_=0),p>=u.length&&(p=u.length-1),y>=u.length&&(y=u.length-1),_>=u[0].length&&(_=u[0].length-1),x>=u[0].length&&(x=u[0].length-1);const R=[];t.getRectMinMax(p,x,y,_,R);const S=R[0],L=R[1];if(f.z-m>L||f.z+m<S)return;const q=this.result;for(let w=p;w<y;w++)for(let E=x;E<_;E++){const G=q.length;let J=!1;if(t.getConvexTrianglePillar(w,E,!1),Ze.pointToWorldFrame(i,o,t.pillarOffset,v),n.distanceTo(v)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(J=this.sphereConvex(e,t.pillarConvex,n,v,s,o,r,l,e,t,h)),h&&J||(t.getConvexTrianglePillar(w,E,!0),Ze.pointToWorldFrame(i,o,t.pillarOffset,v),n.distanceTo(v)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(J=this.sphereConvex(e,t.pillarConvex,n,v,s,o,r,l,e,t,h)),h&&J))return!0;if(q.length-G>2)return}}boxHeightfield(e,t,n,i,s,o,r,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexHeightfield(e.convexPolyhedronRepresentation,t,n,i,s,o,r,l,e,t,h)}convexHeightfield(e,t,n,i,s,o,r,l,c,d,h){const u=t.data,m=t.elementSize,g=e.boundingSphereRadius,v=A0,f=R0,p=C0;Ze.pointToLocalFrame(i,o,n,p);let y=Math.floor((p.x-g)/m)-1,x=Math.ceil((p.x+g)/m)+1,_=Math.floor((p.y-g)/m)-1,R=Math.ceil((p.y+g)/m)+1;if(x<0||R<0||y>u.length||_>u[0].length)return;y<0&&(y=0),x<0&&(x=0),_<0&&(_=0),R<0&&(R=0),y>=u.length&&(y=u.length-1),x>=u.length&&(x=u.length-1),R>=u[0].length&&(R=u[0].length-1),_>=u[0].length&&(_=u[0].length-1);const S=[];t.getRectMinMax(y,_,x,R,S);const L=S[0],q=S[1];if(!(p.z-g>q||p.z+g<L))for(let w=y;w<x;w++)for(let E=_;E<R;E++){let G=!1;if(t.getConvexTrianglePillar(w,E,!1),Ze.pointToWorldFrame(i,o,t.pillarOffset,v),n.distanceTo(v)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(G=this.convexConvex(e,t.pillarConvex,n,v,s,o,r,l,null,null,h,f,null)),h&&G||(t.getConvexTrianglePillar(w,E,!0),Ze.pointToWorldFrame(i,o,t.pillarOffset,v),n.distanceTo(v)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(G=this.convexConvex(e,t.pillarConvex,n,v,s,o,r,l,null,null,h,f,null)),h&&G))return!0}}sphereParticle(e,t,n,i,s,o,r,l,c,d,h){const u=w0;if(u.set(0,0,1),i.vsub(n,u),u.lengthSquared()<=e.radius*e.radius){if(h)return!0;const g=this.createContactEquation(l,r,t,e,c,d);u.normalize(),g.rj.copy(u),g.rj.scale(e.radius,g.rj),g.ni.copy(u),g.ni.negate(g.ni),g.ri.set(0,0,0),this.result.push(g),this.createFrictionEquationsFromContact(g,this.frictionResult)}}planeParticle(e,t,n,i,s,o,r,l,c,d,h){const u=b0;u.set(0,0,1),r.quaternion.vmult(u,u);const m=_0;if(i.vsub(r.position,m),u.dot(m)<=0){if(h)return!0;const v=this.createContactEquation(l,r,t,e,c,d);v.ni.copy(u),v.ni.negate(v.ni),v.ri.set(0,0,0);const f=M0;u.scale(u.dot(i),f),i.vsub(f,f),v.rj.copy(f),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}boxParticle(e,t,n,i,s,o,r,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexParticle(e.convexPolyhedronRepresentation,t,n,i,s,o,r,l,e,t,h)}convexParticle(e,t,n,i,s,o,r,l,c,d,h){let u=-1;const m=E0,g=T0;let v=null;const f=S0;if(f.copy(i),f.vsub(n,f),s.conjugate(Dl),Dl.vmult(f,f),e.pointIsInside(f)){e.worldVerticesNeedsUpdate&&e.computeWorldVertices(n,s),e.worldFaceNormalsNeedsUpdate&&e.computeWorldFaceNormals(s);for(let p=0,y=e.faces.length;p!==y;p++){const x=[e.worldVertices[e.faces[p][0]]],_=e.worldFaceNormals[p];i.vsub(x[0],Fl);const R=-_.dot(Fl);if(v===null||Math.abs(R)<Math.abs(v)){if(h)return!0;v=R,u=p,m.copy(_)}}if(u!==-1){const p=this.createContactEquation(l,r,t,e,c,d);m.scale(v,g),g.vadd(i,g),g.vsub(n,g),p.rj.copy(g),m.negate(p.ni),p.ri.set(0,0,0);const y=p.ri,x=p.rj;y.vadd(i,y),y.vsub(l.position,y),x.vadd(n,x),x.vsub(r.position,x),this.result.push(p),this.createFrictionEquationsFromContact(p,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(e,t,n,i,s,o,r,l,c,d,h){return this.convexHeightfield(t,e,i,n,o,s,l,r,c,d,h)}particleCylinder(e,t,n,i,s,o,r,l,c,d,h){return this.convexParticle(t,e,i,n,o,s,l,r,c,d,h)}sphereTrimesh(e,t,n,i,s,o,r,l,c,d,h){const u=Nv,m=Uv,g=Bv,v=Ov,f=kv,p=zv,y=Wv,x=Fv,_=Pv,R=$v;Ze.pointToLocalFrame(i,o,n,f);const S=e.radius;y.lowerBound.set(f.x-S,f.y-S,f.z-S),y.upperBound.set(f.x+S,f.y+S,f.z+S),t.getTrianglesInAABB(y,R);const L=Dv,q=e.radius*e.radius;for(let H=0;H<R.length;H++)for(let I=0;I<3;I++)if(t.getVertex(t.indices[R[H]*3+I],L),L.vsub(f,_),_.lengthSquared()<=q){if(x.copy(L),Ze.pointToWorldFrame(i,o,x,L),L.vsub(n,_),h)return!0;let F=this.createContactEquation(r,l,e,t,c,d);F.ni.copy(_),F.ni.normalize(),F.ri.copy(F.ni),F.ri.scale(e.radius,F.ri),F.ri.vadd(n,F.ri),F.ri.vsub(r.position,F.ri),F.rj.copy(L),F.rj.vsub(l.position,F.rj),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}for(let H=0;H<R.length;H++)for(let I=0;I<3;I++){t.getVertex(t.indices[R[H]*3+I],u),t.getVertex(t.indices[R[H]*3+(I+1)%3],m),m.vsub(u,g),f.vsub(m,p);const F=p.dot(g);f.vsub(u,p);let B=p.dot(g);if(B>0&&F<0&&(f.vsub(u,p),v.copy(g),v.normalize(),B=p.dot(v),v.scale(B,p),p.vadd(u,p),p.distanceTo(f)<e.radius)){if(h)return!0;const Y=this.createContactEquation(r,l,e,t,c,d);p.vsub(f,Y.ni),Y.ni.normalize(),Y.ni.scale(e.radius,Y.ri),Y.ri.vadd(n,Y.ri),Y.ri.vsub(r.position,Y.ri),Ze.pointToWorldFrame(i,o,p,p),p.vsub(l.position,Y.rj),Ze.vectorToWorldFrame(o,Y.ni,Y.ni),Ze.vectorToWorldFrame(o,Y.ri,Y.ri),this.result.push(Y),this.createFrictionEquationsFromContact(Y,this.frictionResult)}}const w=Hv,E=Gv,G=Vv,J=Iv;for(let H=0,I=R.length;H!==I;H++){t.getTriangleVertices(R[H],w,E,G),t.getNormal(R[H],J),f.vsub(w,p);let F=p.dot(J);if(J.scale(F,p),f.vsub(p,p),F=p.distanceTo(f),dt.pointInTriangle(p,w,E,G)&&F<e.radius){if(h)return!0;let B=this.createContactEquation(r,l,e,t,c,d);p.vsub(f,B.ni),B.ni.normalize(),B.ni.scale(e.radius,B.ri),B.ri.vadd(n,B.ri),B.ri.vsub(r.position,B.ri),Ze.pointToWorldFrame(i,o,p,p),p.vsub(l.position,B.rj),Ze.vectorToWorldFrame(o,B.ni,B.ni),Ze.vectorToWorldFrame(o,B.ri,B.ri),this.result.push(B),this.createFrictionEquationsFromContact(B,this.frictionResult)}}R.length=0}planeTrimesh(e,t,n,i,s,o,r,l,c,d,h){const u=new b,m=Av;m.set(0,0,1),s.vmult(m,m);for(let g=0;g<t.vertices.length/3;g++){t.getVertex(g,u);const v=new b;v.copy(u),Ze.pointToWorldFrame(i,o,v,u);const f=Rv;if(u.vsub(n,f),m.dot(f)<=0){if(h)return!0;const y=this.createContactEquation(r,l,e,t,c,d);y.ni.copy(m);const x=Lv;m.scale(f.dot(m),x),u.vsub(x,x),y.ri.copy(x),y.ri.vsub(r.position,y.ri),y.rj.copy(u),y.rj.vsub(l.position,y.rj),this.result.push(y),this.createFrictionEquationsFromContact(y,this.frictionResult)}}}}const ti=new b,Pi=new b,Di=new b,Sv=new b,Ev=new b,Tv=new ht,Cv=new ht,Av=new b,Rv=new b,Lv=new b,Iv=new b,Pv=new b;new b;const Dv=new b,Fv=new b,Nv=new b,Uv=new b,Bv=new b,Ov=new b,kv=new b,zv=new b,Hv=new b,Gv=new b,Vv=new b,Wv=new Xt,$v=[],Xs=new b,Pl=new b,qv=new b,Xv=new b,Yv=new b;function jv(a,e,t){let n=null;const i=a.length;for(let s=0;s!==i;s++){const o=a[s],r=qv;a[(s+1)%i].vsub(o,r);const l=Xv;r.cross(e,l);const c=Yv;t.vsub(o,c);const d=l.dot(c);if(n===null||d>0&&n===!0||d<=0&&n===!1){n===null&&(n=d>0);continue}else return!1}return!0}const Ys=new b,Kv=new b,Zv=new b,Jv=new b,Qv=[new b,new b,new b,new b,new b,new b],e0=new b,t0=new b,n0=new b,i0=new b,s0=new b,o0=new b,r0=new b,a0=new b,l0=new b,c0=new b,d0=new b,h0=new b,u0=new b,p0=new b;new b;new b;const f0=new b,m0=new b,g0=new b,v0=new b,y0=new b,x0=new b,b0=new b,_0=new b,M0=new b,w0=new b,Dl=new ht,S0=new b;new b;const E0=new b,Fl=new b,T0=new b,C0=new b,A0=new b,R0=[0],L0=new b,I0=new b;class Nl{constructor(){this.current=[],this.previous=[]}getKey(e,t){if(t<e){const n=t;t=e,e=n}return e<<16|t}set(e,t){const n=this.getKey(e,t),i=this.current;let s=0;for(;n>i[s];)s++;if(n!==i[s]){for(let o=i.length-1;o>=s;o--)i[o+1]=i[o];i[s]=n}}tick(){const e=this.current;this.current=this.previous,this.previous=e,this.current.length=0}getDiff(e,t){const n=this.current,i=this.previous,s=n.length,o=i.length;let r=0;for(let l=0;l<s;l++){let c=!1;const d=n[l];for(;d>i[r];)r++;c=d===i[r],c||Ul(e,d)}r=0;for(let l=0;l<o;l++){let c=!1;const d=i[l];for(;d>n[r];)r++;c=n[r]===d,c||Ul(t,d)}}}function Ul(a,e){a.push((e&4294901760)>>16,e&65535)}const sr=(a,e)=>a<e?`${a}-${e}`:`${e}-${a}`;class P0{constructor(){this.data={keys:[]}}get(e,t){const n=sr(e,t);return this.data[n]}set(e,t,n){const i=sr(e,t);this.get(e,t)||this.data.keys.push(i),this.data[i]=n}delete(e,t){const n=sr(e,t),i=this.data.keys.indexOf(n);i!==-1&&this.data.keys.splice(i,1),delete this.data[n]}reset(){const e=this.data,t=e.keys;for(;t.length>0;){const n=t.pop();delete e[n]}}}class D0 extends Pc{constructor(e){e===void 0&&(e={}),super(),this.dt=-1,this.allowSleep=!!e.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=e.quatNormalizeSkip!==void 0?e.quatNormalizeSkip:0,this.quatNormalizeFast=e.quatNormalizeFast!==void 0?e.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new b,e.gravity&&this.gravity.copy(e.gravity),e.frictionGravity&&(this.frictionGravity=new b,this.frictionGravity.copy(e.frictionGravity)),this.broadphase=e.broadphase!==void 0?e.broadphase:new zg,this.bodies=[],this.hasActiveBodies=!1,this.solver=e.solver!==void 0?e.solver:new vv,this.constraints=[],this.narrowphase=new wv(this),this.collisionMatrix=new _l,this.collisionMatrixPrevious=new _l,this.bodyOverlapKeeper=new Nl,this.shapeOverlapKeeper=new Nl,this.contactmaterials=[],this.contactMaterialTable=new P0,this.defaultMaterial=new pi("default"),this.defaultContactMaterial=new ui(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(e,t){return this.contactMaterialTable.get(e.id,t.id)}collisionMatrixTick(){const e=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=e,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(e){this.constraints.push(e)}removeConstraint(e){const t=this.constraints.indexOf(e);t!==-1&&this.constraints.splice(t,1)}rayTest(e,t,n){n instanceof lo?this.raycastClosest(e,t,{skipBackfaces:!0},n):this.raycastAll(e,t,{skipBackfaces:!0},n)}raycastAll(e,t,n,i){return n===void 0&&(n={}),n.mode=dt.ALL,n.from=e,n.to=t,n.callback=i,or.intersectWorld(this,n)}raycastAny(e,t,n,i){return n===void 0&&(n={}),n.mode=dt.ANY,n.from=e,n.to=t,n.result=i,or.intersectWorld(this,n)}raycastClosest(e,t,n,i){return n===void 0&&(n={}),n.mode=dt.CLOSEST,n.from=e,n.to=t,n.result=i,or.intersectWorld(this,n)}addBody(e){this.bodies.includes(e)||(e.index=this.bodies.length,this.bodies.push(e),e.world=this,e.initPosition.copy(e.position),e.initVelocity.copy(e.velocity),e.timeLastSleepy=this.time,e instanceof ce&&(e.initAngularVelocity.copy(e.angularVelocity),e.initQuaternion.copy(e.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=e,this.idToBodyMap[e.id]=e,this.dispatchEvent(this.addBodyEvent))}removeBody(e){e.world=null;const t=this.bodies.length-1,n=this.bodies,i=n.indexOf(e);if(i!==-1){n.splice(i,1);for(let s=0;s!==n.length;s++)n[s].index=s;this.collisionMatrix.setNumObjects(t),this.removeBodyEvent.body=e,delete this.idToBodyMap[e.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(e){return this.idToBodyMap[e]}getShapeById(e){const t=this.bodies;for(let n=0;n<t.length;n++){const i=t[n].shapes;for(let s=0;s<i.length;s++){const o=i[s];if(o.id===e)return o}}return null}addContactMaterial(e){this.contactmaterials.push(e),this.contactMaterialTable.set(e.materials[0].id,e.materials[1].id,e)}removeContactMaterial(e){const t=this.contactmaterials.indexOf(e);t!==-1&&(this.contactmaterials.splice(t,1),this.contactMaterialTable.delete(e.materials[0].id,e.materials[1].id))}fixedStep(e,t){e===void 0&&(e=1/60),t===void 0&&(t=10);const n=pt.now()/1e3;if(!this.lastCallTime)this.step(e,void 0,t);else{const i=n-this.lastCallTime;this.step(e,i,t)}this.lastCallTime=n}step(e,t,n){if(n===void 0&&(n=10),t===void 0)this.internalStep(e),this.time+=e;else{this.accumulator+=t;const i=pt.now();let s=0;for(;this.accumulator>=e&&s<n&&(this.internalStep(e),this.accumulator-=e,s++,!(pt.now()-i>e*1e3)););this.accumulator=this.accumulator%e;const o=this.accumulator/e;for(let r=0;r!==this.bodies.length;r++){const l=this.bodies[r];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=t}}internalStep(e){this.dt=e;const t=this.contacts,n=O0,i=k0,s=this.bodies.length,o=this.bodies,r=this.solver,l=this.gravity,c=this.doProfiling,d=this.profile,h=ce.DYNAMIC;let u=-1/0;const m=this.constraints,g=B0;l.length();const v=l.x,f=l.y,p=l.z;let y=0;for(c&&(u=pt.now()),y=0;y!==s;y++){const H=o[y];if(H.type===h){const I=H.force,F=H.mass;I.x+=F*v,I.y+=F*f,I.z+=F*p}}for(let H=0,I=this.subsystems.length;H!==I;H++)this.subsystems[H].update();c&&(u=pt.now()),n.length=0,i.length=0,this.broadphase.collisionPairs(this,n,i),c&&(d.broadphase=pt.now()-u);let x=m.length;for(y=0;y!==x;y++){const H=m[y];if(!H.collideConnected)for(let I=n.length-1;I>=0;I-=1)(H.bodyA===n[I]&&H.bodyB===i[I]||H.bodyB===n[I]&&H.bodyA===i[I])&&(n.splice(I,1),i.splice(I,1))}this.collisionMatrixTick(),c&&(u=pt.now());const _=U0,R=t.length;for(y=0;y!==R;y++)_.push(t[y]);t.length=0;const S=this.frictionEquations.length;for(y=0;y!==S;y++)g.push(this.frictionEquations[y]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,i,this,t,_,this.frictionEquations,g),c&&(d.narrowphase=pt.now()-u),c&&(u=pt.now()),y=0;y<this.frictionEquations.length;y++)r.addEquation(this.frictionEquations[y]);const L=t.length;for(let H=0;H!==L;H++){const I=t[H],F=I.bi,B=I.bj,te=I.si,Y=I.sj;let X;if(F.material&&B.material?X=this.getContactMaterial(F.material,B.material)||this.defaultContactMaterial:X=this.defaultContactMaterial,X.friction,F.material&&B.material&&(F.material.friction>=0&&B.material.friction>=0&&F.material.friction*B.material.friction,F.material.restitution>=0&&B.material.restitution>=0&&(I.restitution=F.material.restitution*B.material.restitution)),r.addEquation(I),F.allowSleep&&F.type===ce.DYNAMIC&&F.sleepState===ce.SLEEPING&&B.sleepState===ce.AWAKE&&B.type!==ce.STATIC){const P=B.velocity.lengthSquared()+B.angularVelocity.lengthSquared(),C=B.sleepSpeedLimit**2;P>=C*2&&(F.wakeUpAfterNarrowphase=!0)}if(B.allowSleep&&B.type===ce.DYNAMIC&&B.sleepState===ce.SLEEPING&&F.sleepState===ce.AWAKE&&F.type!==ce.STATIC){const P=F.velocity.lengthSquared()+F.angularVelocity.lengthSquared(),C=F.sleepSpeedLimit**2;P>=C*2&&(B.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(F,B,!0),this.collisionMatrixPrevious.get(F,B)||(es.body=B,es.contact=I,F.dispatchEvent(es),es.body=F,B.dispatchEvent(es)),this.bodyOverlapKeeper.set(F.id,B.id),this.shapeOverlapKeeper.set(te.id,Y.id)}for(this.emitContactEvents(),c&&(d.makeContactConstraints=pt.now()-u,u=pt.now()),y=0;y!==s;y++){const H=o[y];H.wakeUpAfterNarrowphase&&(H.wakeUp(),H.wakeUpAfterNarrowphase=!1)}for(x=m.length,y=0;y!==x;y++){const H=m[y];H.update();for(let I=0,F=H.equations.length;I!==F;I++){const B=H.equations[I];r.addEquation(B)}}r.solve(e,this),c&&(d.solve=pt.now()-u),r.removeAllEquations();const q=Math.pow;for(y=0;y!==s;y++){const H=o[y];if(H.type&h){const I=q(1-H.linearDamping,e),F=H.velocity;F.scale(I,F);const B=H.angularVelocity;if(B){const te=q(1-H.angularDamping,e);B.scale(te,B)}}}this.dispatchEvent(N0),c&&(u=pt.now());const E=this.stepnumber%(this.quatNormalizeSkip+1)===0,G=this.quatNormalizeFast;for(y=0;y!==s;y++)o[y].integrate(e,E,G);this.clearForces(),this.broadphase.dirty=!0,c&&(d.integrate=pt.now()-u),this.stepnumber+=1,this.dispatchEvent(F0);let J=!0;if(this.allowSleep)for(J=!1,y=0;y!==s;y++){const H=o[y];H.sleepTick(this.time),H.sleepState!==ce.SLEEPING&&(J=!0)}this.hasActiveBodies=J}emitContactEvents(){const e=this.hasAnyEventListener("beginContact"),t=this.hasAnyEventListener("endContact");if((e||t)&&this.bodyOverlapKeeper.getDiff(En,Tn),e){for(let s=0,o=En.length;s<o;s+=2)ts.bodyA=this.getBodyById(En[s]),ts.bodyB=this.getBodyById(En[s+1]),this.dispatchEvent(ts);ts.bodyA=ts.bodyB=null}if(t){for(let s=0,o=Tn.length;s<o;s+=2)ns.bodyA=this.getBodyById(Tn[s]),ns.bodyB=this.getBodyById(Tn[s+1]),this.dispatchEvent(ns);ns.bodyA=ns.bodyB=null}En.length=Tn.length=0;const n=this.hasAnyEventListener("beginShapeContact"),i=this.hasAnyEventListener("endShapeContact");if((n||i)&&this.shapeOverlapKeeper.getDiff(En,Tn),n){for(let s=0,o=En.length;s<o;s+=2){const r=this.getShapeById(En[s]),l=this.getShapeById(En[s+1]);Cn.shapeA=r,Cn.shapeB=l,r&&(Cn.bodyA=r.body),l&&(Cn.bodyB=l.body),this.dispatchEvent(Cn)}Cn.bodyA=Cn.bodyB=Cn.shapeA=Cn.shapeB=null}if(i){for(let s=0,o=Tn.length;s<o;s+=2){const r=this.getShapeById(Tn[s]),l=this.getShapeById(Tn[s+1]);An.shapeA=r,An.shapeB=l,r&&(An.bodyA=r.body),l&&(An.bodyB=l.body),this.dispatchEvent(An)}An.bodyA=An.bodyB=An.shapeA=An.shapeB=null}}clearForces(){const e=this.bodies,t=e.length;for(let n=0;n!==t;n++){const i=e[n];i.force,i.torque,i.force.set(0,0,0),i.torque.set(0,0,0)}}}new Xt;const or=new dt,pt=globalThis.performance||{};if(!pt.now){let a=Date.now();pt.timing&&pt.timing.navigationStart&&(a=pt.timing.navigationStart),pt.now=()=>Date.now()-a}new b;const F0={type:"postStep"},N0={type:"preStep"},es={type:ce.COLLIDE_EVENT_NAME,body:null,contact:null},U0=[],B0=[],O0=[],k0=[],En=[],Tn=[],ts={type:"beginContact",bodyA:null,bodyB:null},ns={type:"endContact",bodyA:null,bodyB:null},Cn={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},An={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},is=new k;function Kt(a,e,t,n,i,s){const o=2*Math.PI*i/4,r=Math.max(s-2*i,0),l=Math.PI/4;is.copy(e),is[n]=0,is.normalize();const c=.5*o/(o+r),d=1-is.angleTo(a)/l;return Math.sign(is[t])===1?d*c:r/(o+r)+c+c*(1-d)}class Bl extends ln{constructor(e=1,t=1,n=1,i=2,s=.1){if(i=i*2+1,s=Math.min(e/2,t/2,n/2,s),super(1,1,1,i,i,i),i===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const r=new k,l=new k,c=new k(e,t,n).divideScalar(2).subScalar(s),d=this.attributes.position.array,h=this.attributes.normal.array,u=this.attributes.uv.array,m=d.length/6,g=new k,v=.5/i;for(let f=0,p=0;f<d.length;f+=3,p+=2)switch(r.fromArray(d,f),l.copy(r),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),d[f+0]=c.x*Math.sign(r.x)+l.x*s,d[f+1]=c.y*Math.sign(r.y)+l.y*s,d[f+2]=c.z*Math.sign(r.z)+l.z*s,h[f+0]=l.x,h[f+1]=l.y,h[f+2]=l.z,Math.floor(f/m)){case 0:g.set(1,0,0),u[p+0]=Kt(g,l,"z","y",s,n),u[p+1]=1-Kt(g,l,"y","z",s,t);break;case 1:g.set(-1,0,0),u[p+0]=1-Kt(g,l,"z","y",s,n),u[p+1]=1-Kt(g,l,"y","z",s,t);break;case 2:g.set(0,1,0),u[p+0]=1-Kt(g,l,"x","z",s,e),u[p+1]=Kt(g,l,"z","x",s,n);break;case 3:g.set(0,-1,0),u[p+0]=1-Kt(g,l,"x","z",s,e),u[p+1]=1-Kt(g,l,"z","x",s,n);break;case 4:g.set(0,0,1),u[p+0]=1-Kt(g,l,"x","y",s,e),u[p+1]=1-Kt(g,l,"y","x",s,t);break;case 5:g.set(0,0,-1),u[p+0]=Kt(g,l,"x","y",s,e),u[p+1]=1-Kt(g,l,"y","x",s,t);break}}}const eo={baseColor:"#ffffff",dotColor:"#000000",borderColor:"#ffffff",roughness:.3,metalness:.25,clearcoat:0,clearcoatRoughness:0,opacity:1,dotSize:29,dotShape:"circle",dotDepth:1.3,bevelRadius:.16};function rr(a){const e={...eo};for(const t of Object.keys(a)){const n=a[t];n!==void 0&&(e[t]=n)}return e}const z0=16766720,Ol=1.04,Tt=class Tt{constructor(e,t,n,i,s=3){N(this,"mesh");N(this,"body");N(this,"config");N(this,"outlineMesh");N(this,"selected",!1);N(this,"prevPosition",new k);N(this,"prevQuaternion",new Qt);N(this,"currPosition",new k);N(this,"currQuaternion",new Qt);this.config=i?rr(i):{...eo};const o=this.config.bevelRadius,r=Tt.getSizeForBevel(o),l=new Bl(r,r,r,s,o),c=this.createMaterials();this.mesh=new _t(l,c),this.mesh.castShadow=!0,e.add(this.mesh),this.outlineMesh=this.buildOutlineMesh(o??eo.bevelRadius),this.mesh.add(this.outlineMesh);const d=Tt.BASE_SIZE/2;this.body=new ce({mass:.5,shape:new go(new b(d,d,d)),material:n,linearDamping:.1,angularDamping:.1,allowSleep:!0,sleepSpeedLimit:.5,sleepTimeLimit:.5}),t.addBody(this.body),this.currPosition.set(this.body.position.x,this.body.position.y,this.body.position.z),this.currQuaternion.set(this.body.quaternion.x,this.body.quaternion.y,this.body.quaternion.z,this.body.quaternion.w),this.prevPosition.copy(this.currPosition),this.prevQuaternion.copy(this.currQuaternion)}static getSizeForBevel(e){return Tt.BASE_SIZE+e*.4}isConfigDifferent(e){const t=this.config,n=rr(e);return t.baseColor!==n.baseColor||t.dotColor!==n.dotColor||t.borderColor!==n.borderColor||t.roughness!==n.roughness||t.metalness!==n.metalness||t.clearcoat!==n.clearcoat||t.clearcoatRoughness!==n.clearcoatRoughness||t.opacity!==n.opacity||t.dotSize!==n.dotSize||t.dotShape!==n.dotShape||t.dotDepth!==n.dotDepth||t.bevelRadius!==n.bevelRadius}updateConfig(e,t=3){if(!this.isConfigDifferent(e))return;const n=this.config.bevelRadius;if(this.config=rr(e),this.config.bevelRadius!==n){const l=this.mesh.geometry,c=this.config.bevelRadius,d=Tt.getSizeForBevel(c),h=new Bl(d,d,d,t,c);this.mesh.geometry=h,l.dispose(),this.rebuildOutlineMesh(c??eo.bevelRadius)}const i=this.getMaterialCacheKey();let s=Tt.materialCache.get(i);s||(s=this.createMaterials(),Tt.materialCache.set(i,s));const o=this.mesh.material,r=this.getMaterialCacheKey(this.config);Tt.materialCache.has(r)||o.forEach(l=>l.dispose()),this.mesh.material=s}getMaterialCacheKey(e){const t=e||this.config;return JSON.stringify({baseColor:t.baseColor,dotColor:t.dotColor,borderColor:t.borderColor,roughness:t.roughness,metalness:t.metalness,clearcoat:t.clearcoat,clearcoatRoughness:t.clearcoatRoughness,opacity:t.opacity,dotSize:t.dotSize,dotShape:t.dotShape,dotDepth:t.dotDepth})}static clearMaterialCache(){console.log("[Dice] Clearing material cache, size:",Tt.materialCache.size),Tt.materialCache.forEach(e=>{e.forEach(t=>t.dispose())}),Tt.materialCache.clear()}createMaterials(){return[1,6,2,5,3,4].map(t=>{const n=this.createDotTexture(t),i=new hs(n);i.colorSpace=ft;const s=this.createBumpMap(t),o=new hs(s),r=new Lc({map:i,bumpMap:o,bumpScale:1*this.config.dotDepth,roughness:this.config.roughness,metalness:this.config.metalness,clearcoat:this.config.clearcoat,clearcoatRoughness:this.config.clearcoatRoughness,transparent:this.config.opacity<1,opacity:this.config.opacity});return this.config.opacity<1&&(r.depthWrite=!1),r})}createBumpMap(e){const n=document.createElement("canvas");n.width=256,n.height=256;const i=n.getContext("2d");i.fillStyle="rgb(255, 255, 255)",i.fillRect(0,0,256,256);const s=this.config.dotSize,o=this.config.dotShape;return this.getDotPositions(e,256).forEach(([l,c])=>{const d=i.createRadialGradient(l,c,0,l,c,s);d.addColorStop(0,"rgb(0, 0, 0)"),d.addColorStop(.92,"rgb(0, 0, 0)"),d.addColorStop(.96,"rgb(128, 128, 128)"),d.addColorStop(1,"rgb(255, 255, 255)"),i.fillStyle=d,i.beginPath(),o==="circle"?i.arc(l,c,s,0,Math.PI*2):o==="square"?i.rect(l-s,c-s,s*2,s*2):o==="diamond"&&(i.moveTo(l,c-s),i.lineTo(l+s,c),i.lineTo(l,c+s),i.lineTo(l-s,c),i.closePath()),i.fill()}),n}createNormalMap(e){const n=document.createElement("canvas");n.width=256,n.height=256;const i=n.getContext("2d");i.fillStyle="rgb(128, 128, 255)",i.fillRect(0,0,256,256);const s=this.config.dotSize,o=this.config.dotShape,r=this.config.dotDepth;return this.getDotPositions(e,256).forEach(([c,d])=>{const h=s*2,u=i.getImageData(c-s,d-s,h,h),m=u.data;for(let g=0;g<h;g++)for(let v=0;v<h;v++){const f=v-s,p=g-s;let y=!1,x=0;if(o==="circle"){const _=Math.sqrt(f*f+p*p);y=_<=s,x=_/s}else if(o==="square")y=Math.abs(f)<=s&&Math.abs(p)<=s,x=Math.max(Math.abs(f),Math.abs(p))/s;else if(o==="diamond"){const _=Math.abs(f)+Math.abs(p);y=_<=s,x=_/s}if(y){let _=0,R=0,S=1;const q=.88,w=.98;if(x<q)_=0,R=0,S=1;else if(x<w){const J=Math.sqrt(f*f+p*p);if(J>.001){const H=Math.min(r*.495,.99);_=-(f/J)*H,R=-(p/J)*H,S=Math.sqrt(1-H*H)}}else{const J=Math.sqrt(f*f+p*p),H=(1-x)/(1-w);if(J>.001){const I=Math.min(r*.45,.95)*H;_=-(f/J)*I,R=-(p/J)*I,S=Math.sqrt(1-I*I)}}const E=Math.sqrt(_*_+R*R+S*S);_/=E,R/=E,S/=E;const G=(g*h+v)*4;m[G]=Math.floor((_*.5+.5)*255),m[G+1]=Math.floor((R*.5+.5)*255),m[G+2]=Math.floor((S*.5+.5)*255),m[G+3]=255}}i.putImageData(u,c-s,d-s)}),n}createDotTexture(e){const n=document.createElement("canvas");n.width=256,n.height=256;const i=n.getContext("2d");i.fillStyle=this.config.baseColor,i.fillRect(0,0,256,256);const s=4;i.strokeStyle=this.config.borderColor,i.lineWidth=s,i.strokeRect(s/2,s/2,256-s,256-s);const o=this.config.dotSize,r=this.config.dotShape;return this.getDotPositions(e,256).forEach(([c,d])=>{i.fillStyle=this.config.dotColor,i.beginPath(),r==="circle"?i.arc(c,d,o,0,Math.PI*2):r==="square"?i.rect(c-o,d-o,o*2,o*2):r==="diamond"&&(i.moveTo(c,d-o),i.lineTo(c+o,d),i.lineTo(c,d+o),i.lineTo(c-o,d),i.closePath()),i.fill()}),n}getDotPositions(e,t){const n=t/2,i=t/4;return{1:[[n,n]],2:[[i,i],[t-i,t-i]],3:[[i,i],[n,n],[t-i,t-i]],4:[[i,i],[t-i,i],[i,t-i],[t-i,t-i]],5:[[i,i],[t-i,i],[n,n],[i,t-i],[t-i,t-i]],6:[[i,i],[t-i,i],[i,n],[t-i,n],[i,t-i],[t-i,t-i]]}[e]||[]}setPosition(e,t,n){this.body.position.set(e,t,n),this.prevPosition.set(e,t,n),this.currPosition.set(e,t,n),this.currQuaternion.set(this.body.quaternion.x,this.body.quaternion.y,this.body.quaternion.z,this.body.quaternion.w),this.prevQuaternion.copy(this.currQuaternion)}setVelocity(e,t,n){this.body.velocity.set(e,t,n)}setAngularVelocity(e,t,n){this.body.angularVelocity.set(e,t,n)}saveState(){this.prevPosition.copy(this.currPosition),this.prevQuaternion.copy(this.currQuaternion)}updateState(){this.currPosition.set(this.body.position.x,this.body.position.y,this.body.position.z),this.currQuaternion.set(this.body.quaternion.x,this.body.quaternion.y,this.body.quaternion.z,this.body.quaternion.w)}update(e=1){this.mesh.position.lerpVectors(this.prevPosition,this.currPosition,e),this.mesh.quaternion.slerpQuaternions(this.prevQuaternion,this.currQuaternion,e)}updateDirect(){this.mesh.position.copy(this.body.position),this.mesh.quaternion.copy(this.body.quaternion),this.currPosition.copy(this.mesh.position),this.currQuaternion.copy(this.mesh.quaternion),this.prevPosition.copy(this.mesh.position),this.prevQuaternion.copy(this.mesh.quaternion)}getTopFace(){const e=new k(0,1,0),t=[{dir:new k(1,0,0),value:1},{dir:new k(-1,0,0),value:6},{dir:new k(0,1,0),value:2},{dir:new k(0,-1,0),value:5},{dir:new k(0,0,1),value:3},{dir:new k(0,0,-1),value:4}];let n=-1,i=1;return t.forEach(s=>{const r=s.dir.clone().applyQuaternion(this.mesh.quaternion).dot(e);r>n&&(n=r,i=s.value)}),i}setTopFace(e){const t={1:new pn(0,0,-Math.PI/2),2:new pn(0,0,0),3:new pn(Math.PI/2,0,0),4:new pn(-Math.PI/2,0,0),5:new pn(Math.PI,0,0),6:new pn(0,0,Math.PI/2)},n=t[e]||t[1],i=new Qt().setFromEuler(n);this.body.quaternion.set(i.x,i.y,i.z,i.w),this.updateDirect()}getConfig(){return{...this.config}}buildOutlineMesh(e){const t=Tt.BASE_SIZE*Ol,n=new ln(t,t,t),i=new pl(n);n.dispose();const s=new Rc({color:z0,transparent:!0,opacity:1,depthWrite:!1,depthTest:!1,toneMapped:!1}),o=new ig(i,s);return o.visible=this.selected,o.renderOrder=999,o.castShadow=!1,o.receiveShadow=!1,o.raycast=()=>{},o}rebuildOutlineMesh(e){const t=this.outlineMesh.geometry,n=Tt.BASE_SIZE*Ol,i=new ln(n,n,n);this.outlineMesh.geometry=new pl(i),i.dispose(),t.dispose()}setSelected(e){this.selected=e,this.outlineMesh.visible=e}isSelected(){return this.selected}};N(Tt,"BASE_SIZE",.8),N(Tt,"materialCache",new Map);let co=Tt;class H0{constructor(){N(this,"lastX",0);N(this,"lastY",0);N(this,"lastZ",0);N(this,"isActive",!1);N(this,"isMobile");N(this,"hasPermission",!1);N(this,"permissionChecked",!1);N(this,"lastMouseX",0);N(this,"lastMouseY",0);N(this,"lastMouseMoveTime",0);N(this,"MOUSE_THROTTLE",16);N(this,"intensityHistory",[]);N(this,"prevX",0);N(this,"prevY",0);N(this,"prevZ",0);N(this,"dirX",0);N(this,"dirY",0);N(this,"dirZ",0);N(this,"turnPointY",0);N(this,"turnPointZ",0);N(this,"HISTORY_SIZE",6);N(this,"SHAKE_THRESHOLD",.3);N(this,"onMove",null);N(this,"onTurn",null);N(this,"onThrow",null);N(this,"onPermissionGranted",null);this.handleMotion=this.handleMotion.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.isMobile="ontouchstart"in window||navigator.maxTouchPoints>0,this.checkPermission()}async checkPermission(){if(!this.isMobile){this.hasPermission=!0,this.permissionChecked=!0;return}if(typeof DeviceMotionEvent.requestPermission=="function"){if(await new Promise(i=>{let s=!1;const o=setTimeout(()=>{s||(s=!0,i(!1))},100),r=()=>{s||(s=!0,clearTimeout(o),window.removeEventListener("devicemotion",r),i(!0))};window.addEventListener("devicemotion",r)})){this.hasPermission=!0,this.permissionChecked=!0;return}const n=document.getElementById("permission-btn");n&&(n.style.display="block",n.addEventListener("click",async()=>{try{await DeviceMotionEvent.requestPermission()==="granted"&&(this.hasPermission=!0,this.permissionChecked=!0,n.style.display="none",this.onPermissionGranted&&this.onPermissionGranted())}catch(i){console.warn("Permission error:",i)}})),this.permissionChecked=!0}else this.hasPermission=!0,this.permissionChecked=!0}async start(){if(this.isActive=!0,this.intensityHistory=[],this.isMobile){if(!this.hasPermission)return;window.addEventListener("devicemotion",this.handleMotion)}else window.addEventListener("mousemove",this.handleMouseMove)}stop(){this.isActive=!1,this.intensityHistory=[],window.removeEventListener("devicemotion",this.handleMotion),window.removeEventListener("mousemove",this.handleMouseMove)}handleMotion(e){if(!this.isActive)return;const t=e.acceleration||e.accelerationIncludingGravity;if(!t||t.x===null||t.y===null||t.z===null)return;const n=Math.abs(t.x-this.lastX),i=Math.abs(t.y-this.lastY),s=Math.abs(t.z-this.lastZ),o=(n+i+s)/15,r=t.x>this.prevX?1:t.x<this.prevX?-1:this.dirX,l=t.y>this.prevY?1:t.y<this.prevY?-1:this.dirY,c=t.z>this.prevZ?1:t.z<this.prevZ?-1:this.dirZ;let d=!1;r!==this.dirX&&this.dirX!==0&&(d=!0),l!==this.dirY&&this.dirY!==0&&(this.turnPointY=this.prevY,d=!0),c!==this.dirZ&&this.dirZ!==0&&(this.turnPointZ=this.prevZ,d=!0),d&&o>this.SHAKE_THRESHOLD&&this.onTurn&&this.onTurn(o),this.dirX=r,this.dirY=l,this.dirZ=c;const h=t.y-this.turnPointY,u=t.z-this.turnPointZ,m=h>2&&u<-12,g=this.intensityHistory.length>=2&&m;if(this.prevX=t.x,this.prevY=t.y,this.prevZ=t.z,this.lastX=t.x,this.lastY=t.y,this.lastZ=t.z,!(o<this.SHAKE_THRESHOLD)){if(g){const v=Math.min(1,o/3);this.onThrow&&this.onThrow(v,h,u),this.intensityHistory=[];return}this.intensityHistory.push(o),this.intensityHistory.length>this.HISTORY_SIZE&&this.intensityHistory.shift(),this.onMove&&this.onMove(o,t.x,t.y,t.z)}}handleMouseMove(e){if(!this.isActive)return;const t=Date.now();if(t-this.lastMouseMoveTime<this.MOUSE_THROTTLE)return;this.lastMouseMoveTime=t;const n=Math.abs(e.clientX-this.lastMouseX),i=Math.abs(e.clientY-this.lastMouseY),s=(n+i)/50;this.lastMouseX=e.clientX,this.lastMouseY=e.clientY,!(s<this.SHAKE_THRESHOLD)&&(this.intensityHistory.push(s),this.intensityHistory.length>this.HISTORY_SIZE&&this.intensityHistory.shift(),this.onMove&&this.onMove(s,0,0,0))}}class G0{constructor(){N(this,"ctx",null);N(this,"diceHitBuffer",null);N(this,"tableHitBuffer",null);N(this,"isLoaded",!1);N(this,"initInFlight",!1);N(this,"contextUnlocked",!1);N(this,"lastShakeTime",0);N(this,"lastDiceHitTime",0);N(this,"lastTableHitTime",0);N(this,"diceHitData",null);N(this,"tableHitData",null);N(this,"visibilityHandlerInstalled",!1)}async init(){if(this.unlockContextSync(),!(this.isLoaded||this.initInFlight)){this.initInFlight=!0;try{await this.loadAndDecodeBuffers(),this.isLoaded=!0,this.visibilityHandlerInstalled||(this.setupVisibilityHandler(),this.visibilityHandlerInstalled=!0)}catch(e){window.debugLog?.("AUDIO","init failed, will retry on next gesture:",String(e))}finally{this.initInFlight=!1}}}unlockContextSync(){if(this.contextUnlocked&&this.ctx&&this.ctx.state!=="closed"){(this.ctx.state==="suspended"||this.ctx.state==="interrupted")&&this.ctx.resume().catch(()=>{});return}try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e;const t=this.ctx.createBuffer(1,1,22050),n=this.ctx.createBufferSource();n.buffer=t,n.connect(this.ctx.destination),n.start(0),this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.contextUnlocked=!0}catch(e){window.debugLog?.("AUDIO","unlockContextSync failed:",String(e))}}async loadAndDecodeBuffers(){if(!this.diceHitData||!this.tableHitData){const e="/",[t,n]=await Promise.all([fetch(`${e}sounds/dice_hit.mp3`),fetch(`${e}sounds/table_hit.mp3`)]);if(!t.ok||!n.ok)throw new Error(`Audio fetch failed: ${t.status} / ${n.status}`);[this.diceHitData,this.tableHitData]=await Promise.all([t.arrayBuffer(),n.arrayBuffer()])}await this.decodeAudioBuffers()}async decodeAudioBuffers(){!this.ctx||!this.diceHitData||!this.tableHitData||(this.diceHitBuffer=await this.ctx.decodeAudioData(this.diceHitData.slice(0)),this.tableHitBuffer=await this.ctx.decodeAudioData(this.tableHitData.slice(0)))}setupVisibilityHandler(){document.addEventListener("visibilitychange",async()=>{if(!document.hidden&&this.ctx){const e=this.ctx.state;if(window.debugLog?.("AUDIO","Visibility restored, state:",e),e==="suspended"||e==="interrupted"||e==="closed"){window.debugLog?.("AUDIO","Attempting to recover...");try{await this.ctx.resume(),window.debugLog?.("AUDIO","Resume OK, new state:",this.ctx.state)}catch(t){window.debugLog?.("AUDIO","Resume FAILED, recreating...",String(t));try{this.ctx.close().catch(()=>{})}catch{}this.contextUnlocked=!1,this.unlockContextSync(),await this.decodeAudioBuffers(),window.debugLog?.("AUDIO","Recreated, new state:",this.ctx?.state)}}}})}playBuffer(e,t,n){if(!this.ctx||!e||!this.isLoaded)return;const i=this.ctx.state;(i==="suspended"||i==="interrupted")&&this.ctx.resume().catch(()=>{});try{const s=this.ctx.createBufferSource(),o=this.ctx.createGain();s.buffer=e,s.playbackRate.value=n,o.gain.value=t,s.connect(o),o.connect(this.ctx.destination),s.start(0)}catch{}}playShake(e){if(!this.isLoaded)return;const t=Date.now();if(t-this.lastShakeTime<50||(this.lastShakeTime=t,e<.2))return;const n=.2+e*.4,i=.6+e*.3;this.playBuffer(this.diceHitBuffer,n,i)}playDiceHit(e){if(!this.isLoaded)return;const t=Date.now();if(t-this.lastDiceHitTime<100||(this.lastDiceHitTime=t,e<1))return;const n=Math.min(1,e/10),i=.05+n*.7,s=.6+n*.3;this.playBuffer(this.diceHitBuffer,i,s)}playTableHit(e){if(!this.isLoaded)return;const t=Date.now();if(t-this.lastTableHitTime<80||(this.lastTableHitTime=t,e<1))return;const n=Math.min(1,e/10),i=.05+n*.85,s=.6+n*.3;this.playBuffer(this.tableHitBuffer,i,s)}}class V0{constructor(e,t){N(this,"ws",null);N(this,"handlers",new Map);N(this,"reconnectAttempts",0);N(this,"maxReconnectAttempts",10);N(this,"baseReconnectDelay",1e3);N(this,"maxReconnectDelay",3e4);N(this,"user",null);N(this,"inventory",[]);N(this,"isConnected",!1);N(this,"isAuthenticated",!1);N(this,"currentLobbyHostId",null);N(this,"connectionHealth","offline");N(this,"pendingReconnect",null);this.serverUrl=e,this.options=t,setInterval(()=>{this.checkConnectionStatus()},1e3),window.addEventListener("online",()=>{console.log("[WS] Browser detected online",{navigatorOnline:navigator.onLine,isConnected:this.isConnected}),this.isConnected||this.connect().catch(()=>{})}),window.addEventListener("offline",()=>{console.log("[WS] Browser detected offline",{navigatorOnline:navigator.onLine,isConnected:this.isConnected}),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"No internet connection"})})}get isHost(){return this.user?.id===this.currentLobbyHostId}connect(){return new Promise((e,t)=>{try{this.ws=new WebSocket(this.serverUrl),this.ws.onopen=()=>{console.log("[WS] Connected"),this.isConnected=!0,this.connectionHealth="good",this.reconnectAttempts=0,this.authenticate(),e()},this.ws.onmessage=n=>{this.handleMessage(n.data)},this.ws.onclose=n=>{console.log("[WS] Disconnected",n.code,n.reason),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",n.code===1001&&n.reason==="Server shutdown"&&console.log("[WS] Server is restarting, will reconnect shortly"),this.tryReconnect()},this.ws.onerror=n=>{console.error("[WS] Error:",n),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"Connection error"}),t(n)}}catch(n){t(n)}})}authenticate(){if(this.options?.getAuthPayload){const t=this.options.getAuthPayload();this.send({type:"auth",...t});return}const e=window.Telegram?.WebApp?.initData||this.createDevInitData();this.send({type:"auth",initData:e})}createDevInitData(){let e=sessionStorage.getItem("devUserId");if(!e){const i=[],s=localStorage.getItem("activeDevUsers");if(s)try{const l=JSON.parse(s);Array.isArray(l)&&i.push(...l)}catch{}const o=[11,22,33,44,55,66],r=o.find(l=>!i.includes(l))||o[0];e=String(r),sessionStorage.setItem("devUserId",e),i.push(r),localStorage.setItem("activeDevUsers",JSON.stringify(i)),window.addEventListener("beforeunload",()=>{const c=JSON.parse(localStorage.getItem("activeDevUsers")||"[]").filter(d=>d!==r);localStorage.setItem("activeDevUsers",JSON.stringify(c))})}const n={id:parseInt(e),first_name:"Dev",last_name:"User",username:`dev${e}`};return console.log("[WS] Using dev user:",n),"user="+encodeURIComponent(JSON.stringify(n))+"&hash=dev"}handleMessage(e){try{const t=JSON.parse(e);t.type!=="throw_frame"&&t.type,t.type==="server_shutdown"&&console.log("[WS] Server shutdown notification:",t.message),t.type==="connection_warning"&&(console.warn("[WS] Connection warning:",t.message),this.emit("connection_unstable",t)),t.type==="connection_health"&&(this.connectionHealth=t.health,this.emit("connection_health_changed",{health:t.health,message:t.message})),t.type,t.type,t.type,t.type==="auth_success"&&(this.user=t.user,this.inventory=t.inventory,this.isAuthenticated=!0,console.log("[WS] Authenticated as:",this.user?.nickname),t.canReconnect&&(this.pendingReconnect=t.canReconnect)),(t.type==="lobby_created"||t.type==="lobby_joined")&&(this.currentLobbyHostId=t.lobby?.hostId||null),(t.type==="game_started"||t.type==="game_reconnected")&&(this.currentLobbyHostId=t.lobby?.hostId||null),t.type==="lobby_left"&&(this.currentLobbyHostId=null,this.pendingReconnect=null),(this.handlers.get(t.type)||[]).forEach(s=>s(t)),(this.handlers.get("*")||[]).forEach(s=>s(t))}catch(t){console.error("[WS] Failed to parse message:",t)}}tryReconnect(){if(this.reconnectAttempts>=this.maxReconnectAttempts){console.log("[WS] Max reconnect attempts reached"),this.emit("max_reconnect_attempts",{});return}this.reconnectAttempts++;const e=Math.min(this.baseReconnectDelay*Math.pow(2,this.reconnectAttempts-1),this.maxReconnectDelay),t=Math.random()*e*.25,n=Math.floor(e+t);console.log(`[WS] Reconnecting in ${n}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`),setTimeout(()=>{this.connect().catch(()=>{})},n)}checkConnectionStatus(){if(!navigator.onLine){this.isConnected&&(console.warn("[WS] Browser reports offline"),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"No internet connection"}));return}if(!this.ws||this.ws.readyState!==WebSocket.OPEN){this.isConnected&&(console.warn("[WS] Connection lost detected (readyState check)"),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"Connection lost"}));return}try{this.isConnected&&this.isAuthenticated&&this.ws.send(JSON.stringify({type:"_client_ping",t:Date.now()}))}catch(e){console.warn("[WS] Failed to send ping, connection likely dead",e),this.isConnected=!1,this.isAuthenticated=!1,this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"Connection lost"})}}send(e){this.ws&&this.ws.readyState===WebSocket.OPEN?this.ws.send(JSON.stringify(e)):(console.warn("[WS] Cannot send - not connected",{readyState:this.ws?.readyState}),this.isConnected||(this.connectionHealth="offline",this.emit("connection_health_changed",{health:"offline",message:"Offline"})))}on(e,t){this.handlers.has(e)||this.handlers.set(e,[]),this.handlers.get(e).push(t)}off(e,t){const n=this.handlers.get(e);if(n){const i=n.indexOf(t);i!==-1&&n.splice(i,1)}}emit(e,t){(this.handlers.get(e)||[]).forEach(i=>i(t))}setNickname(e){this.send({type:"set_nickname",nickname:e})}equipItem(e,t){this.send({type:"equip_item",itemId:e,slot:t})}getShopItems(){this.send({type:"get_shop_items"})}purchaseItem(e){this.send({type:"purchase_item",itemId:e})}searchUser(e){this.send({type:"search_user",username:e})}getFriends(){this.send({type:"get_friends"})}addFriend(e){this.send({type:"add_friend",friendId:e})}removeFriend(e){this.send({type:"remove_friend",friendId:e})}getFriendRequests(){this.send({type:"get_friend_requests"})}respondFriendRequest(e,t){this.send({type:"respond_friend_request",requestId:e,accept:t})}getReferralStats(){this.send({type:"get_referral_stats"})}getReferralList(){this.send({type:"get_referral_list"})}createLobby(e,t){this.send({type:"create_lobby",gameMode:e,bet:t,screenWidth:window.innerWidth,screenHeight:window.innerHeight})}joinQueue(e,t,n){this.send({type:"mm_join_queue",mode:e,betAmount:t,gameMode:n})}leaveQueue(){this.send({type:"mm_leave_queue"})}confirmReady(){this.send({type:"mm_ready"})}getPlayerStats(){this.send({type:"get_player_stats"})}joinLobby(e){this.send({type:"join_lobby",lobbyId:e,screenWidth:window.innerWidth,screenHeight:window.innerHeight})}leaveLobby(){this.send({type:"leave_lobby"}),this.pendingReconnect=null}reconnectGame(e){this.send({type:"reconnect_game",lobbyId:e})}hasPendingReconnect(){return this.pendingReconnect!==null}clearPendingReconnect(){this.pendingReconnect=null}voteTable(e){this.send({type:"vote_table",tableId:e})}startGame(){this.send({type:"start_game"})}restartGame(){this.send({type:"restart_game"})}inviteFriend(e){this.send({type:"invite_friend",friendId:e})}getInvitations(){this.send({type:"get_invitations"})}respondInvitation(e,t){this.send({type:"respond_invitation",invitationId:e,accept:t})}rollDice(e,t){this.send({type:"roll_dice",dice1:e,dice2:t})}getEquippedDiceConfig(){if(!this.user?.equippedDiceId)return null;const e=this.inventory.find(t=>t.type==="dice"&&t.id===this.user?.equippedDiceId);return e?.config?{baseColor:e.config.baseColor||"#e5e5d7",dotColor:e.config.dotColor||"#383838",borderColor:e.config.borderColor||"#e5e5d7",roughness:e.config.roughness??.3,metalness:e.config.metalness??0,clearcoat:e.config.clearcoat??0,clearcoatRoughness:e.config.clearcoatRoughness??0,opacity:e.config.opacity??1,dotSize:e.config.dotSize??29,dotShape:e.config.dotShape??"circle",dotDepth:e.config.dotDepth??1.3,bevelRadius:e.config.bevelRadius??.08}:null}getEquippedTableConfig(){if(!this.user?.equippedTableId)return null;const e=this.inventory.find(t=>t.type==="table"&&t.id===this.user?.equippedTableId);return e?.config?e.config:null}throwDiceSync(e){this.send({type:"throw_dice_sync",throwData:e})}throwStart(e,t,n){this.send({type:"throw_start",throwPower:e,effectId:t,selectedDice:n})}throwFrame(e){this.send({type:"throw_frame",frame:e})}throwSound(e,t,n){this.send({type:"throw_sound",soundType:e,velocity:t,time:n})}throwEnd(e){this.send({type:"throw_end",finalResult:e})}passTurn(){this.send({type:"pass_turn"})}greedyPigStop(){this.send({type:"greedy_pig_stop"})}palmosTake(){this.send({type:"palmos_take"})}palmosReroll(e){this.send({type:"palmos_reroll",selectedDice:e})}disconnect(){this.ws&&(this.ws.close(),this.ws=null)}}function W0(){return"wss://street-dice.online/ws"}const D=new V0(W0());var Dr={};(function a(e,t,n,i){var s=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),o=typeof Path2D=="function"&&typeof DOMMatrix=="function",r=function(){if(!e.OffscreenCanvas)return!1;try{var P=new OffscreenCanvas(1,1),C=P.getContext("2d");C.fillRect(0,0,1,1);var V=P.transferToImageBitmap();C.createPattern(V,"no-repeat")}catch{return!1}return!0}();function l(){}function c(P){var C=t.exports.Promise,V=C!==void 0?C:e.Promise;return typeof V=="function"?new V(P):(P(l,l),null)}var d=function(P,C){return{transform:function(V){if(P)return V;if(C.has(V))return C.get(V);var z=new OffscreenCanvas(V.width,V.height),Z=z.getContext("2d");return Z.drawImage(V,0,0),C.set(V,z),z},clear:function(){C.clear()}}}(r,new Map),h=function(){var P=Math.floor(16.666666666666668),C,V,z={},Z=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(C=function(ne){var re=Math.random();return z[re]=requestAnimationFrame(function ie(pe){Z===pe||Z+P-1<pe?(Z=pe,delete z[re],ne()):z[re]=requestAnimationFrame(ie)}),re},V=function(ne){z[ne]&&cancelAnimationFrame(z[ne])}):(C=function(ne){return setTimeout(ne,P)},V=function(ne){return clearTimeout(ne)}),{frame:C,cancel:V}}(),u=function(){var P,C,V={};function z(Z){function ne(re,ie){Z.postMessage({options:re||{},callback:ie})}Z.init=function(ie){var pe=ie.transferControlToOffscreen();Z.postMessage({canvas:pe},[pe])},Z.fire=function(ie,pe,xe){if(C)return ne(ie,null),C;var ve=Math.random().toString(36).slice(2);return C=c(function(Se){function W(je){je.data.callback===ve&&(delete V[ve],Z.removeEventListener("message",W),C=null,d.clear(),xe(),Se())}Z.addEventListener("message",W),ne(ie,ve),V[ve]=W.bind(null,{data:{callback:ve}})}),C},Z.reset=function(){Z.postMessage({reset:!0});for(var ie in V)V[ie](),delete V[ie]}}return function(){if(P)return P;if(!n&&s){var Z=["var CONFETTI, SIZE = {}, module = {};","("+a.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{P=new Worker(URL.createObjectURL(new Blob([Z])))}catch(ne){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",ne),null}z(P)}return P}}(),m={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function g(P,C){return C?C(P):P}function v(P){return P!=null}function f(P,C,V){return g(P&&v(P[C])?P[C]:m[C],V)}function p(P){return P<0?0:Math.floor(P)}function y(P,C){return Math.floor(Math.random()*(C-P))+P}function x(P){return parseInt(P,16)}function _(P){return P.map(R)}function R(P){var C=String(P).replace(/[^0-9a-f]/gi,"");return C.length<6&&(C=C[0]+C[0]+C[1]+C[1]+C[2]+C[2]),{r:x(C.substring(0,2)),g:x(C.substring(2,4)),b:x(C.substring(4,6))}}function S(P){var C=f(P,"origin",Object);return C.x=f(C,"x",Number),C.y=f(C,"y",Number),C}function L(P){P.width=document.documentElement.clientWidth,P.height=document.documentElement.clientHeight}function q(P){var C=P.getBoundingClientRect();P.width=C.width,P.height=C.height}function w(P){var C=document.createElement("canvas");return C.style.position="fixed",C.style.top="0px",C.style.left="0px",C.style.pointerEvents="none",C.style.zIndex=P,C}function E(P,C,V,z,Z,ne,re,ie,pe){P.save(),P.translate(C,V),P.rotate(ne),P.scale(z,Z),P.arc(0,0,1,re,ie,pe),P.restore()}function G(P){var C=P.angle*(Math.PI/180),V=P.spread*(Math.PI/180);return{x:P.x,y:P.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:P.startVelocity*.5+Math.random()*P.startVelocity,angle2D:-C+(.5*V-Math.random()*V),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:P.color,shape:P.shape,tick:0,totalTicks:P.ticks,decay:P.decay,drift:P.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:P.gravity*3,ovalScalar:.6,scalar:P.scalar,flat:P.flat}}function J(P,C){C.x+=Math.cos(C.angle2D)*C.velocity+C.drift,C.y+=Math.sin(C.angle2D)*C.velocity+C.gravity,C.velocity*=C.decay,C.flat?(C.wobble=0,C.wobbleX=C.x+10*C.scalar,C.wobbleY=C.y+10*C.scalar,C.tiltSin=0,C.tiltCos=0,C.random=1):(C.wobble+=C.wobbleSpeed,C.wobbleX=C.x+10*C.scalar*Math.cos(C.wobble),C.wobbleY=C.y+10*C.scalar*Math.sin(C.wobble),C.tiltAngle+=.1,C.tiltSin=Math.sin(C.tiltAngle),C.tiltCos=Math.cos(C.tiltAngle),C.random=Math.random()+2);var V=C.tick++/C.totalTicks,z=C.x+C.random*C.tiltCos,Z=C.y+C.random*C.tiltSin,ne=C.wobbleX+C.random*C.tiltCos,re=C.wobbleY+C.random*C.tiltSin;if(P.fillStyle="rgba("+C.color.r+", "+C.color.g+", "+C.color.b+", "+(1-V)+")",P.beginPath(),o&&C.shape.type==="path"&&typeof C.shape.path=="string"&&Array.isArray(C.shape.matrix))P.fill(te(C.shape.path,C.shape.matrix,C.x,C.y,Math.abs(ne-z)*.1,Math.abs(re-Z)*.1,Math.PI/10*C.wobble));else if(C.shape.type==="bitmap"){var ie=Math.PI/10*C.wobble,pe=Math.abs(ne-z)*.1,xe=Math.abs(re-Z)*.1,ve=C.shape.bitmap.width*C.scalar,Se=C.shape.bitmap.height*C.scalar,W=new DOMMatrix([Math.cos(ie)*pe,Math.sin(ie)*pe,-Math.sin(ie)*xe,Math.cos(ie)*xe,C.x,C.y]);W.multiplySelf(new DOMMatrix(C.shape.matrix));var je=P.createPattern(d.transform(C.shape.bitmap),"no-repeat");je.setTransform(W),P.globalAlpha=1-V,P.fillStyle=je,P.fillRect(C.x-ve/2,C.y-Se/2,ve,Se),P.globalAlpha=1}else if(C.shape==="circle")P.ellipse?P.ellipse(C.x,C.y,Math.abs(ne-z)*C.ovalScalar,Math.abs(re-Z)*C.ovalScalar,Math.PI/10*C.wobble,0,2*Math.PI):E(P,C.x,C.y,Math.abs(ne-z)*C.ovalScalar,Math.abs(re-Z)*C.ovalScalar,Math.PI/10*C.wobble,0,2*Math.PI);else if(C.shape==="star")for(var de=Math.PI/2*3,Ee=4*C.scalar,ye=8*C.scalar,Xe=C.x,Re=C.y,A=5,M=Math.PI/A;A--;)Xe=C.x+Math.cos(de)*ye,Re=C.y+Math.sin(de)*ye,P.lineTo(Xe,Re),de+=M,Xe=C.x+Math.cos(de)*Ee,Re=C.y+Math.sin(de)*Ee,P.lineTo(Xe,Re),de+=M;else P.moveTo(Math.floor(C.x),Math.floor(C.y)),P.lineTo(Math.floor(C.wobbleX),Math.floor(Z)),P.lineTo(Math.floor(ne),Math.floor(re)),P.lineTo(Math.floor(z),Math.floor(C.wobbleY));return P.closePath(),P.fill(),C.tick<C.totalTicks}function H(P,C,V,z,Z){var ne=C.slice(),re=P.getContext("2d"),ie,pe,xe=c(function(ve){function Se(){ie=pe=null,re.clearRect(0,0,z.width,z.height),d.clear(),Z(),ve()}function W(){n&&!(z.width===i.width&&z.height===i.height)&&(z.width=P.width=i.width,z.height=P.height=i.height),!z.width&&!z.height&&(V(P),z.width=P.width,z.height=P.height),re.clearRect(0,0,z.width,z.height),ne=ne.filter(function(je){return J(re,je)}),ne.length?ie=h.frame(W):Se()}ie=h.frame(W),pe=Se});return{addFettis:function(ve){return ne=ne.concat(ve),xe},canvas:P,promise:xe,reset:function(){ie&&h.cancel(ie),pe&&pe()}}}function I(P,C){var V=!P,z=!!f(C||{},"resize"),Z=!1,ne=f(C,"disableForReducedMotion",Boolean),re=s&&!!f(C||{},"useWorker"),ie=re?u():null,pe=V?L:q,xe=P&&ie?!!P.__confetti_initialized:!1,ve=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,Se;function W(de,Ee,ye){for(var Xe=f(de,"particleCount",p),Re=f(de,"angle",Number),A=f(de,"spread",Number),M=f(de,"startVelocity",Number),j=f(de,"decay",Number),ae=f(de,"gravity",Number),oe=f(de,"drift",Number),le=f(de,"colors",_),Te=f(de,"ticks",Number),fe=f(de,"shapes"),Me=f(de,"scalar"),Le=!!f(de,"flat"),Ue=S(de),se=Xe,Ke=[],Ge=P.width*Ue.x,Fe=P.height*Ue.y;se--;)Ke.push(G({x:Ge,y:Fe,angle:Re,spread:A,startVelocity:M,color:le[se%le.length],shape:fe[y(0,fe.length)],ticks:Te,decay:j,gravity:ae,drift:oe,scalar:Me,flat:Le}));return Se?Se.addFettis(Ke):(Se=H(P,Ke,pe,Ee,ye),Se.promise)}function je(de){var Ee=ne||f(de,"disableForReducedMotion",Boolean),ye=f(de,"zIndex",Number);if(Ee&&ve)return c(function(M){M()});V&&Se?P=Se.canvas:V&&!P&&(P=w(ye),document.body.appendChild(P)),z&&!xe&&pe(P);var Xe={width:P.width,height:P.height};ie&&!xe&&ie.init(P),xe=!0,ie&&(P.__confetti_initialized=!0);function Re(){if(ie){var M={getBoundingClientRect:function(){if(!V)return P.getBoundingClientRect()}};pe(M),ie.postMessage({resize:{width:M.width,height:M.height}});return}Xe.width=Xe.height=null}function A(){Se=null,z&&(Z=!1,e.removeEventListener("resize",Re)),V&&P&&(document.body.contains(P)&&document.body.removeChild(P),P=null,xe=!1)}return z&&!Z&&(Z=!0,e.addEventListener("resize",Re,!1)),ie?ie.fire(de,Xe,A):W(de,Xe,A)}return je.reset=function(){ie&&ie.reset(),Se&&Se.reset()},je}var F;function B(){return F||(F=I(null,{useWorker:!0,resize:!0})),F}function te(P,C,V,z,Z,ne,re){var ie=new Path2D(P),pe=new Path2D;pe.addPath(ie,new DOMMatrix(C));var xe=new Path2D;return xe.addPath(pe,new DOMMatrix([Math.cos(re)*Z,Math.sin(re)*Z,-Math.sin(re)*ne,Math.cos(re)*ne,V,z])),xe}function Y(P){if(!o)throw new Error("path confetti are not supported in this browser");var C,V;typeof P=="string"?C=P:(C=P.path,V=P.matrix);var z=new Path2D(C),Z=document.createElement("canvas"),ne=Z.getContext("2d");if(!V){for(var re=1e3,ie=re,pe=re,xe=0,ve=0,Se,W,je=0;je<re;je+=2)for(var de=0;de<re;de+=2)ne.isPointInPath(z,je,de,"nonzero")&&(ie=Math.min(ie,je),pe=Math.min(pe,de),xe=Math.max(xe,je),ve=Math.max(ve,de));Se=xe-ie,W=ve-pe;var Ee=10,ye=Math.min(Ee/Se,Ee/W);V=[ye,0,0,ye,-Math.round(Se/2+ie)*ye,-Math.round(W/2+pe)*ye]}return{type:"path",path:C,matrix:V}}function X(P){var C,V=1,z="#000000",Z='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof P=="string"?C=P:(C=P.text,V="scalar"in P?P.scalar:V,Z="fontFamily"in P?P.fontFamily:Z,z="color"in P?P.color:z);var ne=10*V,re=""+ne+"px "+Z,ie=new OffscreenCanvas(ne,ne),pe=ie.getContext("2d");pe.font=re;var xe=pe.measureText(C),ve=Math.ceil(xe.actualBoundingBoxRight+xe.actualBoundingBoxLeft),Se=Math.ceil(xe.actualBoundingBoxAscent+xe.actualBoundingBoxDescent),W=2,je=xe.actualBoundingBoxLeft+W,de=xe.actualBoundingBoxAscent+W;ve+=W+W,Se+=W+W,ie=new OffscreenCanvas(ve,Se),pe=ie.getContext("2d"),pe.font=re,pe.fillStyle=z,pe.fillText(C,je,de);var Ee=1/V;return{type:"bitmap",bitmap:ie.transferToImageBitmap(),matrix:[Ee,0,0,Ee,-ve*Ee/2,-Se*Ee/2]}}t.exports=function(){return B().apply(this,arguments)},t.exports.reset=function(){B().reset()},t.exports.create=I,t.exports.shapeFromPath=Y,t.exports.shapeFromText=X})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),Dr,!1);const kl=Dr.exports;Dr.exports.create;const $0={status:{connecting:"Connecting...",online:"● Online",offline:"● Offline",inGame:"● In Game",lobby:"● Lobby",authFailed:"● Auth failed"},buttons:{cancel:"Cancel",leave:"Leave",accept:"Accept",decline:"Decline",invite:"Invite",remove:"Remove",ready:"Ready",start:"Start",close:"Close",save:"Save",back:"Back",confirm:"Confirm",buy:"Buy",equip:"Equip",equipped:"Equipped",stop:"Stop",pass:"Pass",take:"Take",reroll:"Reroll"},dialogs:{leaveGame:"Leave game?",leaveLobby:"Leave lobby?"},notifications:{title:"Notifications",news:"News",noNews:"No news yet",invitesYouTo:"invites you to",wantsToBeFriend:"wants to be your friend",friendRequest:"{nickname} wants to be your friend!",friendRequestSent:"Friend request sent!",friendRequestAccepted:"{nickname} accepted your friend request!",invitationReceived:"{nickname} invited you to play!",itemReceived:"🎁 You received: {item}!",itemsReceived:"🎁 You received {count} new items!",purchaseSuccess:"🎉 Purchased: {item}!",purchaseFailed:"Purchase failed",purchaseCancelled:"Purchase cancelled",paymentProcessing:"Payment processing...",paymentFailed:"Payment failed",paymentNotAvailable:"Telegram payment not available",playerLeft:"Other player left. Returning to solo mode.",gameStarted:"Game started!",firstShooter:"First shooter: {nickname}",reconnected:"Reconnected to game!",playerDisconnected:"{nickname} disconnected. Waiting for reconnect...",playerReconnected:"{nickname} reconnected!",reconnectFailed:"Failed to reconnect"},menu:{main:"Menu",friends:"Friends",invites:"Invites",inventory:"Inventory",shop:"Shop",settings:"Settings",customDice:"Custom Dice",signInYandex:"Sign in with Yandex",multiplayer:"Multiplayer"},notifPanel:{invites:"Invites",friends:"Friends"},profile:{title:"Profile",nickname:"Nickname",changeName:"Change name",stats:"Stats",gamesPlayed:"Games played",wins:"Wins",losses:"Losses",winRate:"Win rate",level:"Level",xp:"XP",pips:"Pips",xpProgress:"{current} / {next} XP"},multiplayer:{title:"Multiplayer",quickPlay:"Quick play",quickPlayHint:"Match with a random opponent",findMatch:"Find match",cancelSearch:"Cancel search",searching:"Searching for an opponent…",searchingAny:"Searching for {min}–{max} players…",matchFound:"Match found!",matchFailed:"Could not find a match",searchTimedOut:"Search timed out. Try another bet or mode.",modeDuel:"1×1",modeDuelSub:"Duel · two players",modeAny:"Any",modeAnySub:"Group · 3 to 5 players",selectGameMode:"Pick a game",selectMode:"Pick a format",selectBet:"Pick a bet",betAmount:"Bet",noBet:"No bet",noBetSub:"Free play · winner gets fixed pips",winnerTakesBank:"Winner takes the pot",currentBalance:"Your pips: {pips}",notEnoughPips:"Not enough pips for this bet",createLobby:"Create lobby",joinByCode:"Join by code",join:"Join",copy:"Copy code",leave:"Leave",start:"Start match",host:"host",you:"you",waitingHost:"Waiting for host to start…",connecting:"Connecting…",help:"Invite friends by sharing the 8-character lobby code, or use Quick play to match with random opponents.",iAmReady:"Ready",waitingForOthers:"Waiting for others…",decline:"Decline",keepPlaying:"Keep playing",pot:"Pot",open:"Open",matchFoundConfirm:"Match found — confirm ready",youAreReady:"You are ready",minimizeHint:"You can close this and keep rolling — we’ll ping you when a match is found.",unstableSearching:"Unstable connection — still searching…",reconnecting:"Reconnecting…",matchCancelledDisconnect:"A player lost connection. Match cancelled, your bet was refunded.",matchCancelledNotReady:"Someone didn’t confirm in time. Match cancelled, your bet was refunded.",matchCancelledDeclined:"A player declined. Match cancelled, your bet was refunded.",matchCancelled:"Match cancelled. Your bet was refunded.",connectionLost:"Connection lost. Please reload to retry.",matchmakingUnavailable:"Matchmaking not available on this build",readyCounter:"Ready",close:"Close",rulesTitle:"Rules"},friends:{title:"Friends",noFriends:"No friends yet",addFriend:"Add friend",searchPlaceholder:"Enter Telegram ID",search:"Search",online:"Online",offline:"Offline",inLobby:"In lobby",inGame:"In game",friendRequests:"Friend requests",noRequests:"No friend requests",removeFriend:"Remove friend",confirmRemove:"Remove {nickname} from friends?",invite:"Invite",notify:"Notify",invited:"Invited",inviteFriends:"Invite Friends"},referrals:{inviteFriend:"Invite for Rewards",yourCode:"Your referral code",stats:"Your stats",totalReferrals:"Total referrals",activeReferrals:"Active referrals",totalRewards:"Total rewards",rewards:"Rewards",friend:"friend",friends:"friends",games:"games",rareDice:"rare dice",rareTable:"rare table",friendPurchase:"Friend makes first purchase",sameItem:"same type & rarity item",copyLink:"Copy Link",shareTelegram:"Share via Telegram",linkCopied:"Link copied to clipboard!",copyFailed:"Failed to copy link",shareText:"Join me in Street Dice! 🎲"},invitations:{title:"Invitations",noInvitations:"No invitations",from:"From",gameMode:"Game mode"},lobby:{title:"Lobby",waiting:"Waiting for players...",selectTable:"Select table",players:"Players",inviteFriends:"Invite Friends",startGame:"Start Game",readyToStart:"Ready to start",votingForTable:"Vote for table",host:"Host",waitingForHost:"Waiting for host...",leaveLobby:"Leave Lobby",createLobby:"Create Lobby",selectGameMode:"Select Game Mode"},inventory:{title:"Inventory",dice:"Dice",tables:"Tables",effects:"Effects",keys:"Design Keys",customDice:"Custom Dice",noDice:"No dice yet",noTables:"No tables yet",noEffects:"No effects yet",noKeys:"No keys yet — buy one in the shop",noCustomDice:"You haven't saved a custom dice yet",keysOwned:"{count} key(s)",customDiceSaved:"Saved custom dice",equip:"Equip",useCustom:"Use custom",clearCustom:"Reset to equipped"},shop:{title:"Shop",dice:"Dice",tables:"Tables",effects:"Effects",keys:"Design Keys",stars:"stars",owned:"Owned",loading:"Loading...",noDiceAvailable:"No dice available",noTablesAvailable:"No tables available",noEffectsAvailable:"No effects available",noKeysAvailable:"No keys available",buyFor:"Buy for",youOwnThis:"You own this item",preview:"Preview",previewing:"Previewing: {item}",close:"Close",locked:"Locked",notEnoughPips:"Not enough pips",bought:"Bought!"},settings:{title:"Settings",language:"Language",graphics:"Graphics quality",graphicsLow:"Low",graphicsMedium:"Medium",graphicsHigh:"High",controls:"Controls",controlsMotion:"Motion",controlsManual:"Manual",sound:"Sound",soundOn:"On",soundOff:"Off",haptics:"Haptic feedback",hapticsOn:"On",hapticsOff:"Off",confirmBeforeThrow:"Confirm before throw"},gameModes:{freeRoll:"Free Roll",streetCraps:"Street Craps",mexico:"Mexico",greedyPig:"Greedy Pig",pokerDice:"Palmo's Dice",freeRollDesc:"Practice throws",streetCrapsDesc:"Classic street dice",mexicoDesc:"Lowest roll loses",greedyPigDesc:"First to 100 wins",pokerDiceDesc:"Poker hands with 5 dice",rules:"Rules",freeRollRules:`# Free Roll

**Practice mode** - throw dice without any rules or scoring.

Perfect for:
- Testing new dice skins
- Practicing your throwing technique
- Just having fun with physics

No winners, no losers - just pure dice rolling!`,streetCrapsRules:`# Street Craps — Rules

**Goal:** Win rounds by rolling the right combinations

## Come Out (First Roll)
Roll 2 dice:
- **7 or 11** — you win the round!
- **2, 3, or 12** — you lose the round
- **Other number (4, 5, 6, 8, 9, 10)** — this becomes your "Point", keep rolling

## Point (Next Rolls)
- Roll your **Point** number again — you win!
- Roll **7** — you lose
- Other numbers — keep rolling

## Victory
Win **3 rounds** to win the game!`,mexicoRules:`# Mexico — Rules

**Goal:** Don't get 5 penalty points and be the last player standing

## Round
Each player rolls 2 dice. Higher number = tens, lower = ones (6 and 4 = 64).

## Combination Strength (weak to strong)
- **Regular:** 31, 32, 41, 42, 43... up to 65
- **Doubles:** 11 < 22 < 33 < 44 < 55 < 66
- **MEXICO (2-1)** — the strongest combination!

## Penalties
Weakest combination in the round gets 1 penalty point. If tied — all tied players get a penalty!

## Elimination
Get 5 penalty points — you're out of the game.

## Victory
Last player remaining wins!`,greedyPigRules:`# Greedy Pig — Rules

**Goal:** Be the first to reach 100 points

## Your Turn
Roll 2 dice as many times as you want. Each roll adds to your turn score.

## Risks
- **One 1** — lose all turn points, turn passes to opponent
- **Two 1s (1-1)** — lose all turn points AND your total score resets to 0!

## Stop
You can stop at any time and add turn points to your total score.

## Victory
First player to reach 100 or more points wins!`,pokerDiceRules:`# Palmo's Dice 🎲 — Rules

**Goal:** Be the first to reach 200 points.

## Gameplay
Players take turns in rounds. On your turn:
1. **Roll 5 dice** (D6: 1 to 6)
2. **Check your combination** and decide:
   - **Take points** — round ends
   - **Reroll** — select dice to reroll

### If you reroll:
- Roll the selected dice
- **If 2+ ones appear → BUST:** -20 points (not below 0)
- Otherwise check all 5 dice and decide again
- **Maximum 3 rolls per round**

## Combinations
| Combination | Points | Example |
|-------------|--------|---------|
| **Five of a Kind** | 100 | [3][3][3][3][3] |
| **Four of a Kind** | 70 | [6][6][6][6][2] |
| **Large Straight** | 60 | [1][2][3][4][5] or [2][3][4][5][6] |
| **Full House** | 50 | [4][4][4][2][2] |
| **Straight (4 in a row)** | 40 | [2][3][4][5][1] |
| **Three of a Kind** | 30 | [5][5][5][1][2] |
| **Two Pair** | 20 | [3][3][6][6][1] |
| **One Pair** | 10 | [4][4][2][5][6] |
| **Nothing** | 0 | [1][2][4][5][6] |

First player to reach 200 or more points wins!`},rarities:{common:"Common",rare:"Rare",epic:"Epic",legendary:"Legendary"},errors:{serverError:"Server error",connectionLost:"Connection lost",unknownError:"Unknown error"},gameResults:{wins:"wins!",loses:"loses.",getsPenalty:"gets penalty!",eliminated:"eliminated!",turn:"Turn",total:"Total",pigOut:"🐷 Pig Out!",lostTurnPoints:"Lost {points} turn points",snakeEyes:"🐍 Snake Eyes!",lostEverything:"Lost {turnPoints} turn + {totalPoints} total = 0!",banked:"Banked {points} points!",score:"Score",bust:"🔥 BUST!"},reactions:{selectCategory:"Select",back:"Back",categories:{game:"Game",chat:"Chat",emotions:"Mood",actions:"Actions"},game:{niceRoll:"Nice!",close:"Close!"},chat:{goodLuck:"GL!",oneMore:"Again!",brb:"BRB"}},boosts:{title:"Boosts",activate:"Activate",active:"Active",cooldown:"Cooldown",ready:"Ready!",anotherActive:"Another boost active",alreadyActive:"Another boost is already active!",chooseParity:"Choose multiplier for:",even:"EVEN",odd:"ODD",double:{name:"Double Pips",desc:"x2 pips for all rolls"},triple:{name:"Triple Pips",desc:"x3 pips for even OR odd totals"},snakeEyes:{name:"Lucky Snakes",desc:"+1111 pips for snake eyes (1+1)"},golden:{name:"Golden Hour",desc:"x5 pips for all rolls"}},diceEditor:{title:"Custom Dice",appearance:"Appearance",pips:"Pips",material:"Material",physics:"Physics",reset:"Reset",apply:"Apply",baseColor:"Base Color",pipColor:"Pip Color",borderColor:"Border Color",bevelRadius:"Bevel Radius",pipSize:"Pip Size",pipDepth:"Pip Depth",roughness:"Roughness",metalness:"Metalness",clearcoat:"Clearcoat",clearcoatRoughness:"Clearcoat Roughness",opacity:"Opacity",noKey:"No Design Key",noKeyHint:"You need a Design Key to save a custom dice.",buyKey:"Buy in shop",useKey:"Use Design Key?",useKeyHint:"This will save your custom dice permanently.",keysRemaining:"You have {count} key(s) remaining.",saved:"Custom dice saved!",saving:"Saving custom dice..."},betting:{title:"Place Your Bet",subtitle:"Choose your bet amount",customAmount:"Custom Amount",pot:"Pot",confirm:"Confirm",waiting:"Waiting for others...",playersBets:"Players' Bets"}},q0={status:{connecting:"Подключение...",online:"● Онлайн",offline:"● Офлайн",inGame:"● В игре",lobby:"● Лобби",authFailed:"● Ошибка авторизации"},buttons:{cancel:"Отмена",leave:"Выйти",accept:"Принять",decline:"Отклонить",invite:"Пригласить",remove:"Удалить",ready:"Готов",start:"Начать",close:"Закрыть",save:"Сохранить",back:"Назад",confirm:"Подтвердить",buy:"Купить",equip:"Надеть",equipped:"Надето",stop:"Стоп",pass:"Пас",take:"Взять",reroll:"Перебросить"},dialogs:{leaveGame:"Выйти из игры?",leaveLobby:"Выйти из лобби?"},notifications:{title:"Уведомления",news:"Новости",noNews:"Пока нет новостей",invitesYouTo:"приглашает вас в",wantsToBeFriend:"хочет добавить вас в друзья",friendRequest:"{nickname} хочет добавить вас в друзья!",friendRequestSent:"Запрос в друзья отправлен!",friendRequestAccepted:"{nickname} принял ваш запрос в друзья!",invitationReceived:"{nickname} пригласил вас в игру!",itemReceived:"🎁 Вы получили: {item}!",itemsReceived:"🎁 Вы получили {count} новых предметов!",purchaseSuccess:"🎉 Куплено: {item}!",purchaseFailed:"Покупка не удалась",purchaseCancelled:"Покупка отменена",paymentProcessing:"Обработка платежа...",paymentFailed:"Платёж не прошёл",paymentNotAvailable:"Telegram платежи недоступны",playerLeft:"Другой игрок вышел. Возврат в одиночный режим.",gameStarted:"Игра началась!",firstShooter:"Первый бросок: {nickname}",reconnected:"Переподключение к игре!",playerDisconnected:"{nickname} отключился. Ожидание переподключения...",playerReconnected:"{nickname} переподключился!",reconnectFailed:"Не удалось переподключиться"},menu:{main:"Меню",friends:"Друзья",invites:"Приглашения",inventory:"Инвентарь",shop:"Магазин",settings:"Настройки",customDice:"Кастомный кубик",signInYandex:"Войти через Яндекс",multiplayer:"Мультиплеер"},notifPanel:{invites:"Приглашения",friends:"Друзья"},profile:{title:"Профиль",nickname:"Никнейм",changeName:"Изменить имя",stats:"Статистика",gamesPlayed:"Игр сыграно",wins:"Побед",losses:"Поражений",winRate:"Процент побед",level:"Уровень",xp:"XP",pips:"Очки",xpProgress:"{current} / {next} XP"},multiplayer:{title:"Мультиплеер",quickPlay:"Быстрая игра",quickPlayHint:"Подобрать случайного соперника",findMatch:"Найти соперника",cancelSearch:"Отменить поиск",searching:"Ищем соперника…",searchingAny:"Ищем {min}–{max} игроков…",matchFound:"Соперник найден!",matchFailed:"Не удалось найти соперника",searchTimedOut:"Поиск истёк. Попробуйте другую ставку или режим.",modeDuel:"1×1",modeDuelSub:"Дуэль · два игрока",modeAny:"Любой",modeAnySub:"Стол · от 3 до 5 игроков",selectGameMode:"Выберите игру",selectMode:"Выберите формат",selectBet:"Выберите ставку",betAmount:"Ставка",noBet:"Без ставки",noBetSub:"Бесплатная игра · победителю фиксированные очки",winnerTakesBank:"Победитель забирает банк",currentBalance:"У вас очков: {pips}",notEnoughPips:"Недостаточно очков для этой ставки",createLobby:"Создать лобби",joinByCode:"Войти по коду",join:"Войти",copy:"Скопировать код",leave:"Выйти",start:"Начать игру",host:"хост",you:"вы",waitingHost:"Ждём, когда хост начнёт…",connecting:"Подключаемся…",help:"Пригласите друзей, поделившись 8-значным кодом лобби, или используйте «Быструю игру» для поиска случайных соперников.",iAmReady:"Я готов",waitingForOthers:"Ждём других…",decline:"Отказаться",keepPlaying:"Продолжить игру",pot:"Банк",open:"Открыть",matchFoundConfirm:"Игра найдена — подтвердите готовность",youAreReady:"Вы готовы",minimizeHint:"Можете закрыть окно и бросать кубики — позовём, когда найдём соперника.",unstableSearching:"Нестабильно — продолжаем поиск…",reconnecting:"Подключение…",matchCancelledDisconnect:"Игрок потерял связь. Матч отменён, ставка возвращена.",matchCancelledNotReady:"Кто-то не подтвердил готовность. Матч отменён, ставка возвращена.",matchCancelledDeclined:"Игрок отказался. Матч отменён, ставка возвращена.",matchCancelled:"Матч отменён. Ставка возвращена.",connectionLost:"Соединение потеряно. Перезагрузите страницу.",matchmakingUnavailable:"Матчмейкинг недоступен в этой сборке.",readyCounter:"Готовы",close:"Закрыть",rulesTitle:"Правила"},friends:{title:"Друзья",noFriends:"Пока нет друзей",addFriend:"Добавить друга",searchPlaceholder:"Введите Telegram ID",search:"Поиск",online:"Онлайн",offline:"Офлайн",inLobby:"В лобби",inGame:"В игре",friendRequests:"Запросы в друзья",noRequests:"Нет запросов в друзья",removeFriend:"Удалить друга",confirmRemove:"Удалить {nickname} из друзей?",invite:"Пригласить",notify:"Уведомить",invited:"Приглашён",inviteFriends:"Пригласить друзей"},referrals:{inviteFriend:"Пригласи за награды",yourCode:"Ваш реферальный код",stats:"Ваша статистика",totalReferrals:"Всего рефералов",activeReferrals:"Активных рефералов",totalRewards:"Всего наград",rewards:"Награды",friend:"друг",friends:"друзей",games:"игр",rareDice:"редкие кости",rareTable:"редкий стол",friendPurchase:"Друг совершил первую покупку",sameItem:"предмет того же типа и редкости",copyLink:"Скопировать ссылку",shareTelegram:"Поделиться в Telegram",linkCopied:"Ссылка скопирована!",copyFailed:"Не удалось скопировать ссылку",shareText:"Присоединяйся ко мне в Street Dice! 🎲"},invitations:{title:"Приглашения",noInvitations:"Нет приглашений",from:"От",gameMode:"Режим игры"},lobby:{title:"Лобби",waiting:"Ожидание игроков...",selectTable:"Выберите стол",players:"Игроки",inviteFriends:"Пригласить друзей",startGame:"Начать игру",readyToStart:"Готовы начать",votingForTable:"Голосование за стол",host:"Хост",waitingForHost:"Ожидание хоста...",leaveLobby:"Выйти из лобби",createLobby:"Создать лобби",selectGameMode:"Выберите режим игры"},inventory:{title:"Инвентарь",dice:"Кости",tables:"Столы",effects:"Эффекты",keys:"Ключи дизайнера",customDice:"Кастомные кубики",noDice:"Пока нет костей",noTables:"Пока нет столов",noEffects:"Пока нет эффектов",noKeys:"Ключей пока нет — купи в магазине",noCustomDice:"Ты ещё не сохранил свой кубик",keysOwned:"{count} шт.",customDiceSaved:"Сохранённый кубик",equip:"Надеть",useCustom:"Применить",clearCustom:"Вернуть стандартный"},shop:{title:"Магазин",dice:"Кости",tables:"Столы",effects:"Эффекты",keys:"Ключи дизайнера",stars:"звёзд",owned:"Куплено",loading:"Загрузка...",noDiceAvailable:"Нет доступных костей",noTablesAvailable:"Нет доступных столов",noEffectsAvailable:"Нет доступных эффектов",noKeysAvailable:"Нет доступных ключей",buyFor:"Купить за",youOwnThis:"У вас есть этот предмет",preview:"Просмотр",previewing:"Просмотр: {item}",close:"Закрыть",locked:"Заблокировано",notEnoughPips:"Недостаточно pips",bought:"Куплено!"},settings:{title:"Настройки",language:"Язык",graphics:"Качество графики",graphicsLow:"Низкое",graphicsMedium:"Среднее",graphicsHigh:"Высокое",controls:"Управление",controlsMotion:"Движение",controlsManual:"Ручное",sound:"Звук",soundOn:"Вкл",soundOff:"Выкл",haptics:"Вибрация",hapticsOn:"Вкл",hapticsOff:"Выкл",confirmBeforeThrow:"Подтверждение броска"},gameModes:{freeRoll:"Free Roll",streetCraps:"Street Craps",mexico:"Mexico",greedyPig:"Greedy Pig",pokerDice:"Palmo's Dice",freeRollDesc:"Тренировочные броски",streetCrapsDesc:"Классические уличные кости",mexicoDesc:"Проигрывает меньший бросок",greedyPigDesc:"Первый до 100 побеждает",pokerDiceDesc:"Покерные комбинации на 5 костях",rules:"Правила",freeRollRules:`# Free Roll

**Тренировочный режим** - бросайте кости без правил и подсчета очков.

Идеально для:
- Тестирования новых скинов костей
- Практики техники броска
- Просто веселья с физикой

Нет победителей, нет проигравших - только чистое удовольствие от бросков!`,streetCrapsRules:`# Street Craps — Правила

**Цель:** Выиграть раунд, выбросив нужные комбинации

## Come Out (Первый бросок)
Бросайте 2 кубика:
- **7 или 11** — вы выиграли раунд!
- **2, 3 или 12** — вы проиграли раунд
- **Другое число (4, 5, 6, 8, 9, 10)** — это ваше "Point" число, продолжайте бросать

## Point (Следующие броски)
- Выбросьте ваше **Point** число снова — вы выиграли!
- Выбросьте **7** — вы проиграли
- Другие числа — продолжайте бросать

## Победа
Выиграйте **3 раунда** чтобы победить!`,mexicoRules:`# Mexico — Правила

**Цель:** Не набрать 5 штрафных очков и остаться последним в игре

## Раунд
Каждый игрок бросает 2 кубика. Большее число = десятки, меньшее = единицы (6 и 4 = 64).

## Сила комбинаций (от слабой к сильной)
- **Обычные:** 31, 32, 41, 42, 43... до 65
- **Дубли:** 11 < 22 < 33 < 44 < 55 < 66
- **MEXICO (2-1)** — самая сильная комбинация!

## Штрафы
У кого самая слабая комбинация в раунде — получает 1 штрафное очко. При ничье — все с одинаковым результатом получают штраф!

## Выбывание
Набрал 5 штрафных очков — выбываешь из игры.

## Победа
Последний оставшийся игрок побеждает!`,greedyPigRules:`# Greedy Pig — Правила

**Цель:** Первым набрать 100 очков

## Ход игрока
Бросайте 2 кубика столько раз, сколько хотите. Сумма каждого броска добавляется к очкам текущего хода.

## Риски
- **Одна 1** — все очки текущего хода сгорают, ход переходит сопернику
- **Две 1 (1-1)** — все очки текущего хода сгорают + ваш общий счёт обнуляется до 0!

## Стоп
В любой момент можете остановиться и добавить очки хода к общему счёту.

## Победа
Первый, кто наберёт 100 или больше очков, побеждает!`,pokerDiceRules:`# Palmo's Dice 🎲 — Правила

**Цель:** Первым набрать 200 очков.

## Ход игры
Игроки ходят по очереди раундами. В свой раунд:
1. **Бросаешь 5 кубиков** (D6: от 1 до 6)
2. **Смотришь комбинацию** и решаешь:
   - **Взять очки** — раунд закончен
   - **Перебросить** — выбираешь кубики для переброса

### Если перебрасываешь:
- Бросаешь выбранные кубики
- **Если среди них 2+ единицы → СГОРАНИЕ:** -20 очков (не ниже 0)
- Иначе смотришь на все 5 кубиков и снова решаешь
- **Максимум 3 броска за раунд**

## Комбинации
| Комбинация | Очки | Пример |
|------------|------|--------|
| **Пятёрка** | 100 | [3][3][3][3][3] |
| **Каре** | 70 | [6][6][6][6][2] |
| **Большой стрит** | 60 | [1][2][3][4][5] или [2][3][4][5][6] |
| **Фулл-хаус** | 50 | [4][4][4][2][2] |
| **Стрит (4 подряд)** | 40 | [2][3][4][5][1] |
| **Тройка** | 30 | [5][5][5][1][2] |
| **Две пары** | 20 | [3][3][6][6][1] |
| **Пара** | 10 | [4][4][2][5][6] |
| **Ничего** | 0 | [1][2][4][5][6] |

Первый игрок, набравший 200 или больше очков, побеждает!`},rarities:{common:"Обычный",rare:"Редкий",epic:"Эпический",legendary:"Легендарный"},errors:{serverError:"Ошибка сервера",connectionLost:"Соединение потеряно",unknownError:"Неизвестная ошибка"},gameResults:{wins:"выиграл!",loses:"проиграл.",getsPenalty:"получает штраф!",eliminated:"выбыл!",turn:"Ход",total:"Всего",pigOut:"🐷 Свинья!",lostTurnPoints:"Потеряно {points} очков хода",snakeEyes:"🐍 Змеиные глаза!",lostEverything:"Потеряно {turnPoints} хода + {totalPoints} всего = 0!",banked:"Сохранено {points} очков!",score:"Счёт",bust:"🔥 СГОРАНИЕ!"},reactions:{selectCategory:"Выбери",back:"Назад",categories:{game:"Игра",chat:"Общение",emotions:"Эмоции",actions:"Действия"},game:{niceRoll:"Круто!",close:"Почти!"},chat:{goodLuck:"Удачи!",oneMore:"Еще!",brb:"Отошел!"}},boosts:{title:"Ускорители",activate:"Активировать",active:"Активен",cooldown:"Перезарядка",ready:"Готов!",anotherActive:"Другой буст активен",alreadyActive:"Другой буст уже активен!",chooseParity:"Выберите множитель для:",even:"ЧЕТНЫЕ",odd:"НЕЧЕТНЫЕ",double:{name:"Double Pips",desc:"x2 pips за все броски"},triple:{name:"Triple Pips",desc:"x3 pips"},snakeEyes:{name:"Lucky Snakes",desc:"+1111 pips за змеиные глаза (1+1)"},golden:{name:"Golden Hour",desc:"x5 pips за все броски"}},diceEditor:{title:"Кастомный кубик",appearance:"Внешний вид",pips:"Точки",material:"Материал",physics:"Физика",reset:"Сброс",apply:"Применить",baseColor:"Цвет основы",pipColor:"Цвет точек",borderColor:"Цвет граней",bevelRadius:"Скругление граней",pipSize:"Размер точек",pipDepth:"Глубина точек",roughness:"Шероховатость",metalness:"Металличность",clearcoat:"Лак",clearcoatRoughness:"Шероховатость лака",opacity:"Прозрачность",noKey:"Нет ключа дизайнера",noKeyHint:"Для сохранения кубика нужен ключ дизайнера.",buyKey:"Купить в магазине",useKey:"Использовать ключ?",useKeyHint:"Кубик будет сохранён навсегда.",keysRemaining:"У тебя осталось {count} ключ(ей).",saved:"Кубик сохранён!",saving:"Сохраняем кубик..."},betting:{title:"Сделайте ставку",subtitle:"Выберите сумму для ставки",customAmount:"Своя сумма",pot:"Банк",confirm:"Подтвердить",waiting:"Ожидание других игроков...",playersBets:"Ставки игроков"}};function X0(){if(typeof window>"u")return null;try{const e=window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;if(e==="ru")return"ru";if(e==="en")return"en"}catch{}return null}const Y0={en:$0,ru:q0};let mn="en";const to=[];function j0(){const a=localStorage.getItem("language");if(a&&(a==="en"||a==="ru"))return mn=a,mn;const e=X0();return e?(mn=e,localStorage.setItem("language",e),mn):(mn="en",localStorage.setItem("language","en"),mn)}function K0(){return mn}function zl(a){a!=="en"&&a!=="ru"&&(console.warn(`[i18n] Unsupported language: ${a}, falling back to 'en'`),a="en"),mn=a,localStorage.setItem("language",a),to.forEach(e=>e(a))}function Z0(a){return to.push(a),()=>{const e=to.indexOf(a);e>-1&&to.splice(e,1)}}function J0(a,e){const t=e.split(".");let n=a;for(const i of t)if(n&&typeof n=="object"&&i in n)n=n[i];else return;return n}function Q0(a,e){return e?a.replace(/\{(\w+)\}/g,(t,n)=>{const i=e[n];return i!==void 0?String(i):t}):a}function U(a,e){const t=J0(Y0[mn],a);return t===void 0?(console.warn(`[i18n] Missing translation for key: ${a} (lang: ${mn})`),a):typeof t!="string"?(console.warn(`[i18n] Translation for key ${a} is not a string`),a):Q0(t,e)}class ey{constructor(e){N(this,"game");N(this,"gameState",{currentTurn:null,turnIndex:0,playerOrder:[],isInGame:!1,gameMode:"free_roll",players:new Map,phase:"come_out",pointValue:null,mexicoPenalties:{},mexicoGameOver:!1,greedyPigScores:{},greedyPigTurnScore:0,greedyPigGameOver:!1,palmosScores:{},palmosGameOver:!1,playerDiceConfigs:new Map});N(this,"gameHUD",null);N(this,"turnIndicator",null);N(this,"playersList",null);N(this,"passButton",null);N(this,"crapsStatus",null);N(this,"stopButton",null);N(this,"isThrowInProgress",!1);N(this,"diceResetScheduled",!1);N(this,"replayWaitTimeoutId",null);N(this,"replayWaitIntervalId",null);this.game=e,this.setupEventListeners(),this.createGameHUD()}setupEventListeners(){D.on("game_started",e=>{window.debugLog?.("GAME","========== GAME STARTED =========="),window.debugLog?.("GAME",`Players: ${e.lobby?.players?.length||0}, Items: ${e.lobby?.availableItems?.length||0}`);const t=document.querySelector("[data-mexico-result]");t&&t.remove();const n=document.querySelector("[data-greedy-pig-result]");n&&n.remove();const i=document.querySelector("[data-palmos-result]");i&&i.remove();const s=this.game.getDiceSync();s&&s.resetForSoloMode(),this.gameState.isInGame=!0,this.gameState.currentTurn=e.currentTurn,this.gameState.playerOrder=e.playerOrder||[],this.gameState.gameMode=e.lobby?.gameMode||"free_roll",this.gameState.phase=e.phase||"come_out",this.gameState.pointValue=e.pointValue||null;const o=e.diceCount||this.getDiceCountForMode(this.gameState.gameMode);if(this.game.setDiceCount(o),e.tableConfig&&this.game.updateTableAppearance(e.tableConfig),this.gameState.players.clear(),this.gameState.playerDiceConfigs.clear(),window.debugLog?.("GAME",`Starting preload, availableItems: ${e.lobby?.availableItems?.length||0}, inventory: ${D.inventory?.length||0}`),e.lobby?.players)for(const l of e.lobby.players){const c=l.oderId||l.userId,d=l.nickname||l.user?.nickname||`Player${c}`;if(c){this.gameState.players.set(c,d);const h=l.equippedDiceId||l.user?.equippedDiceId;if(window.debugLog?.("GAME",`Player ${c} diceId: ${h}`),h){let u=this.getDiceConfigById(h,e.lobby.availableItems);!u&&D.inventory&&(u=this.getDiceConfigById(h,D.inventory)),u?(this.gameState.playerDiceConfigs.set(c,u),window.debugLog?.("GAME",`✓ Preloaded config for player ${c}`)):(window.debugLog?.("GAME",`✗ Failed to preload for player ${c}`),console.warn("[GameSync] ✗ Failed to preload dice config for player",c,"diceId:",h),console.warn("[GameSync] Available dice items:",e.lobby.availableItems?.filter(m=>m.type==="dice").map(m=>m.id)),console.warn("[GameSync] Inventory dice items:",D.inventory?.filter(m=>m.type==="dice").map(m=>m.id)))}else console.warn("[GameSync] ✗ No equippedDiceId for player",c)}}window.debugLog?.("GAME",`Preload complete: ${this.gameState.playerDiceConfigs.size} configs loaded`),e.minAspectRatio&&this.game.setSyncedAspectRatio(e.minAspectRatio),this.gameState.gameMode==="mexico"&&(this.gameState.mexicoPenalties=e.penalties||{},this.gameState.mexicoGameOver=!1,Object.keys(this.gameState.mexicoPenalties).length===0&&this.gameState.playerOrder.forEach(l=>{this.gameState.mexicoPenalties[l]=0})),this.gameState.gameMode==="greedy_pig"&&(this.gameState.greedyPigScores=e.scores||{},this.gameState.greedyPigTurnScore=0,this.gameState.greedyPigGameOver=!1,Object.keys(this.gameState.greedyPigScores).length===0&&this.gameState.playerOrder.forEach(l=>{this.gameState.greedyPigScores[l]=0})),this.showGameHUD(),this.updateTurnIndicator(),this.updatePlayersList(),this.updateCrapsStatus(),this.disableSoloControls(),this.game.updateUIVisibility();const r=e.currentTurn===D.user?.id;this.game.onGameStarted(r),e.throwSeed!==void 0&&this.game.setThrowSeed(e.throwSeed)}),D.on("game_reconnected",e=>{window.debugLog?.("GAME","========== GAME RECONNECTED =========="),window.debugLog?.("GAME",`Players: ${e.lobby?.players?.length||0}, Items: ${e.lobby?.availableItems?.length||0}`);const t=this.game.getDiceSync();if(t&&t.resetForSoloMode(),this.gameState.isInGame=!0,this.gameState.currentTurn=e.currentTurn,this.gameState.playerOrder=e.playerOrder||[],this.gameState.gameMode=e.lobby?.gameMode||"free_roll",this.gameState.phase=e.phase||"come_out",this.gameState.pointValue=e.pointValue||null,e.tableConfig&&this.game.updateTableAppearance(e.tableConfig),this.gameState.players.clear(),this.gameState.playerDiceConfigs.clear(),window.debugLog?.("GAME",`Starting preload (reconnect), availableItems: ${e.lobby?.availableItems?.length||0}, inventory: ${D.inventory?.length||0}`),e.lobby?.players)for(const o of e.lobby.players){const r=o.oderId||o.userId,l=o.nickname||o.user?.nickname||`Player${r}`;if(r){this.gameState.players.set(r,l);const c=o.equippedDiceId||o.user?.equippedDiceId;if(window.debugLog?.("GAME",`Player ${r} diceId: ${c}`),c){let d=this.getDiceConfigById(c,e.lobby.availableItems);!d&&D.inventory&&(d=this.getDiceConfigById(c,D.inventory)),d?(this.gameState.playerDiceConfigs.set(r,d),window.debugLog?.("GAME",`✓ Preloaded config for player ${r}`)):(window.debugLog?.("GAME",`✗ Failed to preload for player ${r}`),console.warn("[GameSync] ✗ Failed to preload dice config for player",r,"diceId:",c),console.warn("[GameSync] Available dice items:",e.lobby.availableItems?.filter(h=>h.type==="dice").map(h=>h.id)),console.warn("[GameSync] Inventory dice items:",D.inventory?.filter(h=>h.type==="dice").map(h=>h.id)))}else console.warn("[GameSync] ✗ No equippedDiceId for player",r)}}window.debugLog?.("GAME",`Preload complete (reconnect): ${this.gameState.playerDiceConfigs.size} configs loaded`);const n=e.diceCount||this.getDiceCountForMode(this.gameState.gameMode),i=this.gameState.gameMode==="poker_dice"&&e.lastFrame&&e.currentRound;this.game.setDiceCount(n,i),e.minAspectRatio&&this.game.setSyncedAspectRatio(e.minAspectRatio),this.gameState.gameMode==="mexico"&&(this.gameState.mexicoPenalties=e.penalties||{},this.gameState.mexicoGameOver=!1),this.gameState.gameMode==="greedy_pig"&&(this.gameState.greedyPigScores=e.scores||{},this.gameState.greedyPigTurnScore=e.turnScore||0,this.gameState.greedyPigGameOver=!1),this.gameState.gameMode==="poker_dice"&&(this.gameState.palmosScores=e.scores||{},this.gameState.palmosGameOver=!1),this.showGameHUD(),this.updateTurnIndicator(),this.updatePlayersList(),this.updateCrapsStatus(),this.disableSoloControls();const s=e.currentTurn===D.user?.id;window.debugLog?.("GAME",`Reconnect - gameMode: ${this.gameState.gameMode}, isMyTurn: ${s}`),this.gameState.gameMode==="poker_dice"?(window.debugLog?.("GAME",`Palmo's Dice reconnect - hasLastFrame: ${!!e.lastFrame}, hasCurrentRound: ${!!e.currentRound}, currentRoundPlayerId: ${e.currentRound?.playerId}, myUserId: ${D.user?.id}`),s?e.lastFrame&&e.currentRound&&e.currentRound.playerId===D.user?.id?(window.debugLog?.("GAME","Palmo's Dice reconnect: Restoring dice from last frame"),this.game.restoreDiceFromFrame(e.lastFrame),this.game.enableDiceSelection(),window.debugLog?.("GAME","Palmo's Dice UI restored: selection enabled")):(window.debugLog?.("GAME","Palmo's Dice reconnect: My turn, dice in hand (no lastFrame or currentRound)"),this.game.onGameStarted(!0)):(window.debugLog?.("GAME",`Palmo's Dice reconnect: Not my turn, teleporting to player ${e.currentTurn}`),this.game.teleportDiceToNextPlayer(e.currentTurn,!1))):this.game.onGameStarted(s),e.throwSeed!==void 0&&this.game.setThrowSeed(e.throwSeed)}),D.on("craps_result",e=>{this.gameState.phase=e.phase,this.gameState.pointValue=e.pointValue,this.showCrapsResult(e.message,e.shooterWins),this.updateCrapsStatus(),this.resetDiceForNextTurn(800,e.nextTurn)}),D.on("mexico_result",e=>{e.data?.penalties&&(this.gameState.mexicoPenalties=e.data.penalties),e.gameOver&&(this.gameState.mexicoGameOver=!0,e.payouts&&(this.gameState.payouts=e.payouts)),this.showMexicoResult(e),this.updatePlayersList()}),D.on("greedy_pig_result",e=>{if(e.outcome==="stop"){const t=this.game.getDiceSync();t?.isCurrentlyReplaying()&&t.stopReplay()}e.data?.scores&&(this.gameState.greedyPigScores=e.data.scores),this.gameState.greedyPigTurnScore=e.data?.turnScore||0,e.nextTurn!==null&&e.nextTurn!==void 0&&(this.gameState.currentTurn=e.nextTurn,this.gameState.turnIndex=this.gameState.playerOrder.indexOf(e.nextTurn)),e.gameOver&&(this.gameState.greedyPigGameOver=!0,e.payouts&&(this.gameState.payouts=e.payouts)),this.showGreedyPigResult(e),this.updatePlayersList(),this.updateTurnIndicator(),e.gameOver||(window.debugLog?.("DICE",`greedy_pig_result: nextTurn=${e.nextTurn}, outcome=${e.outcome}`),this.resetDiceForNextTurn(800,e.nextTurn))}),D.on("palmos_result",e=>{this.handlePalmosResult(e)}),D.on("poker_dice_result",e=>{this.handlePalmosResult(e)}),D.on("palmos_reroll_ready",e=>{window.debugLog?.("PALMOS",`Reroll ready: [${e.selectedDice.join(",")}]`),this.game.prepareRerollDice(e.selectedDice)}),D.on("palmos_reroll_selection",e=>{window.debugLog?.("PALMOS",`Player ${e.playerNickname} selected dice for reroll: [${e.selectedDice.join(",")}]`),e.playerId!==D.user?.id&&this.game.showOtherPlayerDiceSelection(e.selectedDice)}),D.on("game_payouts",e=>{this.gameState.payouts=e.payouts}),D.on("dice_rolled",e=>{e.playerId!==D.user?.id&&this.showOtherPlayerRoll(e)}),D.on("throw_start",e=>{if(e.playerId===D.user?.id)return;this.game.clearDiceSelection();const t=this.game.getDiceSync(),n=this.getPlayerDiceConfig(e.playerId)||e.diceConfig||null;n||console.error("[GameSync] CRITICAL: No config for player",e.playerId,"in throw_start!"),t.startStreamingReplay({playerId:e.playerId,playerNickname:e.playerNickname,throwPower:e.throwPower,effectId:e.effectId,diceConfig:n})}),D.on("throw_frame",e=>{e.playerId!==D.user?.id&&this.game.getDiceSync().addStreamingFrame(e.frame)}),D.on("throw_sound",e=>{e.playerId!==D.user?.id&&this.game.getDiceSync().playStreamingSound(e.soundType,e.velocity,e.time)}),D.on("throw_end",e=>{e.playerId!==D.user?.id&&this.game.getDiceSync().endStreamingReplay({dice1:e.finalResult.dice1,dice2:e.finalResult.dice2,total:e.finalResult.total,diceValues:e.finalResult.diceValues})}),D.on("dice_throw_sync",e=>{if(e.playerId!==D.user?.id&&!e.throwData){console.error("[GameSync] No throwData in message!");return}}),D.on("turn_changed",e=>{this.gameState.currentTurn=e.playerId,this.updateTurnIndicator(),this.updatePlayersList(),e.throwSeed!==void 0&&this.game.setThrowSeed(e.throwSeed);const t=e.playerId===D.user?.id;this.waitForReplayAndNotify(t)}),D.on("turn_passed",e=>{this.showNotification(`${this.getPlayerNickname(e.fromPlayerId)} passed`)}),D.on("lobby_left",()=>{this.resetToSoloMode()}),D.on("game_ended_by_disconnect",()=>{this.resetToSoloMode()}),D.on("player_disconnected",e=>{if(!e||e.oderId===D.user?.id)return;const t=this.getPlayerNickname(e.oderId)||e.nickname||"Игрок";this.showNotification(`${t} отключился, ожидание переподключения…`)}),D.on("player_reconnected",e=>{if(!e||e.oderId===D.user?.id)return;const t=this.getPlayerNickname(e.oderId)||e.nickname||"Игрок";this.showNotification(`${t} переподключился`)})}resetToSoloMode(){const e=document.querySelector("[data-mexico-result]");e&&e.remove();const t=document.querySelector("[data-greedy-pig-result]");t&&t.remove();const n=document.querySelector("[data-palmos-result]");n&&n.remove(),this.gameState.isInGame=!1,this.gameState.currentTurn=null,this.gameState.playerOrder=[],this.gameState.players.clear(),this.gameState.playerDiceConfigs.clear(),this.gameState.phase="come_out",this.gameState.pointValue=null,this.gameState.mexicoPenalties={},this.gameState.mexicoGameOver=!1,this.hideGameHUD(),this.enableSoloControls(),this.game.updateUIVisibility();const i=this.game.getDiceSync();i&&(i.clearIndicators(),i.resetForSoloMode()),this.game.resetWallsToLocal();const s=D.getEquippedTableConfig();s&&this.game.updateTableAppearance(s),this.game.showWallText(!0),this.game.onTurnChanged(!0)}createGameHUD(){this.gameHUD=document.createElement("div"),this.gameHUD.id="game-hud",this.gameHUD.style.cssText=`
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      border-radius: 12px;
      padding: 6px 12px;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      font-size: 14px;
      display: none;
      z-index: 90;
      text-align: center;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    `,this.gameHUD.innerHTML=`
      <div id="craps-status" style="margin-bottom: 6px; font-weight: 600; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: none;"></div>
      <div id="turn-indicator" style="margin-bottom: 6px; font-weight: 600; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"></div>
      <div id="players-list" style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 6px; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"></div>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <button id="pass-turn-btn" style="
          padding: 6px 12px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${U("buttons.pass")}</button>
        <button id="stop-turn-btn" style="
          padding: 6px 12px;
          background: #4CAF50;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${U("buttons.stop")}</button>
        <button id="palmos-take-btn" style="
          padding: 6px 12px;
          background: #4CAF50;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${U("buttons.take")}</button>
        <button id="palmos-reroll-btn" style="
          padding: 6px 12px;
          background: #FF9800;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: none;
        ">${U("buttons.reroll")}</button>
      </div>
    `,document.body.appendChild(this.gameHUD),this.turnIndicator=document.getElementById("turn-indicator"),this.playersList=document.getElementById("players-list"),this.passButton=document.getElementById("pass-turn-btn"),this.stopButton=document.getElementById("stop-turn-btn"),this.crapsStatus=document.getElementById("craps-status");const e=document.getElementById("palmos-take-btn"),t=document.getElementById("palmos-reroll-btn");e?.addEventListener("click",()=>{if(window.debugLog?.("PALMOS",`Take btn clicked! throwInProgress=${this.isThrowInProgress}`),this.isThrowInProgress){window.debugLog?.("PALMOS","Take blocked by throwInProgress");return}e&&(e.style.pointerEvents="none",e.style.opacity="0.5"),window.debugLog?.("PALMOS","Sending take command to server"),D.palmosTake()}),t?.addEventListener("click",()=>{if(window.debugLog?.("PALMOS",`Reroll btn clicked! throwInProgress=${this.isThrowInProgress}`),this.isThrowInProgress){window.debugLog?.("PALMOS","Reroll blocked by throwInProgress");return}const n=this.game.getSelectedDiceForReroll();if(window.debugLog?.("PALMOS",`Selected dice count: ${n.length}`),n.length===0){window.debugLog?.("PALMOS","No dice selected, ignoring reroll");return}t&&(t.style.pointerEvents="none",t.style.opacity="0.5"),window.debugLog?.("PALMOS",`Sending reroll: [${n.join(",")}]`),D.palmosReroll(n)}),this.passButton?.addEventListener("click",()=>{if(this.isThrowInProgress||!this.game.isDiceInHand())return;this.passButton&&(this.passButton.style.pointerEvents="none",this.passButton.style.opacity="0.5"),this.game.setDiceInHand(!1);const n=this.game.getDiceSync();n&&n.isCurrentlyRecording()&&n.stopRecordingStream(!1),D.passTurn()}),this.stopButton?.addEventListener("click",()=>{if(this.isThrowInProgress||!this.game.isDiceInHand())return;this.stopButton&&(this.stopButton.style.pointerEvents="none",this.stopButton.style.opacity="0.5"),this.game.setDiceInHand(!1);const n=this.game.getDiceSync();n&&n.isCurrentlyRecording()&&n.stopRecordingStream(!1),D.greedyPigStop()})}showGameHUD(){this.gameHUD&&(this.gameHUD.style.display="block")}hideGameHUD(){this.gameHUD&&(this.gameHUD.style.display="none")}updateTurnIndicator(){if(!this.turnIndicator)return;const e=this.gameState.currentTurn===D.user?.id;this.turnIndicator.style.display="none";const t=document.getElementById("palmos-take-btn"),n=document.getElementById("palmos-reroll-btn");e&&this.gameState.gameMode==="free_roll"&&this.passButton?(this.passButton.style.display="inline-block",this.isThrowInProgress||(this.passButton.style.pointerEvents="auto",this.passButton.style.opacity="1")):this.passButton&&(this.passButton.style.display="none"),e&&this.gameState.gameMode==="greedy_pig"&&this.gameState.greedyPigTurnScore>0&&this.stopButton?(this.stopButton.style.display="inline-block",this.stopButton.textContent=`${U("buttons.stop")} (+${this.gameState.greedyPigTurnScore})`,this.isThrowInProgress||(this.stopButton.style.pointerEvents="auto",this.stopButton.style.opacity="1")):this.stopButton&&(this.stopButton.style.display="none"),e&&this.gameState.gameMode==="poker_dice"&&!this.game.isDiceInHand()&&t&&n?(window.debugLog?.("PALMOS",`Showing buttons, throwInProgress=${this.isThrowInProgress}`),t.style.display="inline-block",n.style.display="inline-block",this.isThrowInProgress?window.debugLog?.("PALMOS","Buttons disabled (throw in progress)"):(t.style.pointerEvents="auto",t.style.opacity="1",n.style.pointerEvents="auto",n.style.opacity="1",window.debugLog?.("PALMOS","Buttons enabled"))):(t&&(t.style.display="none"),n&&(n.style.display="none"))}updateCrapsStatus(){if(!this.crapsStatus)return;this.gameState.gameMode==="street_craps"?(this.crapsStatus.style.display="block",this.gameState.phase==="come_out"?this.crapsStatus.innerHTML='<span style="color: #FFD700;">COME OUT ROLL</span>':this.crapsStatus.innerHTML=`<span style="color: #00BFFF;">POINT: ${this.gameState.pointValue}</span>`):this.gameState.gameMode==="mexico"?(this.crapsStatus.style.display="block",this.crapsStatus.innerHTML='<span style="color: #FFD700; cursor: pointer;" data-game-rules="mexico">🇲🇽 MEXICO</span>'):this.gameState.gameMode==="greedy_pig"?(this.crapsStatus.style.display="block",this.crapsStatus.innerHTML='<span style="color: #FF69B4; cursor: pointer;" data-game-rules="greedy_pig">🐷 GREEDY PIG</span>'):this.gameState.gameMode==="poker_dice"?(this.crapsStatus.style.display="block",this.crapsStatus.innerHTML=`<span style="color: #FFD700; cursor: pointer;" data-game-rules="poker_dice">🎲 PALMO'S DICE</span>`):this.crapsStatus.style.display="none";const e=this.crapsStatus.querySelector("[data-game-rules]");e&&e.addEventListener("click",()=>{const t=e.getAttribute("data-game-rules");t&&window.dispatchEvent(new CustomEvent("showGameRules",{detail:{mode:t}}))})}showCrapsResult(e,t){const n=this.getPlayerNickname(this.gameState.currentTurn);let i=e;t===!0?(i=`${n} ${U("gameResults.wins")} ${e}`,this.gameState.currentTurn===D.user?.id&&this.celebrateWinner()):t===!1&&(i=`${n} ${U("gameResults.loses")} ${e}`);const s=t===!0?"#4CAF50":t===!1?"#f44336":"#FFD700",o=t===!0?"rgba(76, 175, 80, 0.3)":t===!1?"rgba(244, 67, 54, 0.3)":"rgba(255, 215, 0, 0.3)",r=document.createElement("div");r.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${o};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${s};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
    `,r.textContent=i,document.body.appendChild(r),setTimeout(()=>r.remove(),3e3)}showMexicoResult(e){const{scoreName:t,losers:n,eliminated:i}=e.data||{},s=e.outcome,o=e.winners,r=e.gameOver;let l=t||e.message,c="rgba(255, 215, 0, 0.3)",d="#FFD700",h=!1;if(s==="round_end"){const m=(n||[]).map(g=>this.getPlayerNickname(g)).join(", ");if(l=`${t}
${m} ${U("gameResults.getsPenalty")}`,c="rgba(244, 67, 54, 0.3)",d="#f44336",i&&i.length>0){const g=i.map(v=>this.getPlayerNickname(v)).join(", ");l+=`
${g} ${U("gameResults.eliminated")}`}}else if(s==="game_over"||r&&o&&o.length>0){const m=this.getPlayerNickname(o[0]),g=this.gameState.payouts?.[o[0]];g&&g>0?l=`🏆 ${m} ${U("gameResults.wins")}
💰 +${g} pips`:l=`🏆 ${m} ${U("gameResults.wins")}`,c="rgba(76, 175, 80, 0.3)",d="#4CAF50",h=!0,o[0]===D.user?.id&&this.celebrateWinner()}const u=document.createElement("div");u.setAttribute("data-mexico-result","true"),u.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${c};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${d};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `,u.textContent=l,h&&u.appendChild(this.buildGameOverButtons(u)),document.body.appendChild(u),h||(u.style.cursor="pointer",u.addEventListener("click",()=>u.remove()),setTimeout(()=>u.remove(),3e3))}showGreedyPigResult(e){const{outcome:t,message:n,gameOver:i,winners:s,payouts:o}=e,{turnScore:r,scores:l,bankedScore:c,newTotal:d,lostTurnScore:h,lostTotalScore:u}=e.data||{};let m=n,g="rgba(255, 215, 0, 0.3)",v="#FFD700",f=!1,p=!0;if(t==="roll"){const x=l?.[e.playerId]||0;m=`+${e.total}
${U("gameResults.turn")}: ${r}
${U("gameResults.total")}: ${x}`,g="rgba(76, 175, 80, 0.3)",v="#4CAF50"}else if(t==="pig_out")m=`${U("gameResults.pigOut")}
${U("gameResults.lostTurnPoints",{points:h})}`,g="rgba(244, 67, 54, 0.3)",v="#f44336";else if(t==="double_ones")m=`${U("gameResults.snakeEyes")}
${U("gameResults.lostEverything",{turnPoints:h,totalPoints:u})}`,g="rgba(244, 67, 54, 0.5)",v="#f44336";else if(t==="stop")m=`${U("gameResults.banked",{points:c})}
${U("gameResults.total")}: ${d}`,g="rgba(76, 175, 80, 0.3)",v="#4CAF50";else if(t==="game_over"||i){const x=this.getPlayerNickname(s?.[0]),_=l?.[s?.[0]]||d||0,R=o?.[s?.[0]];R&&R>0?m=`🏆 ${x} ${U("gameResults.wins")}
${U("gameResults.score")}: ${_}
💰 +${R} pips`:m=`🏆 ${x} ${U("gameResults.wins")}
${U("gameResults.score")}: ${_}`,g="rgba(76, 175, 80, 0.3)",v="#4CAF50",f=!0,p=!1,s?.[0]===D.user?.id&&this.celebrateWinner()}const y=document.createElement("div");y.setAttribute("data-greedy-pig-result","true"),y.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${g};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${v};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `,y.textContent=m,f&&y.appendChild(this.buildGameOverButtons(y)),document.body.appendChild(y),f||(y.style.cursor="pointer",y.addEventListener("click",()=>y.remove()),p&&setTimeout(()=>y.remove(),t==="roll"?1e3:2500)),this.updateTurnIndicator()}handlePalmosResult(e){e.data?.scores&&(this.gameState.palmosScores=e.data.scores),e.nextTurn!==null&&e.nextTurn!==void 0&&(this.gameState.currentTurn=e.nextTurn,this.gameState.turnIndex=this.gameState.playerOrder.indexOf(e.nextTurn)),e.gameOver&&(this.gameState.palmosGameOver=!0,e.payouts&&(this.gameState.payouts=e.payouts)),(e.action==="take"||e.data?.bust||e.data?.autoTake||e.gameOver)&&this.showPalmosResult(e),this.updatePlayersList(),this.updateTurnIndicator(),(e.action==="take"||e.data?.bust)&&this.game.disableDiceSelection(),(e.action==="take"||e.data?.bust||e.data?.autoTake||e.gameOver)&&!e.gameOver&&setTimeout(()=>{const i=e.nextTurn;i===D.user?.id?(this.game.setDiceInHand(!1),this.game.onTurnChanged(!0)):this.game.teleportDiceToNextPlayer(i)},2e3)}showPalmosResult(e){const{outcome:t,message:n,gameOver:i,winners:s,payouts:o,action:r}=e,{hand:l,points:c,newScore:d,scores:h,bust:u,onesCount:m,autoTake:g}=e.data||{};let v=n,f="rgba(255, 215, 0, 0.3)",p="#FFD700",y=!1,x=!0;if(t==="game_over"||i){const R=this.getPlayerNickname(s?.[0]),S=h?.[s?.[0]]||d||0,L=o?.[s?.[0]];L&&L>0?v=`🏆 ${R} ${U("gameResults.wins")}
${U("gameResults.score")}: ${S}
💰 +${L} pips`:v=`🏆 ${R} ${U("gameResults.wins")}
${U("gameResults.score")}: ${S}`,f="rgba(76, 175, 80, 0.3)",p="#4CAF50",y=!0,x=!1,s?.[0]===D.user?.id&&this.celebrateWinner()}else u?(v=`${U("gameResults.bust")}
${m} единиц
-20 очков
${U("gameResults.total")}: ${d}`,f="rgba(244, 67, 54, 0.3)",p="#f44336"):g?(v=`${l}
+${c} очков
${U("gameResults.total")}: ${d}`,f="rgba(76, 175, 80, 0.3)",p="#4CAF50"):r==="take"?(v=`${l}
+${c} очков
${U("gameResults.total")}: ${d}`,f="rgba(76, 175, 80, 0.3)",p="#4CAF50"):t==="roll"&&(v=`${l}
${c} очков`,f="rgba(255, 215, 0, 0.3)",p="#FFD700");const _=document.createElement("div");_.setAttribute("data-palmos-result","true"),_.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${f};
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 400;
      z-index: 1000;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid ${p};
      max-width: 70vw;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
      white-space: pre-line;
    `,_.textContent=v,y&&_.appendChild(this.buildGameOverButtons(_)),document.body.appendChild(_),y||(_.style.cursor="pointer",_.addEventListener("click",()=>_.remove()),x&&setTimeout(()=>_.remove(),t==="roll"?1500:2500)),this.updateTurnIndicator()}updatePlayersList(){if(!this.playersList)return;if(this.gameState.gameMode==="mexico"){this.renderMexicoPlayersList();return}if(this.gameState.gameMode==="greedy_pig"){this.renderGreedyPigPlayersList();return}if(this.gameState.gameMode==="poker_dice"){this.renderPalmosDicePlayersList();return}this.playersList.style.flexDirection="row",this.playersList.style.alignItems="center";const e=this.gameState.playerOrder.indexOf(this.gameState.currentTurn),t=this.gameState.playerOrder.length;let n=[];if(t<=3)n=this.gameState.playerOrder.map(s=>({playerId:s,role:s===this.gameState.currentTurn?"current":"other"}));else{const s=(e-1+t)%t,o=(e+1)%t;n=[{playerId:this.gameState.playerOrder[s],role:"prev"},{playerId:this.gameState.playerOrder[e],role:"current"},{playerId:this.gameState.playerOrder[o],role:"next"}]}const i=n.map(({playerId:s,role:o})=>{const r=this.getPlayerNickname(s),l=o==="current";return`
        <div style="
          padding: 4px 8px;
          background: ${l?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          ${l?"▶ ":""}${r}
        </div>
      `}).join("");this.playersList.innerHTML=i}renderMexicoPlayersList(){if(!this.playersList)return;if(this.gameState.mexicoGameOver){const i=this.gameState.playerOrder.map(s=>{const o=this.getPlayerNickname(s),r=this.gameState.mexicoPenalties[s]||0,l=r<5,c=Array(5).fill(0).map((d,h)=>h<r?"▪":"▫").join("");return`
          <div style="
            padding: 3px 6px;
            background: ${l?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${l?"color: #4CAF50;":"color: white;"}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            ${r>=5?"opacity: 0.5;":""}
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${l?"🏆 ":""}${o}</span>
            <span style="font-size: 10px; letter-spacing: 2px;">${c}</span>
          </div>
        `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=i;return}const e=this.gameState.playerOrder.filter(i=>(this.gameState.mexicoPenalties[i]||0)<5);if(e.length===0){this.playersList.innerHTML="";return}let t=[];if(e.length<=3)t=e.map(i=>({playerId:i,role:i===this.gameState.currentTurn?"current":e.indexOf(i)<e.indexOf(this.gameState.currentTurn)?"prev":"next"}));else{const i=e.indexOf(this.gameState.currentTurn),s=(i-1+e.length)%e.length,o=(i+1)%e.length;t=[{playerId:e[s],role:"prev"},{playerId:e[i],role:"current"},{playerId:e[o],role:"next"}]}const n=t.map(({playerId:i,role:s})=>{const o=this.getPlayerNickname(i),r=s==="current",l=this.gameState.mexicoPenalties[i]||0,c=Array(5).fill(0).map((d,h)=>h<l?"▪":"▫").join("");return`
        <div style="
          padding: 3px 6px;
          background: ${r?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${r?"color: #4CAF50;":"color: white;"}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${o}</span>
          <span style="font-size: 10px; letter-spacing: 2px;">${c}</span>
        </div>
      `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=n}renderGreedyPigPlayersList(){if(!this.playersList)return;if(this.gameState.greedyPigGameOver){const o=[...this.gameState.playerOrder].sort((r,l)=>(this.gameState.greedyPigScores[l]||0)-(this.gameState.greedyPigScores[r]||0)).map((r,l)=>{const c=this.getPlayerNickname(r),d=this.gameState.greedyPigScores[r]||0,h=l===0;return`
          <div style="
            padding: 3px 6px;
            background: ${h?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${h?"color: #4CAF50;":"color: white;"}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${h?"🏆 ":""}${c}</span>
            <span style="font-weight: 600;">${d}</span>
          </div>
        `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=o;return}let e=[];const t=this.gameState.playerOrder.length,n=this.gameState.playerOrder.indexOf(this.gameState.currentTurn);if(t<=3)e=this.gameState.playerOrder.map(s=>({playerId:s,role:s===this.gameState.currentTurn?"current":this.gameState.playerOrder.indexOf(s)<n?"prev":"next"}));else{const s=(n-1+t)%t,o=(n+1)%t;e=[{playerId:this.gameState.playerOrder[s],role:"prev"},{playerId:this.gameState.playerOrder[n],role:"current"},{playerId:this.gameState.playerOrder[o],role:"next"}]}const i=e.map(({playerId:s,role:o})=>{const r=this.getPlayerNickname(s),l=o==="current",c=this.gameState.greedyPigScores[s]||0,d=l&&this.gameState.greedyPigTurnScore>0?` (+${this.gameState.greedyPigTurnScore})`:"";return`
        <div style="
          padding: 3px 6px;
          background: ${l?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${l?"color: #4CAF50;":"color: white;"}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${r}</span>
          <span style="font-weight: 600;">${c}${d}</span>
        </div>
      `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=i}renderPalmosDicePlayersList(){if(!this.playersList)return;if(this.gameState.palmosGameOver){const o=[...this.gameState.playerOrder].sort((r,l)=>(this.gameState.palmosScores?.[l]||0)-(this.gameState.palmosScores?.[r]||0)).map((r,l)=>{const c=this.getPlayerNickname(r),d=this.gameState.palmosScores?.[r]||0,h=l===0;return`
          <div style="
            padding: 3px 6px;
            background: ${h?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${h?"color: #4CAF50;":"color: white;"}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          ">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${h?"🏆 ":""}${c}</span>
            <span style="font-weight: 600;">${d}/200</span>
          </div>
        `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=o;return}let e=[];const t=this.gameState.playerOrder.length,n=this.gameState.playerOrder.indexOf(this.gameState.currentTurn);if(t<=3)e=this.gameState.playerOrder.map(s=>({playerId:s,role:s===this.gameState.currentTurn?"current":this.gameState.playerOrder.indexOf(s)<n?"prev":"next"}));else{const s=(n-1+t)%t,o=(n+1)%t;e=[{playerId:this.gameState.playerOrder[s],role:"prev"},{playerId:this.gameState.playerOrder[n],role:"current"},{playerId:this.gameState.playerOrder[o],role:"next"}]}const i=e.map(({playerId:s,role:o})=>{const r=this.getPlayerNickname(s),l=o==="current",c=this.gameState.palmosScores?.[s]||0;return`
        <div style="
          padding: 3px 6px;
          background: ${l?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${l?"color: #4CAF50;":"color: white;"}
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        ">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${r}</span>
          <span style="font-weight: 600;">${c}/200</span>
        </div>
      `}).join("");this.playersList.style.flexDirection="column",this.playersList.style.alignItems="stretch",this.playersList.innerHTML=i}buildGameOverButtons(e){const t=document.createElement("div");t.style.cssText=`
      margin-top: 16px;
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    `;const n=`
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `,i=document.createElement("button");i.textContent="New Game",i.style.cssText=n+"background: #4CAF50;",i.addEventListener("click",()=>{e.remove(),D.restartGame()}),t.appendChild(i);const s=document.createElement("button");return s.textContent="Exit",s.style.cssText=n+"background: rgba(255,255,255,0.15);",s.addEventListener("click",()=>{e.remove(),D.leaveLobby()}),t.appendChild(s),t}celebrateWinner(){const t=Date.now()+3e3,n={startVelocity:30,spread:360,ticks:60,zIndex:2e3};function i(o,r){return Math.random()*(r-o)+o}const s=setInterval(function(){const o=t-Date.now();if(o<=0)return clearInterval(s);const r=50*(o/3e3);kl({...n,particleCount:r,origin:{x:i(.1,.3),y:Math.random()-.2}}),kl({...n,particleCount:r,origin:{x:i(.7,.9),y:Math.random()-.2}})},250)}getPlayerNickname(e){if(!e)return"Unknown";if(e===D.user?.id)return D.user.nickname;const t=this.gameState.players.get(e);return t||`Player${e}`}showOtherPlayerRoll(e){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      z-index: 1000;
      text-align: center;
    `;let n;if(this.gameState.gameMode==="mexico"){const i=Math.max(e.dice1,e.dice2),s=Math.min(e.dice1,e.dice2),o=i*10+s;n=`${e.dice1} + ${e.dice2} = ${o}`}else n=`${e.dice1} + ${e.dice2} = ${e.total}`;t.innerHTML=`
      <div style="margin-bottom: 8px;">${e.playerNickname}</div>
      <div style="font-size: 24px;">🎲 ${n}</div>
    `,document.body.appendChild(t),setTimeout(()=>{t.remove()},2e3)}disableSoloControls(){}enableSoloControls(){}showNotification(e){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      background: rgba(0,0,0,0.8);
      color: white;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
    `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.remove(),2e3)}onDiceRolled(e,t){!this.gameState.isInGame||!(this.gameState.currentTurn===D.user?.id)&&this.gameState.gameMode==="free_roll"||D.rollDice(e,t)}onDiceThrown(e){!this.gameState.isInGame||!(this.gameState.currentTurn===D.user?.id)&&this.gameState.gameMode==="free_roll"||D.throwDiceSync(e)}isMultiplayerActive(){return this.gameState.isInGame}isMyTurn(){return this.gameState.currentTurn===D.user?.id}getEquippedDiceId(){return D.user?.equippedDiceId||null}getEquippedEffectId(){return D.user?.equippedEffectId||null}getGameMode(){return this.gameState.gameMode}getPlayerDiceConfig(e){window.debugLog?.("DICE",`getPlayerDiceConfig(${e}) called`);const t=this.gameState.playerDiceConfigs.get(e);if(t)return window.debugLog?.("DICE",`Found preloaded config for player ${e}`),t;window.debugLog?.("DICE",`No preloaded config for player ${e}, trying fallback`),window.debugLog?.("DICE","Preloaded configs available:",Array.from(this.gameState.playerDiceConfigs.keys()));const n=window.multiplayerUI;if(n?.currentLobby?.players){const i=n.currentLobby.players.find(s=>(s.oderId||s.userId)===e);if(i){const s=i.equippedDiceId||i.user?.equippedDiceId;if(window.debugLog?.("DICE",`Player ${e} equippedDiceId: ${s}`),s){if(n.currentLobby.availableItems){const r=this.getDiceConfigById(s,n.currentLobby.availableItems);if(r)return this.gameState.playerDiceConfigs.set(e,r),r}const o=D.inventory.find(r=>r.type==="dice"&&r.id===s);if(o?.config)return this.gameState.playerDiceConfigs.set(e,o.config),o.config}else window.debugLog?.("DICE",`Player ${e} has no equippedDiceId`)}else window.debugLog?.("DICE",`Player ${e} not found in lobby players`)}else window.debugLog?.("DICE","No multiplayerUI or currentLobby available");return window.debugLog?.("DICE",`No config found for player ${e}`),null}setThrowInProgress(e){window.debugLog?.("PALMOS",`setThrowInProgress: ${e}`),this.isThrowInProgress=e,this.stopButton&&(e?(this.stopButton.style.pointerEvents="none",this.stopButton.style.opacity="0.5"):(this.stopButton.style.pointerEvents="auto",this.stopButton.style.opacity="1")),this.passButton&&(e?(this.passButton.style.pointerEvents="none",this.passButton.style.opacity="0.5"):(this.passButton.style.pointerEvents="auto",this.passButton.style.opacity="1"));const t=document.getElementById("palmos-take-btn"),n=document.getElementById("palmos-reroll-btn");t&&(e?(t.style.pointerEvents="none",t.style.opacity="0.5"):(t.style.pointerEvents="auto",t.style.opacity="1")),n&&(e?(n.style.pointerEvents="none",n.style.opacity="0.5"):(n.style.pointerEvents="auto",n.style.opacity="1"))}getDiceConfigById(e,t){if(!t)return null;const n=t.find(o=>o.type==="dice"&&o.id===e);if(!n?.config)return null;const i={baseColor:n.config.baseColor||"#e5e5d7",dotColor:n.config.dotColor||"#383838",borderColor:n.config.borderColor||"#e5e5d7"},s=["roughness","metalness","clearcoat","clearcoatRoughness","opacity","dotSize","dotShape","dotDepth","bevelRadius"];for(const o of s)n.config[o]!==void 0&&(i[o]=n.config[o]);return i}waitForReplayAndNotify(e){const t=this.game.getDiceSync();this.replayWaitTimeoutId&&(clearTimeout(this.replayWaitTimeoutId),this.replayWaitTimeoutId=null),this.replayWaitIntervalId&&(clearInterval(this.replayWaitIntervalId),this.replayWaitIntervalId=null),t.isCurrentlyReplaying()?(this.replayWaitIntervalId=window.setInterval(()=>{t.isCurrentlyReplaying()||(this.replayWaitIntervalId&&(clearInterval(this.replayWaitIntervalId),this.replayWaitIntervalId=null),this.replayWaitTimeoutId&&(clearTimeout(this.replayWaitTimeoutId),this.replayWaitTimeoutId=null),this.resetDiceForNextTurn(800))},100),this.replayWaitTimeoutId=window.setTimeout(()=>{this.replayWaitIntervalId&&(clearInterval(this.replayWaitIntervalId),this.replayWaitIntervalId=null),this.replayWaitTimeoutId=null,this.resetDiceForNextTurn(800)},5e3)):this.resetDiceForNextTurn(800)}resetDiceForNextTurn(e=800,t){if(this.diceResetScheduled){window.debugLog?.("DICE","Reset already scheduled, skipping duplicate");return}this.gameState.gameMode!=="poker_dice"&&(this.diceResetScheduled=!0,setTimeout(()=>{this.diceResetScheduled=!1;const n=t===null?this.gameState.currentTurn:t!==void 0?t:this.gameState.currentTurn,i=n===D.user?.id,s=this.gameState.gameMode==="greedy_pig"&&t===null;if(window.debugLog?.("DICE",`resetDiceForNextTurn: isMyTurn=${i}, nextTurn=${n}, currentTurn=${this.gameState.currentTurn}, override=${t}, fastThrow=${s}`),i)window.debugLog?.("DICE","My turn - resetting dice to hand"),this.game.setDiceInHand(!1),this.game.onTurnChanged(!0);else{const o=this.game.getDiceSync();if(o){const r=this.game.getHandPositions(),l=n?this.getPlayerDiceConfig(n):null;if(window.debugLog?.("DICE",`Teleporting with player ${n} config:`,l?"found":"null"),!l){console.error("[GameSync] CRITICAL: No config found for player",n,"- skipping teleport!"),console.error("[GameSync] Preloaded configs:",Array.from(this.gameState.playerDiceConfigs.keys())),console.error("[GameSync] Player order:",this.gameState.playerOrder);return}o.teleportDiceToHand(r,l,!s)}}},e))}getDiceCountForMode(e){switch(e){case"poker_dice":return 5;case"free_roll":case"street_craps":case"mexico":case"greedy_pig":default:return 2}}}function zn(a){if(typeof window<"u"&&window.Telegram?.WebApp?.HapticFeedback&&typeof window.Telegram.WebApp.HapticFeedback.impactOccurred=="function")try{window.Telegram.WebApp.HapticFeedback.impactOccurred(a)}catch{}}const Fi=new Qt,Hl=new Qt;function Gl(a,e,t){return Fi.set(a[0],a[1],a[2],a[3]),Hl.set(e[0],e[1],e[2],e[3]),Fi.slerp(Hl,t),[Fi.x,Fi.y,Fi.z,Fi.w]}function ty(a,e,t){return[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t,a[2]+(e[2]-a[2])*t]}class Vl{constructor(e,t,n,i,s,o){N(this,"dice");N(this,"audio");N(this,"game");N(this,"getGameMode");N(this,"originalDiceConfig",null);N(this,"colorChangeLocked",!1);N(this,"lastAppliedReplayConfig",null);N(this,"isRecording",!1);N(this,"recordInterval",null);N(this,"recordStartTime",0);N(this,"isReplaying",!1);N(this,"replayStartTime",0);N(this,"replayReceivedTime",0);N(this,"replayAnimationId",null);N(this,"streamingFrames",[]);N(this,"streamingData",null);N(this,"streamEnded",!1);N(this,"finalResult",null);N(this,"soundEvents",[]);N(this,"lastPlayedSoundIndex",-1);N(this,"onReplayFinished",null);N(this,"lastFrameIndices",[]);this.dice=e,this.audio=t,this.game=o,this.getGameMode=s||(()=>"free_roll")}cancelAnimations(){}setOnReplayFinished(e){this.onReplayFinished=e}setOriginalDiceConfig(e){this.originalDiceConfig=e}getOriginalDiceConfig(){return this.originalDiceConfig}isColorChangeLocked(){return this.colorChangeLocked}restoreOriginalDiceConfig(){this.originalDiceConfig&&this.dice.forEach(e=>e.updateConfig(this.originalDiceConfig))}resetForSoloMode(){this.isRecording&&(this.isRecording=!1,this.recordInterval&&(clearInterval(this.recordInterval),this.recordInterval=null)),this.colorChangeLocked=!1,this.isReplaying=!1,this.lastAppliedReplayConfig=null,this.game&&this.game.setDiceCount(2),this.restoreOriginalDiceConfig()}preloadDiceConfig(e){const t=performance.now(),n=JSON.stringify(e),i=this.lastAppliedReplayConfig?JSON.stringify(this.lastAppliedReplayConfig):null;if(n!==i){this.dice.forEach(o=>o.updateConfig(e)),this.lastAppliedReplayConfig=e;const s=performance.now()-t;window.debugLog?.("PERF",`Preload config: ${s.toFixed(1)}ms`)}else window.debugLog?.("PERF","Config cached, skipped")}startRecordingStream(e,t,n){this.isRecording||(window.debugLog?.("STREAM","Recording started"),this.isRecording=!0,this.colorChangeLocked=!1,this.recordStartTime=Date.now(),D.throwStart(e,t,n),this.recordInterval=window.setInterval(()=>{this.recordAndStreamFrame()},66),this.recordAndStreamFrame())}recordSoundEvent(e,t){if(!this.isRecording)return;const n=Date.now()-this.recordStartTime;D.throwSound(e,t,n)}recordAndStreamFrame(){if(!this.isRecording)return;const e=Date.now()-this.recordStartTime,t=this.dice.map(n=>({position:[n.body.position.x,n.body.position.y,n.body.position.z],quaternion:[n.body.quaternion.x,n.body.quaternion.y,n.body.quaternion.z,n.body.quaternion.w],time:e}));try{D.throwFrame({diceFrames:t,time:e})}catch(n){console.error("[DiceSync] Error streaming frame:",n)}}stopRecordingStream(e=!0){this.isRecording=!1,this.recordInterval&&(clearInterval(this.recordInterval),this.recordInterval=null),this.recordAndStreamFrame();const t=this.dice.map(o=>o.getTopFace()),n=t[0]||0,i=t[1]||0,s=t.reduce((o,r)=>o+r,0);return window.debugLog?.("STREAM",`Recording stopped, sent frames, result: ${t.join("+")}=${s}`),e&&D.throwEnd({dice1:n,dice2:i,total:s,diceValues:t}),{dice1:n,dice2:i,total:s,diceValues:t}}startStreamingReplay(e){this.isReplaying&&(console.warn("[DiceSync] Already replaying, force-finishing current replay"),window.debugLog?.("STREAM","Force finishing current replay"),this.finishStreamingReplay());const t=performance.now();if(this.isReplaying=!0,this.colorChangeLocked=!0,this.replayStartTime=0,this.replayReceivedTime=Date.now(),this.streamingFrames=this.dice.map(()=>[]),this.streamingData=e,this.streamEnded=!1,this.finalResult=null,this.soundEvents=[],this.lastPlayedSoundIndex=-1,this.lastFrameIndices=this.dice.map(()=>0),window.debugLog?.("STREAM",`Replay started for player ${e.playerId}`),e.diceConfig){const i=JSON.stringify(e.diceConfig),s=this.lastAppliedReplayConfig?JSON.stringify(this.lastAppliedReplayConfig):null;i!==s&&(this.dice.forEach(o=>o.updateConfig(e.diceConfig)),this.lastAppliedReplayConfig=e.diceConfig)}this.showPlayerIndicator(e.playerNickname),e.throwPower>.7?zn("heavy"):e.throwPower>.4?zn("medium"):zn("light"),this.dice.forEach(i=>{i.body.type=ce.KINEMATIC}),this.replayStartTime=0;const n=performance.now()-t;window.debugLog?.("PERF",`Replay start: ${n.toFixed(1)}ms`),this.animateStreamingReplay()}addStreamingFrame(e){if(!this.isReplaying)return;e.diceFrames.forEach((n,i)=>{i<this.streamingFrames.length&&this.streamingFrames[i].push(n)});const t=this.streamingFrames[0]?.length||0;if(t%10===0&&t>0){const n=Date.now()-this.replayStartTime;if(n>0){const i=t/n*1e3;window.debugLog?.("STREAM",`Received ${t} frames, avg ${i.toFixed(1)} FPS`)}}}playStreamingSound(e,t,n){this.isReplaying&&this.soundEvents.push({type:e,velocity:t,time:n})}endStreamingReplay(e){if(!this.isReplaying)return;const t=this.streamingFrames.reduce((n,i)=>n+i.length,0);if(window.debugLog?.("STREAM",`Stream ended, ${t} frames received`),this.replayStartTime===0&&t===0){console.error("[DiceSync] CRITICAL: Stream ended but no frames received!"),window.debugLog?.("STREAM","ERROR: No frames received!"),this.finishStreamingReplay();return}this.streamEnded=!0,this.finalResult={dice1:e.dice1,dice2:e.dice2,total:e.total,diceValues:e.diceValues}}animateStreamingReplay(){if(!this.isReplaying)return;const e=Math.min(...this.streamingFrames.map(c=>c.length)),t=Date.now()-this.replayReceivedTime;if(!(e>=3||t>500)){this.replayAnimationId=requestAnimationFrame(()=>this.animateStreamingReplay());return}if(this.replayStartTime===0){let c=0;for(const d of this.streamingFrames)if(d.length>0){const h=d[0].time;(c===0||h<c)&&(c=h)}if(this.replayStartTime=Date.now()-c,c>0){let d=-1;for(let h=0;h<this.soundEvents.length&&this.soundEvents[h].time<c;h++)d=h;this.lastPlayedSoundIndex=d}window.debugLog?.("STREAM",`Playback started: ${e} frames, ${this.soundEvents.length} sounds, after ${t}ms, offset=${c}ms`)}const s=Date.now()-this.replayStartTime,o=e/(s/1e3);let r;o<15?r=50:e<10?r=150:e<20?r=100:r=50;const l=Math.max(0,s-r);if(this.dice.forEach((c,d)=>{this.streamingFrames[d]&&this.streamingFrames[d].length>0&&this.interpolateDice(d,this.streamingFrames[d],l)}),this.playSoundsUpToTime(l),this.streamEnded){const c=Math.max(...this.streamingFrames.map(d=>d.length>0?d[d.length-1].time:0));if(s>=c+200){this.finishStreamingReplay();return}}this.replayAnimationId=requestAnimationFrame(()=>this.animateStreamingReplay())}playSoundsUpToTime(e){for(let t=this.lastPlayedSoundIndex+1;t<this.soundEvents.length;t++){const n=this.soundEvents[t];if(n.time<=e)n.type==="dice_hit"?(this.audio.playDiceHit(n.velocity),n.velocity>1&&zn("light")):(this.audio.playTableHit(n.velocity),n.velocity>5?zn("heavy"):n.velocity>2?zn("medium"):n.velocity>.5&&zn("light")),this.lastPlayedSoundIndex=t;else break}}interpolateDice(e,t,n){if(t.length===0)return;const i=this.lastFrameIndices[e]||0;let s=t[0],o=t[0],r=0;for(let d=Math.max(0,i-1);d<t.length-1;d++){if(t[d].time<=n&&t[d+1].time>=n){s=t[d],o=t[d+1],r=d;break}if(t[d].time>n){s=t[d],o=t[d],r=d;break}}n>=t[t.length-1].time&&(s=t[t.length-1],o=s,r=t.length-1),this.lastFrameIndices[e]=r;const l=o.time-s.time;let c=l>0?Math.min(1,(n-s.time)/l):0;if(l>100&&Math.random()<.1&&window.debugLog?.("STREAM",`Gap: ${l}ms, t=${c.toFixed(2)}, frames=${t.length}`),r>0&&r<t.length-2&&l>0){const d=t[Math.max(0,r-1)],h=s,u=o,m=t[Math.min(t.length-1,r+2)],g=this.catmullRomPosition(d.position,h.position,u.position,m.position,c),v=Gl(h.quaternion,u.quaternion,c),f=this.dice[e];f.body.position.set(g[0],g[1],g[2]),f.body.quaternion.set(v[0],v[1],v[2],v[3]),f.updateDirect()}else{const d=ty(s.position,o.position,c),h=Gl(s.quaternion,o.quaternion,c),u=this.dice[e];u.body.position.set(d[0],d[1],d[2]),u.body.quaternion.set(h[0],h[1],h[2],h[3]),u.updateDirect()}}catmullRomPosition(e,t,n,i,s){const o=s*s,r=o*s,l=2*t[0],c=-e[0]+n[0],d=2*e[0]-5*t[0]+4*n[0]-i[0],h=-e[0]+3*t[0]-3*n[0]+i[0],u=.5*(l+c*s+d*o+h*r),m=2*t[1],g=-e[1]+n[1],v=2*e[1]-5*t[1]+4*n[1]-i[1],f=-e[1]+3*t[1]-3*n[1]+i[1],p=.5*(m+g*s+v*o+f*r),y=2*t[2],x=-e[2]+n[2],_=2*e[2]-5*t[2]+4*n[2]-i[2],R=-e[2]+3*t[2]-3*n[2]+i[2],S=.5*(y+x*s+_*o+R*r);return[u,p,S]}finishStreamingReplay(){window.debugLog?.("STREAM","Finishing replay"),this.replayAnimationId&&(cancelAnimationFrame(this.replayAnimationId),this.replayAnimationId=null),this.dice.forEach((e,t)=>{const n=this.streamingFrames[t];if(n&&n.length>0){const i=n[n.length-1];e.body.position.set(i.position[0],i.position[1],i.position[2]),e.body.quaternion.set(i.quaternion[0],i.quaternion[1],i.quaternion[2],i.quaternion[3]),e.updateDirect()}}),this.finalResult&&this.streamingData&&this.showReplayResult(this.streamingData.playerNickname,this.finalResult),this.isReplaying=!1,this.streamingData=null,this.streamingFrames=[],this.soundEvents=[],this.lastPlayedSoundIndex=-1,this.colorChangeLocked=!1,this.lastAppliedReplayConfig=null,this.onReplayFinished&&this.onReplayFinished()}teleportDiceToHand(e,t,n=!0){window.debugLog?.("DICE",`teleportDiceToHand: animate=${n}, hasConfig=${!!t}`),t?this.preloadDiceConfig(t):this.restoreOriginalDiceConfig(),n?this.animateDiceToHand(e):this.dice.forEach((i,s)=>{i.body.type=ce.KINEMATIC,i.body.position.set(e[s].x,e[s].y,e[s].z),i.body.quaternion.set(0,0,0,1),i.body.velocity.set(0,0,0),i.body.angularVelocity.set(0,0,0),i.updateDirect()})}animateDiceToHand(e){const t=Date.now(),n=300,i=this.dice.map(o=>({x:o.body.position.x,y:o.body.position.y,z:o.body.position.z}));this.dice.forEach(o=>{o.body.type=ce.KINEMATIC,o.body.velocity.set(0,0,0),o.body.angularVelocity.set(0,0,0)});const s=()=>{const o=Date.now()-t,r=Math.min(1,o/n),l=1-Math.pow(1-r,3);this.dice.forEach((c,d)=>{const h=i[d],u=e[d];c.body.position.set(h.x+(u.x-h.x)*l,h.y+(u.y-h.y)*l,h.z+(u.z-h.z)*l);const m=new Qt(0,0,0,1),g=new Qt(c.body.quaternion.x,c.body.quaternion.y,c.body.quaternion.z,c.body.quaternion.w);g.slerp(m,l*.5),c.body.quaternion.set(g.x,g.y,g.z,g.w),c.updateDirect()}),r<1?requestAnimationFrame(s):this.dice.forEach((c,d)=>{c.body.position.set(e[d].x,e[d].y,e[d].z),c.body.quaternion.set(0,0,0,1),c.updateDirect()})};s()}showPlayerIndicator(e){const t=document.getElementById("throwing-indicator");t&&t.remove();const n=document.createElement("div");n.id="throwing-indicator",n.style.cssText=`
      position: fixed;
      bottom: 133px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 100;
      pointer-events: none;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `,n.innerHTML=`<span style="opacity: 0.7;">${e}</span> shooting...`,document.body.appendChild(n),setTimeout(()=>{n.remove()},5e3)}showReplayResult(e,t){const n=document.getElementById("throwing-indicator");n&&n.remove();const i=document.getElementById("last-throw-indicator");i&&i.remove();const s=document.createElement("div");s.id="last-throw-indicator",s.style.cssText=`
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.2);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 100;
      text-align: center;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;let o;const r=this.getGameMode(),l=t.diceValues||[t.dice1,t.dice2];if(r==="mexico"){const c=Math.max(t.dice1,t.dice2),d=Math.min(t.dice1,t.dice2),h=c*10+d;o=`${t.dice1} + ${t.dice2} = ${h}`}else r==="poker_dice"?o=l.join(" + ")+" = "+t.total:o=`${t.dice1} + ${t.dice2} = ${t.total}`;s.innerHTML=`
      <span style="opacity: 0.7;">${e}:</span> ${o}
    `,document.body.appendChild(s),this.audio.playDiceHit(.5),zn("medium")}isCurrentlyReplaying(){return this.isReplaying}stopReplay(){this.isReplaying&&this.finishStreamingReplay()}isCurrentlyRecording(){return this.isRecording}getReplayTime(){return this.isReplaying?Date.now()-this.replayStartTime:0}clearIndicators(){const e=document.getElementById("throwing-indicator");e&&e.remove();const t=document.getElementById("last-throw-indicator");t&&t.remove()}}class Hn{static validateDicePositions(e){const t=[];e.forEach((i,s)=>{this.isDiceOnValidFace(i)||t.push(s)});const n=t.length===0;return{isValid:n,invalidDiceIndices:t,reason:n?void 0:"One or more dice are not resting on a face"}}static isDiceOnValidFace(e){if(e.body.position.y>this.MAX_HEIGHT_ABOVE_FLOOR)return!1;const n=new k(0,1,0),i=new k(0,-1,0),s=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)];let o=-1,r=-1;return s.forEach(c=>{const d=c.clone().applyQuaternion(e.mesh.quaternion),h=d.dot(n);h>o&&(o=h);const u=d.dot(i);u>r&&(r=u)}),o>=this.MIN_FACE_ALIGNMENT&&r>=this.MIN_FACE_ALIGNMENT}static getDiceTiltAngle(e){const t=new k(0,1,0),n=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)];let i=-1;return n.forEach(o=>{const r=o.clone().applyQuaternion(e.mesh.quaternion),l=Math.abs(r.dot(t));l>i&&(i=l)}),Math.acos(Math.min(1,i))*180/Math.PI}static getDiceAlignmentInfo(e){const t=new k(0,1,0),n=new k(0,-1,0),i=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)];let s=-1,o=-1;return i.forEach(r=>{const l=r.clone().applyQuaternion(e.mesh.quaternion),c=l.dot(t);c>s&&(s=c);const d=l.dot(n);d>o&&(o=d)}),{upAlignment:s,downAlignment:o}}static getDiceHeight(e){return e.body.position.y}}N(Hn,"MIN_FACE_ALIGNMENT",.98),N(Hn,"MAX_HEIGHT_ABOVE_FLOOR",.6);const vr={bell:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6L12 2z"/></svg>',refresh:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/></svg>',flame:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',sparkles:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3ZM5 3v4M3 5h4M19 17v4M17 19h4"/></svg>',crown:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v2H2v-2zm2-8l4 2 4-6 4 6 4-2v8H4v-8z"/></svg>',key:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>'};function ai(a,e=24){return vr[a].replace('width="24"',`width="${e}"`).replace('height="24"',`height="${e}"`)}class ny{constructor(e,t,n,i){N(this,"canvas");N(this,"ctx");N(this,"texture");N(this,"material");N(this,"mesh");N(this,"pips",0);N(this,"fontSize",300);N(this,"textColor","#D4D4C8");N(this,"needsUpdate",!1);N(this,"animationFrameId",null);this.canvas=document.createElement("canvas"),this.canvas.width=1024,this.canvas.height=512,this.ctx=this.canvas.getContext("2d",{alpha:!0,willReadFrequently:!1}),this.ctx.imageSmoothingEnabled=!0,this.ctx.imageSmoothingQuality="high",this.texture=new hs(this.canvas),this.texture.minFilter=Ot,this.texture.magFilter=Ot,this.texture.generateMipmaps=!1,this.material=new fo({map:this.texture,transparent:!0,opacity:.95,side:Pn,depthWrite:!1,depthTest:!0});const s=new hi(n*.9,i*.4);this.mesh=new _t(s,this.material),this.mesh.position.copy(t),this.mesh.position.z+=.01,this.mesh.renderOrder=1,e.add(this.mesh),document.fonts&&document.fonts.load?document.fonts.load('300px "Alfa Slab One"').then(()=>{this.updateCanvasImmediate()}).catch(()=>{console.warn("[WallText] Failed to load Alfa Slab One, using fallback"),this.updateCanvasImmediate()}):this.updateCanvasImmediate()}setPips(e){this.pips!==e&&(this.pips=e,this.scheduleUpdate())}getPips(){return this.pips}addPips(e){this.setPips(this.pips+e)}setTextColor(e){this.textColor=e,this.scheduleUpdate()}setFontSize(e){this.fontSize=e,this.scheduleUpdate()}scheduleUpdate(){this.animationFrameId===null&&(this.needsUpdate=!0,this.animationFrameId=requestAnimationFrame(()=>{this.animationFrameId=null,this.needsUpdate&&(this.updateCanvasImmediate(),this.needsUpdate=!1)}))}updateCanvasImmediate(){const e=this.ctx,t=this.canvas.width,n=this.canvas.height;e.clearRect(0,0,t,n),window.__debugWallText&&(e.fillStyle="rgba(255, 0, 0, 0.3)",e.fillRect(0,0,t,n));const i=this.pips.toLocaleString("en-US");e.font=`${this.fontSize}px 'Alfa Slab One', serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle=this.textColor,e.fillText(i,t/2,n/2-80),e.font=`600 ${this.fontSize*.3}px 'Montserrat', sans-serif`,e.fillStyle=this.textColor,e.fillText("PIPS",t/2,n/2+120),this.texture.needsUpdate=!0}setVisible(e){this.mesh.visible=e}animateChange(e,t=500){this.setPips(e)}dispose(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.texture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}update(){return!1}}const zc=typeof window<"u"&&window.Telegram?.WebApp?.HapticFeedback&&typeof window.Telegram.WebApp.HapticFeedback.impactOccurred=="function";let Wl=0;const iy=50;function Gt(a){if(!zc)return;const e=Date.now();if(!(e-Wl<iy)){Wl=e;try{window.Telegram?.WebApp.HapticFeedback.impactOccurred(a)}catch{}}}function $l(a){if(zc)try{window.Telegram?.WebApp.HapticFeedback.notificationOccurred(a)}catch{}}const ss={low:{pixelRatio:1,shadowsEnabled:!1,antialias:!1,diceBevelSegments:1},medium:{pixelRatio:Math.min(window.devicePixelRatio,1.75),shadowsEnabled:!1,antialias:!1,diceBevelSegments:2},high:{pixelRatio:Math.min(window.devicePixelRatio,2),shadowsEnabled:!0,antialias:!0,diceBevelSegments:3}},sy={floor:{color:"#1b4b02",texture:"felt",roughness:.85,metalness:.5,normalIntensity:2,textureScale:"small",clearcoat:0,realTexture:"fabric_velour_velvet"},wall:{color:"#e0e0e0",texture:"brick",roughness:1,metalness:.65,normalIntensity:1.7,textureScale:"small",clearcoat:0,realTexture:"concrete_concrete"},border:{color:"#153b02",roughness:.45,metalness:0}};function oy(a){if(a.floor&&a.wall)return a;const e=a;return{floor:{color:e.floorColor||"#2d5a3d",texture:e.textureType||"felt",roughness:e.floorRoughness??.9,metalness:0,normalIntensity:.6},wall:{color:e.wallColor||"#1a3d2a",texture:e.textureType||"felt",roughness:e.wallRoughness??.95,metalness:0,normalIntensity:.6}}}class ry{constructor(e){N(this,"renderer");N(this,"scene");N(this,"camera");N(this,"world");N(this,"dice",[]);N(this,"raycaster",new pg);N(this,"mouse",new Ye);N(this,"shakeDetector");N(this,"selectedDiceForReroll",new Set);N(this,"diceSelectionEnabled",!1);N(this,"lastRerollSelection",[]);N(this,"isHolding",!1);N(this,"shakeIntensity",0);N(this,"diceInHand",!0);N(this,"hintEl");N(this,"resultEl");N(this,"handBoxWalls",[]);N(this,"handBoxFloor",null);N(this,"leftWall",null);N(this,"rightWall",null);N(this,"leftWallMesh",null);N(this,"rightWallMesh",null);N(this,"backWallMesh",null);N(this,"tableMesh",null);N(this,"backBorderMesh",null);N(this,"leftBorderMesh",null);N(this,"rightBorderMesh",null);N(this,"tableConfig",sy);N(this,"diceMaterial");N(this,"floorMaterial");N(this,"wallMaterial");N(this,"audio");N(this,"gameSync");N(this,"diceSync");N(this,"lockedWidth",0);N(this,"lockedHeight",0);N(this,"sideWallsInitialized",!1);N(this,"controlMode","motion");N(this,"requireReadyConfirmation",!1);N(this,"isWaitingForReady",!1);N(this,"readyOverlay",null);N(this,"manualTouchId",null);N(this,"manualTouchStartY",0);N(this,"manualLastY",0);N(this,"manualIsDragging",!1);N(this,"throwSeed",0);N(this,"isMenuOpenCallback",null);N(this,"envMap",null);N(this,"pmremGenerator",null);N(this,"fpsCounter",null);N(this,"frameCount",0);N(this,"lastFpsUpdate",0);N(this,"graphicsQuality","high");N(this,"graphicsSettings",ss.high);N(this,"invalidRollCheckTimeout",null);N(this,"invalidRollWaitTime",3e3);N(this,"wallText",null);N(this,"normalMapCache",new Map);N(this,"fpsVisible",!1);N(this,"fpsClickCount",0);N(this,"fpsClickTimeout",null);N(this,"fpsToggleButton",null);this.canvas=e,this.loadGraphicsQuality(),this.renderer=new Ac({canvas:e,antialias:this.graphicsSettings.antialias,powerPreference:"high-performance"}),this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio),this.renderer.shadowMap.enabled=this.graphicsSettings.shadowsEnabled,this.renderer.shadowMap.type=jl,this.setupWebGLContextHandlers(),this.scene=new al,this.scene.background=new Oe(1719594),this.camera=new Wt(60,1,.1,100),this.camera.position.set(0,10,8),this.camera.lookAt(0,0,0),this.world=new D0,this.world.gravity.set(0,-40,0),this.world.allowSleep=!0,this.world.solver.iterations=10,this.diceMaterial=new pi("dice"),this.floorMaterial=new pi("floor"),this.wallMaterial=new pi("wall");const t=new ui(this.diceMaterial,this.floorMaterial,{friction:.15,restitution:.45}),n=new ui(this.diceMaterial,this.wallMaterial,{friction:.1,restitution:.3}),i=new ui(this.diceMaterial,this.diceMaterial,{friction:.1,restitution:.6});this.world.addContactMaterial(t),this.world.addContactMaterial(n),this.world.addContactMaterial(i),this.world.addEventListener("beginContact",o=>{if(this.diceInHand)return;const r=this.dice.some(d=>d.body===o.bodyA),l=this.dice.some(d=>d.body===o.bodyB),c=o.bodyA.velocity.vsub(o.bodyB.velocity).length();r&&l?(c>.5&&(this.audio.playDiceHit(c),this.diceSync&&this.diceSync.recordSoundEvent("dice_hit",c)),c>1&&Gt("light")):(r||l)&&(c>.5&&(this.audio.playTableHit(c),this.diceSync&&this.diceSync.recordSoundEvent("table_hit",c)),c>5?Gt("heavy"):c>2?Gt("medium"):c>.5&&Gt("light"))}),this.shakeDetector=new H0,this.hintEl=document.getElementById("hint"),this.resultEl=document.getElementById("result");const s=document.getElementById("boost-icon");s&&s.addEventListener("click",()=>{this.gameSync.isMultiplayerActive()||Bi(async()=>{const{BoostsModal:o}=await Promise.resolve().then(()=>ql);return{BoostsModal:o}},void 0).then(({BoostsModal:o})=>{o.toggle()})}),this.createFpsCounter(),this.audio=new G0,this.gameSync=new ey(this),this.diceSync=null,this.pmremGenerator=new fr(this.renderer),this.loadControlSettings(),this.setupScene(),this.setupControls(),this.resize(),window.addEventListener("resize",()=>this.resize())}setupWebGLContextHandlers(){this.canvas.addEventListener("webglcontextlost",e=>{if(e.preventDefault(),console.warn("[Game] WebGL context lost! This causes black screen."),window.debugLog?.("RENDER","WebGL context LOST"),performance.memory){const t=performance.memory;console.warn("[Game] Memory at context loss:",{used:Math.round(t.usedJSHeapSize/1048576)+"MB",total:Math.round(t.totalJSHeapSize/1048576)+"MB",limit:Math.round(t.jsHeapSizeLimit/1048576)+"MB"})}},!1),this.canvas.addEventListener("webglcontextrestored",()=>{if(console.log("[Game] WebGL context restored, reinitializing renderer..."),window.debugLog?.("RENDER","WebGL context RESTORED"),window.gc)try{window.gc(),console.log("[Game] Forced garbage collection")}catch{}this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio),this.renderer.shadowMap.enabled=this.graphicsSettings.shadowsEnabled,this.renderer.clear(!0,!0,!0),this.clearNormalMapCache(),this.updateEnvMap(),this.tableMesh&&(this.tableMesh.material.dispose(),this.tableMesh.material=this.createSurfaceMaterial(this.tableConfig.floor,20,20)),this.backWallMesh&&(this.backWallMesh.material.dispose(),this.backWallMesh.material=this.createSurfaceMaterial(this.tableConfig.wall,12,6)),this.leftWallMesh&&(this.leftWallMesh.material.dispose(),this.leftWallMesh.material=this.createSurfaceMaterial(this.tableConfig.wall,15,6)),this.rightWallMesh&&(this.rightWallMesh.material.dispose(),this.rightWallMesh.material=this.createSurfaceMaterial(this.tableConfig.wall,15,6)),this.dice.forEach(e=>{const t=e.getConfig();e.updateConfig(t,this.graphicsSettings.diceBevelSegments)}),setTimeout(()=>{if(this.resize(),this.renderer.render(this.scene,this.camera),console.log("[Game] WebGL context fully restored"),performance.memory){const e=performance.memory;console.log("[Game] Memory after restore:",{used:Math.round(e.usedJSHeapSize/1048576)+"MB",total:Math.round(e.totalJSHeapSize/1048576)+"MB",limit:Math.round(e.jsHeapSizeLimit/1048576)+"MB"})}},100)},!1)}loadGraphicsQuality(){const e=localStorage.getItem("graphicsQuality");if(e&&ss[e]&&(this.graphicsQuality=e,this.graphicsSettings=ss[e]),performance.memory){const n=performance.memory.jsHeapSizeLimit/1048576;n<512&&this.graphicsQuality!=="low"&&(console.warn(`[Game] Low memory detected (${Math.round(n)}MB limit), forcing low quality`),this.graphicsQuality="low",this.graphicsSettings=ss.low,localStorage.setItem("graphicsQuality","low"))}}getGraphicsQuality(){return this.graphicsQuality}setGraphicsQuality(e){this.graphicsQuality!==e&&(this.graphicsQuality=e,this.graphicsSettings=ss[e],localStorage.setItem("graphicsQuality",e),this.renderer.setPixelRatio(this.graphicsSettings.pixelRatio),this.renderer.shadowMap.enabled=this.graphicsSettings.shadowsEnabled,this.dice.forEach(t=>{t.mesh.castShadow=this.graphicsSettings.shadowsEnabled}),this.tableMesh&&(this.tableMesh.receiveShadow=this.graphicsSettings.shadowsEnabled),this.dice.forEach(t=>{const n=t.getConfig();t.updateConfig(n,this.graphicsSettings.diceBevelSegments)}),console.log(`[Game] Graphics quality set to: ${e}`))}setupScene(){const e=new hi(20,20),t=this.createSurfaceMaterial(this.tableConfig.floor,20,20);this.tableMesh=new _t(e,t),this.tableMesh.rotation.x=-Math.PI/2,this.tableMesh.receiveShadow=!0,this.scene.add(this.tableMesh);const n=.08,i=.12,s=this.tableConfig.border||{color:"#2a2520",roughness:.3,metalness:.6},o=new Qs({color:new Oe(s.color),roughness:s.roughness,metalness:s.metalness});this.backBorderMesh=new _t(new ln(12,n,i),o),this.backBorderMesh.position.set(0,n/2,-5),this.backBorderMesh.castShadow=this.graphicsSettings.shadowsEnabled,this.backBorderMesh.receiveShadow=this.graphicsSettings.shadowsEnabled,this.scene.add(this.backBorderMesh),this.leftBorderMesh=new _t(new ln(i,n,15),o.clone()),this.leftBorderMesh.position.set(-5,n/2,0),this.leftBorderMesh.castShadow=this.graphicsSettings.shadowsEnabled,this.leftBorderMesh.receiveShadow=this.graphicsSettings.shadowsEnabled,this.scene.add(this.leftBorderMesh),this.rightBorderMesh=new _t(new ln(i,n,15),o.clone()),this.rightBorderMesh.position.set(5,n/2,0),this.rightBorderMesh.castShadow=this.graphicsSettings.shadowsEnabled,this.rightBorderMesh.receiveShadow=this.graphicsSettings.shadowsEnabled,this.scene.add(this.rightBorderMesh);const r=new ce({type:ce.STATIC,shape:new ei,material:this.floorMaterial});r.quaternion.setFromEuler(-Math.PI/2,0,0),this.world.addBody(r),this.addWall(0,1,-5,0),this.addWall(0,1,5,Math.PI);const l=new hi(15,6),c=this.createSurfaceMaterial(this.tableConfig.wall,15,6);this.leftWall=new ce({type:ce.STATIC,shape:new ei,material:this.wallMaterial}),this.leftWall.position.set(-5,1,0),this.leftWall.quaternion.setFromEuler(0,Math.PI/2,0),this.world.addBody(this.leftWall),this.leftWallMesh=new _t(l,c),this.leftWallMesh.position.set(-5,3,0),this.leftWallMesh.rotation.y=Math.PI/2,this.leftWallMesh.receiveShadow=!0,this.scene.add(this.leftWallMesh),this.rightWall=new ce({type:ce.STATIC,shape:new ei,material:this.wallMaterial}),this.rightWall.position.set(5,1,0),this.rightWall.quaternion.setFromEuler(0,-Math.PI/2,0),this.world.addBody(this.rightWall),this.rightWallMesh=new _t(l.clone(),c.clone()),this.rightWallMesh.position.set(5,3,0),this.rightWallMesh.rotation.y=-Math.PI/2,this.rightWallMesh.receiveShadow=!0,this.scene.add(this.rightWallMesh);const d=new ug(16777215,0);this.scene.add(d);const h=new cg(16777215,2.8);h.position.set(-5,15,5),h.angle=Math.PI/4,h.penumbra=.8,h.decay=0,h.distance=0,h.castShadow=this.graphicsSettings.shadowsEnabled,h.shadow.mapSize.width=1024,h.shadow.mapSize.height=1024,h.shadow.radius=1.5,h.shadow.camera.near=5,h.shadow.camera.far=30,h.shadow.bias=-1e-4,this.scene.add(h);const u=new hg(16777215,2.1);u.position.set(3,5,8),this.scene.add(u);const m=new hi(12,6),g=this.createSurfaceMaterial(this.tableConfig.wall,12,6);this.backWallMesh=new _t(m,g),this.backWallMesh.position.set(0,3,-5),this.backWallMesh.receiveShadow=!0,this.scene.add(this.backWallMesh),this.wallText=new ny(this.scene,new k(0,2.5,-4.9),6,3);const v=localStorage.getItem("playerPips");v&&this.wallText.setPips(parseInt(v,10));for(let f=0;f<2;f++){const p=new co(this.scene,this.world,this.diceMaterial,void 0,this.graphicsSettings.diceBevelSegments);p.mesh.castShadow=this.graphicsSettings.shadowsEnabled,this.dice.push(p)}this.diceSync=new Vl(this.dice,this.audio,this.scene,this.world,()=>this.gameSync.getGameMode(),this),this.createHandBox(),this.updateEnvMap(),this.resetDiceToHand()}updateEnvMap(){if(!this.pmremGenerator)return;this.envMap&&this.envMap.dispose();const e=new xc(128),t=new vc(.1,100,e),n=new al,i=new Cr(50,32,32),s=document.createElement("canvas");s.width=512,s.height=256;const o=s.getContext("2d");o.fillStyle="#2a2a2a",o.fillRect(0,0,512,256);const r=120,l=o.createRadialGradient(0,128,0,0,128,r);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.5,"rgba(255, 255, 255, 0.4)"),l.addColorStop(1,"rgba(255, 255, 255, 0)"),o.fillStyle=l,o.fillRect(0,0,256,256);const c=o.createRadialGradient(512,128,0,512,128,r);c.addColorStop(0,"rgba(255, 255, 255, 1.0)"),c.addColorStop(.5,"rgba(255, 255, 255, 0.4)"),c.addColorStop(1,"rgba(255, 255, 255, 0)"),o.fillStyle=c,o.fillRect(256,0,256,256);const d=new hs(s),h=new fo({map:d,side:Dt}),u=new _t(i,h);n.add(u),t.update(this.renderer,n),this.envMap=this.pmremGenerator.fromCubemap(e.texture).texture,this.scene.environment=this.envMap,i.dispose(),h.dispose(),d.dispose(),e.dispose()}clearNormalMapCache(){this.normalMapCache.forEach(e=>e.dispose()),this.normalMapCache.clear()}createSurfaceMaterial(e,t,n){const i=e.texture||"felt",s=e.textureScale||"medium",l=10/{small:4,medium:2,large:1}[s],c=t/l,d=n/l,u=this.graphicsQuality==="low"||this.graphicsQuality==="medium"?new Qs({color:new Oe(e.color),roughness:e.roughness,metalness:e.metalness}):new Lc({color:new Oe(e.color),roughness:e.roughness,metalness:e.metalness,clearcoat:e.clearcoat??0,clearcoatRoughness:e.clearcoatRoughness??.1});if(e.realTexture)this.loadRealTexture(e.realTexture,u,c,d,e);else{const m=`${i}_${s}`;let g=this.normalMapCache.get(m);if(!g){const f=this.generateSurfaceNormalMap(i,s);g=new hs(f),g.wrapS=Vt,g.wrapT=Vt,this.normalMapCache.set(m,g)}const v=g.clone();v.repeat.set(c,d),v.needsUpdate=!0,u.normalMap=v,u.normalScale=new Ye(e.normalIntensity,e.normalIntensity)}return e.emissive&&(u.emissive=new Oe(e.emissive),u.emissiveIntensity=e.emissiveIntensity??.5),u}loadRealTexture(e,t,n,i,s){const o=e.split("_");if(o.length<2){console.warn(`[Game] Invalid realTexture ID: ${e}`);return}const r=o[0],l=o.slice(1).join("_"),c=`/textures/${r}/${l}`,d=new ag;d.load(`${c}_color.jpg`,h=>{h.colorSpace=ft,h.wrapS=Vt,h.wrapT=Vt,h.repeat.set(n,i),t.map=h,t.color.set(s.color),t.needsUpdate=!0},void 0,()=>{console.log(`[Game] No color map for ${e}, using material color`)}),d.load(`${c}_normal.jpg`,h=>{h.wrapS=Vt,h.wrapT=Vt,h.repeat.set(n,i),t.normalMap=h,t.normalScale=new Ye(s.normalIntensity,s.normalIntensity),t.needsUpdate=!0}),d.load(`${c}_roughness.jpg`,h=>{h.wrapS=Vt,h.wrapT=Vt,h.repeat.set(n,i),t.roughnessMap=h,t.roughness=s.roughness,t.needsUpdate=!0}),d.load(`${c}_metalness.jpg`,h=>{h.wrapS=Vt,h.wrapT=Vt,h.repeat.set(n,i),t.metalnessMap=h,t.metalness=s.metalness,t.needsUpdate=!0},void 0,()=>{})}generateSurfaceNormalMap(e,t="medium"){const n=this.graphicsQuality==="low"?128:256,i=document.createElement("canvas");i.width=n,i.height=n;const s=i.getContext("2d"),o=s.createImageData(n,n),r=o.data;for(let l=0;l<r.length;l+=4)r[l]=128,r[l+1]=128,r[l+2]=255,r[l+3]=255;switch(e){case"felt":this.generateFeltNormals(r,n,t);break;case"leather":this.generateLeatherNormals(r,n,t);break;case"velvet":this.generateVelvetNormals(r,n,t);break;case"wood":this.generateWoodNormals(r,n,t);break;case"marble":this.generateMarbleNormals(r,n,t);break;case"concrete":this.generateConcreteNormals(r,n,t);break;case"diamond":this.generateDiamondNormals(r,n,t);break;case"glass":this.generateGlassNormals(r,n,t);break;case"hexagon":this.generateHexagonNormals(r,n,t);break;case"brick":this.generateBrickNormals(r,n,t);break;case"scales":this.generateScalesNormals(r,n,t);break;case"waves":this.generateWavesNormals(r,n,t);break;case"dots":this.generateDotsNormals(r,n,t);break;case"stripes":this.generateStripesNormals(r,n,t);break;case"checker":this.generateCheckerNormals(r,n,t);break;case"smooth":default:this.generateSmoothNormals(r,n,t);break}return s.putImageData(o,0,0),i}generateFeltNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=(Math.random()-.5)*.4,l=(Math.random()-.5)*.4;e[o]=Math.floor((r+.5)*255),e[o+1]=Math.floor((l+.5)*255),e[o+2]=230}}generateLeatherNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=Math.sin(s*.3+Math.random()*2)*.2,l=Math.sin(i*.3+Math.random()*2)*.2,c=r+(Math.random()-.5)*.15,d=l+(Math.random()-.5)*.15;e[o]=Math.floor((c*.4+.5)*255),e[o+1]=Math.floor((d*.4+.5)*255),e[o+2]=230}}generateVelvetNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=(Math.random()-.5)*.2,l=(Math.random()-.5)*.2;e[o]=Math.floor((r+.5)*255),e[o+1]=Math.floor((l+.5)*255),e[o+2]=245}}generateSmoothNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=(Math.random()-.5)*.08,l=(Math.random()-.5)*.08;e[o]=Math.floor((r+.5)*255),e[o+1]=Math.floor((l+.5)*255),e[o+2]=252}}generateWoodNormals(e,t,n){const i=n==="small"?1:n==="medium"?.5:.25;for(let s=0;s<t;s++)for(let o=0;o<t;o++){const r=(s*t+o)*4,l=Math.sin(s*i+Math.sin(o*.1)*3)*.3,c=(Math.random()-.5)*.1,d=c,h=l+c;e[r]=Math.floor((d+.5)*255),e[r+1]=Math.floor((h*.5+.5)*255),e[r+2]=235}}generateMarbleNormals(e,t,n){const i=n==="small"?.1:n==="medium"?.05:.025;for(let s=0;s<t;s++)for(let o=0;o<t;o++){const r=(s*t+o)*4,l=Math.sin(o*i+s*i*.6+Math.sin(o*i*.4)*5)*.25,c=(Math.random()-.5)*.05,d=l+c,h=Math.cos(o*i*.8+s*i)*.15+c;e[r]=Math.floor((d+.5)*255),e[r+1]=Math.floor((h+.5)*255),e[r+2]=240}}generateConcreteNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=Math.random()>.95?(Math.random()-.5)*.6:0,l=(Math.random()-.5)*.3+r,c=(Math.random()-.5)*.3+r;e[o]=Math.floor((l+.5)*255),e[o+1]=Math.floor((c+.5)*255),e[o+2]=225}}generateGlassNormals(e,t,n){for(let i=0;i<t;i++)for(let s=0;s<t;s++){const o=(i*t+s)*4,r=Math.sin(s*.1)*Math.sin(i*.1)*.02,l=r+(Math.random()-.5)*.02,c=r+(Math.random()-.5)*.02;e[o]=Math.floor((l+.5)*255),e[o+1]=Math.floor((c+.5)*255),e[o+2]=254}}generateDiamondNormals(e,t,n){const i=n==="small"?16:n==="medium"?32:64;for(let s=0;s<t;s++)for(let o=0;o<t;o++){const r=(s*t+o)*4,l=o%i-i/2,c=s%i-i/2,d=Math.abs(l)+Math.abs(c),h=d>i/2-4&&d<i/2+4;let u=0,m=0;h?(u=l/(Math.abs(l)+.1)*.4,m=c/(Math.abs(c)+.1)*.4):(u=l/i*.15,m=c/i*.15),e[r]=Math.floor((u+.5)*255),e[r+1]=Math.floor((m+.5)*255),e[r+2]=h?220:240}}generateHexagonNormals(e,t,n){const s=t/(n==="small"?16:n==="medium"?8:4),o=s*.866;for(let r=0;r<t;r++)for(let l=0;l<t;l++){const c=(r*t+l)*4,h=Math.floor(r/(o*.75))%2*(s/2),u=(l+h)%s,m=r%(o*.75),g=u-s/2,v=m-o*.375,f=Math.max(Math.abs(g)*1.15+Math.abs(v)*.58,Math.abs(v)),p=s*.45,y=f>p*.85&&f<p*1.1;let x=0,_=0;if(y){const R=Math.sqrt(g*g+v*v)+.1;x=g/R*.5,_=v/R*.5}e[c]=Math.floor((x+.5)*255),e[c+1]=Math.floor((_+.5)*255),e[c+2]=y?210:245}}generateBrickNormals(e,t,n){const i=n==="small"?4:n==="medium"?2:1,s=n==="small"?4:n==="medium"?2:1,o=t/i,r=t/s,l=n==="small"?2:n==="medium"?4:6;for(let c=0;c<t;c++)for(let d=0;d<t;d++){const h=(c*t+d)*4,m=Math.floor(c/o)%2*(r/2),g=(d+m)%r,v=c%o,f=g<l,p=v<l;let y=0,x=0;f||p?(p&&!f&&(x=.4),f&&!p&&(y=.4),f&&p&&(y=.3,x=.3)):(y=(Math.random()-.5)*.1,x=(Math.random()-.5)*.1),e[h]=Math.floor((y+.5)*255),e[h+1]=Math.floor((x+.5)*255),e[h+2]=f||p?200:240}}generateScalesNormals(e,t,n){const s=t/(n==="small"?16:n==="medium"?8:4),o=s*.75;for(let r=0;r<t;r++)for(let l=0;l<t;l++){const c=(r*t+l)*4,h=Math.floor(r/o)%2*(s/2),u=((l+h)%s+s)%s-s/2,m=(r%o+o)%o-o,g=Math.sqrt(u*u+m*m),v=s*.55,f=g<v,p=g>v*.8&&g<v*1.05;let y=0,x=0;f&&g>.1&&(y=u/g*.2,x=m/g*.2+.08),p&&(y*=1.8,x*=1.8),e[c]=Math.floor((y+.5)*255),e[c+1]=Math.floor((x+.5)*255),e[c+2]=p?215:240}}generateWavesNormals(e,t,n){const i=n==="small"?20:n==="medium"?40:80,s=.4;for(let o=0;o<t;o++)for(let r=0;r<t;r++){const l=(o*t+r)*4,c=r/i*Math.PI*2,d=Math.cos(c)*s,h=(Math.random()-.5)*.1;e[l]=Math.floor((h+.5)*255),e[l+1]=Math.floor((d+.5)*255),e[l+2]=235}}generateDotsNormals(e,t,n){const i=n==="small"?10:n==="medium"?20:40,s=i*.3;for(let o=0;o<t;o++)for(let r=0;r<t;r++){const l=(o*t+r)*4,c=r%i-i/2,d=o%i-i/2,h=Math.sqrt(c*c+d*d);let u=0,m=0;if(h<s&&h>.1){const g=1-h/s;u=-(c/h)*g*.5,m=-(d/h)*g*.5}e[l]=Math.floor((u+.5)*255),e[l+1]=Math.floor((m+.5)*255),e[l+2]=h<s?220:250}}generateStripesNormals(e,t,n){const i=n==="small"?8:n==="medium"?16:32;for(let s=0;s<t;s++)for(let o=0;o<t;o++){const r=(s*t+o)*4,l=(o+s)%(i*2)/i,c=l<1;let d=0,h=0;if(c){const u=l;u<.3?(d=.3,h=.3):u>.7&&(d=-.3,h=-.3)}e[r]=Math.floor((d+.5)*255),e[r+1]=Math.floor((h+.5)*255),e[r+2]=c?225:245}}generateCheckerNormals(e,t,n){const i=n==="small"?16:n==="medium"?32:64,s=Math.max(2,i/8);for(let o=0;o<t;o++)for(let r=0;r<t;r++){const l=(o*t+r)*4,c=r%i,d=o%i,h=Math.floor(r/i),u=Math.floor(o/i),m=(h+u)%2===0;let g=0,v=0;c<s?g=m?.3:-.3:c>i-s&&(g=m?-.3:.3),d<s?v=m?.3:-.3:d>i-s&&(v=m?-.3:.3),e[l]=Math.floor((g+.5)*255),e[l+1]=Math.floor((v+.5)*255),e[l+2]=240}}createHandBox(){this.handBoxFloor=new ce({type:ce.KINEMATIC,shape:new ei,material:this.floorMaterial}),this.handBoxFloor.quaternion.setFromEuler(-Math.PI/2,0,0),this.handBoxFloor.position.set(0,4,3),this.world.addBody(this.handBoxFloor),[{x:-2.5/2,z:3,rotY:Math.PI/2},{x:2.5/2,z:3,rotY:-Math.PI/2},{x:0,z:3-2.5/2,rotY:0},{x:0,z:3+2.5/2,rotY:Math.PI}].forEach(o=>{const r=new ce({type:ce.KINEMATIC,shape:new ei});r.position.set(o.x,5,o.z),r.quaternion.setFromEuler(0,o.rotY,0),this.world.addBody(r),this.handBoxWalls.push(r)});const s=new ce({type:ce.KINEMATIC,shape:new ei});s.quaternion.setFromEuler(Math.PI/2,0,0),s.position.set(0,5+1.5,3),this.world.addBody(s),this.handBoxWalls.push(s)}addWall(e,t,n,i){const s=new ce({type:ce.STATIC,shape:new ei,material:this.wallMaterial});s.position.set(e,t,n),s.quaternion.setFromEuler(0,i,0),this.world.addBody(s)}setupControls(){const e=async()=>{await this.audio.init()},t=()=>{e()};if(document.addEventListener("touchstart",t,{passive:!0}),document.addEventListener("touchend",t,{passive:!0}),document.addEventListener("click",t),document.addEventListener("pointerdown",t,{passive:!0}),document.addEventListener("keydown",t),this.shakeDetector.isMobile)this.setupMobileControls(e);else{let i=0,s=0,o=0,r=!1;const l=h=>{h.preventDefault(),e(),this.diceInHand&&(this.isHolding=!0,this.shakeIntensity=0,this.resultEl.textContent="",i=h.clientY,s=h.clientX,o=h.clientY,r=!1)},c=h=>{if(!this.isHolding||!this.diceInHand)return;const u=h.clientX-s,m=h.clientY-i;s=h.clientX,i=h.clientY;const g=Math.sqrt(u*u+m*m);if(g>2){r=!0;const v=Math.min(1,g/50);this.shakeIntensity=Math.min(1,this.shakeIntensity+v*.05),this.shakeDiceInHand(u*.1,m*.1,0),this.audio.playShake(this.shakeIntensity),v>.4&&Gt("light")}},d=h=>{if(h.preventDefault(),!this.isHolding)return;this.isHolding=!1;const u=o-h.clientY;if(this.diceInHand&&u>30){const m=Math.min(200,u-30),g=3+m*.04,v=-10-m*.1;this.throwDice(1,g,v)}};this.canvas.addEventListener("mousedown",l),this.canvas.addEventListener("mousemove",c),this.canvas.addEventListener("mouseup",d),this.canvas.addEventListener("mouseleave",()=>{this.isHolding&&(this.isHolding=!1)}),this.canvas.addEventListener("click",h=>{if(r){r=!1;return}window.debugLog?.("PALMOS","Canvas click event received (desktop)"),this.handleDiceClick(h)})}let n=0;this.shakeDetector.onMove=(i,s,o,r)=>{if(!this.diceInHand||this.isMenuOpen()||this.isWaitingForReady||this.controlMode==="manual"&&this.shakeDetector.isMobile&&!this.manualIsDragging)return;const l=Date.now();l-n<16||(n=l,this.shakeIntensity=Math.min(1,this.shakeIntensity+i*.12),this.shakeDiceInHand(s,o,r),this.audio.playShake(this.shakeIntensity),i>.4?Gt("medium"):Gt("light"))},this.shakeDetector.onTurn=i=>{this.diceInHand&&(this.isMenuOpen()||this.isWaitingForReady||this.controlMode==="manual"&&this.shakeDetector.isMobile&&!this.manualIsDragging||(this.audio.playShake(this.shakeIntensity),i>.4?Gt("medium"):Gt("light")))},this.shakeDetector.onThrow=(i,s,o)=>{this.controlMode!=="manual"&&(this.isWaitingForReady||this.diceInHand&&this.shakeIntensity>.2&&this.throwDice(i,s,o))}}setupMobileControls(e){this.shakeDetector.onPermissionGranted=()=>{this.controlMode==="motion"&&this.shakeDetector.start()},this.controlMode==="motion"&&setTimeout(()=>this.shakeDetector.start(),500),this.canvas.addEventListener("touchstart",async n=>{if(this.controlMode!=="manual"||!this.diceInHand||this.isMenuOpen())return;await e();const i=n.touches[0];this.manualTouchId=i.identifier,this.manualTouchStartY=i.clientY,this.manualLastY=i.clientY,this.manualIsDragging=!0,this.isHolding=!0,this.shakeIntensity=0,Gt("light")},{passive:!0}),this.canvas.addEventListener("touchmove",n=>{if(this.controlMode!=="manual"||!this.manualIsDragging)return;const i=Array.from(n.touches).find(r=>r.identifier===this.manualTouchId);if(!i)return;const s=this.manualLastY-i.clientY;this.manualLastY=i.clientY;const o=Math.abs(s)/40;o>.1&&(this.shakeIntensity=Math.min(1,this.shakeIntensity+o*.1),this.shakeDiceInHand((Math.random()-.5)*o*1.5,s*.1,(Math.random()-.5)*o*1.5),this.audio.playShake(this.shakeIntensity),Gt("light"))},{passive:!0}),this.canvas.addEventListener("touchend",n=>{if(this.controlMode!=="manual"||!this.manualIsDragging)return;const i=Array.from(n.changedTouches).find(o=>o.identifier===this.manualTouchId);if(!i)return;const s=this.manualTouchStartY-i.clientY;if(this.manualIsDragging=!1,this.isHolding=!1,this.manualTouchId=null,s>50&&this.diceInHand){const o=Math.min(200,s-50),r=3+o*.04,l=-10-o*.1;this.throwDice(1,r,l)}},{passive:!0}),this.canvas.addEventListener("touchcancel",()=>{this.manualIsDragging=!1,this.isHolding=!1,this.manualTouchId=null},{passive:!0});let t=0;this.canvas.addEventListener("touchend",n=>{if(window.debugLog?.("PALMOS","Canvas touchend event received"),t=Date.now(),n.changedTouches.length===1){const i=n.changedTouches[0];this.handleDiceClick(i)}},{passive:!0}),this.canvas.addEventListener("click",n=>{if(Date.now()-t<500){window.debugLog?.("PALMOS","Click ignored (after touch)");return}window.debugLog?.("PALMOS","Canvas click event received"),this.handleDiceClick(n)})}resetDiceToHand(){this.gameSync.isMultiplayerActive()&&!this.gameSync.isMyTurn()||(this.diceInHand=!0,this.shakeIntensity=0,this.handBoxWalls.forEach(e=>e.collisionResponse=!0),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!0),this.dice.forEach((e,t)=>{e.body.type=ce.DYNAMIC,e.body.wakeUp(),e.setPosition((t-.5)*1,5,3),e.setVelocity(0,0,0),e.setAngularVelocity(0,0,0)}),this.hintEl.textContent="")}prepareRerollDice(e){window.debugLog?.("PALMOS",`Preparing reroll for dice: [${e.join(",")}]`),this.lastRerollSelection=e,this.diceInHand=!0,this.shakeIntensity=0,this.clearDiceSelection(),this.disableDiceSelection(),this.handBoxWalls.forEach(t=>t.collisionResponse=!0),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!0),this.dice.forEach((t,n)=>{if(e.includes(n)){t.body.type=ce.DYNAMIC,t.body.wakeUp();const i=e.length,o=(e.indexOf(n)-(i-1)/2)*1;t.setPosition(o,5,3),t.setVelocity(0,0,0),t.setAngularVelocity(0,0,0),window.debugLog?.("PALMOS",`Dice ${n} moved to hand`)}else t.body.type=ce.STATIC,t.body.sleep(),window.debugLog?.("PALMOS",`Dice ${n} stays on table`)}),this.hintEl.textContent="",window.debugLog?.("PALMOS","Reroll dice ready"),window.debugLog?.("PALMOS",`About to check recording: diceSync=${!!this.diceSync}, multiplayer=${this.gameSync.isMultiplayerActive()}`),this.diceSync&&this.gameSync.isMultiplayerActive()?(window.debugLog?.("PALMOS","prepareRerollDice: Starting recording for multiplayer"),this.diceSync.isCurrentlyRecording()&&(window.debugLog?.("PALMOS","prepareRerollDice: Stopping previous recording"),this.diceSync.stopRecordingStream(!1)),window.debugLog?.("PALMOS",`prepareRerollDice: Starting new recording with selectedDice: [${e.join(",")}]`),this.diceSync.startRecordingStream(0,this.gameSync.getEquippedEffectId(),e),window.debugLog?.("PALMOS",`prepareRerollDice: Recording started, isRecording: ${this.diceSync.isCurrentlyRecording()}`)):window.debugLog?.("PALMOS",`prepareRerollDice: NOT starting recording - diceSync: ${!!this.diceSync}, multiplayer: ${this.gameSync.isMultiplayerActive()}`)}shakeDiceInHand(e=0,t=0,n=0){this.dice.forEach(s=>{s.body.type===ce.DYNAMIC&&(s.body.applyForce(new b(e*15,-n*15*.5,t*15),s.body.position),s.body.wakeUp())})}throwDice(e=.5,t=5,n=-20){if(this.isMenuOpen()||this.gameSync.isMultiplayerActive()&&!this.gameSync.isMyTurn()||this.diceSync?.isCurrentlyReplaying()||!this.diceInHand)return;this.diceInHand=!1,this.hintEl.textContent="",this.gameSync.setThrowInProgress(!0),this.handBoxWalls.forEach(r=>r.collisionResponse=!1),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!1),Gt("heavy");const i=()=>{let r=this.throwSeed+=1831565813;return r=Math.imul(r^r>>>15,r|1),r^=r+Math.imul(r^r>>>7,r|61),((r^r>>>14)>>>0)/4294967296},s=8+Math.abs(t)*3,o=Math.abs(n)*.5;this.dice.forEach(r=>{if(r.body.type!==ce.DYNAMIC){window.debugLog?.("PALMOS",`Skipping static dice ${this.dice.indexOf(r)}`);return}r.body.wakeUp(),r.setVelocity((Math.random()-.5)*s*.4,Math.max(-5,3-o*.3),-(s+o*.4));const c=15+(s+o)*.5,d=1+(i()-.5)*.4,h=35+i()*20;r.setAngularVelocity(-h*d,(i()-.5)*c*.3,(i()-.5)*c*.3)}),setTimeout(()=>this.waitForDiceToStop(),500)}waitForDiceToStop(){let n=0;const i=Date.now(),s=setInterval(()=>{this.dice.every(l=>{const c=l.body.velocity.length(),d=l.body.angularVelocity.length();return c<.02&&d<.02})?n++:n=0;const r=Date.now()-i>8e3;(n>=4||r)&&(clearInterval(s),r&&window.debugLog?.("DICE","waitForDiceToStop timeout after 8000ms"),this.checkDiceValidityAndShowResult())},100)}checkDiceValidityAndShowResult(){window.debugLog?.("DICE","========== CHECKING VALIDITY ==========");const e=Hn.validateDicePositions(this.dice),t=this.dice.map((n,i)=>{const s=Hn.getDiceTiltAngle(n),o=Hn.getDiceHeight(n);return`D${i}:${s.toFixed(1)}°/h${o.toFixed(2)}`});window.debugLog?.("DICE",`Status: ${t.join(", ")}`),e.isValid?(window.debugLog?.("DICE","✅ VALID - showing result"),this.showResult()):(window.debugLog?.("DICE",`❌ INVALID! Dice: ${e.invalidDiceIndices.join(",")}`),this.diceSync&&this.diceSync.isCurrentlyRecording()&&(window.debugLog?.("DICE","Stopping recording (no result sent)"),this.diceSync.stopRecordingStream(!1)),this.showInvalidRollIndicator(),this.invalidRollCheckTimeout=window.setTimeout(()=>{this.recheckAndRerollIfNeeded()},this.invalidRollWaitTime))}showInvalidRollIndicator(){const e=document.getElementById("invalid-roll-indicator");e&&e.remove();const t=document.createElement("div");t.id="invalid-roll-indicator",t.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 20px 28px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      pointer-events: auto;
      cursor: pointer;
      transition: opacity 0.3s ease;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `,t.innerHTML=`
      <div style="color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        ${ai("refresh",40)}
      </div>
      <div style="color: white; font-size: 14px; font-weight: 500; text-align: center;">
        Rerolling...
      </div>
    `,t.addEventListener("click",()=>{t.style.opacity="0",setTimeout(()=>t.remove(),300)}),document.body.appendChild(t)}hideInvalidRollIndicator(){const e=document.getElementById("invalid-roll-indicator");e&&(e.style.opacity="0",setTimeout(()=>e.remove(),300))}recheckAndRerollIfNeeded(){window.debugLog?.("DICE","Rechecking after 3s wait...");const e=Hn.validateDicePositions(this.dice),t=this.dice.map((n,i)=>{const s=Hn.getDiceTiltAngle(n),o=Hn.getDiceHeight(n);return`D${i}:${s.toFixed(1)}°/h${o.toFixed(2)}`});window.debugLog?.("DICE",`Final: ${t.join(", ")}`),e.isValid?(window.debugLog?.("DICE","✅ Corrected itself - showing result"),this.hideInvalidRollIndicator(),this.showResult()):(window.debugLog?.("DICE","🔄 Still invalid - resetting to hand"),this.hideInvalidRollIndicator(),$l("warning"),setTimeout(()=>{this.performAutomaticReroll()},500))}performAutomaticReroll(){window.debugLog?.("DICE","🔄 Performing automatic reroll (invalid roll)"),this.lastRerollSelection.length>0?(window.debugLog?.("PALMOS",`Invalid roll in Palmo's reroll, re-preparing dice: [${this.lastRerollSelection.join(",")}]`),this.prepareRerollDice(this.lastRerollSelection)):(window.debugLog?.("DICE","Invalid roll in full throw, resetting all dice to hand"),this.forceResetDiceToHand(!1)),this.hintEl.textContent="",this.resultEl.textContent="",this.resultEl.style.color=""}showResult(){this.invalidRollCheckTimeout&&(clearTimeout(this.invalidRollCheckTimeout),this.invalidRollCheckTimeout=null);const e=this.dice.map(s=>s.getTopFace()),t=this.gameSync.getGameMode();let n,i=0;if(t==="mexico"){const s=Math.max(e[0],e[1]),o=Math.min(e[0],e[1]),r=s*10+o;n=`${e[0]} + ${e[1]} = ${r}`,i=r}else{const s=e.reduce((o,r)=>o+r,0);n=`${e[0]} + ${e[1]} = ${s}`,i=s}if(this.gameSync.isMultiplayerActive()?this.resultEl.textContent=n:this.resultEl.textContent="",!this.gameSync.isMultiplayerActive()&&this.wallText){let s=i;Bi(async()=>{const{BoostsModal:o}=await Promise.resolve().then(()=>ql);return{BoostsModal:o}},void 0).then(({BoostsModal:o})=>{const{multiplier:r,bonus:l,reason:c}=o.calculatePipsMultiplier(e[0],e[1]);(r>1||l>0)&&(s=Math.floor(i*r)+l,this.showBoostAnimation(e[0],e[1],i,r,l,s));const d=window.wsClient;if(!d){console.error("[PIPS] wsClient not found in window");return}if(!d.isConnected||!d.isAuthenticated){console.warn("[PIPS] Not connected - pips not awarded",{isConnected:d.isConnected,isAuthenticated:d.isAuthenticated});return}if(d.connectionHealth==="poor"||d.connectionHealth==="unstable"){console.warn("[PIPS] Poor connection - pips not awarded",{health:d.connectionHealth});return}const u=this.wallText.getPips()+s;this.wallText.animateChange(u,800),localStorage.setItem("playerPips",u.toString()),d.send({type:"solo_roll_complete",dice1:e[0],dice2:e[1],total:e.reduce((m,g)=>m+g,0),earnedPips:s,boostMultiplier:r,boostBonus:l})})}if(this.gameSync.isMultiplayerActive()){this.diceSync&&this.diceSync.stopRecordingStream(),this.lastRerollSelection=[],this.hintEl.textContent="Waiting...";const s=this.gameSync.isMyTurn();window.debugLog?.("PALMOS",`After roll: mode=${t}, myTurn=${s}`),t==="poker_dice"&&s&&(this.dice.forEach(o=>{o.body.type=ce.DYNAMIC}),this.enableDiceSelection(),window.debugLog?.("PALMOS","Dice selection enabled"),this.gameSync.setThrowInProgress(!1),window.debugLog?.("PALMOS","Throw completed, buttons unblocked"))}else this.hintEl.textContent="Tap to roll again",setTimeout(()=>{this.resetDiceToHand()},1500);$l("success")}resize(){(this.lockedWidth===0||this.lockedHeight===0)&&(this.lockedWidth=window.innerWidth,this.lockedHeight=window.innerHeight);const e=this.lockedWidth,t=this.lockedHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.updateSideWalls()}updateSideWalls(){if(this.sideWallsInitialized)return;this.sideWallsInitialized=!0;const e=this.camera.fov*Math.PI/180,t=this.lockedWidth/this.lockedHeight,s=2*Math.tan(e/2)*13*t,o=Math.min(6,s/2);this.leftWall&&(this.leftWall.position.x=-o),this.rightWall&&(this.rightWall.position.x=o),this.leftWallMesh&&(this.leftWallMesh.position.x=-o),this.rightWallMesh&&(this.rightWallMesh.position.x=o),this.leftBorderMesh&&(this.leftBorderMesh.position.x=-o),this.rightBorderMesh&&(this.rightBorderMesh.position.x=o)}start(){document.addEventListener("visibilitychange",()=>{if(document.hidden){window.debugLog?.("RENDER","Page hidden, clearing renderer");try{if(this.renderer.clear(),this.renderer.clearColor(),this.renderer.clearDepth(),performance.memory){const r=performance.memory}}catch(r){console.warn("[Game] Error clearing renderer:",r)}}else{const l=this.renderer.getContext().isContextLost();if(window.debugLog?.("RENDER","Visibility restored, contextLost:",l),l){console.warn("[Game] WebGL context is lost after visibility restore. Waiting for restore event...");return}setTimeout(()=>{window.debugLog?.("RENDER","Calling resize..."),this.resize(),this.renderer.render(this.scene,this.camera),window.debugLog?.("RENDER","Forced render done")},100)}});let e=performance.now(),t=0;const n=1/60,i=5;let s=0;const o=()=>{if(requestAnimationFrame(o),document.hidden)return;const r=performance.now(),l=Math.min((r-e)/1e3,.1);if(r-e>2e3&&(t++,window.debugLog?.("RENDER","STALL detected! Gap:",Math.round(r-e),"ms, count:",t)),e=r,this.frameCount++,r-this.lastFpsUpdate>=500){const d=Math.round(this.frameCount/((r-this.lastFpsUpdate)/1e3));this.updateFpsCounter(d),this.frameCount=0,this.lastFpsUpdate=r}for(s+=l;s>=n;)if(this.dice.forEach(d=>d.saveState()),this.world.step(n),this.dice.forEach(d=>d.updateState()),s-=n,s>n*i){s=0;break}const c=Math.min(1,s/n);this.dice.forEach(d=>d.update(c)),this.renderer.render(this.scene,this.camera)};o()}createFpsCounter(){this.fpsToggleButton=document.createElement("div"),this.fpsToggleButton.style.cssText=`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 40px;
      z-index: 999;
      cursor: default;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      outline: none;
    `,this.fpsToggleButton.addEventListener("click",()=>this.handleFpsToggleClick()),document.body.appendChild(this.fpsToggleButton),this.fpsCounter=document.createElement("div"),this.fpsCounter.style.cssText=`
      position: fixed;
      bottom: 10px;
      left: 10px;
      font-family: monospace;
      font-size: 14px;
      font-weight: bold;
      padding: 4px 8px;
      background: rgba(0,0,0,0.5);
      border-radius: 4px;
      z-index: 1000;
      pointer-events: none;
      display: none;
    `,document.body.appendChild(this.fpsCounter),this.lastFpsUpdate=performance.now()}handleFpsToggleClick(){if(this.fpsClickCount++,this.fpsClickTimeout&&clearTimeout(this.fpsClickTimeout),this.fpsClickCount>=5){this.fpsVisible=!this.fpsVisible,this.fpsCounter&&(this.fpsCounter.style.display=this.fpsVisible?"block":"none");const e=document.getElementById("debug-overlay");e&&(e.style.display=this.fpsVisible?"block":"none"),this.fpsClickCount=0}else this.fpsClickTimeout=window.setTimeout(()=>{this.fpsClickCount=0},1e3)}updateFpsCounter(e){if(!this.fpsCounter||!this.fpsVisible)return;let t="#4CAF50";e<35?t="#f44336":e<55&&(t="#FFC107"),this.fpsCounter.style.color=t,this.fpsCounter.textContent=`${e} FPS`}resetForNewTurn(){this.resetDiceToHand()}onTurnChanged(e){e&&(this.diceSync?.isCurrentlyReplaying()&&this.diceSync.stopReplay(),this.forceResetDiceToHand(),this.requireReadyConfirmation&&this.controlMode==="motion"&&this.gameSync.isMultiplayerActive()&&(this.shakeDetector.isMobile&&this.shakeDetector.stop(),this.showReadyDialog()))}forceResetDiceToHand(e=!1){if(window.debugLog?.("DICE",`forceResetDiceToHand called, diceInHand=${this.diceInHand}, skipStreamStart=${e}`),this.gameSync.isMultiplayerActive()&&!this.gameSync.isMyTurn()){window.debugLog?.("DICE","Not our turn, skipping reset");return}if(this.diceInHand&&!this.gameSync.isMultiplayerActive()){window.debugLog?.("DICE","Already in hand (solo mode), skipping reset");return}this.shakeIntensity=0,this.handBoxWalls.forEach(n=>n.collisionResponse=!0),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!0);const t=this.dice.map((n,i)=>({x:(i-.5)*1,y:5,z:3}));if(this.gameSync.isMultiplayerActive()&&this.diceSync){window.debugLog?.("DICE","Multiplayer mode - setting DYNAMIC physics");const n=D.getEquippedDiceConfig();if(n&&this.dice.forEach(i=>i.updateConfig(n)),this.dice.forEach((i,s)=>{i.body.type=ce.DYNAMIC,i.body.wakeUp(),i.setPosition(t[s].x,t[s].y,t[s].z),i.setVelocity(0,0,0),i.setAngularVelocity(0,0,0)}),window.debugLog?.("DICE",`Dice set to DYNAMIC, type=${this.dice[0].body.type}`),this.diceInHand=!0,this.gameSync.setThrowInProgress(!1),!e&&this.diceSync&&this.gameSync.isMultiplayerActive()){const i=this.lastRerollSelection.length>0?this.lastRerollSelection:void 0;this.diceSync.startRecordingStream(0,this.gameSync.getEquippedEffectId(),i)}}else this.dice.forEach((n,i)=>{n.body.type=ce.DYNAMIC,n.body.wakeUp(),n.setPosition(t[i].x,t[i].y,t[i].z),n.setVelocity(0,0,0),n.setAngularVelocity(0,0,0)}),this.diceInHand=!0,this.gameSync.setThrowInProgress(!1);this.hintEl.textContent=""}getDiceSync(){return this.diceSync}getGameSync(){return this.gameSync}isDiceInHand(){return this.diceInHand}setDiceInHand(e){this.diceInHand=e}teleportDiceToNextPlayer(e,t=!0){window.debugLog?.("DICE",`teleportDiceToNextPlayer: playerId=${e}, animate=${t}`);const n=this.diceSync;if(!n)return;const i=this.getHandPositions(),s=this.gameSync.getPlayerDiceConfig(e);this.diceInHand=!1,n.teleportDiceToHand(i,s??void 0,t)}getHandPositions(){return this.dice.map((e,t)=>({x:(t-.5)*1,y:5,z:3}))}isInMultiplayerGame(){return this.gameSync.isMultiplayerActive()}updateUIVisibility(){const e=this.gameSync.isMultiplayerActive(),t=document.getElementById("result"),n=document.getElementById("boost-icon"),i=document.getElementById("chat-icon");window.debugLog?.("UI",`updateUIVisibility: multiplayer=${e}, result=${!!t}, boost=${!!n}, chat=${!!i}`),e?(t&&(t.style.display=""),n&&(n.style.display="none"),i&&(i.style.display="flex"),window.debugLog?.("UI","Multiplayer mode: result+chat visible, boost hidden")):(t&&(t.style.display="none"),n&&(n.style.display="flex"),i&&(i.style.display="none"),window.debugLog?.("UI","Online mode: result+chat hidden, boost visible"))}setSyncedAspectRatio(e){const t=this.camera.fov*Math.PI/180,s=2*Math.tan(t/2)*13*e,o=Math.min(6,s/2);this.leftWall&&(this.leftWall.position.x=-o),this.rightWall&&(this.rightWall.position.x=o),this.leftWallMesh&&(this.leftWallMesh.position.x=-o),this.rightWallMesh&&(this.rightWallMesh.position.x=o)}resetWallsToLocal(){const e=this.camera.fov*Math.PI/180,t=this.lockedWidth/this.lockedHeight,s=2*Math.tan(e/2)*13*t,o=Math.min(6,s/2);this.leftWall&&(this.leftWall.position.x=-o),this.rightWall&&(this.rightWall.position.x=o),this.leftWallMesh&&(this.leftWallMesh.position.x=-o),this.rightWallMesh&&(this.rightWallMesh.position.x=o)}onGameStarted(e){this.wallText&&this.wallText.setVisible(!1),this.shakeIntensity=0,this.resultEl.textContent="",this.hintEl.textContent="",e?(this.forceResetDiceToHand(),this.requireReadyConfirmation&&this.controlMode==="motion"&&(this.shakeDetector.isMobile&&this.shakeDetector.stop(),this.showReadyDialog())):this.hideDice()}hideDice(){this.diceInHand=!1,this.handBoxWalls.forEach(e=>e.collisionResponse=!1),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!1),this.dice.forEach(e=>{e.body.type=ce.KINEMATIC,e.setPosition(0,-10,0),e.setVelocity(0,0,0),e.setAngularVelocity(0,0,0)})}setMenuOpenCallback(e){this.isMenuOpenCallback=e}isMenuOpen(){return this.isMenuOpenCallback?this.isMenuOpenCallback():!1}getDice(){return this.dice}setDiceCount(e,t=!1){if(console.log(`[Game] setDiceCount called with count=${e}, current=${this.dice.length}, skipAutoReset=${t}`),e<1||e>10){console.error(`Invalid dice count: ${e}. Must be between 1 and 10.`);return}const n=this.dice.length;if(n===e){console.log(`[Game] Dice count already correct (${e}), skipping`);return}console.log(`[Game] Changing dice count from ${n} to ${e}`);const i=this.diceSync?this.diceSync.getOriginalDiceConfig():null;if(e<n){for(let s=n-1;s>=e;s--){const o=this.dice[s];this.scene.remove(o.mesh),this.world.removeBody(o.body),o.mesh.geometry.dispose(),Array.isArray(o.mesh.material)?o.mesh.material.forEach(r=>r.dispose()):o.mesh.material.dispose()}this.dice.length=e}else{const s=this.dice[0]?.getConfig();for(let o=n;o<e;o++){const r=new co(this.scene,this.world,this.diceMaterial,s,this.graphicsSettings.diceBevelSegments);r.mesh.castShadow=this.graphicsSettings.shadowsEnabled,this.dice.push(r)}}this.diceSync=new Vl(this.dice,this.audio,this.scene,this.world,()=>this.gameSync.getGameMode(),this),i&&this.diceSync.setOriginalDiceConfig(i),t?console.log("[Game] Skipping auto-reset for reconnect"):this.resetDiceToHand()}getDiceCount(){return this.dice.length}restoreDiceFromFrame(e){if(window.debugLog?.("GAME","Restoring dice from last frame, frame:",e),!e||!e.dice||e.dice.length!==this.dice.length){window.debugLog?.("GAME",`Invalid frame data: hasFrame=${!!e}, hasDice=${!!e?.dice}, frameLength=${e?.dice?.length}, diceLength=${this.dice.length}`);return}window.debugLog?.("GAME",`Frame valid, restoring ${e.dice.length} dice`),this.handBoxWalls.forEach(t=>t.collisionResponse=!1),this.handBoxFloor&&(this.handBoxFloor.collisionResponse=!1),e.dice.forEach((t,n)=>{const i=this.dice[n];i.body.type=ce.KINEMATIC,i.body.collisionResponse=!0,i.setPosition(t.x,t.y,t.z),i.body.quaternion.set(t.qx,t.qy,t.qz,t.qw),i.setVelocity(0,0,0),i.setAngularVelocity(0,0,0)}),this.diceInHand=!1,window.debugLog?.("GAME",`Dice restored from frame, diceInHand=${this.diceInHand}`)}updateDiceAppearance(e){this.dice.forEach(t=>{t.updateConfig(e,this.graphicsSettings.diceBevelSegments)})}updateTableAppearance(e){const t=oy(e),n=JSON.stringify(this.tableConfig),i=JSON.stringify(t);if(n===i)return;(this.tableConfig.floor.texture!==t.floor.texture||this.tableConfig.wall.texture!==t.wall.texture)&&this.clearNormalMapCache(),this.tableConfig=t;const s=new Oe(this.tableConfig.wall.color);s.multiplyScalar(.7),this.scene.background=s,this.tableMesh&&(this.tableMesh.material.dispose(),this.tableMesh.material=this.createSurfaceMaterial(this.tableConfig.floor,20,20));const o=this.createSurfaceMaterial(this.tableConfig.wall,12,6);if(this.backWallMesh&&(this.backWallMesh.material.dispose(),this.backWallMesh.material=o),this.leftWallMesh&&(this.leftWallMesh.material.dispose(),this.leftWallMesh.material=this.createSurfaceMaterial(this.tableConfig.wall,15,6)),this.rightWallMesh&&(this.rightWallMesh.material.dispose(),this.rightWallMesh.material=this.createSurfaceMaterial(this.tableConfig.wall,15,6)),this.tableConfig.border){const r=new Qs({color:new Oe(this.tableConfig.border.color),roughness:this.tableConfig.border.roughness,metalness:this.tableConfig.border.metalness});this.backBorderMesh&&(this.backBorderMesh.material.dispose(),this.backBorderMesh.material=r),this.leftBorderMesh&&(this.leftBorderMesh.material.dispose(),this.leftBorderMesh.material=r.clone()),this.rightBorderMesh&&(this.rightBorderMesh.material.dispose(),this.rightBorderMesh.material=r.clone())}this.updateEnvMap()}setControlMode(e){this.controlMode=e,localStorage.setItem("controlMode",e),e==="motion"?this.shakeDetector.isMobile&&this.shakeDetector.start():this.shakeDetector.isMobile&&this.shakeDetector.stop()}getControlMode(){return this.controlMode}setRequireReadyConfirmation(e){this.requireReadyConfirmation=e,localStorage.setItem("requireReadyConfirmation",e?"1":"0")}getRequireReadyConfirmation(){return this.requireReadyConfirmation}showReadyDialog(){if(this.readyOverlay)return;this.isWaitingForReady=!0,this.readyOverlay=document.createElement("div"),this.readyOverlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `,this.readyOverlay.innerHTML=`
      <div style="
        background: rgba(30,30,30,0.95);
        padding: 32px 48px;
        border-radius: 16px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      ">
        <div style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Ready?</div>
        <div style="color: #888; font-size: 14px;">Tap to throw</div>
      </div>
    `,document.body.appendChild(this.readyOverlay);const e=()=>{this.hideReadyDialog(),this.controlMode==="motion"&&this.shakeDetector.isMobile&&this.shakeDetector.start()};this.readyOverlay.addEventListener("click",e),this.readyOverlay.addEventListener("touchstart",e,{passive:!0})}hideReadyDialog(){this.readyOverlay&&(this.readyOverlay.remove(),this.readyOverlay=null),this.isWaitingForReady=!1}loadControlSettings(){const e=localStorage.getItem("controlMode");(e==="motion"||e==="manual")&&(this.controlMode=e);const t=localStorage.getItem("requireReadyConfirmation");this.requireReadyConfirmation=t==="1"}setThrowSeed(e){this.throwSeed=e}previewDice(e){if(!e)return;const t={baseColor:e.baseColor??"#e5e5d7",dotColor:e.dotColor??"#383838",borderColor:e.borderColor??"#e5e5d7",roughness:e.roughness??.3,metalness:e.metalness??0,clearcoat:e.clearcoat??0,clearcoatRoughness:e.clearcoatRoughness??0,opacity:e.opacity??1,dotSize:e.dotSize??29,dotShape:e.dotShape??"circle",dotDepth:e.dotDepth??1.3,bevelRadius:e.bevelRadius??.08};this.updateDiceAppearance(t);const n=window.__diceEditorModal;n&&n.updateFromDiceChange(t)}previewTable(e){e&&this.updateTableAppearance(e)}getPips(){return this.wallText?.getPips()??0}setPips(e){this.wallText&&(this.wallText.setPips(e),localStorage.setItem("playerPips",e.toString()))}addPips(e){if(this.wallText){const t=this.wallText.getPips()+e;this.wallText.animateChange(t,800),localStorage.setItem("playerPips",t.toString())}}showWallText(e){this.wallText&&this.wallText.setVisible(e)}showBoostAnimation(e,t,n,i,s,o){const r=document.getElementById("boost-icon");if(!r)return;const l=r.getBoundingClientRect(),c=l.left+l.width/2,d=l.top+l.height/2,h=document.createElement("div");h.textContent=`+${o}`,h.style.cssText=`
      position: fixed;
      left: ${c}px;
      top: ${d}px;
      transform: translate(-50%, -50%);
      color: #FFD700;
      font-size: 24px;
      font-weight: 900;
      font-family: 'Alfa Slab One', serif;
      z-index: 3000;
      pointer-events: none;
      opacity: 0;
      transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `,document.body.appendChild(h),requestAnimationFrame(()=>{h.style.top=`${d-100}px`,h.style.opacity="1",setTimeout(()=>{h.style.opacity="0"},1e3)}),setTimeout(()=>{h.remove()},2500)}showConnectionWarning(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(244, 67, 54, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      z-index: 10001;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      text-align: center;
      max-width: 80%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1"}),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>{t.remove()},300)},3e3)}handleDiceClick(e){if(window.debugLog?.("PALMOS",`handleDiceClick: enabled=${this.diceSelectionEnabled}, inHand=${this.diceInHand}`),!this.diceSelectionEnabled){window.debugLog?.("PALMOS","Selection not enabled, ignoring click");return}if(this.diceInHand){window.debugLog?.("PALMOS","Dice in hand, ignoring click");return}if(!this.dice.every(o=>o.body.sleepState===ce.SLEEPING||o.body.type===ce.STATIC)){window.debugLog?.("PALMOS","Dice not settled, ignoring click");return}const n=this.canvas.getBoundingClientRect();this.mouse.x=(e.clientX-n.left)/n.width*2-1,this.mouse.y=-((e.clientY-n.top)/n.height)*2+1,window.debugLog?.("PALMOS",`Mouse pos: ${this.mouse.x.toFixed(2)}, ${this.mouse.y.toFixed(2)}`),this.raycaster.setFromCamera(this.mouse,this.camera);const i=this.dice.map(o=>o.mesh),s=this.raycaster.intersectObjects(i);if(window.debugLog?.("PALMOS",`Intersects: ${s.length}`),s.length>0){const o=s[0].object,r=this.dice.findIndex(l=>l.mesh===o);window.debugLog?.("PALMOS",`Clicked dice index: ${r}`),r!==-1&&this.toggleDiceSelection(r)}}toggleDiceSelection(e){this.selectedDiceForReroll.has(e)?(this.selectedDiceForReroll.delete(e),this.setDiceHighlight(e,!1)):(this.selectedDiceForReroll.add(e),this.setDiceHighlight(e,!0)),this.audio.playDiceHit(.3),Gt("light"),window.debugLog?.("PALMOS",`Selected: ${Array.from(this.selectedDiceForReroll).join(",")}`)}setDiceHighlight(e,t){const n=this.dice[e];n&&n.setSelected(t)}enableDiceSelection(){this.diceSelectionEnabled=!0,window.debugLog?.("PALMOS","Selection enabled")}disableDiceSelection(){this.diceSelectionEnabled=!1,this.clearDiceSelection(),window.debugLog?.("PALMOS","Selection disabled")}clearDiceSelection(){for(const e of this.dice)e.isSelected()&&e.setSelected(!1);this.selectedDiceForReroll.clear()}getSelectedDiceForReroll(){return Array.from(this.selectedDiceForReroll)}isAnyDiceSelected(){return this.selectedDiceForReroll.size>0}showOtherPlayerDiceSelection(e){window.debugLog?.("PALMOS",`Showing other player's selection (notify only): [${e.join(",")}]`),this.showNotification(`Выбрано кубиков для переброса: ${e.length}`)}showNotification(e){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
      animation: fadeInOut 2s ease-in-out;
    `,t.textContent=e;const n=document.createElement("style");n.textContent=`
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      }
    `,document.head.appendChild(n),document.body.appendChild(t),setTimeout(()=>{t.remove(),n.remove()},2e3)}}const Bt=class Bt{constructor(e){N(this,"overlay",null);N(this,"game");N(this,"currentConfig");N(this,"previewUpdateTimer",null);this.game=e;const t=this.loadSavedConfig();if(t){this.currentConfig=t;const n=this.game.graphicsSettings?.diceBevelSegments||3;this.game.getDice().forEach(i=>{i.updateConfig(t,n)})}else this.currentConfig=this.game.getDice()[0]?.getConfig()||this.getDefaultConfig();window.__diceEditorModal=this}static toggle(e){Bt.instance&&Bt.instance.overlay?(Bt.instance.close(),Bt.instance=null,window.__diceEditorModal=null):(Bt.instance=new Bt(e),Bt.instance.show())}static updateIfOpen(e){if(Bt.instance&&Bt.instance.overlay){localStorage.removeItem("customDiceConfig");const t=e.getDice()[0]?.getConfig();t&&(Bt.instance.currentConfig=t,Bt.instance.updateFormValues(t))}}updateFromDiceChange(e){localStorage.removeItem("customDiceConfig"),this.currentConfig=e,this.updateFormValues(e)}loadSavedConfig(){try{const e=localStorage.getItem("customDiceConfig");if(e){const t=JSON.parse(e);return console.log("[DiceEditor] Loaded config from localStorage:",t),t}}catch(e){console.error("Failed to load saved dice config:",e)}return null}getDefaultConfig(){return{baseColor:"#ffffff",dotColor:"#000000",borderColor:"#ffffff",roughness:.3,metalness:.25,clearcoat:0,clearcoatRoughness:0,opacity:1,dotSize:29,dotShape:"circle",dotDepth:1.3,bevelRadius:.08}}show(){if(this.overlay)return;const e=document.getElementById("result");e&&(e.style.display="none");const t=document.getElementById("boost-icon");t&&(t.style.display="none"),this.overlay=document.createElement("div"),this.overlay.id="dice-editor-modal",this.overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      backdrop-filter: none;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0 10px 10px 10px;
      pointer-events: none;
      z-index: 98;
    `,this.overlay.innerHTML=`
      <div class="mp-confirm-dialog" style="position: relative; width: 100%; max-width: 420px; max-height: 70vh; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 12px 12px 12px 12px; background: transparent; border-radius: 16px; margin: 0; pointer-events: auto;">
        
        <div id="dice-editor-content" style="text-align: left;">
          <!-- Appearance Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="appearance">
              <span class="dice-editor-category-icon">▶</span>
              <span>${U("diceEditor.appearance")}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="appearance" style="display: none;">
              <div class="dice-editor-control">
                <label>${U("diceEditor.baseColor")}</label>
                <input type="color" id="dice-baseColor" value="${this.currentConfig.baseColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.borderColor")}</label>
                <input type="color" id="dice-borderColor" value="${this.currentConfig.borderColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.bevelRadius")}</label>
                <input type="range" id="dice-bevelRadius" min="0" max="0.2" step="0.01" value="${this.currentConfig.bevelRadius||.08}" />
                <span class="dice-editor-value">${(this.currentConfig.bevelRadius||.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Pips Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="pips">
              <span class="dice-editor-category-icon">▶</span>
              <span>${U("diceEditor.pips")}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="pips" style="display: none;">
              <div class="dice-editor-control">
                <label>${U("diceEditor.pipColor")}</label>
                <input type="color" id="dice-dotColor" value="${this.currentConfig.dotColor}" />
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.pipSize")}</label>
                <input type="range" id="dice-dotSize" min="10" max="31" step="1" value="${this.currentConfig.dotSize||29}" />
                <span class="dice-editor-value">${this.currentConfig.dotSize||29}</span>
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.pipDepth")}</label>
                <input type="range" id="dice-dotDepth" min="0" max="2" step="0.1" value="${this.currentConfig.dotDepth||1.3}" />
                <span class="dice-editor-value">${(this.currentConfig.dotDepth||1.3).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <!-- Material Category -->
          <div class="dice-editor-category">
            <button class="dice-editor-category-header" data-category="material">
              <span class="dice-editor-category-icon">▶</span>
              <span>${U("diceEditor.material")}</span>
            </button>
            <div class="dice-editor-category-content" data-category-content="material" style="display: none;">
              <div class="dice-editor-control">
                <label>${U("diceEditor.roughness")}</label>
                <input type="range" id="dice-roughness" min="0" max="1" step="0.05" value="${this.currentConfig.roughness||.3}" />
                <span class="dice-editor-value">${((this.currentConfig.roughness||.3)*100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.metalness")}</label>
                <input type="range" id="dice-metalness" min="0" max="1" step="0.05" value="${this.currentConfig.metalness||.25}" />
                <span class="dice-editor-value">${((this.currentConfig.metalness||.25)*100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.clearcoat")}</label>
                <input type="range" id="dice-clearcoat" min="0" max="1" step="0.05" value="${this.currentConfig.clearcoat||0}" />
                <span class="dice-editor-value">${((this.currentConfig.clearcoat||0)*100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.clearcoatRoughness")}</label>
                <input type="range" id="dice-clearcoatRoughness" min="0" max="1" step="0.05" value="${this.currentConfig.clearcoatRoughness||0}" />
                <span class="dice-editor-value">${((this.currentConfig.clearcoatRoughness||0)*100).toFixed(0)}%</span>
              </div>
              <div class="dice-editor-control">
                <label>${U("diceEditor.opacity")}</label>
                <input type="range" id="dice-opacity" min="0.1" max="1" step="0.05" value="${this.currentConfig.opacity||1}" />
                <span class="dice-editor-value">${((this.currentConfig.opacity||1)*100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="mp-btn secondary" id="dice-editor-reset" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("diceEditor.reset")}</button>
          <button class="mp-btn" id="dice-editor-use-key" style="flex: 0 0 48px; padding: 12px; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255,215,0,0.4); display: flex; align-items: center; justify-content: center;">
            <span id="use-key-icon" style="display: inline-flex; width: 20px; height: 20px; color: #000;"></span>
          </button>
          <button class="mp-btn" id="dice-editor-apply" style="flex: 1; padding: 12px; background: #4CAF50; border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("diceEditor.apply")}</button>
        </div>
      </div>
    `;const n=document.createElement("style");n.textContent=`
      .dice-editor-category {
        margin-bottom: 8px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        overflow: hidden;
      }
      #dice-editor-content .dice-editor-category:last-child {
        margin-bottom: 0 !important;
      }
      .dice-editor-category-header {
        width: 100%;
        padding: 12px;
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.2s;
      }
      .dice-editor-category-header:hover {
        background: rgba(255,255,255,0.15);
      }
      .dice-editor-category-header.active {
        background: rgba(76, 175, 80, 0.3);
      }
      .dice-editor-category-icon {
        transition: transform 0.2s;
        font-size: 12px;
      }
      .dice-editor-category-header.active .dice-editor-category-icon {
        transform: rotate(90deg);
      }
      .dice-editor-category-content {
        padding: 12px;
      }
      .dice-editor-control {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dice-editor-control:last-child {
        margin-bottom: 0;
      }
      .dice-editor-control label {
        flex: 1;
        color: #ccc;
        font-size: 13px;
        min-width: 0;
      }
      .dice-editor-control input[type="color"] {
        width: 50px;
        height: 18px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: transparent;
      }
      .dice-editor-control input[type="range"] {
        flex: 1;
        min-width: 80px;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        border: none;
        cursor: pointer;
        outline: none;
      }
      .dice-editor-control input[type="range"]::-webkit-slider-track {
        background: transparent;
        height: 8px;
        border-radius: 4px;
      }
      .dice-editor-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #FFD700;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .dice-editor-control input[type="range"]::-moz-range-track {
        background: transparent;
        height: 8px;
        border-radius: 4px;
      }
      .dice-editor-control input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #FFD700;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .dice-editor-value {
        color: white;
        font-size: 13px;
        min-width: 40px;
        text-align: right;
      }
    `,this.overlay.appendChild(n),document.body.appendChild(this.overlay);const i=this.overlay.querySelector("#use-key-icon");if(i){i.innerHTML=ai("key",20);const s=i.querySelector("svg");s&&(s.style.fill="currentColor",s.style.color="#000")}this.setupEventListeners()}setupEventListeners(){if(!this.overlay)return;this.overlay.querySelectorAll(".dice-editor-category-header").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-category"),i=this.overlay?.querySelector(`[data-category-content="${n}"]`);i.style.display!=="none"?(i.style.display="none",t.classList.remove("active")):(i.style.display="block",t.classList.add("active"))})}),["dice-baseColor","dice-dotColor","dice-borderColor","dice-bevelRadius","dice-dotSize","dice-dotDepth","dice-roughness","dice-metalness","dice-clearcoat","dice-clearcoatRoughness","dice-opacity"].forEach(t=>{const n=this.overlay?.querySelector(`#${t}`);n&&n.addEventListener("input",()=>{this.updateValueDisplay(t,n.value),this.schedulePreviewUpdate()})}),this.overlay.querySelector("#dice-editor-reset")?.addEventListener("click",()=>{this.resetToDefault()}),this.overlay.querySelector("#dice-editor-apply")?.addEventListener("click",()=>{this.applyChanges(),this.close()}),this.overlay.querySelector("#dice-editor-use-key")?.addEventListener("click",()=>{this.showUseKeyConfirmation()})}updateValueDisplay(e,t){const i=this.overlay?.querySelector(`#${e}`)?.closest(".dice-editor-control")?.querySelector(".dice-editor-value");if(i)switch(e){case"dice-bevelRadius":i.textContent=parseFloat(t).toFixed(2);break;case"dice-dotSize":i.textContent=t;break;case"dice-dotDepth":i.textContent=parseFloat(t).toFixed(1);break;case"dice-roughness":case"dice-metalness":case"dice-clearcoat":case"dice-clearcoatRoughness":case"dice-opacity":i.textContent=`${(parseFloat(t)*100).toFixed(0)}%`;break}}schedulePreviewUpdate(){this.previewUpdateTimer&&clearTimeout(this.previewUpdateTimer),this.previewUpdateTimer=window.setTimeout(()=>{this.updatePreview()},100)}updatePreview(){const e=this.getCurrentConfig(),t=this.game.graphicsSettings?.diceBevelSegments||3;this.game.getDice().forEach(n=>{n.updateConfig(e,t)})}getCurrentConfig(){if(!this.overlay)return this.currentConfig;const e=t=>this.overlay?.querySelector(`#${t}`)?.value||"";return{baseColor:e("dice-baseColor"),dotColor:e("dice-dotColor"),borderColor:e("dice-borderColor"),bevelRadius:parseFloat(e("dice-bevelRadius")),dotSize:parseInt(e("dice-dotSize")),dotShape:"circle",dotDepth:parseFloat(e("dice-dotDepth")),roughness:parseFloat(e("dice-roughness")),metalness:parseFloat(e("dice-metalness")),clearcoat:parseFloat(e("dice-clearcoat")),clearcoatRoughness:parseFloat(e("dice-clearcoatRoughness")),opacity:parseFloat(e("dice-opacity"))}}resetToDefault(){const e=this.game.getDice()[0]?.getConfig();e&&(localStorage.removeItem("customDiceConfig"),this.currentConfig=e,this.updateFormValues(e),this.updatePreview())}updateFormValues(e){if(!this.overlay)return;const t=(n,i)=>{const s=this.overlay?.querySelector(`#${n}`);s&&(s.value=i.toString(),this.updateValueDisplay(n,i.toString()))};t("dice-baseColor",e.baseColor),t("dice-dotColor",e.dotColor),t("dice-borderColor",e.borderColor),t("dice-bevelRadius",e.bevelRadius),t("dice-dotSize",e.dotSize),t("dice-dotDepth",e.dotDepth),t("dice-roughness",e.roughness),t("dice-metalness",e.metalness),t("dice-clearcoat",e.clearcoat),t("dice-clearcoatRoughness",e.clearcoatRoughness),t("dice-opacity",e.opacity),this.updatePreview()}applyChanges(){const e=this.getCurrentConfig();this.currentConfig=e,console.log("[DiceEditor] Saving config to localStorage:",e),localStorage.setItem("customDiceConfig",JSON.stringify(e));const t=this.game.graphicsSettings?.diceBevelSegments||3;this.game.getDice().forEach(n=>{n.updateConfig(e,t)})}showUseKeyConfirmation(){const e=window.wsClient;if(!e){console.error("[DiceEditor] wsClient not available");return}const t=e.inventory.filter(i=>i.type==="key"&&i.code==="design_key");if(t.length===0){const i=document.createElement("div");i.className="mp-confirm-overlay",i.style.zIndex="1200",i.innerHTML=`
        <div class="mp-confirm-dialog" style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
          <div style="color: white; font-size: 18px; margin-bottom: 8px;">No Design Key</div>
          <div style="color: #888; font-size: 14px; margin-bottom: 16px;">
            You need a Design Key to save custom dice.<br>
            Purchase one from the shop for 5000 pips.
          </div>
          <button class="mp-btn secondary" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Close</button>
        </div>
      `,document.body.appendChild(i),i.querySelector("button").addEventListener("click",()=>i.remove()),i.addEventListener("click",s=>{s.target===i&&i.remove()});return}const n=document.createElement("div");n.className="mp-confirm-overlay",n.style.zIndex="1200",n.innerHTML=`
      <div class="mp-confirm-dialog" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Use Design Key?</div>
        <div style="color: #888; font-size: 14px; margin-bottom: 16px;">
          This will save your custom dice permanently.<br>
          You have ${t.length} key(s) remaining.
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="mp-btn secondary" id="cancel-use-key" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Cancel</button>
          <button class="mp-btn" id="confirm-use-key" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255,215,0,0.4);">Use Key</button>
        </div>
      </div>
    `,document.body.appendChild(n),document.getElementById("cancel-use-key").addEventListener("click",()=>n.remove()),document.getElementById("confirm-use-key").addEventListener("click",()=>{this.saveCustomDice(),n.remove()}),n.addEventListener("click",i=>{i.target===n&&n.remove()})}saveCustomDice(){const e=window.wsClient;if(!e){console.error("[DiceEditor] wsClient not available");return}const t=this.getCurrentConfig();e.send({type:"save_custom_dice",config:t});const n=document.createElement("div");n.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30,30,30,0.95);
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-size: 14px;
      z-index: 1300;
      text-align: center;
    `,n.textContent="Saving custom dice...",document.body.appendChild(n),setTimeout(()=>n.remove(),2e3),this.close()}close(){this.overlay&&(this.overlay.remove(),this.overlay=null),this.previewUpdateTimer&&(clearTimeout(this.previewUpdateTimer),this.previewUpdateTimer=null),this.game.updateUIVisibility(),window.__diceEditorModal=null}};N(Bt,"instance",null);let yr=Bt,Rt=null;function ay(a){Rt=a}class ly{constructor(){N(this,"container");N(this,"statusEl");N(this,"menuBtn");N(this,"menuPanel",null);N(this,"lobbyPanel",null);N(this,"isMenuOpen",!1);N(this,"friends",[]);N(this,"currentLobby",null);N(this,"invitations",[]);N(this,"friendRequests",[]);N(this,"isInGame",!1);N(this,"sentInvites",new Set);N(this,"isLobbyMinimized",!1);N(this,"shopItems",[]);N(this,"unsubscribeLanguageChange",null);N(this,"handleClickOutsideMenu",e=>{if(!this.menuPanel)return;const t=e.target;document.body.contains(t)&&!this.menuPanel.contains(t)&&!this.menuBtn.contains(t)&&this.closeMenu()});this.container=document.createElement("div"),this.container.id="multiplayer-ui",this.container.innerHTML=`
      <style>
        #multiplayer-ui {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: none;
          z-index: 100;
        }
        #mp-status {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0,0,0,0.6);
          border-radius: 12px;
          font-size: 12px;
          color: #888;
          cursor: pointer;
          pointer-events: auto;
        }
        #mp-status.connected { color: #4CAF50; }
        #mp-status.lobby { color: #FF9800; }
        #mp-status.in-game { color: #2196F3; }
        #mp-status.error { color: #f44336; }
        .mp-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          pointer-events: auto;
        }
        .mp-confirm-dialog {
          background: rgba(30,30,30,0.95);
          border-radius: 12px;
          padding: 20px;
          max-width: 280px;
          text-align: center;
        }
        .mp-confirm-title {
          color: white;
          font-size: 16px;
          margin-bottom: 16px;
        }
        .mp-confirm-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        #mp-user-info {
          float: right;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #mp-menu-btn {
          width: 36px;
          height: 36px;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          cursor: pointer;
          pointer-events: auto;
        }
        #mp-menu-btn:hover { background: rgba(0,0,0,0.8); }
        #mp-invites-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f44336;
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mp-panel {
          position: fixed;
          top: 60px;
          left: 10px;
          right: 10px;
          max-height: 68vh;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          background: rgba(0,0,0,0.6);
          border-radius: 12px 12px 16px 16px;
          padding: 16px;
          pointer-events: auto;
          box-sizing: border-box;
        }
        .mp-panel::-webkit-scrollbar {
          display: none;
        }
        .mp-title { color: white; font-size: 16px; margin-bottom: 12px; font-weight: 600; }
        .mp-section { margin-bottom: 16px; }
        .mp-section:last-child { margin-bottom: 0; }
        .mp-section-title { color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
        .mp-item {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 8px;
          color: white;
        }
        .mp-item:last-child {
          margin-bottom: 0;
        }
          font-size: 14px;
        }
        .mp-item label { display: block; margin-bottom: 4px; color: #888; font-size: 12px; }
        .mp-input {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 14px;
          box-sizing: border-box;
        }
        .mp-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #4CAF50;
          color: white;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
        }
        .mp-btn:hover { background: #45a049; }
        .mp-btn.secondary { background: rgba(255,255,255,0.2); }
        .mp-btn.danger { background: #f44336; }
        .mp-btn.small { padding: 6px 12px; width: auto; margin: 0; font-size: 12px; }
        .mp-friend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .mp-friend:last-child { margin-bottom: 0; }
        .mp-friend-info { display: flex; align-items: center; gap: 8px; }
        .mp-friend-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #888;
        }
        .mp-friend-status.online { background: #4CAF50; }
        .mp-friend-status.in_lobby { background: #FF9800; }
        .mp-friend-status.in_game { background: #2196F3; }
        .mp-friend-name { color: white; font-size: 14px; }
        .mp-friend-actions { display: flex; gap: 4px; align-items: center; min-height: 32px; }
        .mp-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
        .mp-tab {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }
        .mp-tab.active { background: #4CAF50; color: white; }
        .mp-invite {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .mp-invite-text { color: white; font-size: 14px; margin-bottom: 8px; }
        .mp-invite-actions { display: flex; gap: 8px; }
        .mp-lobby-player {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 6px;
          color: white;
        }
        .mp-lobby-player.host::after {
          content: '👑';
          margin-left: auto;
        }
        .mp-vote-btn {
          padding: 8px 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: transparent;
          color: white;
          cursor: pointer;
          margin-right: 8px;
        }
        .mp-vote-btn.voted { border-color: #4CAF50; background: rgba(76,175,80,0.3); }
        .mp-vote-count { font-size: 12px; color: #888; }
      </style>
      <div id="mp-status">${U("status.connecting")}</div>
      <div id="mp-user-info">
        <button id="mp-dice-editor-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; margin-right: 4px; display: flex; align-items: center; justify-content: center;" title="Редактор кубика">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <circle cx="15.5" cy="8.5" r="1.5"></circle>
            <circle cx="8.5" cy="15.5" r="1.5"></circle>
            <circle cx="15.5" cy="15.5" r="1.5"></circle>
          </svg>
        </button>
        <button id="mp-notif-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; margin-right: 4px; display: flex; align-items: center; justify-content: center;">${vr.bell}</button>
        <button id="mp-menu-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center;">${vr.menu}</button>
      </div>
    `,document.body.appendChild(this.container),this.statusEl=document.getElementById("mp-status"),this.menuBtn=document.getElementById("mp-menu-btn"),this.menuBtn.addEventListener("click",()=>this.toggleMenu()),this.statusEl.addEventListener("click",()=>this.onStatusClick()),document.getElementById("mp-dice-editor-btn").addEventListener("click",()=>{this.currentLobby||this.isInGame||Rt&&yr.toggle(Rt)}),document.getElementById("mp-notif-btn").addEventListener("click",()=>this.showNotificationsPanel()),this.unsubscribeLanguageChange=Z0(()=>{if(this.updateStatus(),this.menuPanel&&this.isMenuOpen){const n=this.menuPanel.querySelector(".mp-tab.active");n&&this.renderTab(n.getAttribute("data-tab"))}this.lobbyPanel&&this.renderLobby()}),window.addEventListener("showGameRules",n=>{this.showGameRulesModal(n.detail.mode)}),this.setupEventListeners(),this.connect()}onStatusClick(){(this.currentLobby||this.isInGame)&&this.showLeaveConfirmation()}showLeaveConfirmation(){const e=document.createElement("div");e.className="mp-confirm-overlay",e.style.zIndex="1100",e.innerHTML=`
      <div class="mp-confirm-dialog">
        <div class="mp-confirm-title">${U(this.isInGame?"dialogs.leaveGame":"dialogs.leaveLobby")}</div>
        <div class="mp-confirm-buttons">
          <button class="mp-btn secondary" id="mp-confirm-cancel">${U("buttons.cancel")}</button>
          <button class="mp-btn danger" id="mp-confirm-leave">${U("buttons.leave")}</button>
        </div>
      </div>
    `,document.body.appendChild(e),document.getElementById("mp-confirm-cancel").addEventListener("click",()=>{e.remove()}),document.getElementById("mp-confirm-leave").addEventListener("click",()=>{e.remove(),D.leaveLobby()}),e.addEventListener("click",t=>{t.target===e&&e.remove()})}updateStatus(){const e=document.getElementById("mp-notif-btn"),t=document.getElementById("mp-dice-editor-btn");this.isInGame?this.isMenuOpen?(this.statusEl.textContent=U("status.inGame"),this.statusEl.className="in-game",this.statusEl.style.padding="6px 12px",e&&(e.style.display="block"),t&&(t.style.display="none")):(this.statusEl.textContent="●",this.statusEl.className="in-game",this.statusEl.style.padding="6px 10px",e&&(e.style.display="none"),t&&(t.style.display="none")):this.currentLobby?(this.statusEl.textContent=U("status.lobby"),this.statusEl.className="lobby",this.statusEl.style.padding="6px 12px",e&&(e.style.display="block"),t&&(t.style.display="none")):D.isConnected?D.connectionHealth==="unstable"||D.connectionHealth==="poor"?(this.statusEl.textContent="Unstable",this.statusEl.className="error",this.statusEl.style.padding="6px 12px",e&&(e.style.display="block"),t&&(t.style.display="flex")):(this.statusEl.textContent=U("status.online"),this.statusEl.className="connected",this.statusEl.style.padding="6px 12px",e&&(e.style.display="block"),t&&(t.style.display="flex")):(D.reconnectAttempts>0&&navigator.onLine?(this.statusEl.textContent="Reconnecting...",this.statusEl.className="error"):(this.statusEl.textContent=U("status.offline"),this.statusEl.className="error"),this.statusEl.style.padding="6px 12px",e&&(e.style.display="block"),t&&(t.style.display="flex"))}setupEventListeners(){D.on("auth_success",e=>{if(this.updateStatus(),setTimeout(()=>{D.getFriends(),D.getInvitations(),D.getFriendRequests()},100),this.menuPanel&&this.isMenuOpen){const t=this.menuPanel.querySelector(".mp-tab.active");t&&this.renderTab(t.getAttribute("data-tab"))}e.canReconnect&&this.showReconnectDialog(e.canReconnect.lobbyId,e.canReconnect.timeLeft)}),D.on("connection_health_changed",e=>{console.log("[MultiplayerUI] Connection health changed:",e.health),this.updateStatus()}),D.on("auth_error",e=>{this.statusEl.textContent=U("status.authFailed"),this.statusEl.className="error",console.error("Auth error:",e.message)}),D.on("nickname_changed",e=>{D.user&&(D.user.nickname=e.nickname)}),D.on("item_equipped",e=>{D.user&&(e.slot==="dice"&&(D.user.equippedDiceId=e.itemId),e.slot==="table"&&(D.user.equippedTableId=e.itemId),e.slot==="effect"&&(D.user.equippedEffectId=e.itemId))}),D.on("item_received",e=>{e.inventory&&(D.inventory=e.inventory);const t=e.item;if(t.length===1?this.showNotification(U("notifications.itemReceived",{item:t[0].name})):this.showNotification(U("notifications.itemsReceived",{count:t.length})),this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="inventory"){const i=document.getElementById("mp-tab-content");i&&this.renderInventoryTab(i)}}),D.on("shop_items",e=>{if(this.shopItems=e.items,this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="shop"){const n=document.getElementById("mp-tab-content");n&&this.renderShopTab(n)}}),D.on("purchase_invoice",e=>{window.Telegram?.WebApp?.openInvoice?window.Telegram.WebApp.openInvoice(e.invoiceUrl,t=>{console.log("[Purchase] Invoice status:",t),t==="paid"?this.showNotification(U("notifications.paymentProcessing")):t==="cancelled"?this.showNotification(U("notifications.purchaseCancelled")):t==="failed"&&this.showNotification(U("notifications.paymentFailed"),!0)}):this.showNotification(U("notifications.paymentNotAvailable"),!0)}),D.on("purchase_success",e=>{e.inventory&&(D.inventory=e.inventory);const n=this.shopItems.find(i=>i.id===e.itemId)?.name||"Item";if(this.showNotification(U("notifications.purchaseSuccess",{item:n})),this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="shop"){const s=document.getElementById("mp-tab-content");s&&this.renderShopTab(s)}}),D.on("purchase_success_pips",e=>{if(console.log("[SHOP] Purchased with pips:",e),e.inventory&&(D.inventory=e.inventory),this.showNotification(`Purchased ${e.itemName} for ${e.pipsSpent} pips!`),this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="shop"){const n=document.getElementById("mp-tab-content");n&&this.renderShopTab(n)}}),D.on("purchase_error",e=>{this.showNotification(e.message||U("notifications.purchaseFailed"),!0)}),D.on("custom_dice_saved",e=>{if(console.log("[KEYS] Custom dice saved:",e),e.inventory&&(D.inventory=e.inventory),this.showNotification(`✨ Custom dice "${e.diceName}" saved!`),this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="inventory"){const n=document.getElementById("mp-tab-content");n&&this.renderInventoryTab(n)}}),D.on("friends_list",e=>{this.friends=e.friends,this.renderFriends()}),D.on("user_found",e=>{this.showSearchResult(e.user)}),D.on("user_not_found",()=>{this.showSearchResult(null)}),D.on("friend_online",e=>{const t=this.friends.find(n=>n.friendId===e.friendId);t&&(t.onlineStatus="online",this.renderFriends(),document.getElementById("mp-invite-modal")&&this.refreshInviteFriendsModal())}),D.on("friend_offline",e=>{const t=this.friends.find(n=>n.friendId===e.friendId);t&&(t.onlineStatus="offline",this.renderFriends(),document.getElementById("mp-invite-modal")&&this.refreshInviteFriendsModal())}),D.on("friend_status_changed",e=>{const t=this.friends.find(n=>n.friendId===e.friendId);t&&(t.onlineStatus=e.status,this.renderFriends(),document.getElementById("mp-invite-modal")&&this.refreshInviteFriendsModal())}),D.on("friend_added_you",()=>{D.getFriends()}),D.on("friend_requests_list",e=>{this.friendRequests=e.requests,this.updateInvitesBadge()}),D.on("friend_request_received",e=>{this.friendRequests.push(e.request),this.updateInvitesBadge(),this.showNotification(U("notifications.friendRequest",{nickname:e.request.fromNickname}));const t=document.getElementById("mp-notifications-panel");if(t){const n=t.querySelector('[data-notif-tab="friends"]');n&&n.style.background==="rgb(76, 175, 80)"&&this.renderNotifTab("friends"),n&&(n.textContent=`${U("notifPanel.friends")}${this.friendRequests.length?` (${this.friendRequests.length})`:""}`)}this.menuPanel&&this.menuPanel.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="friends"&&this.renderTab("friends")}),D.on("friend_request_sent",()=>{this.showNotification(U("notifications.friendRequestSent"))}),D.on("friend_request_accepted",e=>{this.friendRequests=this.friendRequests.filter(n=>n.id!==e.requestId),this.updateInvitesBadge(),D.getFriends();const t=document.getElementById("mp-notifications-panel");if(t){const n=t.querySelector('[data-notif-tab="friends"]');n&&(n.textContent=`${U("notifPanel.friends")}${this.friendRequests.length?` (${this.friendRequests.length})`:""}`),n&&n.style.background==="rgb(76, 175, 80)"&&this.renderNotifTab("friends")}}),D.on("friend_request_was_accepted",e=>{this.showNotification(U("notifications.friendRequestAccepted",{nickname:e.byNickname})),D.getFriends()}),D.on("friend_request_declined",e=>{this.friendRequests=this.friendRequests.filter(n=>n.id!==e.requestId),this.updateInvitesBadge();const t=document.getElementById("mp-notifications-panel");if(t){const n=t.querySelector('[data-notif-tab="friends"]');n&&(n.textContent=`${U("notifPanel.friends")}${this.friendRequests.length?` (${this.friendRequests.length})`:""}`),n&&n.style.background==="rgb(76, 175, 80)"&&this.renderNotifTab("friends")}}),D.on("friend_removed_you",()=>{D.getFriends()}),D.on("invitations_list",e=>{this.invitations=e.invitations,this.updateInvitesBadge()}),D.on("invitation_received",e=>{this.invitations.push(e.invitation),this.updateInvitesBadge(),this.showNotification(U("notifications.invitationReceived",{nickname:e.invitation.fromUser.nickname})),this.menuPanel?.querySelector(".mp-tab.active")?.getAttribute("data-tab")==="invites"&&this.renderInvitations();const n=document.getElementById("mp-notifications-panel");if(n){const i=n.querySelector('[data-notif-tab="invites"]');i&&i.style.background==="rgb(76, 175, 80)"&&this.renderNotifTab("invites"),i&&(i.textContent=`${U("notifPanel.invites")}${this.invitations.length?` (${this.invitations.length})`:""}`)}this.updateInvitesTabLabel()}),D.on("invitation_cancelled",e=>{this.invitations=this.invitations.filter(n=>n.lobbyId!==e.lobbyId),this.updateInvitesBadge();const t=document.getElementById("mp-notifications-panel");if(t){const n=t.querySelector('[data-notif-tab="invites"]');n&&n.style.background==="rgb(76, 175, 80)"&&this.renderNotifTab("invites"),n&&(n.textContent=`${U("notifPanel.invites")}${this.invitations.length?` (${this.invitations.length})`:""}`)}}),D.on("invitation_response",e=>{e.accepted||(this.sentInvites.delete(e.toUserId),document.getElementById("mp-invite-modal")&&this.refreshInviteFriendsModal())}),D.on("lobby_created",e=>{this.currentLobby=e.lobby,this.closeMenu(),this.showLobbyPanel(),this.updateStatus()}),D.on("lobby_joined",e=>{this.currentLobby=e.lobby,this.closeMenu(),this.showLobbyPanel(),this.updateStatus()}),D.on("lobby_left",e=>{this.currentLobby=null,this.isInGame=!1,this.sentInvites.clear(),this.closeLobbyPanel(),this.updateStatus(),e?.newPips!==void 0&&(D.user.pips=e.newPips);const t=document.querySelector("[data-mexico-result]");t&&t.remove()}),D.on("player_joined",e=>{this.currentLobby&&(this.currentLobby.players.push(e.player),this.renderLobby())}),D.on("player_left",e=>{this.currentLobby&&(this.currentLobby.players=this.currentLobby.players.filter(t=>t.oderId!==e.oderId),this.sentInvites.delete(e.oderId),this.isInGame?(this.showNotification(U("notifications.playerLeft")),D.leaveLobby(),D.emit("game_ended_by_disconnect",{})):(this.renderLobby(),document.getElementById("mp-invite-modal")&&this.refreshInviteFriendsModal()))}),D.on("vote_update",e=>{this.renderVotes(e.votes)}),D.on("table_selected",e=>{this.currentLobby&&(this.currentLobby.selectedTableId=e.tableId,this.currentLobby.status="waiting",this.renderLobby())}),D.on("game_started",e=>{this.currentLobby=e.lobby,this.isInGame=!0,this.closeLobbyPanel(),this.updateStatus(),this.showNotification(U("notifications.gameStarted"));const t=this.getPlayerNickname(e.currentTurn);setTimeout(()=>{this.showNotification(U("notifications.firstShooter",{nickname:t}))},1e3)}),D.on("game_reconnected",e=>{this.currentLobby=e.lobby,this.isInGame=!0,this.closeLobbyPanel(),this.updateStatus(),this.showNotification(U("notifications.reconnected"))}),D.on("player_disconnected",e=>{const t=this.getPlayerNickname(e.oderId);this.showNotification(U("notifications.playerDisconnected",{nickname:t}))}),D.on("player_reconnected",e=>{this.showNotification(U("notifications.playerReconnected",{nickname:e.nickname}))}),D.on("reconnect_failed",e=>{this.showNotification(e.message||U("notifications.reconnectFailed"),!0),D.clearPendingReconnect()}),D.on("show_betting_ui",e=>{console.log("[BETTING] Showing betting UI",e),Bi(async()=>{const{BettingModal:t}=await import("./BettingModal-CZssq6V6-1779046189997.js");return{BettingModal:t}},[]).then(({BettingModal:t})=>{t.show(e.minBet,e.balance)})}),D.on("bet_placed",e=>{console.log("[BETTING] Bet placed",e),D.user&&e.userId===D.user.id&&(D.user.pips=e.newBalance)}),D.on("pot_updated",e=>{console.log("[BETTING] Pot updated",e),Bi(async()=>{const{BettingModal:t}=await import("./BettingModal-CZssq6V6-1779046189997.js");return{BettingModal:t}},[]).then(({BettingModal:t})=>{t.updatePot(e.pot,e.bets)})}),D.on("bet_confirmed",e=>{console.log("[BETTING] Bet confirmed",e),D.user&&e.userId===D.user.id&&(D.user.pips=e.newBalance)}),D.on("betting_complete",e=>{console.log("[BETTING] Betting complete",e),Bi(async()=>{const{BettingModal:t}=await import("./BettingModal-CZssq6V6-1779046189997.js");return{BettingModal:t}},[]).then(({BettingModal:t})=>{t.onBettingComplete()}),this.showNotification(`Игра начнется через ${e.startingIn} сек. Банк: ${e.pot} pips`)}),D.on("bet_error",e=>{console.error("[BETTING] Bet error:",e.message),this.showNotification(e.message,!0)}),D.on("error",e=>{console.error("Server error:",e.message),this.showNotification(e.message,!0)})}async connect(){try{await D.connect()}catch{this.statusEl.textContent=U("status.offline"),this.statusEl.className="error"}}toggleMenu(){this.isMenuOpen?this.closeMenu():this.openMenu()}openMenu(){if(window.__diceEditorModal){const n=window.__diceEditorModal;n&&typeof n.close=="function"&&n.close()}if(this.menuPanel)return;const e=document.querySelector("[data-mexico-result]");e&&e.remove(),this.isMenuOpen=!0,this.updateStatus();const t=document.createElement("div");t.id="mp-menu-backdrop",t.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99;
      pointer-events: auto;
    `,document.body.appendChild(t),this.menuPanel=document.createElement("div"),this.menuPanel.className="mp-panel",this.menuPanel.id="mp-menu-panel",this.menuPanel.innerHTML=`
      <div class="mp-tabs">
        <button class="mp-tab active" data-tab="main">${U("menu.main")}</button>
        <button class="mp-tab" data-tab="friends">${U("menu.friends")}</button>
        <button class="mp-tab" data-tab="inventory">${U("menu.inventory")}</button>
        <button class="mp-tab" data-tab="shop">${U("menu.shop")}</button>
      </div>
      <div id="mp-tab-content"></div>
    `,this.container.appendChild(this.menuPanel),this.menuPanel.querySelectorAll(".mp-tab").forEach(n=>{n.addEventListener("click",()=>{this.menuPanel.querySelectorAll(".mp-tab").forEach(i=>i.classList.remove("active")),n.classList.add("active"),this.renderTab(n.getAttribute("data-tab"))})}),setTimeout(()=>{document.addEventListener("click",this.handleClickOutsideMenu)},10),this.renderTab("main")}renderTab(e){const t=document.getElementById("mp-tab-content");if(t)switch(e){case"main":const n=Rt?.getControlMode()||"motion",i=Rt?.getRequireReadyConfirmation()||!1,s=Rt?.getGraphicsQuality()||"high",o=this.currentLobby||this.isInGame,r=K0();t.innerHTML=`
          ${o?`<div class="mp-section">
                <button class="mp-btn danger" id="mp-disconnect">${U("buttons.leave")}</button>
              </div>`:`<div class="mp-section">
                <button class="mp-btn" id="mp-create-lobby" style="background: #FF9800;">${U("lobby.createLobby")}</button>
              </div>`}
          <div class="mp-section">
            <div class="mp-section-title">${U("profile.title")}</div>
            <div class="mp-item">
              <input type="text" class="mp-input" id="mp-nickname-input" value="${D.user?.nickname||""}" maxlength="32" pattern="[a-zA-Z0-9_]+" autocomplete="off">
              <button class="mp-btn" id="mp-save-nickname">${U("buttons.save")}</button>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${U("settings.language")}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${U("settings.language")}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${r==="en"?"":"secondary"}" id="mp-lang-en" style="padding: 6px 12px;">English</button>
                <button class="mp-btn small ${r==="ru"?"":"secondary"}" id="mp-lang-ru" style="padding: 6px 12px;">Русский</button>
              </div>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${U("settings.controls")}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${U("settings.controls")}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${n==="motion"?"":"secondary"}" id="mp-mode-motion" style="padding: 6px 12px;">${U("settings.controlsMotion")}</button>
                <button class="mp-btn small ${n==="manual"?"":"secondary"}" id="mp-mode-manual" style="padding: 6px 12px;">${U("settings.controlsManual")}</button>
              </div>
            </div>
            <div class="mp-item" id="mp-ready-toggle-container" style="display: ${n==="motion"?"flex":"none"}; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${U("settings.confirmBeforeThrow")}</span>
              <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
                <input type="checkbox" id="mp-ready-toggle" ${i?"checked":""} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${i?"#4CAF50":"rgba(255,255,255,0.2)"}; border-radius: 24px; transition: 0.2s;"></span>
                <span style="position: absolute; top: 2px; left: ${i?"22px":"2px"}; width: 20px; height: 20px; background: white; border-radius: 50%; transition: 0.2s;"></span>
              </label>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${U("settings.graphics")}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${U("settings.graphics")}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${s==="low"?"":"secondary"}" id="mp-gfx-low" style="padding: 6px 10px;">${U("settings.graphicsLow")}</button>
                <button class="mp-btn small ${s==="medium"?"":"secondary"}" id="mp-gfx-medium" style="padding: 6px 10px;">${U("settings.graphicsMedium")}</button>
                <button class="mp-btn small ${s==="high"?"":"secondary"}" id="mp-gfx-high" style="padding: 6px 10px;">${U("settings.graphicsHigh")}</button>
              </div>
            </div>
          </div>
        `,document.getElementById("mp-save-nickname").addEventListener("click",()=>{const d=document.getElementById("mp-nickname-input");D.setNickname(d.value)}),document.getElementById("mp-lang-en").addEventListener("click",()=>{zl("en")}),document.getElementById("mp-lang-ru").addEventListener("click",()=>{zl("ru")});const l=document.getElementById("mp-create-lobby");l&&l.addEventListener("click",()=>{this.closeMenu(),this.showGameModeModal()});const c=document.getElementById("mp-disconnect");c&&c.addEventListener("click",()=>{D.leaveLobby(),this.closeMenu()}),document.getElementById("mp-mode-motion").addEventListener("click",()=>{Rt?.setControlMode("motion"),this.renderTab("main")}),document.getElementById("mp-mode-manual").addEventListener("click",()=>{Rt?.setControlMode("manual"),this.renderTab("main")}),document.getElementById("mp-ready-toggle").addEventListener("change",d=>{const h=d.target.checked;Rt?.setRequireReadyConfirmation(h),this.renderTab("main")}),document.getElementById("mp-gfx-low").addEventListener("click",()=>{Rt?.setGraphicsQuality("low"),this.renderTab("main")}),document.getElementById("mp-gfx-medium").addEventListener("click",()=>{Rt?.setGraphicsQuality("medium"),this.renderTab("main")}),document.getElementById("mp-gfx-high").addEventListener("click",()=>{Rt?.setGraphicsQuality("high"),this.renderTab("main")});break;case"friends":t.innerHTML=`
          <div class="mp-section">
            <button class="mp-btn" id="mp-invite-friend-btn" style="background: #0088cc;">
              ${U("referrals.inviteFriend")}
            </button>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${U("friends.addFriend")}</div>
            <div class="mp-item">
              <input type="text" class="mp-input" id="mp-search-input" placeholder="${U("friends.searchPlaceholder")}">
              <button class="mp-btn" id="mp-search-btn">${U("friends.search")}</button>
            </div>
            <div id="mp-search-result"></div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${U("friends.title")} (${this.friends.length})</div>
            <div id="mp-friends-list"></div>
          </div>
        `,document.getElementById("mp-invite-friend-btn").addEventListener("click",()=>{this.showInviteFriendModal()}),document.getElementById("mp-search-btn").addEventListener("click",()=>{const d=document.getElementById("mp-search-input");d.value.trim()&&D.searchUser(d.value.trim())}),this.renderFriends();break;case"inventory":this.renderInventoryTab(t);break;case"shop":this.renderShopTab(t);break}}renderInventoryTab(e){const t=D.inventory.filter(l=>l.type==="dice"),n=D.inventory.filter(l=>l.type==="table"),i=D.inventory.filter(l=>l.type==="effect");e.innerHTML=`
      <div class="mp-section">
        <div class="mp-section-title">${U("inventory.dice")}</div>
        <div id="mp-inv-dice" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${U("inventory.tables")}</div>
        <div id="mp-inv-tables" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${U("inventory.effects")}</div>
        <div id="mp-inv-effects" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
    `;const s=document.getElementById("mp-inv-dice");t.length===0?s.innerHTML=`<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${U("inventory.noDice")}</div>`:s.innerHTML=t.map(l=>{const c=l.config,d=c?.baseColor||"#ffffff",h=c?.dotColor||"#1a1a1a",u=l.name.split(" ")[0];return`
          <div class="mp-inv-item" data-equip-dice="${l.id}" style="
            padding: 8px;
            background: ${D.user?.equippedDiceId===l.id?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
            border: 2px solid ${D.user?.equippedDiceId===l.id?"#4CAF50":"transparent"};
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
          ">
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              background: ${d};
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
            ">
              <div style="
                width: 6px;
                height: 6px;
                background: ${h};
                border-radius: 50%;
              "></div>
            </div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${u}</div>
          </div>
        `}).join("");const o=document.getElementById("mp-inv-tables");n.length===0?o.innerHTML=`<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${U("inventory.noTables")}</div>`:o.innerHTML=n.map(l=>{const c=l.name.split(" ")[0],d=l.config,h=d?.floor?.color||d?.floorColor||"#2d5a3d",u=d?.wall?.color||d?.wallColor||"#1a3d2a";return`
        <div class="mp-inv-item" data-equip-table="${l.id}" style="
          padding: 8px;
          background: ${D.user?.equippedTableId===l.id?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border: 2px solid ${D.user?.equippedTableId===l.id?"#4CAF50":"transparent"};
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
        ">
          <div style="
            width: 32px;
            height: 32px;
            margin: 0 auto 4px;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
          ">
            <div style="height: 50%; background: ${u};"></div>
            <div style="height: 50%; background: ${h}; border-top: 1px solid rgba(255,255,255,0.2);"></div>
          </div>
          <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c}</div>
        </div>
      `}).join("");const r=document.getElementById("mp-inv-effects");i.length===0?r.innerHTML=`<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${U("inventory.noEffects")}</div>`:r.innerHTML=i.map(l=>{const c=l.name.split(" ")[0];return`
        <div class="mp-inv-item" data-equip-effect="${l.id}" style="
          padding: 8px;
          background: ${D.user?.equippedEffectId===l.id?"rgba(76,175,80,0.3)":"rgba(255,255,255,0.1)"};
          border: 2px solid ${D.user?.equippedEffectId===l.id?"#4CAF50":"transparent"};
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
        ">
          <div style="font-size: 20px; margin-bottom: 4px;">✨</div>
          <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c}</div>
        </div>
      `}).join(""),e.querySelectorAll("[data-equip-dice]").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.getAttribute("data-equip-dice"));D.user&&(D.user.equippedDiceId=c),this.renderInventoryTab(e),D.emit("item_equipped",{itemId:c,slot:"dice"}),D.equipItem(c,"dice")})}),e.querySelectorAll("[data-equip-table]").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.getAttribute("data-equip-table"));D.user&&(D.user.equippedTableId=c),this.renderInventoryTab(e),D.emit("item_equipped",{itemId:c,slot:"table"}),D.equipItem(c,"table")})}),e.querySelectorAll("[data-equip-effect]").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.getAttribute("data-equip-effect"));D.user&&(D.user.equippedEffectId=c),this.renderInventoryTab(e),D.emit("item_equipped",{itemId:c,slot:"effect"}),D.equipItem(c,"effect")})})}renderShopTab(e){if(this.shopItems.length===0){D.getShopItems(),e.innerHTML=`<div style="color: #888; font-size: 14px; text-align: center; padding: 20px;">${U("shop.loading")}</div>`;return}const t=this.shopItems.filter(r=>r.type==="key").sort((r,l)=>r.code==="design_key"?-1:l.code==="design_key"?1:0),n=this.shopItems.filter(r=>r.type==="table"),i=new Set(D.inventory.map(r=>r.id));e.innerHTML=`
      <div class="mp-section">
        <div class="mp-section-title">🔑 Design Keys</div>
        <div id="mp-shop-keys" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${U("shop.tables")}</div>
        <div id="mp-shop-tables" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
    `;const s=document.getElementById("mp-shop-keys");t.length===0?s.innerHTML='<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">No keys available</div>':s.innerHTML=t.map(r=>{const l=r.config,c=l?.pipsPrice||0,d=l?.priceDisplay||`${c}P`,h=l?.color||"#4A90E2",u=l?.locked||!1,m=r.name.replace(" Key",""),g=i.has(r.id),v=this.getRarityColor(r.rarity);return`
          <div class="mp-shop-item" data-preview-key="${r.id}" style="
            position: relative;
            padding: 8px;
            background: ${u?"rgba(50,50,50,0.5)":"rgba(255,255,255,0.1)"};
            border: 2px solid ${v};
            border-radius: 8px;
            cursor: ${u?"not-allowed":"pointer"};
            text-align: center;
            opacity: ${g?"0.5":u?"0.3":"1"};
            filter: ${u?"grayscale(1)":"none"};
          ">
            ${u?'<div style="position: absolute; top: 4px; right: 4px; font-size: 16px;">🔒</div>':""}
            ${g&&!u?'<div style="position: absolute; top: 4px; right: 4px; color: #4CAF50; font-size: 12px;">✓</div>':""}
            ${!g&&!u?`<div style="position: absolute; top: 4px; right: 4px; color: #FFD700; font-size: 10px;">${d}</div>`:""}
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              background: ${h};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">🔑</div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m}</div>
          </div>
        `}).join("");const o=document.getElementById("mp-shop-tables");n.length===0?o.innerHTML=`<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${U("shop.noTablesAvailable")}</div>`:o.innerHTML=n.map(r=>{const l=r.name.split(" ")[0],c=r.config,d=c?.floor?.color||c?.floorColor||"#2d5a3d",h=c?.wall?.color||c?.wallColor||"#1a3d2a",u=i.has(r.id),m=this.getRarityColor(r.rarity);return`
          <div class="mp-shop-item" data-preview-table="${r.id}" style="
            position: relative;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border: 2px solid ${m};
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            opacity: ${u?"0.5":"1"};
          ">
            ${u?'<div style="position: absolute; top: 4px; right: 4px; color: #4CAF50; font-size: 12px;">✓</div>':`<div style="position: absolute; top: 4px; right: 4px; color: #FFD700; font-size: 10px; display: flex; align-items: center; gap: 1px;">${r.priceStars}<span style="display: inline-flex;">${ai("star",9)}</span></div>`}
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
            ">
              <div style="height: 50%; background: ${h};"></div>
              <div style="height: 50%; background: ${d}; border-top: 1px solid rgba(255,255,255,0.2);"></div>
            </div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${l}</div>
          </div>
        `}).join(""),e.querySelectorAll("[data-preview-key]").forEach(r=>{r.addEventListener("click",()=>{const l=parseInt(r.getAttribute("data-preview-key")),c=this.shopItems.find(d=>d.id===l);c&&this.showItemModal(c,"key")})}),e.querySelectorAll("[data-preview-table]").forEach(r=>{r.addEventListener("click",()=>{const l=parseInt(r.getAttribute("data-preview-table")),c=this.shopItems.find(d=>d.id===l);c&&this.showItemModal(c,"table")})})}showItemModal(e,t){const n=D.inventory.some(g=>g.id===e.id),i=!this.currentLobby&&!this.isInGame,s=e.config;if(t==="key"&&s?.locked){const g=document.createElement("div");g.className="mp-confirm-overlay",g.style.zIndex="1200",g.innerHTML=`
        <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 280px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
          <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">${e.name}</div>
          <div style="color: #888; font-size: 14px; margin-bottom: 16px;">Coming soon!</div>
          <button class="mp-btn secondary" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Close</button>
        </div>
      `,document.body.appendChild(g),g.querySelector("button").addEventListener("click",()=>g.remove()),g.addEventListener("click",v=>{v.target===g&&g.remove()});return}let o="";if(t==="dice"){const g=s?.baseColor||"#ffffff",v=s?.dotColor||"#1a1a1a";o=`
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: ${g};
          border-radius: 8px;
          transform: perspective(200px) rotateX(-15deg) rotateY(25deg);
          box-shadow: 
            4px 4px 8px rgba(0,0,0,0.3),
            inset 0 0 0 2px rgba(255,255,255,0.1);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          padding: 12px;
          gap: 8px;
        ">
          ${[1,2,3,4,5].map(()=>`<div style="width: 12px; height: 12px; background: ${v}; border-radius: 50%;"></div>`).join("")}
        </div>
      `}else if(t==="table"){const g=s?.floor?.color||s?.floorColor||"#2d5a3d";o=`
        <div style="
          width: 100px;
          height: 80px;
          margin: 0 auto 16px;
          border-radius: 8px;
          overflow: hidden;
          transform: perspective(200px) rotateX(10deg);
          box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        ">
          <div style="height: 40%; background: ${s?.wall?.color||s?.wallColor||"#1a3d2a"};"></div>
          <div style="height: 60%; background: ${g}; border-top: 2px solid rgba(255,255,255,0.2);"></div>
        </div>
      `}else t==="key"?o=`
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: ${s?.color||"#4A90E2"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        ">🔑</div>
      `:o='<div style="font-size: 48px; margin-bottom: 16px;">✨</div>';const r=document.createElement("div");r.className="mp-confirm-overlay",r.id="mp-item-modal",r.style.zIndex="1200";const l=t==="key"&&s?.pipsPrice||0,c=D.user?.pips||0,d=c>=l;r.innerHTML=`
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">
        ${o}
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">${e.name}</div>
        <div style="color: #888; font-size: 12px; margin-bottom: 16px;">${e.description||""}</div>
        
        ${n?`
          <div style="color: #4CAF50; font-size: 14px; margin-bottom: 16px;">✓ ${U("shop.youOwnThis")}</div>
          <button class="mp-btn secondary" id="mp-item-close" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("shop.close")}</button>
        `:t==="key"?`
          ${d?"":`<div style="color: #f44336; font-size: 12px; margin-bottom: 8px;">Need ${l-c} more pips</div>`}
          <button class="mp-btn" id="mp-item-buy" style="width: 100%; padding: 12px; background: ${d?"linear-gradient(135deg, #FFD700, #FFA500)":"rgba(100,100,100,0.5)"}; border: none; border-radius: 8px; color: ${d?"#000":"#666"}; font-size: 14px; font-weight: 600; cursor: ${d?"pointer":"not-allowed"}; ${d?"box-shadow: 0 4px 12px rgba(255,215,0,0.4);":""}" ${d?"":"disabled"}>
            Buy for ${l} Pips
          </button>
        `:`
          <div style="display: flex; gap: 8px;">
            ${i?`<button class="mp-btn secondary" id="mp-item-preview" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("shop.preview")}</button>`:""}
            <button class="mp-btn" id="mp-item-buy" style="flex: 1; padding: 12px; background: #4CAF50; border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ${U("shop.buyFor")} ${e.priceStars}<span style="display: inline-flex;">${ai("star",14)}</span>
            </button>
          </div>
        `}
      </div>
    `,document.body.appendChild(r),r.addEventListener("click",g=>{g.stopPropagation(),g.target===r&&r.remove()});const h=document.getElementById("mp-item-close");h&&h.addEventListener("click",()=>r.remove());const u=document.getElementById("mp-item-preview");u&&Rt&&u.addEventListener("click",()=>{t==="dice"?Rt.previewDice(e.config):t==="table"&&Rt.previewTable(e.config),r.remove(),this.closeMenu(),this.showNotification(U("shop.previewing",{item:e.name}))});const m=document.getElementById("mp-item-buy");m&&m.addEventListener("click",()=>{r.remove(),D.purchaseItem(e.id)})}getRarityColor(e){switch(e){case"common":return"rgba(255,255,255,0.3)";case"uncommon":return"#4CAF50";case"rare":return"#2196F3";case"epic":return"#9C27B0";case"legendary":return"#FFD700";default:return"rgba(255,255,255,0.3)"}}renderFriends(){const e=document.getElementById("mp-friends-list");if(e){if(this.friends.length===0){e.innerHTML=`<div style="color: #888; font-size: 14px;">${U("friends.noFriends")}</div>`;return}e.innerHTML=this.friends.map(t=>`
      <div class="mp-friend">
        <div class="mp-friend-info">
          <div class="mp-friend-status ${t.onlineStatus}"></div>
          <span class="mp-friend-name">${t.user.nickname}</span>
        </div>
        <div class="mp-friend-actions">
          ${t.onlineStatus!=="offline"&&this.currentLobby?`<button class="mp-btn small" data-invite="${t.friendId}">${U("friends.invite")}</button>`:""}
          <button class="mp-remove-btn" data-remove="${t.friendId}" data-name="${t.user.nickname}" style="background: transparent; border: none; color: #f44336; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;">${ai("x",18)}</button>
        </div>
      </div>
    `).join(""),e.querySelectorAll("[data-invite]").forEach(t=>{t.addEventListener("click",()=>{D.inviteFriend(parseInt(t.getAttribute("data-invite")))})}),e.querySelectorAll("[data-remove]").forEach(t=>{t.addEventListener("click",()=>{const n=parseInt(t.getAttribute("data-remove")),i=t.getAttribute("data-name")||"this friend";this.showRemoveFriendConfirmation(n,i)})})}}showRemoveFriendConfirmation(e,t){const n=document.createElement("div");n.className="mp-confirm-overlay",n.style.zIndex="1100",n.innerHTML=`
      <div class="mp-confirm-dialog">
        <div class="mp-confirm-title">Remove ${t}?</div>
        <div class="mp-confirm-buttons">
          <button class="mp-btn secondary" id="mp-confirm-cancel">Cancel</button>
          <button class="mp-btn danger" id="mp-confirm-remove">Remove</button>
        </div>
      </div>
    `,document.body.appendChild(n),document.getElementById("mp-confirm-cancel").addEventListener("click",()=>{n.remove()}),document.getElementById("mp-confirm-remove").addEventListener("click",()=>{n.remove(),D.removeFriend(e)}),n.addEventListener("click",i=>{i.target===n&&n.remove()})}showSearchResult(e){const t=document.getElementById("mp-search-result");if(!t)return;if(!e){t.innerHTML='<div style="color: #f44336; font-size: 14px; margin-top: 8px;">User not found</div>';return}const n=this.friends.some(i=>i.friendId===e.id);t.innerHTML=`
      <div class="mp-friend" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
        <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px;">
          <span class="mp-friend-name">${e.nickname}</span>
          ${e.telegramUsername?`<span style="color: #888; font-size: 12px;">@${e.telegramUsername}</span>`:""}
        </div>
        <div class="mp-friend-actions">
          ${n?'<span style="color: #4CAF50; font-size: 12px;">Already friends</span>':'<button class="mp-btn small" id="mp-add-found">Add</button>'}
        </div>
      </div>
    `,n||document.getElementById("mp-add-found").addEventListener("click",()=>{D.addFriend(e.id),t.innerHTML=`
          <div class="mp-friend" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px;">
              <span class="mp-friend-name">${e.nickname}</span>
            </div>
            <div class="mp-friend-actions">
              <span style="color: #4CAF50; font-size: 12px;">Request sent</span>
            </div>
          </div>
        `})}renderInvitations(){const e=document.getElementById("mp-invites-list");if(!e)return;if(this.invitations.length===0){e.innerHTML='<div style="color: #888; font-size: 14px;">No invitations</div>';return}const t={free_roll:"Free Roll",street_craps:"Street Craps",mexico:"Mexico",greedy_pig:"Greedy Pig",poker_dice:"Poker Dice"};e.innerHTML=this.invitations.map(n=>`
      <div class="mp-invite">
        <div class="mp-invite-text">
          <strong>${n.fromUser.nickname}</strong> invites you to<br>
          ${t[n.gameMode]||n.gameMode}
        </div>
        <div class="mp-invite-actions">
          <button class="mp-btn small" data-accept="${n.id}">Accept</button>
          <button class="mp-btn small secondary" data-decline="${n.id}">Decline</button>
        </div>
      </div>
    `).join(""),e.querySelectorAll("[data-accept]").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.getAttribute("data-accept"));D.respondInvitation(i,!0),this.invitations=this.invitations.filter(s=>s.id!==i),this.renderInvitations(),this.updateInvitesBadge()})}),e.querySelectorAll("[data-decline]").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.getAttribute("data-decline"));D.respondInvitation(i,!1),this.invitations=this.invitations.filter(s=>s.id!==i),this.renderInvitations(),this.updateInvitesBadge()})})}updateInvitesBadge(){const e=document.getElementById("mp-notif-btn");if(!e)return;let t=e.querySelector("#mp-invites-badge");const n=this.invitations.length+this.friendRequests.length;n>0?(t||(t=document.createElement("div"),t.id="mp-invites-badge",t.style.cssText=`
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f44336;
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        `,e.appendChild(t)),t.textContent=String(n)):t&&t.remove()}showNotificationsPanel(){this.closeMenu();const e=document.createElement("div");e.className="mp-confirm-overlay",e.id="mp-notifications-panel",e.innerHTML=`
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; max-height: 70vh; overflow-y: auto; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${U("notifications.title")}</div>
        
        <div class="mp-tabs" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button class="mp-tab" data-notif-tab="invites" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: #4CAF50; color: white; font-size: 12px; cursor: pointer;">${U("notifPanel.invites")}${this.invitations.length?` (${this.invitations.length})`:""}</button>
          <button class="mp-tab" data-notif-tab="friends" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.1); color: #888; font-size: 12px; cursor: pointer;">${U("notifPanel.friends")}${this.friendRequests.length?` (${this.friendRequests.length})`:""}</button>
          <button class="mp-tab" data-notif-tab="news" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.1); color: #888; font-size: 12px; cursor: pointer;">${U("notifications.news")}</button>
        </div>
        
        <div id="mp-notif-content" style="text-align: left;"></div>
        
        <button class="mp-btn secondary" id="mp-close-notif-panel" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("buttons.close")}</button>
      </div>
    `,document.body.appendChild(e),e.querySelectorAll("[data-notif-tab]").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll("[data-notif-tab]").forEach(n=>{n.style.background="rgba(255,255,255,0.1)",n.style.color="#888"}),t.style.background="#4CAF50",t.style.color="white",this.renderNotifTab(t.getAttribute("data-notif-tab"))})}),this.renderNotifTab("invites"),document.getElementById("mp-close-notif-panel").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",t=>{t.target===e&&e.remove()})}renderNotifTab(e){const t=document.getElementById("mp-notif-content");if(!t)return;const n={free_roll:"Free Roll",street_craps:"Street Craps",mexico:"Mexico",greedy_pig:"Greedy Pig"};switch(e){case"invites":this.invitations.length===0?t.innerHTML=`<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${U("invitations.noInvitations")}</div>`:(t.innerHTML=this.invitations.map(i=>`
            <div class="mp-invite" style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 8px;">
              <div class="mp-invite-text" style="color: white; font-size: 14px; margin-bottom: 8px;">
                <strong>${i.fromUser.nickname}</strong> ${U("notifications.invitesYouTo")} <em style="text-transform: uppercase;">${n[i.gameMode]||i.gameMode}</em>
              </div>
              <div class="mp-invite-actions" style="display: flex; gap: 8px; justify-content: center;">
                <button class="mp-btn small" data-accept-notif="${i.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: #4CAF50; color: white; border: none; cursor: pointer; min-width: 80px;">${U("buttons.accept")}</button>
                <button class="mp-btn small secondary" data-decline-notif="${i.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; border: none; cursor: pointer; min-width: 80px;">${U("buttons.decline")}</button>
              </div>
            </div>
          `).join(""),t.querySelectorAll("[data-accept-notif]").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.getAttribute("data-accept-notif"));D.respondInvitation(s,!0),this.invitations=this.invitations.filter(o=>o.id!==s),this.renderNotifTab("invites"),this.updateInvitesBadge(),document.getElementById("mp-notifications-panel")?.remove()})}),t.querySelectorAll("[data-decline-notif]").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.getAttribute("data-decline-notif"));D.respondInvitation(s,!1),this.invitations=this.invitations.filter(o=>o.id!==s),this.renderNotifTab("invites"),this.updateInvitesBadge()})}));break;case"friends":this.friendRequests.length===0?t.innerHTML=`<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${U("friends.noRequests")}</div>`:(t.innerHTML=this.friendRequests.map(i=>`
            <div class="mp-invite" style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 8px;">
              <div class="mp-invite-text" style="color: white; font-size: 14px; margin-bottom: 8px;">
                <strong>${i.fromNickname}</strong> ${U("notifications.wantsToBeFriend")}
              </div>
              <div class="mp-invite-actions" style="display: flex; gap: 8px; justify-content: center;">
                <button class="mp-btn small" data-accept-friend="${i.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: #4CAF50; color: white; border: none; cursor: pointer; min-width: 80px;">${U("buttons.accept")}</button>
                <button class="mp-btn small secondary" data-decline-friend="${i.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; border: none; cursor: pointer; min-width: 80px;">${U("buttons.decline")}</button>
              </div>
            </div>
          `).join(""),t.querySelectorAll("[data-accept-friend]").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.getAttribute("data-accept-friend"));D.respondFriendRequest(s,!0),this.friendRequests=this.friendRequests.filter(o=>o.id!==s),this.renderNotifTab("friends"),this.updateInvitesBadge()})}),t.querySelectorAll("[data-decline-friend]").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.getAttribute("data-decline-friend"));D.respondFriendRequest(s,!1),this.friendRequests=this.friendRequests.filter(o=>o.id!==s),this.renderNotifTab("friends"),this.updateInvitesBadge()})}));break;case"news":t.innerHTML=`<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${U("notifications.noNews")}</div>`;break}}updateInvitesTabLabel(){const e=document.querySelector('[data-notif-tab="invites"]');e&&(e.textContent=`${U("notifPanel.invites")}${this.invitations.length?` (${this.invitations.length})`:""}`)}showGameModeModal(){const e=document.createElement("div");e.className="mp-confirm-overlay",e.id="mp-gamemode-modal";const t=[{id:"free_roll",name:U("gameModes.freeRoll"),icon:"🎲",desc:U("gameModes.freeRollDesc"),available:!0},{id:"street_craps",name:U("gameModes.streetCraps"),icon:"🎯",desc:U("gameModes.streetCrapsDesc"),available:!0},{id:"mexico",name:U("gameModes.mexico"),icon:"🇲🇽",desc:U("gameModes.mexicoDesc"),available:!0},{id:"greedy_pig",name:U("gameModes.greedyPig"),icon:"🐷",desc:U("gameModes.greedyPigDesc"),available:!0},{id:"poker_dice",name:U("gameModes.pokerDice"),icon:"🃏",desc:U("gameModes.pokerDiceDesc"),available:!0}];let n=0;const i=4,s=Math.ceil(t.length/i),o=()=>{const r=n*i,l=r+i,c=t.slice(r,l),d=document.querySelector(".mp-gamemode-dialog-content");if(!d)return;d.innerHTML=`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${c.map(m=>`
            <div class="mp-gamemode-card" data-mode="${m.id}" style="
              position: relative;
              padding: 16px;
              background: ${m.available?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.05)"};
              border-radius: 12px;
              text-align: center;
              cursor: ${m.available?"pointer":"not-allowed"};
              opacity: ${m.available?"1":"0.5"};
              transition: background 0.2s, transform 0.2s;
              border: 2px solid transparent;
            ">
              <button class="mp-gamemode-info" data-mode-info="${m.id}" style="
                position: absolute;
                top: 4px;
                right: 4px;
                width: 36px;
                height: 36px;
                padding: 0;
                background: transparent;
                border: none;
                border-radius: 50%;
                color: rgba(255,255,255,0.7);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
              ">${ai("info",24)}</button>
              <div style="font-size: 32px; margin-bottom: 8px;">${m.icon}</div>
              <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${m.name}</div>
              <div style="color: #888; font-size: 11px;">${m.desc}</div>
            </div>
          `).join("")}
        </div>
        
        ${s>1?`
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 16px;">
            <button class="mp-page-btn" id="mp-prev-page" ${n===0?"disabled":""} style="
              padding: 8px 16px;
              background: ${n===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.2)"};
              border: none;
              border-radius: 8px;
              color: ${n===0?"#666":"white"};
              font-size: 14px;
              cursor: ${n===0?"not-allowed":"pointer"};
              transition: background 0.2s;
            ">←</button>
            <div style="color: #888; font-size: 12px;">${n+1} / ${s}</div>
            <button class="mp-page-btn" id="mp-next-page" ${n===s-1?"disabled":""} style="
              padding: 8px 16px;
              background: ${n===s-1?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.2)"};
              border: none;
              border-radius: 8px;
              color: ${n===s-1?"#666":"white"};
              font-size: 14px;
              cursor: ${n===s-1?"not-allowed":"pointer"};
              transition: background 0.2s;
            ">→</button>
          </div>
        `:""}
      `,d.querySelectorAll(".mp-gamemode-info").forEach(m=>{m.addEventListener("click",g=>{g.stopPropagation();const v=m.getAttribute("data-mode-info");v&&this.showGameRulesModal(v)})}),d.querySelectorAll(".mp-gamemode-card").forEach(m=>{const g=m.getAttribute("data-mode");t.find(f=>f.id===g)?.available&&(m.addEventListener("mouseenter",()=>{m.style.background="rgba(76,175,80,0.3)",m.style.borderColor="#4CAF50"}),m.addEventListener("mouseleave",()=>{m.style.background="rgba(255,255,255,0.1)",m.style.borderColor="transparent"}),m.addEventListener("click",()=>{e.remove(),D.createLobby(g)}))});const h=d.querySelector("#mp-prev-page"),u=d.querySelector("#mp-next-page");h&&h.addEventListener("click",()=>{n>0&&(n--,o())}),u&&u.addEventListener("click",()=>{n<s-1&&(n++,o())})};e.innerHTML=`
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${U("lobby.selectGameMode")}</div>
        
        <div class="mp-gamemode-dialog-content"></div>
        
        <button class="mp-btn secondary" id="mp-close-gamemode" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("buttons.cancel")}</button>
      </div>
    `,document.body.appendChild(e),o(),document.getElementById("mp-close-gamemode").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",r=>{r.target===e&&e.remove()})}showGameRulesModal(e){const n={free_roll:"gameModes.freeRollRules",street_craps:"gameModes.streetCrapsRules",mexico:"gameModes.mexicoRules",greedy_pig:"gameModes.greedyPigRules",poker_dice:"gameModes.pokerDiceRules"}[e],i=U(n),o=(l=>{let c=l;return c=c.replace(/^### (.+)$/gm,'<h3 style="color: white; font-size: 14px; font-weight: 600; margin: 4px 0 2px 0;">$1</h3>'),c=c.replace(/^## (.+)$/gm,'<h2 style="color: white; font-size: 15px; font-weight: 600; margin: 8px 0 4px 0;">$1</h2>'),c=c.replace(/^# (.+)$/gm,'<h1 style="color: white; font-size: 18px; font-weight: 700; margin: 0 0 8px 0; text-align: center;">$1</h1>'),c=c.replace(/\*\*(.+?)\*\*/g,'<strong style="color: #4CAF50; font-weight: 600;">$1</strong>'),c=c.replace(/^- (.+)$/gm,'<li style="margin-left: 16px; margin-bottom: 2px; color: #ddd;">$1</li>'),c=c.replace(/(<li[^>]*>.*<\/li>\n?)+/g,d=>'<ul style="margin: 4px 0; padding-left: 0; list-style-position: inside;">'+d+"</ul>"),c=c.replace(/\n\n/g,"<br>"),c=c.replace(/\n/g," "),c})(i),r=document.createElement("div");r.className="mp-confirm-overlay",r.style.zIndex="1300",r.innerHTML=`
      <div class="mp-confirm-dialog" style="
        width: calc(100% - 40px); 
        max-width: 400px; 
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: left;
        padding: 20px;
      ">
        <style>.mp-confirm-dialog::-webkit-scrollbar { display: none; }</style>
        <div style="color: #ddd; font-size: 13px; line-height: 1.5;">
          ${o}
        </div>
        <button class="mp-btn secondary" id="mp-close-rules" style="
          margin-top: 16px; 
          width: 100%; 
          padding: 12px; 
          background: rgba(255,255,255,0.2); 
          border: none; 
          border-radius: 8px; 
          color: white; 
          font-size: 14px; 
          cursor: pointer;
        ">${U("buttons.close")}</button>
      </div>
    `,document.body.appendChild(r),document.getElementById("mp-close-rules").addEventListener("click",()=>{r.remove()}),r.addEventListener("click",l=>{l.target===r&&r.remove()})}closeMenu(){this.menuPanel&&(this.menuPanel.remove(),this.menuPanel=null);const e=document.getElementById("mp-menu-backdrop");e&&e.remove(),this.isMenuOpen=!1,this.updateStatus(),document.removeEventListener("click",this.handleClickOutsideMenu)}isMenuPanelOpen(){return this.isMenuOpen===!0}showLobbyPanel(){this.lobbyPanel||(this.isLobbyMinimized=!1,this.lobbyPanel=document.createElement("div"),this.lobbyPanel.className="mp-panel",this.lobbyPanel.id="mp-lobby-panel",this.lobbyPanel.style.left="10px",this.lobbyPanel.style.right="10px",this.container.appendChild(this.lobbyPanel),this.renderLobby())}renderLobby(){if(!this.lobbyPanel||!this.currentLobby)return;const e=this.currentLobby,t=e.hostId===D.user?.id,n={free_roll:"🎲",street_craps:"🎯",mexico:"🇲🇽",greedy_pig:"🐷",poker_dice:"🃏"},i={free_roll:"Free Roll",street_craps:"Street Craps",mexico:"Mexico",greedy_pig:"Greedy Pig",poker_dice:"Poker Dice"};if(this.isLobbyMinimized){this.lobbyPanel.style.cssText=`
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        right: auto;
        width: fit-content;
        padding: 8px 16px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        pointer-events: auto;
      `,this.lobbyPanel.innerHTML=`
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" id="mp-lobby-expand">
          <span style="font-size: 18px;">${n[e.gameMode]}</span>
          <span style="color: white; font-size: 14px;">${i[e.gameMode]}</span>
          <span style="color: white; font-size: 14px;">${e.players.length} / ${e.maxPlayers}</span>
          <span style="color: #888; font-size: 12px;">▼</span>
        </div>
      `,document.getElementById("mp-lobby-expand")?.addEventListener("click",()=>{this.isLobbyMinimized=!1,this.renderLobby()});return}this.lobbyPanel.style.cssText=`
      position: absolute;
      top: 50px;
      left: 10px;
      right: 10px;
      max-height: 70vh;
      overflow-y: auto;
      background: rgba(0,0,0,0.9);
      border-radius: 12px;
      padding: 16px;
      pointer-events: auto;
    `,this.lobbyPanel.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div class="mp-title" style="margin: 0;">${i[e.gameMode]}</div>
        <button id="mp-minimize-lobby" style="background: none; border: none; color: #888; font-size: 16px; cursor: pointer; padding: 4px 8px;">▲</button>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${U("lobby.players")} (${e.players.length}/${e.maxPlayers})</div>
        <div id="mp-lobby-players">
          ${e.players.map(s=>`
            <div class="mp-lobby-player ${s.oderId===e.hostId?"host":""}">
              ${s.user?.nickname||s.nickname||"Player"}
            </div>
          `).join("")}
        </div>
        <button class="mp-btn secondary" id="mp-invite-friends" style="margin-top: 8px;">${U("lobby.inviteFriends")}</button>
      </div>
      ${e.status==="voting"&&e.players.length>1?`
        <div class="mp-section">
          <div class="mp-section-title">${U("lobby.votingForTable")}</div>
          <div id="mp-table-votes"></div>
        </div>
      `:""}
      ${(e.status==="waiting"||e.status==="voting"&&e.players.length===1)&&t?`
        <button class="mp-btn" id="mp-start-game">${U("lobby.startGame")}</button>
      `:""}
      ${e.status==="waiting"&&!t?`
        <div style="color: #888; font-size: 14px; text-align: center;">${U("lobby.waitingForHost")}</div>
      `:""}
      <button class="mp-btn danger" id="mp-leave-lobby">${U("lobby.leaveLobby")}</button>
    `,e.status==="voting"&&e.players.length>1&&this.renderTableVoting(),document.getElementById("mp-minimize-lobby")?.addEventListener("click",()=>{this.isLobbyMinimized=!0,this.renderLobby()}),document.getElementById("mp-invite-friends")?.addEventListener("click",()=>{this.showInviteFriendsModal()}),document.getElementById("mp-leave-lobby")?.addEventListener("click",()=>{this.showLeaveConfirmation()}),document.getElementById("mp-start-game")?.addEventListener("click",()=>{D.startGame()})}showInviteFriendsModal(){const e=document.createElement("div");e.className="mp-confirm-overlay",e.id="mp-invite-modal";const t=[...this.friends].sort((n,i)=>{const s=n.onlineStatus!=="offline"?0:1,o=i.onlineStatus!=="offline"?0:1;return s-o});e.innerHTML=`
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; max-height: 70vh; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${U("friends.inviteFriends")}</div>
        <div id="mp-invite-friends-list" style="text-align: left;">
          ${t.length===0?`<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${U("friends.noFriends")}</div>`:t.map(n=>{const i=this.sentInvites.has(n.friendId),s=n.onlineStatus==="offline";return`
                <div class="mp-friend" data-friend-row="${n.friendId}" style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; ${s?"opacity: 0.7;":""}">
                  <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                    <div class="mp-friend-status ${n.onlineStatus}" style="width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;"></div>
                    <span class="mp-friend-name" style="color: white; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${n.user.nickname}</span>
                  </div>
                  <div class="mp-friend-actions" style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; min-height: 32px;">
                    ${i?`<span style="color: #888; font-size: 12px;">${U("friends.invited")}</span>`:`<button class="mp-btn small" data-invite-friend="${n.friendId}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; background: ${s?"#666":"#4CAF50"}; color: white; border: none; cursor: pointer;">${U(s?"friends.notify":"friends.invite")}</button>`}
                  </div>
                </div>
              `}).join("")}
        </div>
        <button class="mp-btn secondary" id="mp-close-invite-modal" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${U("buttons.close")}</button>
      </div>
    `,document.body.appendChild(e),e.querySelectorAll("[data-invite-friend]").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.getAttribute("data-invite-friend")),o=e.querySelector(`[data-friend-row="${i}"]`)?.querySelector(".mp-friend-actions");D.inviteFriend(i),this.sentInvites.add(i),o&&(o.innerHTML='<span style="color: #888; font-size: 12px;">Invited</span>')})}),document.getElementById("mp-close-invite-modal").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",n=>{n.target===e&&e.remove()})}refreshInviteFriendsModal(){const e=document.getElementById("mp-invite-friends-list");if(!e)return;const t=[...this.friends].sort((n,i)=>{const s=n.onlineStatus!=="offline"?0:1,o=i.onlineStatus!=="offline"?0:1;return s-o});e.innerHTML=t.length===0?'<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">No friends yet</div>':t.map(n=>{const i=this.sentInvites.has(n.friendId),s=n.onlineStatus==="offline";return`
          <div class="mp-friend" data-friend-row="${n.friendId}" style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; ${s?"opacity: 0.7;":""}">
            <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
              <div class="mp-friend-status ${n.onlineStatus}" style="width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;"></div>
              <span class="mp-friend-name" style="color: white; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${n.user.nickname}</span>
            </div>
            <div class="mp-friend-actions" style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; min-height: 32px;">
              ${i?'<span style="color: #888; font-size: 12px;">Invited</span>':`<button class="mp-btn small" data-invite-friend="${n.friendId}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; background: ${s?"#666":"#4CAF50"}; color: white; border: none; cursor: pointer;">${s?"Notify":"Invite"}</button>`}
            </div>
          </div>
        `}).join(""),e.querySelectorAll("[data-invite-friend]").forEach(n=>{n.addEventListener("click",()=>{const i=parseInt(n.getAttribute("data-invite-friend")),o=e.querySelector(`[data-friend-row="${i}"]`)?.querySelector(".mp-friend-actions");D.inviteFriend(i),this.sentInvites.add(i),o&&(o.innerHTML='<span style="color: #888; font-size: 12px;">Invited</span>')})})}renderTableVoting(){const e=document.getElementById("mp-table-votes");if(!e)return;const t=new Map;if(this.currentLobby?.players.forEach(n=>{const i=n.user?.equippedTableId??n.equippedTableId,s=n.user?.equippedTableName??n.equippedTableName;console.log("[TableVoting] Player:",n.user?.nickname||n.nickname,"tableId:",i,"tableName:",s),i&&t.set(i,s||`Table ${i}`)}),console.log("[TableVoting] Unique tables:",Array.from(t.entries())),t.size<=1){const n=t.entries().next().value,i=n?n[1]:"Green Felt",s=n?n[0]:1;e.innerHTML=`<div style="color: #888; font-size: 14px;">${i} (default)</div>`,D.voteTable(s);return}e.innerHTML=Array.from(t.entries()).map(([n,i])=>`
      <button class="mp-vote-btn" data-table="${n}">
        ${i}
        <span class="mp-vote-count" data-votes="${n}">0</span>
      </button>
    `).join(""),e.querySelectorAll(".mp-vote-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll(".mp-vote-btn").forEach(i=>i.classList.remove("voted")),n.classList.add("voted"),D.voteTable(parseInt(n.getAttribute("data-table")))})})}renderVotes(e){e.forEach(t=>{const n=document.querySelector(`[data-votes="${t.tableId}"]`);n&&(n.textContent=String(t.count))})}closeLobbyPanel(){this.lobbyPanel&&(this.lobbyPanel.remove(),this.lobbyPanel=null)}showNotification(e,t=!1){const n=document.createElement("div");n.style.cssText=`
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      max-width: 70vw;
      padding: 12px 24px;
      background: ${t?"#f44336":"#4CAF50"};
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 1000;
      pointer-events: none;
      text-align: center;
      box-sizing: border-box;
    `,n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.remove(),3e3)}showReconnectDialog(e,t){const n=document.getElementById("mp-reconnect-dialog");n&&n.remove();const i=document.createElement("div");i.id="mp-reconnect-dialog",i.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;const s=Math.ceil(t/1e3);i.innerHTML=`
      <div style="
        background: #2a2a2a;
        border-radius: 16px;
        padding: 24px;
        max-width: 300px;
        text-align: center;
        color: white;
      ">
        <h3 style="margin: 0 0 16px 0; font-size: 18px;">Game in Progress</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">
          You were disconnected from an active game.
        </p>
        <p id="reconnect-timer" style="margin: 0 0 20px 0; font-size: 14px; color: #FFD700;">
          Time to reconnect: ${s}s
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="reconnect-yes" style="
            padding: 12px 24px;
            background: #4CAF50;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
          ">Reconnect</button>
          <button id="reconnect-no" style="
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
          ">Leave Game</button>
        </div>
      </div>
    `,document.body.appendChild(i);const o=document.getElementById("reconnect-timer");let r=s;const l=setInterval(()=>{r--,o&&(o.textContent=`Time to reconnect: ${r}s`),r<=0&&(clearInterval(l),i.remove(),D.clearPendingReconnect(),this.showNotification("Reconnect time expired",!0))},1e3);document.getElementById("reconnect-yes")?.addEventListener("click",()=>{clearInterval(l),i.remove(),D.reconnectGame(e)}),document.getElementById("reconnect-no")?.addEventListener("click",()=>{clearInterval(l),i.remove(),D.clearPendingReconnect(),this.showNotification("Left the game")})}getPlayerNickname(e){if(!e)return"Unknown";if(e===D.user?.id)return"Вы";if(this.currentLobby){const n=this.currentLobby.players.find(i=>i.oderId===e);if(n)return n.user?.nickname||n.nickname||`Player${e}`}const t=this.friends.find(n=>n.friendId===e);return t?t.user.nickname:`Player${e}`}destroy(){this.unsubscribeLanguageChange&&(this.unsubscribeLanguageChange(),this.unsubscribeLanguageChange=null)}showInviteFriendModal(){D.getReferralStats();const e=t=>{const{referralCode:n,stats:i}=t,r=`https://t.me/streetdice_bot/app?startapp=ref_${n}`,l=document.createElement("div");l.className="mp-confirm-overlay",l.innerHTML=`
        <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px;">
          <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${U("referrals.inviteFriend")}</div>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="color: #888; font-size: 12px; margin-bottom: 8px;">${U("referrals.yourCode")}</div>
            <div style="color: white; font-size: 16px; font-weight: 600; font-family: monospace; word-break: break-all;">${n}</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="color: #888; font-size: 12px; margin-bottom: 8px;">${U("referrals.stats")}</div>
            <div style="color: white; font-size: 14px;">
              ${U("referrals.totalReferrals")}: ${i.totalReferrals}<br>
              ${U("referrals.activeReferrals")}: ${i.referralsWithThreeGames} / ${i.totalReferrals}<br>
              ${U("referrals.totalRewards")}: ${i.totalRewards}
            </div>
          </div>
          
          <div style="background: rgba(76,175,80,0.2); border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px solid rgba(76,175,80,0.5);">
            <div style="color: #4CAF50; font-size: 12px; font-weight: 600; margin-bottom: 8px;">${U("referrals.rewards")}</div>
            <div style="color: white; font-size: 12px; line-height: 1.6;">
              • 1 ${U("referrals.friend")} → 3 ${U("referrals.games")} = ${U("referrals.rareDice")}<br>
              • 5 ${U("referrals.friends")} → 3 ${U("referrals.games")} = ${U("referrals.rareTable")}<br>
              • 10 ${U("referrals.friends")} → 3 ${U("referrals.games")} = 3x ${U("referrals.rareDice")}<br>
              • ${U("referrals.friendPurchase")} = ${U("referrals.sameItem")}
            </div>
          </div>
          
          <button class="mp-btn" id="mp-copy-link-btn" style="width: 100%; margin-bottom: 8px; background: #4CAF50;">
            ${U("referrals.copyLink")}
          </button>
          <button class="mp-btn" id="mp-share-telegram-btn" style="width: 100%; margin-bottom: 8px; background: #0088cc;">
            ${U("referrals.shareTelegram")}
          </button>
          <button class="mp-btn secondary" id="mp-close-referral-modal" style="width: 100%;">
            ${U("buttons.close")}
          </button>
        </div>
      `,document.body.appendChild(l),document.getElementById("mp-copy-link-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r),this.showNotification(U("referrals.linkCopied"))}catch{const d=document.createElement("textarea");d.value=r,d.style.position="fixed",d.style.left="-999999px",document.body.appendChild(d),d.select();try{document.execCommand("copy"),this.showNotification(U("referrals.linkCopied"))}catch{this.showNotification(U("referrals.copyFailed"),!0)}document.body.removeChild(d)}}),document.getElementById("mp-share-telegram-btn").addEventListener("click",()=>{const c=encodeURIComponent(U("referrals.shareText")),d=`https://t.me/share/url?url=${encodeURIComponent(r)}&text=${c}`;window.open(d,"_blank")}),document.getElementById("mp-close-referral-modal").addEventListener("click",()=>{l.remove()}),l.addEventListener("click",c=>{c.target===l&&l.remove()}),D.off("referral_stats",e)};D.on("referral_stats",e)}}const js=[{id:"double",nameKey:"boosts.double.name",descKey:"boosts.double.desc",iconName:"zap",duration:180,cooldown:14400,type:"double"},{id:"triple",nameKey:"boosts.triple.name",descKey:"boosts.triple.desc",iconName:"flame",duration:180,cooldown:14400,type:"triple_even"},{id:"snake_eyes",nameKey:"boosts.snakeEyes.name",descKey:"boosts.snakeEyes.desc",iconName:"sparkles",duration:180,cooldown:14400,type:"snake_eyes"},{id:"golden",nameKey:"boosts.golden.name",descKey:"boosts.golden.desc",iconName:"crown",duration:60,cooldown:43200,type:"golden"}];class as{static init(){console.log("[BoostsModal] Initializing...");const e=localStorage.getItem("boostStates");if(e)try{const n=JSON.parse(e);this.boostStates=new Map(Object.entries(n)),console.log("[BoostsModal] Loaded states from localStorage:",this.boostStates.size)}catch(n){console.error("[Boosts] Failed to load states:",n)}js.forEach(n=>{this.boostStates.has(n.id)||this.boostStates.set(n.id,{id:n.id,active:!1,availableAt:Date.now()-1e3})}),console.log("[BoostsModal] Total boosts initialized:",this.boostStates.size),this.updateInterval||(this.updateInterval=window.setInterval(()=>{this.checkActiveBoosts(),this.updateTimers()},1e3),console.log("[BoostsModal] Update interval started")),D.on("boost_activated",n=>{console.log("[BoostsModal] Boost activated from server:",n),this.handleBoostActivated(n)}),D.on("boost_expired",n=>{console.log("[BoostsModal] Boost expired from server:",n),this.handleBoostExpired(n)});let t=!1;D.on("auth_success",n=>{console.log("[BoostsModal] Auth success, active boosts:",n.activeBoosts),n.activeBoosts&&Array.isArray(n.activeBoosts)&&(n.activeBoosts.forEach(i=>{const s=this.boostStates.get(i.boostId);s&&(s.active=!0,s.activeUntil=new Date(i.expiresAt).getTime(),s.availableAt=new Date(i.availableAt).getTime(),i.selectedParity&&(s.selectedParity=i.selectedParity))}),this.saveStates(),this.updateBoostIcon()),t||(t=!0,D.send({type:"get_boost_states"}))}),D.on("boost_states",n=>{console.log("[BoostsModal] Received boost states:",n.boosts),n.boosts&&Array.isArray(n.boosts)&&(n.boosts.forEach(i=>{const s=this.boostStates.get(i.boostId);if(s){const o=new Date(i.availableAt).getTime();s.active=i.active,i.activeUntil?s.activeUntil=new Date(i.activeUntil).getTime():s.activeUntil=void 0,s.availableAt=o,i.selectedParity&&(s.selectedParity=i.selectedParity)}}),this.saveStates(),this.updateBoostIcon(),this.overlay&&this.renderBoosts())}),console.log("[BoostsModal] Initialization complete")}static updateTimers(){if(!this.overlay)return;const e=Date.now(),n=this.getActiveBoosts().length>0;js.forEach(i=>{const s=this.boostStates.get(i.id);if(!s)return;const o=document.getElementById(`boost-status-${i.id}`),r=document.getElementById(`boost-button-${i.id}`);if(!o||!r)return;const l=s.active&&s.activeUntil&&e<s.activeUntil,c=Math.max(0,Math.ceil((s.availableAt-e)/1e3)),d=s.activeUntil?Math.max(0,Math.ceil((s.activeUntil-e)/1e3)):0,h=c===0&&!s.active&&!n;l?(o.textContent=this.formatTime(d),o.style.color="#4CAF50"):c>0?(o.textContent=this.formatTime(c),o.style.color="#FF9800"):n?(o.textContent=U("boosts.anotherActive"),o.style.color="#888"):(o.textContent=U("boosts.ready"),o.style.color="#4CAF50"),h?(r.disabled=!1,r.style.background="#4CAF50",r.style.cursor="pointer"):(r.disabled=!0,r.style.background="#555",r.style.cursor="not-allowed")})}static checkActiveBoosts(){const e=Date.now();let t=!1;this.boostStates.forEach((n,i)=>{n.active&&n.activeUntil&&e>=n.activeUntil&&(console.log("[BoostsModal] Boost expired locally",{id:i,activeUntil:n.activeUntil,now:e}),n.active=!1,n.activeUntil=void 0,t=!0,this.animateBoostIconExpire())}),t&&(this.saveStates(),this.updateBoostIcon(),this.overlay&&this.renderBoosts())}static animateBoostIconExpire(){const e=document.getElementById("boost-icon");e&&(e.style.transition="all 0.5s ease",e.style.color="#888",e.style.opacity="0.5",setTimeout(()=>{e.style.opacity="0"},500),setTimeout(()=>{e.style.color="#FFD700",e.style.opacity="1"},1e3))}static handleBoostActivated(e){const t=this.boostStates.get(e.boostId);t&&(t.active=!0,t.activeUntil=e.activeUntil,e.selectedParity&&(t.selectedParity=e.selectedParity),typeof e.availableAt=="number"&&(t.availableAt=e.availableAt),this.saveStates(),this.updateBoostIcon(),this.overlay&&this.renderBoosts())}static handleBoostExpired(e){console.log("[BoostsModal] handleBoostExpired called",{boostId:e.boostId,availableAt:e.availableAt,availableAtDate:new Date(e.availableAt)});const t=this.boostStates.get(e.boostId);t&&(t.active=!1,t.activeUntil=void 0,t.availableAt=e.availableAt,console.log("[BoostsModal] State updated",{state:t}),this.saveStates(),this.updateBoostIcon(),this.animateBoostIconExpire(),this.overlay&&this.renderBoosts())}static saveStates(){const e={};this.boostStates.forEach((t,n)=>{e[n]=t}),localStorage.setItem("boostStates",JSON.stringify(e))}static toggle(){this.overlay?this.close():this.open()}static open(){if(this.overlay)return;this.overlay=document.createElement("div"),this.overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-y: auto;
      padding: 20px;
    `;const e=document.createElement("div");e.style.cssText=`
      background: rgba(30, 30, 30, 0.95);
      border-radius: 16px;
      padding: 24px;
      max-width: 500px;
      width: 100%;
      margin: auto;
    `;const t=document.createElement("div");t.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;const n=document.createElement("h2");n.textContent=U("boosts.title"),n.style.cssText=`
      color: white;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    `;const i=document.createElement("button");i.textContent="✕",i.style.cssText=`
      background: transparent;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `,i.onclick=()=>this.close(),t.appendChild(n),t.appendChild(i),e.appendChild(t);const s=document.createElement("div");s.id="boosts-list",e.appendChild(s),this.overlay.appendChild(e),document.body.appendChild(this.overlay),this.renderBoosts(),this.overlay.addEventListener("click",o=>{o.target===this.overlay&&this.close()})}static renderBoosts(){const e=document.getElementById("boosts-list");if(!e)return;e.innerHTML="";const n=this.getActiveBoosts().length>0;js.forEach(i=>{const s=this.boostStates.get(i.id);if(!s)return;const o=Date.now(),r=s.active&&s.activeUntil&&o<s.activeUntil,l=Math.max(0,Math.ceil((s.availableAt-o)/1e3)),c=l===0&&!s.active&&!n,d=s.activeUntil?Math.max(0,Math.ceil((s.activeUntil-o)/1e3)):0,h=document.createElement("div");h.style.cssText=`
        background: ${r?"rgba(76, 175, 80, 0.2)":"rgba(255, 255, 255, 0.1)"};
        border: 2px solid ${r?"#4CAF50":"rgba(255, 255, 255, 0.2)"};
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: ${c?"pointer":"default"};
        transition: all 0.2s;
        opacity: ${c||r?"1":"0.6"};
      `,c&&(h.onmouseenter=()=>{h.style.transform="scale(1.02)",h.style.borderColor="#4CAF50"},h.onmouseleave=()=>{h.style.transform="scale(1)",h.style.borderColor="rgba(255, 255, 255, 0.2)"});const u=document.createElement("div");u.style.cssText=`
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      `;const m=document.createElement("div");m.innerHTML=ai(i.iconName,32),m.style.cssText=`
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;const g=document.createElement("div");g.style.flex="1";const v=document.createElement("div");v.textContent=U(i.nameKey),v.style.cssText=`
        color: white;
        font-size: 18px;
        font-weight: 600;
      `;const f=document.createElement("div");f.textContent=U(i.descKey),f.style.cssText=`
        color: #aaa;
        font-size: 13px;
        margin-top: 2px;
      `,g.appendChild(v),g.appendChild(f),u.appendChild(m),u.appendChild(g),h.appendChild(u);const p=document.createElement("div");p.style.cssText=`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
      `;const y=document.createElement("div");y.id=`boost-status-${i.id}`,y.style.cssText=`
        color: ${r?"#4CAF50":l>0?"#FF9800":n?"#888":"#4CAF50"};
        font-size: 13px;
        font-weight: 500;
      `,r?y.textContent=this.formatTime(d):l>0?y.textContent=this.formatTime(l):n?y.textContent=U("boosts.anotherActive"):y.textContent=U("boosts.ready");const x=document.createElement("button");x.id=`boost-button-${i.id}`,x.textContent=U("boosts.activate"),x.style.cssText=`
        background: ${c?"#4CAF50":"#555"};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: ${c?"pointer":"not-allowed"};
        transition: all 0.2s;
      `,c?(x.onmouseenter=()=>{x.style.background="#45a049"},x.onmouseleave=()=>{x.style.background="#4CAF50"},x.onclick=_=>{_.stopPropagation(),this.activateBoost(i)}):x.disabled=!0,p.appendChild(y),p.appendChild(x),h.appendChild(p),e.appendChild(h)})}static activateBoost(e){if(this.getActiveBoosts().length>0){this.showNotification(U("boosts.alreadyActive"));return}if(e.id==="triple"){this.showParitySelector(e);return}D.send({type:"activate_boost",boostId:e.id}),this.close()}static showParitySelector(e){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
    `;const n=document.createElement("div");n.style.cssText=`
      background: rgba(30, 30, 30, 0.95);
      border-radius: 16px;
      padding: 24px;
      max-width: 300px;
      text-align: center;
    `;const i=document.createElement("div");i.textContent=U("boosts.chooseParity"),i.style.cssText=`
      color: white;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    `;const s=document.createElement("div");s.style.cssText=`
      display: flex;
      gap: 12px;
      justify-content: center;
    `;const o=document.createElement("button");o.textContent=U("boosts.even"),o.style.cssText=`
      flex: 1;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    `,o.onclick=()=>{t.remove(),D.send({type:"activate_boost",boostId:e.id,parity:"even"}),this.close()};const r=document.createElement("button");r.textContent=U("boosts.odd"),r.style.cssText=`
      flex: 1;
      background: #FF9800;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    `,r.onclick=()=>{t.remove(),D.send({type:"activate_boost",boostId:e.id,parity:"odd"}),this.close()},s.appendChild(o),s.appendChild(r),n.appendChild(i),n.appendChild(s),t.appendChild(n),document.body.appendChild(t),t.addEventListener("click",l=>{l.target===t&&t.remove()})}static formatTime(e){const t=localStorage.getItem("language")||"en";if(e>=3600){const n=Math.floor(e/3600),i=Math.floor(e%3600/60);return t==="ru"?`${n}ч ${i}мин`:`${n}h ${i}m`}else if(e>=60){const n=Math.floor(e/60),i=e%60;return t==="ru"?`${n}мин ${i}с`:`${n}m ${i}s`}else return t==="ru"?`${e}с`:`${e}s`}static close(){this.overlay&&(this.overlay.remove(),this.overlay=null)}static getActiveBoosts(){const e=[];return this.boostStates.forEach(t=>{t.active&&t.activeUntil&&Date.now()<t.activeUntil&&e.push(t)}),e}static calculatePipsMultiplier(e,t){const n=this.getActiveBoosts();let i=1,s=0,o="";return n.forEach(r=>{const l=js.find(c=>c.id===r.id);if(l)switch(l.type){case"double":i=Math.max(i,2),o="Double Pips";break;case"golden":i=Math.max(i,5),o="Golden Hour";break;case"triple_even":case"triple_odd":const d=(e+t)%2===0;(r.selectedParity==="even"&&d||r.selectedParity==="odd"&&!d)&&(i=Math.max(i,3),o=`Triple Pips (${r.selectedParity})`);break;case"snake_eyes":e===1&&t===1&&(s+=1111,o=o?`${o} + Lucky Snakes`:"Lucky Snakes");break}}),{multiplier:i,bonus:s,reason:o}}static showNotification(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(76, 175, 80, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 2000;
      animation: slideDown 0.3s ease;
    `,document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideUp 0.3s ease",setTimeout(()=>t.remove(),300)},3e3)}static updateBoostIcon(){const e=document.getElementById("boost-icon");if(!e)return;this.getActiveBoosts().length>0?e.style.animation="pulse 1s infinite":e.style.animation="none"}}N(as,"overlay",null),N(as,"boostStates",new Map),N(as,"updateInterval",null);const ql=Object.freeze(Object.defineProperty({__proto__:null,BoostsModal:as},Symbol.toStringTag,{value:"Module"}));class cy{constructor(){N(this,"wheelOverlay",null);N(this,"messagesContainer",null);N(this,"isOpen",!1);N(this,"currentLevel","categories");N(this,"selectedCategory",null);N(this,"lastReactionTime",0);N(this,"cooldownMs",2e3);N(this,"messageQueue",[]);N(this,"isShowingMessage",!1);N(this,"categories",[{id:"game",icon:"🎲",labelKey:"reactions.categories.game",color:"#4CAF50"},{id:"chat",icon:"💬",labelKey:"reactions.categories.chat",color:"#2196F3"},{id:"emotions",icon:"😊",labelKey:"reactions.categories.emotions",color:"#FF9800"},{id:"actions",icon:"👋",labelKey:"reactions.categories.actions",color:"#9C27B0"}]);N(this,"reactions",{game:[{id:"fire",content:"🔥",isEmoji:!0},{id:"lucky",content:"🍀",isEmoji:!0},{id:"unlucky",content:"💀",isEmoji:!0},{id:"nice_roll",content:U("reactions.game.niceRoll"),isEmoji:!1},{id:"close",content:U("reactions.game.close"),isEmoji:!1},{id:"gg",content:"GG",isEmoji:!1}],chat:[{id:"hello",content:"👋",isEmoji:!0},{id:"thanks",content:"🙏",isEmoji:!0},{id:"thinking",content:"🤔",isEmoji:!0},{id:"good_luck",content:U("reactions.chat.goodLuck"),isEmoji:!1},{id:"one_more",content:U("reactions.chat.oneMore"),isEmoji:!1},{id:"brb",content:U("reactions.chat.brb"),isEmoji:!1}],emotions:[{id:"laugh",content:"😂",isEmoji:!0},{id:"wow",content:"😮",isEmoji:!0},{id:"cool",content:"😎",isEmoji:!0},{id:"sad",content:"😢",isEmoji:!0},{id:"angry",content:"😠",isEmoji:!0},{id:"love",content:"❤️",isEmoji:!0}],actions:[{id:"thumbs_up",content:"👍",isEmoji:!0},{id:"thumbs_down",content:"👎",isEmoji:!0},{id:"clap",content:"👏",isEmoji:!0},{id:"facepalm",content:"🤦",isEmoji:!0},{id:"shrug",content:"🤷",isEmoji:!0},{id:"muscle",content:"💪",isEmoji:!0}]});this.createMessagesContainer(),this.setupEventListeners(),this.addStyles()}addStyles(){const e=document.createElement("style");e.textContent=`
      .reaction-wheel-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 150;
        pointer-events: auto;
        animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .reaction-wheel {
        position: relative;
        width: 280px;
        height: 280px;
      }
      
      .reaction-wheel-item {
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: rgba(100, 100, 100, 0.3);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(150, 150, 150, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 36px;
        font-weight: 400;
        color: white;
      }
      
      .reaction-wheel-item:hover {
        transform: scale(1.15);
        background: rgba(120, 120, 120, 0.4);
        border-color: rgba(180, 180, 180, 0.6);
      }
      
      .reaction-wheel-item:active {
        transform: scale(0.95);
      }
      
      .reaction-wheel-item-label {
        display: none;
      }
      
      .reaction-wheel-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(60, 60, 60, 0.9);
        border: 3px solid rgba(120, 120, 120, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: rgba(200, 200, 200, 0.9);
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        text-align: center;
        padding: 8px;
        line-height: 1.2;
      }
      
      .reaction-wheel-back {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .reaction-wheel-back:hover {
        background: rgba(80, 80, 80, 0.9);
        border-color: rgba(150, 150, 150, 0.6);
        transform: translate(-50%, -50%) scale(1.05);
      }
      
      #reactions-messages {
        position: fixed;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 85;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 280px;
      }
      
      .reaction-message {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 6px 12px;
        animation: slideInLeft 0.3s ease, fadeOut 0.3s ease 2.7s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-20px);
        }
      }
      
      .reaction-message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: white;
        font-family: 'Montserrat', sans-serif;
        flex-shrink: 0;
        text-transform: uppercase;
      }
      
      .reaction-message-content {
        font-size: 24px;
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        line-height: 1;
      }
      
      .reaction-message-content.text {
        font-size: 16px;
        font-weight: 400;
      }
    `,document.head.appendChild(e)}createMessagesContainer(){this.messagesContainer=document.createElement("div"),this.messagesContainer.id="reactions-messages",document.body.appendChild(this.messagesContainer)}setupEventListeners(){D.on("reaction_received",e=>{this.queueMessage(e)})}show(){}hide(){this.closeWheel()}openWheelPublic(){this.openWheel()}openWheel(){this.isOpen||(this.isOpen=!0,this.currentLevel="categories",this.selectedCategory=null,this.wheelOverlay=document.createElement("div"),this.wheelOverlay.className="reaction-wheel-overlay",this.wheelOverlay.addEventListener("click",e=>{e.target===this.wheelOverlay&&this.closeWheel()}),this.renderWheel(),document.body.appendChild(this.wheelOverlay))}closeWheel(){this.wheelOverlay&&(this.wheelOverlay.remove(),this.wheelOverlay=null),this.isOpen=!1,this.currentLevel="categories",this.selectedCategory=null}renderWheel(){if(!this.wheelOverlay)return;const e=document.createElement("div");e.className="reaction-wheel",this.currentLevel==="categories"?this.renderCategories(e):this.renderItems(e),this.wheelOverlay.innerHTML="",this.wheelOverlay.appendChild(e)}renderCategories(e){const t=Math.PI*2/this.categories.length,n=105;this.categories.forEach((s,o)=>{const r=t*o-Math.PI/2,l=Math.cos(r)*n,c=Math.sin(r)*n,d=document.createElement("div");d.className="reaction-wheel-item",d.style.left=`calc(50% + ${l}px - 35px)`,d.style.top=`calc(50% + ${c}px - 35px)`,d.innerHTML=`<div style="font-size: 36px;">${s.icon}</div>`,d.addEventListener("click",()=>{this.selectedCategory=s.id,this.currentLevel="items",this.renderWheel()}),e.appendChild(d)});const i=document.createElement("div");i.className="reaction-wheel-center",i.textContent="💬",e.appendChild(i)}renderItems(e){if(!this.selectedCategory)return;const t=this.reactions[this.selectedCategory]||[],n=Math.PI*2/t.length,i=105;t.forEach((o,r)=>{const l=n*r-Math.PI/2,c=Math.cos(l)*i,d=Math.sin(l)*i,h=document.createElement("div");h.className="reaction-wheel-item",h.style.left=`calc(50% + ${c}px - 35px)`,h.style.top=`calc(50% + ${d}px - 35px)`,o.isEmoji?(h.style.fontSize="36px",h.textContent=o.content):(h.style.fontSize="14px",h.style.fontWeight="400",h.style.padding="8px",h.style.textAlign="center",h.style.lineHeight="1.2",h.textContent=o.content),h.addEventListener("click",()=>{this.sendReaction(o.content,o.isEmoji)}),e.appendChild(h)});const s=document.createElement("div");s.className="reaction-wheel-center reaction-wheel-back",s.textContent="←",s.addEventListener("click",()=>{this.currentLevel="categories",this.selectedCategory=null,this.renderWheel()}),e.appendChild(s)}sendReaction(e,t){const n=Date.now();if(n-this.lastReactionTime<this.cooldownMs){console.log("[ReactionWheel] Cooldown active");return}this.lastReactionTime=n,D.send({type:"send_reaction",content:e});const i=D.user?.nickname||"You";this.queueMessage({playerId:D.user?.id||0,playerNickname:i,content:e,timestamp:n}),this.playFeedbackSound(),this.closeWheel()}playFeedbackSound(){try{const e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.connect(n),n.connect(e.destination),t.frequency.value=800,t.type="sine",n.gain.setValueAtTime(.1,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.1),t.start(e.currentTime),t.stop(e.currentTime+.1)}catch{}}queueMessage(e){this.messageQueue.push(e),this.isShowingMessage||this.showNextMessage()}async showNextMessage(){if(this.messageQueue.length===0){this.isShowingMessage=!1;return}this.isShowingMessage=!0;const e=this.messageQueue.shift();await this.displayMessage(e),setTimeout(()=>{this.showNextMessage()},300)}displayMessage(e){return new Promise(t=>{if(!this.messagesContainer){t();return}const n=document.createElement("div");n.className="reaction-message";const i=document.createElement("div");i.className="reaction-message-avatar",i.textContent=e.playerNickname.charAt(0);const s=e.playerId*137%360;i.style.background=`linear-gradient(135deg, hsl(${s}, 70%, 60%) 0%, hsl(${s+30}, 70%, 50%) 100%)`;const o=document.createElement("div");o.className="reaction-message-content",/^[\p{Emoji}\u200d]+$/u.test(e.content)||o.classList.add("text"),o.textContent=e.content,n.appendChild(i),n.appendChild(o),this.messagesContainer.appendChild(n),setTimeout(()=>{n.remove(),t()},3e3)})}}console.log("%c🎲 Dice Game v2.0 - Simplified (No Animations)","color: #4CAF50; font-size: 16px; font-weight: bold");console.log("%cBuild time:","color: #2196F3",new Date().toISOString());const Ks=[];let Wn=null;function dy(){Wn=document.createElement("div"),Wn.id="debug-overlay",Wn.style.cssText=`
    position: fixed;
    bottom: 50px;
    left: 10px;
    right: 10px;
    max-height: 40vh;
    background: rgba(0,0,0,0.9);
    color: #0f0;
    font-family: monospace;
    font-size: 10px;
    padding: 8px;
    border-radius: 8px;
    overflow-y: auto;
    z-index: 9999;
    display: none;
    white-space: pre-wrap;
    word-break: break-all;
  `,document.body.appendChild(Wn)}function Fr(a,...e){const n=`[${new Date().toLocaleTimeString("en-US",{hour12:!1})}][${a}] ${e.map(i=>typeof i=="object"?JSON.stringify(i):String(i)).join(" ")}`;Ks.push(n),Ks.length>100&&Ks.shift(),Wn&&(Wn.textContent=Ks.join(`
`),Wn.scrollTop=Wn.scrollHeight),console.log(n)}window.debugLog=Fr;window.wsClient=D;dy();document.addEventListener("visibilitychange",()=>{Fr("VISIBILITY",document.hidden?"HIDDEN":"VISIBLE")});j0();window.Telegram?.WebApp&&(window.Telegram.WebApp.ready(),window.Telegram.WebApp.expand(),window.Telegram.WebApp.disableVerticalSwipes&&window.Telegram.WebApp.disableVerticalSwipes(),window.Telegram.WebApp.enableClosingConfirmation&&window.Telegram.WebApp.enableClosingConfirmation());document.body.addEventListener("touchmove",a=>{let e=a.target;for(;e&&e!==document.body;){const t=window.getComputedStyle(e);if(t.overflowY==="auto"||t.overflowY==="scroll")return;e=e.parentElement}a.preventDefault()},{passive:!1});document.addEventListener("touchstart",a=>{a.touches.length>1&&a.preventDefault()},{passive:!1});let xr=0,Hc=null;document.addEventListener("touchstart",a=>{xr=a.touches[0].clientY,Hc=a.target},{passive:!0});document.addEventListener("touchmove",a=>{let e=Hc;for(;e&&e!==document.body;){const i=window.getComputedStyle(e);if(i.overflowY==="auto"||i.overflowY==="scroll")return;e=e.parentElement}const t=a.touches[0].clientY,n=t-xr;xr=t,window.scrollY===0&&n>0&&a.preventDefault()},{passive:!1});const hy=document.getElementById("canvas"),$t=new ry(hy);$t.start();ay($t);const Gc=new ly;window.multiplayerUI=Gc;window.wsClient=D;console.log("[Connection] Status monitoring active");as.init();Bi(async()=>{const{BettingModal:a}=await import("./BettingModal-CZssq6V6-1779046189997.js");return{BettingModal:a}},[]).then(({BettingModal:a})=>{a.init(),console.log("[BETTING] Modal initialized")});setTimeout(()=>{$t.updateUIVisibility(),Fr("BOOSTS","UI visibility updated on load")},100);$t.setMenuOpenCallback(()=>Gc.isMenuPanelOpen());const Xl=document.getElementById("result");Xl&&Xl.addEventListener("click",()=>{const a=window.reactionWheel;a&&$t.isInMultiplayerGame()&&a.openWheelPublic()});const uy=new cy;window.reactionWheel=uy;D.on("auth_success",()=>{const a=D.getEquippedDiceConfig();if(a){$t.updateDiceAppearance(a);const t=$t.getDiceSync();t&&t.setOriginalDiceConfig(a)}const e=D.getEquippedTableConfig();e&&$t.updateTableAppearance(e),D.user?.pips!==void 0&&$t.setPips(D.user.pips)});D.on("pips_updated",a=>{});D.on("item_equipped",a=>{if(a.slot==="dice"){D.user&&(D.user.equippedDiceId=a.itemId);const e=D.getEquippedDiceConfig();if(e){const t=$t.getDiceSync();t&&t.setOriginalDiceConfig(e),(!t||!t.isColorChangeLocked())&&$t.updateDiceAppearance(e)}}else if(a.slot==="table"&&(D.user&&(D.user.equippedTableId=a.itemId),!$t.isInMultiplayerGame())){const e=D.getEquippedTableConfig();e&&$t.updateTableAppearance(e)}});export{U as t,D as w};
