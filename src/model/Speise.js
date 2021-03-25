
export default class Speise {
  /**
   * Create new Speise object
   * @param id Unique ID of speise
   * @param name Name of speise
   * @param category Specific category of speise
   * @param prices Object containing prices for students, employees, pupils and other 
   * @param notes All additional information about the speise object 
   */
  constructor(id, name, category, prices, notes) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.prices = prices;
    this.notes = notes;
  }
}