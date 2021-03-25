import * as mensaAPI from './OpenMensaAPI';
//mport OpenMensaAPI from './OpenMensaAPI';
import Mensa from '../model/Mensa';
import Speise from '../model/Speise';

/**
 * Convert JSON object list to Mensa obj list
 * @param jsonObj json object list
 */
function createMensaObjListFromJSON(jsonObj) {
  var mensaList = []
  try {
    var length = jsonObj.length;
    for (var i=0; i<length; i++) {
      var tempMensa = new Mensa(
        jsonObj[i].id, 
        jsonObj[i].name, 
        jsonObj[i].city,
        jsonObj[i].address,
        jsonObj[i].coordinates
        );
      mensaList.push(tempMensa);
    }
  } catch (err) {
    console.log(err);
    console.log("Problem with jsonObjList");
  }
  return mensaList;
}

/**
 * Convert JSON object list to Speise obj list
 * @param jsonObj json object list
 */
function createSpeisenObjListFromJSON(jsonObj) {
  var speisenList = []
  try {
    var length = jsonObj.length;
    for (var i=0; i<length; i++) {
      var tempSpeise = new Speise(
        jsonObj[i].id, 
        jsonObj[i].name, 
        jsonObj[i].category,
        jsonObj[i].prices,
        jsonObj[i].notes
        );
      speisenList.push(tempSpeise);
    }
  } catch (err) {
    console.log(err);
    console.log("Problem with jsonObjList");
  }
  return speisenList;
}

/**
 * Fetch all Mensas from API and convert them
 */
export async function fetchAllMensas() {
  var fullJson = [];
  let jsonEmpty = false;
  var page = 1;
  while (!jsonEmpty) {
    var jsonObj = await mensaAPI.getAllMensasPage(page);
    if (jsonObj.length > 0) {
      fullJson = fullJson.concat(jsonObj);
      page++;
    } else {
      jsonEmpty = true;
    }
  }
  var mensaList = createMensaObjListFromJSON(fullJson);
  return mensaList;
}

/**
 * Fetch mensa object list by given id(s) and convert them
 * @param ids one or multiple ids as string, separated by comma
 */
export async function fetchMensaObjListById(ids) {
  var jsonObj = await mensaAPI.searchMensaById(ids);
  //OpenMensaAPI("id", [ids]);
  var mensaList = createMensaObjListFromJSON(jsonObj);
  return mensaList;
}

/**
 * Fetch mensa obj list by given coords for distance <=10km and convert them 
 * @param lat latitude
 * @param lng longitude
 */
export async function fetchMensaObjListNear(lat, lng) {
  var jsonObj = await mensaAPI.searchMensaNear(lat, lng);
  //OpenMensaAPI("near", [lat, lng]);
  var mensaList = createMensaObjListFromJSON(jsonObj);
  return mensaList;
}

/**
 * Fetch mensa obj list by given coords for specific distance and convert them 
 * @param lat latitude
 * @param lng longitude
 * @pram dist distance in km
 */
export async function fetchMensaObjListNearByDist(lat, lng, dist) {
  var jsonObj = await mensaAPI.searchMensaNear(lat, lng, dist);
  //OpenMensaAPI("nearDist", [lat, lng, dist]);
  var mensaList = createMensaObjListFromJSON(jsonObj);
  return mensaList;
}

/**
 * Fetch speisen obj list by given mensaID and date and convert them
 * @param mensaID unique ID of mensa
 * @param date structured date as string e.g. "2019-11-18"
 */
export async function fetchSpeisenForDay(mensaID, date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var formattedDate = year + "-" + month + "-" + day;
  var jsonObj = await mensaAPI.getSpeisenForDay(mensaID, formattedDate);
  
  var speisenList = createSpeisenObjListFromJSON(jsonObj);
  return speisenList;
}