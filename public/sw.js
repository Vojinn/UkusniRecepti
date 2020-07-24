// moras cache da apdejtujes
const staticCacheName = 'site-static-v5';
const dynamicCacheName = 'site-dynamic-v6';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/palacinke1.png',
    '/img/plazmatorta.png',
    '/img/proja.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    '/pages/fallback.html'
];

// install service worker
self.addEventListener('install', evt => {
    //console.log('service worker has been installed');
    evt.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('caching shell assets');
        cache.addAll(assets)
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker has been activated');
    // keys metoda vraca imena cacheva
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
                )
        })
    );
});

// fetch event - zahtev za nesto

self.addEventListener('fetch', evt =>{
   
   // dinamicko kesiranje, ne kesiramo sve stranice, nego samo one koje je taj korisnik posecivao kad je bio online
   // i to stavljamo u dynamic cache
   if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
   evt.respondWith(
       caches.match(evt.request).then(cacheRes => {
           return cacheRes || fetch(evt.request).then(fetchRes => {
               return caches.open(dynamicCacheName).then(cache => {
cache.put(evt.request.url, fetchRes.clone());
                   return fetchRes;
       })
           });
       }).catch(() => {
       if(evt.request.url.indexOf('.html') > -1){
            return caches.match('/pages/fallback.html');
     }
       }) 
   );
    }
});

