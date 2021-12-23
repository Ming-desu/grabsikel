const { Request, Response } = require('express')
const axios = require('axios')
const { ORS_SECRET } = require('../../../config')
const DriverEventEmitter = require('../../utils/websockets/DriverEventEmitter')
const Settings = require('../../models/Settings')

/**
 * Gets matrix for source and destination
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.matrix = async function(req, res) {
  try {
    const { locations } = req.body

    if (locations.length != 2) {
      throw new Error('Locations provided should be an array of coordinates for source and destination. Format: [[source_longitude, source, latitude], [destination_longitude, destination_latitude]]')
    }

    const { data } = await axios.post('https://api.openrouteservice.org/v2/matrix/cycling-regular', {
      locations,
      destinations: [1],
      sources: [0],
      metrics: ['distance', 'duration'],
      units: 'km'
    }, {
      headers: {
        Authorization: ORS_SECRET
      }
    })

    let fare = 15 + (Math.ceil(data.distances[0]) * 5)

    if (DriverEventEmitter.getCommuters().length > DriverEventEmitter.getDrivers().length) {
      const settings = await Settings.findOne({ })
      fare += (fare * settings.rate)
    }

    res.json({
      message: 'ok',
      distance: data.distances[0][0],
      duration: data.durations[0][0] * 1.25,
      fare
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Gets direction 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.directions = async function(req, res) {
  try {
    const { coordinates } = req.body

    if (coordinates.length < 2) {
      throw new Error('Locations provided should be an array of coordinates and at least have 2 items. Format: [[source_longitude, source, latitude], [destination_longitude, destination_latitude]]')
    }

    const { data } = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      coordinates
    }, {
      headers: {
        Authorization: ORS_SECRET
      }
    })

    res.json({
      message: 'ok',
      geoJSON: data
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}