class Storage {
  constructor(key) {
    this.key = key;
  }

  stringify(value) {
    return JSON.stringify(value);
  }

  parseJSON(value) {
    return JSON.parse(value);
  }

  get() {
    return this.parseJSON(window.localStorage.getItem(this.key));
  }

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
