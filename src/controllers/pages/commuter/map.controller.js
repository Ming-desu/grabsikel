const { Request, Response } = require('express')
const axios = require('axios')
const ActiveDriver = require('../../../models/ActiveDriver')
const DriverEventEmitter = require('../../../utils/websockets/DriverEventEmitter')

/**
 * Shows index page for map
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('commuter/map/index.twig')
}

/**
 * Stores book information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const {
      source,
      destination,
      directions,
      distance,
      duration,
      fare,
      _id
    } = req.body

    const { data: { message, sub } } = await axios.post('/api/books', {
      ride: {
        source,
        destination,
        directions,
        fare,
        distance,
        duration
      },
      commuter: _id
    }, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    const activeDrivers = await ActiveDriver.where({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: source.coordinates 
          },
          $maxDistance: 1000 * 10 // 10km
        }
      }
    })

    if (activeDrivers.length <= 0) {
      throw new Error('No drivers available.')
    }

    DriverEventEmitter.emit('book', activeDrivers, sub, res.locals.AUTHENTICATED_USER)

    res.json({
      message: 'ok',
      sub
    })
  }
  catch(err) {
    console.log(err)
    let errors = [err.message]

    if (err.response && err.response.data) {
      errors = err.response.data.errors
    }

    res.status(400).json({
      errors
    })
  }
}