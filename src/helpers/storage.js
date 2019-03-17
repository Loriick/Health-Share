class storage {
  /**
   *Creates an instance of storage.
   * @param {String} key
   * @memberof storage
   */
  constructor(key) {
    this.key = key;
  }
  /**
   *
   *
   * @param {Array} value
   * @returns JSON
   * @memberof storage
   */
  stringify(value) {
    return JSON.stringify(value);
  }

  /**
   *
   *
   * @param {Json} value
   * @returns Array
   * @memberof storage
   */
  parseJSON(value) {
    return JSON.parse(value);
  }

  /**
   *
   *
   * @returns Array
   * @memberof storage
   */
  get() {
    return this.parseJSON(localStorage.getItem(this.key));
  }

  /**
   *
   *
   * @param {Array} value
   * @memberof storage
   */
  set(value) {
    const storage = this.get();
    const newStorage = storage !== null ? [...value] : value;
    if (newStorage.length > 5) {
      newStorage.shift();
    }
    localStorage.setItem(this.key, this.stringify(new Set(newStorage)));
  }
}

export default new storage("folder");
