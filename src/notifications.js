import * as Data from './logic/Data';
import * as Preferences from './database/Preferences';

// Wir benutzen doch kein periodicSync
/* 
export async function registerPeriodicFavSpeisenFetch() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.periodicSync.register('get-todays-meals', {
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch {
    console.log('Periodic Sync could not be registered!');
  }
}

export function checkIfPeriodicFavSpeisenFetchRegistered() {
  return navigator.serviceWorker.ready.then(registration => {
    return registration.periodicSync.getTags().then(tags => {
      return (tags.includes('get-todays-meals'))
    });
  });
}

export function unregisterPeriodicFavSpeisenFetch() {
  navigator.serviceWorker.ready.then(registration => {
    registration.periodicSync.unregister('get-todays-meals');
  });
}

export function fetchAndCacheTodaysMeals() {
  Preferences.getMyMensa().then(mensa => {
    return mensa;
  })
  .then(mensa => {
    Data.fetchSpeisenForDay(mensa, new Date("2019-11-18"))
    .then(speisenList => {
      //localStorage['speisenList'] = speisenList;
    })
  })
  
}
 */
/* 
export function serviceWorkerRequest(message) {
  if ('serviceWorker' in navigator) {
    if ( navigator.serviceWorker.controller == null ) {
      return Promise.reject("No service worker controller.");
    }
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  } else {
    return Promise.reject("No service worker.");
  }
}
 */

/**
 * Show browser notification on client side
 */
export function displayNotification(message) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification(message);
    });
  }  
}

/**
 * Send notification if one of the objects in favSpeisen is offered in todays meals - for now we are using "2019-11-18" as the date as all cantines are closed. Just remove the parameter within new Date to change it.
 */
export function notifyTodaysMeals() {
  Preferences.getMyMensa().then(mensa => {
    return mensa;
  })
  .then(mensa => {
    return Data.fetchSpeisenForDay(mensa.id, new Date("2019-11-18"))
    .then(speisenList => {
      return speisenList;
    })
    .then(todaysSpeisenList => {
      return Preferences.getFavSpeisen()
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
        if (availableSpeisenQuantity === 1) {
          notiText = "Deine Lieblingsspeise " + availableSpeisen[0].name + " ist heute in deiner Mensa verfügbar!";
        } else {
          var text1 = "Deine Lieblingsspeisen ";
          var text2 = "";
          var text3 = " sind heute in deiner Lieblingsmensa verfügbar!";
          for (var i=0; i<availableSpeisenQuantity; i++) {
            if (i === 0) {
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
  }).catch(err => {console.log(err)})
}
