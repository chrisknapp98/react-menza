// ServiceWorker - Network First, Cache Fallback
// https://gist.github.com/JMPerez/8ca8d5ffcc0cc45a8b4e1c279efd8a94

// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 10;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// these are the routes we are going to cache for offline support
const cacheFiles = ['/', '/home/', '/mensa/', '/search/', 'favourites', '/settings/', '/settings/mymensa/', 'settings/myspeisen/'];

// on activation we clean up the previously registered service workers
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('activate', evt =>
  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  )
);

// on install we download the routes we want to cache for offline
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', evt =>
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then(cache => {
      return cache.addAll(cacheFiles);
    })
  )
);

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(response => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
    }, reject);
  });

// fetch the resource from the browser cache
const fromCache = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      cache
        .match(request)
        .then(matching => matching)// || cache.match('/offline/'))
    );

// cache the current page to make it available for offline
const update = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      fetch(request).then(response => cache.put(request, response))
    );

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', evt => {
  evt.respondWith(
    fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
  );
  evt.waitUntil(update(evt.request));
});


// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// --------------------------- Benachrichtigungen -------------------------------

function displayNotification(message) {
  if (Notification.permission == 'granted') {
    self.registration.showNotification(message);
  }  
}

function getMyMensa() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("userPreferences");
    let db;

    request.onupgradeneeded = function() {
      // The database did not previously exist, so create object stores and indexes.
      const db = request.result;
      const store = db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
      resolve();
    };

    request.onsuccess = function() {
      db = request.result;
      var mensaObjectStore = db.transaction("myMensa", "readonly").objectStore("myMensa");
      console.log(mensaObjectStore);
      var mensaList = mensaObjectStore.getAll();
      mensaList.onsuccess = list => {
        resolve(list.target.result[0]);
      }
    };
  })
  
}

function getFavSpeisen() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("userPreferences");
    let db;

    request.onupgradeneeded = function() {
      // The database did not previously exist, so create object stores and indexes.
      const db = request.result;
      const store = db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
      resolve();
    };

    request.onsuccess = function() {
      db = request.result;
      var speisenObjectStore = db.transaction("favSpeisen", "readonly").objectStore("favSpeisen");
      var speisenList = speisenObjectStore.getAll();
      speisenList.onsuccess = list => {
        resolve(list.target.result);
      }
      //return speisenList[0];
    };
    //return request;
  })
  
}

function fetchSpeisenFromAPI(mensaID, date) {
  const url = "https://openmensa.org/api/v2/canteens";
  return fetch(url + "/" + mensaID + "/days/" + date + "/meals")
  .then(response => {
    return response.json()
  })
  .catch(err => console.log(err));
}

function notifyTodaysMeals() {
  getMyMensa().then(mensa => {
    console.log(mensa);
    return mensa;
  })
  .then(mensa => {
    return fetchSpeisenFromAPI(mensa.id, new Date("2019-11-18"))
    .then(speisenList => {
      return speisenList;
    })
    .then(todaysSpeisenList => {
      return getFavSpeisen()
      .then(favSpeisenList => {
        favSpeisenList = favSpeisenList.map(item => item.id);
        return [todaysSpeisenList, favSpeisenList];
      })
    })
    .then(arr => {
      var todaysSpeisenList = arr[0];
      var favSpeisenIDList = arr[1];
      var availableSpeisen = [];
      todaysSpeisenList.forEach(speise => {
        if (favSpeisenIDList.includes(speise.id)) {
          availableSpeisen.push(speise);
        }
      })
      return availableSpeisen;
    })
    .then(availableSpeisen => {
      var availableSpeisenQuantity = availableSpeisen.length
      if (availableSpeisenQuantity > 0) {
        var notiText = "";
        if (availableSpeisenQuantity == 1) {
          notiText = "Deine Lieblingsspeise " + availableSpeisen[0].name + " ist heute in deiner Mensa verfügbar!";
        } else {
          var text1 = "Deine Lieblingsspeisen ";
          var text2 = "";
          var text3 = " sind heute in deiner Lieblingsmensa verfügbar!";
          for (var i=0; i<availableSpeisenQuantity; i++) {
            if (i == 0) {
              text2 = text2 + availableSpeisen[i].name;
            } else {
              text2 = text2 + ", " + availableSpeisen[i].name;
            }
          }
          notiText = text1 + text2 + text3;
        }
        displayNotification(notiText);
      }
    })
  })
}

/* 
// Benachrichtigungen - Periodic fetch der SpeisenListe
// Lassen wir doch sein
self.addEventListener('periodicsync', event => {
  if (event.tag == 'get-todays-meals') {
    event.waitUntil(notifications.fetchAndCacheTodaysMeals());
  }
});
 */


var dateNow = new Date();
var notiDate = new Date();
if (dateNow.getHours() >= 11) {
  // Nach 11 Uhr - Morgen mit Benachrichtigungen beginnen bzw. mit dem Check
  notiDate.setDate(notiDate.getDate() + 1); 
}
notiDate.setHours(11);
var timeTillNoti = notiDate - dateNow;
var dayInMS = 24 * 60 * 60 * 1000;
setTimeout(() => {
  setInterval(() => {
    /* if (localStorage['notifications'] === "true") {
      notifyTodaysMeals()
    } */
  }, dayInMS);
}, notiDate);