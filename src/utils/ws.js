const { Server } = require('socket.io')

/**
 * SocketIO connection
 * 
 * @param {Server} io 
 */
module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('A user connected.')

    socket.on('disconnect', () => {
      console.log('A user disconnected.')
    })
  })

  return io
}