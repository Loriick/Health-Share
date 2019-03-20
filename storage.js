/**
 *
 *
 * @class Storage
 */
class Storage {
  /**
   *Creates an instance of Storage.
   * @param {String} key
   * @memberof Storage
   */
  constructor(key) {
    this.key = key;
  }
  /**
   *
   *
   * @param {String} value
   * @returns json
   * @memberof Storage
   */
  stringify(value) {
    return JSON.stringify(value);
  }

  /**
   *
   *
   * @param {String} value
   * @returns
   * @memberof Storage
   */
  parseJSON(value) {
    return JSON.parse(value);
  }

  /**
   *
   *
   * @returns array
   * @memberof Storage
   */
  get() {
    return this.parseJSON(window.localStorage.getItem(this.key));
  }

  /**
   *
   *
   * @param {array} value
   * @memberof Storage
   */
  set(value) {
    const storage = this.get();
    var newStorage = storage !== null ? [...value] : value;
    if (newStorage.length > 5) {
      newStorage.shift();
    }
    window.localStorage.setItem(this.key, this.stringify(newStorage));
  }
}

module.exports = Storage;
