import{_ as o}from"./preload-helper-41c905a7.js";const a=async e=>e.mdsvexPromise.then(s=>({path:e.path,...s.metadata})),l=async()=>{const e=Object.assign({"/src/lib/assets/articles/second-blog.md":()=>o(()=>import("./second-blog-f62e8afc.js"),["./second-blog-f62e8afc.js","./index-728a74a2.js"],import.meta.url),"/src/lib/assets/articles/this-blog.md":()=>o(()=>import("./this-blog-90b2c7e9.js"),["./this-blog-90b2c7e9.js","./index-728a74a2.js"],import.meta.url)}),s=[];for(const[t,r]of Object.entries(e))s.push({path:t,mdsvexPromise:r()});return{mdFiles:await Promise.allSettled(s.map(t=>a(t))).then(t=>t.map(r=>{if(r.status==="fulfilled")return r.value}))}},n=Object.freeze(Object.defineProperty({__proto__:null,load:l},Symbol.toStringTag,{value:"Module"}));export{n as _,l};