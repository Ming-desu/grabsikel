class Commuter {
  constructor() {
    this.list = new Map()
  }

  add(_id, object) {
    if (this.list.has(_id.toString())) {
      return
    }

    this.list.set(_id.toString(), object)
  }

  getAll() {
    return this.list
  }

  get(_id) {
    if (!this.list.has(_id.toString())) {
      return null
    }

    return this.list.get(_id.toString())
  }

  remove(_id) {
    if (!this.list.has(_id.toString())) {
      return
    }

    this.list.delete(_id.toString())
  }
}

module.exports = new Commuter()