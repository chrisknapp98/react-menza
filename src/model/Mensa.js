
export default class Mensa {
  /**
   * Create new Mensa object 
   * @param id Unique ID of mensa
   * @param name Name of mensa
   * @param city City of mensa
   * @param address Detailed address of mensa as string
   * @param coordinates Array containing latitude and longitude
   */
  constructor(id, name, city, address, coordinates) {
    this.id = id;
    this.name = name;
    this.city = city; 
    this.address = address;
    this.coordinates = coordinates;
  }
}