const { Server } = require('socket.io')
const cookie = require('cookie')
const axios = require('axios')

const Drivers = require('./Driver')
const Commuters = require('./Commuter')
const DriverEventEmitter = require('./DriverEventEmitter')

const ActiveDriver = require('../../models/ActiveDriver')
const Book = require('../../models/Book')

/**
 * SocketIO connection
 * 
 * @param {Server} io 
 */
module.exports = function(io) {
  DriverEventEmitter.setIO(io)

  io.of('/drivers').use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie)
    try {
      if (!'token' in cookies) {
        throw new Error('Token not found. Please log in again.')
      }

      const { data: { token, refresh_token, sub } } = await axios.post('/api/auth/verify', { token: cookies.token })
      socket.user = sub
    }
    catch(err) {
      return next(err)
    }

    next()
  })

  io.of('/drivers').on('connection', socket => {
    socket.on('active', async (coordinates, text) => {
      // console.log(coordinates, text)
      Drivers.add(socket.user._id, {
        socket_id: socket.id,
        user: socket.user
      })

      DriverEventEmitter.setDrivers(Drivers.getAll())

      await ActiveDriver.deleteOne({ user: socket.user._id })
      await ActiveDriver.create({
        user: socket.user._id,
        location: {
          coordinates,
          text
        }
      })
    })

    socket.on('inactive', async () => {
      Drivers.remove(socket.user._id)

      DriverEventEmitter.setDrivers(Drivers.getAll())
    })

    socket.on('disconnect', async () => {
      Drivers.remove(socket.user._id)

      DriverEventEmitter.setDrivers(Drivers.getAll())

      await ActiveDriver.deleteOne({ user: socket.user._id })
    })

    socket.on('driver sent message', (body, user_id) => {
      const commuter = Commuters.get(user_id)

      if (!commuter) {
        return
      }

      io.of('/commuters')
        .to(commuter.socket_id)
        .emit('driver sent message', body)
    })

    socket.on('accept book', (book) => {
      DriverEventEmitter.emit('assign book', book, socket.user._id)
    })

    socket.on('reject book', (book) => {
      DriverEventEmitter.emit('re-assign book', book)
    })

    socket.on('i am here', (commuter_id) => {
      const commuter = Commuters.get(commuter_id)

      if (!commuter) {
        return
      }

      io.of('/commuters').to(commuter.socket_id).emit('driver here')
    })

    socket.on('ride completed', async (book_id, commuter_id) => {
      const commuter = Commuters.get(commuter_id)
      const book = await Book.findById(book_id)
      book.set({
        status: 'completed'
      })

      await book.save()

      io.of('/commuters').to(commuter.socket_id).emit('ride completed')
      socket.emit('ride completed')
    })

    // DriverEventEmitter.setDrivers(Drivers.getAll())
  })

  io.of('/commuters').use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie)
    try {
      if (!'token' in cookies) {
        throw new Error('Token not found. Please log in again.')
      }

      const { data: { token, refresh_token, sub } } = await axios.post('/api/auth/verify', { token: cookies.token })
      socket.user = sub
    }
    catch(err) {
      return next(err)
    }

    next()
  })

  io.of('/commuters').on('connection', socket => {
    Commuters.add(socket.user._id, {
      socket_id: socket.id,
      user: socket.user
    })

    DriverEventEmitter.setCommuters(Commuters.getAll())

    socket.on('commuter sent message', (body, driver_id) => {
      const driver = Drivers.get(driver_id)

      if (!driver) {
        return
      }

      io.of('/drivers')
        .to(driver.socket_id)
        .emit('commuter sent message', body)
    })

    socket.on('disconnect', () => {
      Commuters.remove(socket.user._id)
      DriverEventEmitter.setCommuters(Commuters.getAll())
    })
  })

  return io
}