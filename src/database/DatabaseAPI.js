import * as idb from 'idb';
import { fetchAllMensas } from '../logic/Data';
import { distance } from '../utils/DistCalculator';


// https://w3c.github.io/IndexedDB/

/**
 * Initialize the the databse mensaDB in indexedDB and put all mensa objects from API in it
 */
export async function initMensaDB() {
  const request = indexedDB.open("mensaDB");
  let db;

  request.onupgradeneeded = async function() {
    // The database did not previously exist, so create object stores and indexes.
    const db = request.result;
    const store = db.createObjectStore("mensaDB", {keyPath: "id"});
    const nameIndex = store.createIndex("name", "name");
    const cityIndex = store.createIndex("city", "city");
    const addressIndex = store.createIndex("address", "address");
    const coordinatesIndex = store.createIndex("coordinates", "coordinates");
    
    // Speichere alle Mensen in der Datenbank
    let mensaList = await fetchAllMensas();
    var mensaObjectStore = db.transaction("mensaDB", "readwrite").objectStore("mensaDB");
    mensaList.forEach(function(mensa) {
        //console.log(mensa);
        mensaObjectStore.add(mensa);
      });

  };

  request.onsuccess = function() {
    db = request.result;
  };

}

/**
 * Get specifc item from databse
 * @param database choose between 'mensaDB' or 'userPreferences'
 * @param value The value of the item you are looking for
 * @param index The index. Where should the database search for your value?
 */
export async function getFromDatabase(database, value, index) {
  //var dbPromise = idb.openDB(database);
  //let db;

  var objList = [];
  var valueAsCoordsArr = [];

  if (index === "coordinates") {
    var tempArr = value.split(","); 
    valueAsCoordsArr.push(Number(tempArr[0]));
    valueAsCoordsArr.push(Number(tempArr[1]));
  }
  console.log(valueAsCoordsArr);
  if (!index || index == "id") {
    //dbPromise.then(function(db) {
    return idb.openDB(database).then(function(db) {
      var tx = db.transaction([database], 'readonly');
      var store = tx.objectStore(database);
      return store.get(Number(value))
    })
      .then(obj => {
        objList.push(obj);
        return;
      })
      .then(function() {
      return objList;})
    .catch(err => console.log(err));

  } else {
      return idb.openDB(database).then(async function(db) {
      var tx = db.transaction([database], 'readonly');
      var store = tx.objectStore(database);

      return store.openCursor();
    })
    .then(function showItem(cursor) {
      if (!cursor) {return;} 
      switch (index) {
        case "name":
          if (cursor.value.name.toLowerCase().includes(value.toLowerCase())) {
          objList.push(cursor.value);
          }
          break;
        case "city":
          if (cursor.value.city.toLowerCase().includes(value.toLowerCase())) {
          objList.push(cursor.value);
          }
          break;
        case "address":
          if (cursor.value.address.toLowerCase().includes(value.toLowerCase())) {
          objList.push(cursor.value);
          } 
          break;
        case "coordinates":
          console.log(cursor.value);
          if (cursor.value.coordinates !== null) {
          if (distance(valueAsCoordsArr[0], valueAsCoordsArr[1], cursor.value.coordinates[0], cursor.value.coordinates[1]) <= 20) {
            objList.push(cursor.value);
          }
          }
          break; 
        default:
          console.log("No index matched.");
      }
      return cursor.continue().then(showItem);
    })
    .then(function() {
      return objList;})
    .catch(err => console.log(err));
  }

}

// ----------------------------------------------------------
// I believe all of the functions below are not functional or not used but I'm afraid to comment/delete them the day before the final presentation

export async function getFromDatabaseExact(database, value, index) {
  var dbPromise = idb.openDB(database);
  dbPromise.then(async function(db) {
    const retValue = await db.getFromIndex(database, index, value);
    console.log(retValue);
    return retValue;
  })
}

export async function getFromDatabaseById(database, value) {
 const request = indexedDB.open(database);
  //let db;

  request.onsuccess = function() {
    var anotherRequest = request.result
    .transaction(database)
    .objectStore(database).get(value);
  
    anotherRequest.onsuccess = function() {
    console.log("Gesuchtes Objekt: " + anotherRequest.result);
    return anotherRequest.result;
    }

    anotherRequest.onerror = function() {
      console("Failed");
    }
  }

}


export async function getAllMensen() {
  const request = indexedDB.open('mensaDB');

  request.onsuccess = function() {
    var anotherRequest = request.result
    .transaction('mensaDB')
    .objectStore('mensaDB').getAll();

    anotherRequest.onsuccess = function() {
    return anotherRequest.result;
    }

    anotherRequest.onerror = function() {
      console("Failed");
    }
  }

}

