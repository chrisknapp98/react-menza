
const url = "https://openmensa.org/api/v2/canteens";

/**
 * Run the request for the OpenMensa service
 */
function runRequest(specifications) {
  return fetch(url + specifications)
  .then(response => {
    return response.json()
  })
  .catch(err => console.log(err));
}

/**
 * Get all Mensas from API at specific page number
 * @param page page number
 */
export async function getAllMensasPage(page) {
  var json = await runRequest("?page=" + page);
  return json;
}

/**
 * Search one or multiple Mensa(s)
 * @param ids one or mutliple ids, seperated by comma, ideally as string
 */
export async function searchMensaById(ids){
  var json = await runRequest("?ids=" + ids);
  console.log(json);
  return json;
}

/**
 * Search Mensas near the given location latitude and longitude with 
 * default distance of 10km
 * @param lat latitude
 * @param lng longitude
 */
export async function searchMensaNear(lat, lng) {
  var json = await runRequest("?near[lat]=" + lat + "&near[lng]=" + lng);
  return json;
}

/**
 * Search Mensas near the given location latitude and longitude with 
 * specified distance radius in km
 * @param lat latitude
 * @param lng longitude
 * @param dist distance in km
 */
export async function searchMensaNearByDist(lat, lng, dist) {
  var json = await runRequest("?near[lat]=" + lat + "&near[lng]=" + lng + "&near[dist]=" + dist);
  return json;
}

/**
 * Get all meals of a Mensa for a specifc day
 * @param mensaID unique ID of mensa
 * @param date structured date as string e.g. "2019-11-18"
 */
export async function getSpeisenForDay(mensaID, date) {
  var json = await runRequest("/" + mensaID + "/days/" + date + "/meals");
  return json;
}
