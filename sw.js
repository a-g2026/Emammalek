// © أحمد جمال عبدالحفيظ — معلم الكيمياء
const V="imam-malik-v14";
const SHELL=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// نسخة نظيفة من الرد (من غير علامة redirected) عشان المتصفح يقبلها كصفحة
const clean=r=>new Response(r.body,{status:r.status,statusText:r.statusText,headers:r.headers});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith((async()=>{
      try{
        const res=await fetch(r.url,{cache:"no-cache"});
        if(res&&res.ok){const c=await caches.open(V);c.put("index.html",res.clone()).catch(()=>{});return clean(res)}
      }catch(_){}
      const m=(await caches.match("index.html"))||(await caches.match("./"));
      return m?clean(m):new Response("لا يوجد اتصال بالإنترنت حاليًا، افتح البرنامج مرة أخرى عند توفر الاتصال.",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}});
    })());
    return;
  }
  if(u.pathname.endsWith("/data.json")){
    e.respondWith((async()=>{
      try{const res=await fetch(r,{cache:"no-store"});if(res&&res.ok){const c=await caches.open(V);c.put("data.json",res.clone()).catch(()=>{});return res}}catch(_){}
      return (await caches.match("data.json"))||new Response("{}",{status:404});
    })());
    return;
  }
  e.respondWith((async()=>{
    const m=await caches.match(r);if(m)return m;
    try{const res=await fetch(r);if(res&&res.ok){const c=await caches.open(V);c.put(r,res.clone()).catch(()=>{})}return res}catch(_){return new Response("",{status:504})}
  })());
});
