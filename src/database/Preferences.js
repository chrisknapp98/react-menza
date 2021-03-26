import * as idb from 'idb';

/**
 * Set MyMensa object in local indexedDB. The table can only contain one item. If you set a new value, the old one is overwritten.
 * @param mensa mensa object you'd like to set as MyMensa
 */
export async function setMyMensa(mensa) {
const request = indexedDB.open("userPreferences");
  let db;

  request.onupgradeneeded = async function() {
    // The database did not previously exist, so create object stores and indexes.
    const db = request.result;
    db.createObjectStore("myMensa", {keyPath: "id"});
    db.createObjectStore("favMensen", {keyPath: "id"});
    const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
    favSpeisen.createIndex("name", "name");
    favSpeisen.createIndex("category", "category");
    favSpeisen.createIndex("prices", "prices");
    favSpeisen.createIndex("notes", "notes");

    var mensaObjectStore = db.transaction("myMensa", "readwrite").objectStore("myMensa");
    mensaObjectStore.put(mensa);

  };

  request.onsuccess = function() {
    db = request.result;
    var mensaObjectStore = db.transaction("myMensa", "readwrite").objectStore("myMensa");
    mensaObjectStore.clear();
    mensaObjectStore.put(mensa);
  };
}

/**
 * Get MyMensa object from database 
 */
export async function getMyMensa() {
  var db = await idb.openDB("userPreferences"
   , undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
     //transaction.objectStore("myMensa").put(null);
    } 
  }).then(function(db) {
      var tx = db.transaction(["myMensa"], 'readonly');
      var store = tx.objectStore("myMensa");
      return store.getAll();
      })
      .then(list => {
        return list[0];
      })
  
  return db;
}

/**
 * Add one specific mensa object to favMensen
 * @param mensa The mensa object you'd like to add to the table
 */
export async function addMensaToFavs(mensa) {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favMensen"], 'readwrite');
      var store = tx.objectStore("favMensen");
      return store.add(mensa);
      })
  
  return db;
}

/**
 * Remove one specific mensa object from favMensen 
 * @param mensa The mensa object you'd like to remove. It's searched by its ID
 */
export async function removeMensaFromFavs(mensa) {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favMensen"], 'readwrite');
      var store = tx.objectStore("favMensen");
      return store.delete(mensa.id);
      })
  
  return db;
}

/**
 * Get a list containing all Mensa objects that are saved to favMensen
 */
export async function getFavMensen() {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favMensen"], 'readonly');
      var store = tx.objectStore("favMensen");
      return store.getAll();
      })
      .then(list => {
        return list;
      })
  
  return db;
}

/**
 * Add Speise object to favSpeisen
 * @param speise The meal to add to the table
 */
export async function addSpeiseToFavs(speise) {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favSpeisen"], 'readwrite');
      var store = tx.objectStore("favSpeisen");
      return store.add(speise);
      })
  
  return db;
}

/**
 * Remove Speise object from favSpeisen
 * @param speise The meal to remove from the table
 */
export async function removeSpeiseFromFavs(speise) {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favSpeisen"], 'readwrite');
      var store = tx.objectStore("favSpeisen");
      return store.delete(speise.id);
      })
  
  return db;
}

/**
 * Get all entries for favSpeisen
 */
export async function getFavSpeisen() {
    var db = await idb.openDB("userPreferences", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMensa", {keyPath: "id"});
      db.createObjectStore("favMensen", {keyPath: "id"});
      const favSpeisen = db.createObjectStore("favSpeisen", {keyPath: "id"});
      favSpeisen.createIndex("name", "name");
      favSpeisen.createIndex("category", "category");
      favSpeisen.createIndex("prices", "prices");
      favSpeisen.createIndex("notes", "notes");
    } 
  }).then(function(db) {
      var tx = db.transaction(["favSpeisen"], 'readonly');
      var store = tx.objectStore("favSpeisen");
      return store.getAll();
      })
      .then(list => {
        return list;
      })
  
  return db;
}