const EventEmitter = require('events').EventEmitter
const Book = require('../../models/Book')
const Commuter = require('../../models/Commuter')
const ActiveDriver = require('../../models/ActiveDriver')
const axios = require('axios')

class DriverEventEmitter extends EventEmitter {
  constructor() {
    super()
    this.io = null
    this.drivers = null
    this.commuters = null
  }

  setDrivers(drivers) {
    this.drivers = drivers
  }

  getDrivers() {
    return this.drivers
  }

  setCommuters(commuters) {
    this.commuters = commuters
  }

  getCommuters() {
    return this.commuters
  }

  setIO(io) {
    this.io = io
  }

  getIO() {
    return this.io
  }
}

let queue = []
const emitter = new DriverEventEmitter()

emitter.on('book', (drivers, book, user) => {
  queue = []

  for (let i = drivers.length - 1; i >= 0; i--) {
    queue.push(drivers[i])
  }

  let queueDriver = queue.pop()
  let driver = null

  do {
    driver = emitter.getDrivers().get(queueDriver.user.toString())

    if (driver == undefined) {
      queueDriver = queue.pop()
    }
    else {
      break
    }
  } while (queue.length > 0)

  if (!driver) {
    return
  }

  emitter
    .getIO()
    .of('/drivers')
    .to(driver.socket_id)
    .emit('prompt', book, user)
})

emitter.on('assign book', async (book, driver_id) => {
  const commuters = emitter.getCommuters()
  const drivers = emitter.getDrivers()

  const commuter = commuters.get(book.commuter.toString())

  if (!commuter) {
    return
  }

  const driver = drivers.get(driver_id.toString())
  
  try {
    const savedBook = await Book.findById(book._id)

    const activeDriver = await ActiveDriver.findOne({ user: driver_id })
    const { data: { geoJSON } } = await axios.post('/api/ors/directions', {
      coordinates: [
        activeDriver.location.coordinates,
        savedBook.ride.source.coordinates,
        savedBook.ride.destination.coordinates
      ]
    })

    await savedBook.set({
      driver: driver_id,
      status: 'accepted',
      geoJSON
    }).save()

    console.log('Ride accepted')

    emitter.getIO()
      .of('/drivers')
      .to(driver.socket_id)
      .emit('ride accepted')

    emitter.getIO()
      .of('/commuters')
      .to(commuter.socket_id)
      .emit('ride accepted', driver.user)
  }
  catch(err) {
    console.log(err)
    console.log(err.response.data)
  }
})

emitter.on('re-assign book', async book => {
  try {
    if (queue.length == 0) {
      throw new Error('No drivers available.')
    }

    let queueDriver = queue.pop()
    let driver = null

    do {
      driver = emitter.getDrivers().get(queueDriver.user.toString())
  
      if (driver == undefined) {
        queueDriver = queue.pop()
      }
      else {
        break
      }
    } while (queue.length > 0)

    if (!driver) {
      throw new Error('No drivers available')
    }

    const commuter = await Commuter.findById(book.commuter)

    emitter
      .getIO()
      .of('/drivers')
      .to(driver.socket_id)
      .emit('prompt', book, commuter)
  }
  catch(err) {
    console.log(err.message)

    const commuter = emitter.getCommuters().get(book.commuter.toString())

    if (!commuter) {
      return
    }

    await Book.updateOne({
      _id: book._id
    }, {
      status: 'cancelled'
    })

    emitter
      .getIO()
      .of('/commuters')
      .to(commuter.socket_id)
      .emit('no drivers available')
  }
})

module.exports = emitter