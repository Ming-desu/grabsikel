const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows index page for map
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('commuter/map/index.twig', { time: Date.now() })
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
      _id
    } = req.body

    const { data: { distance, duration, fare } } = await axios.post('/api/ors/matrix', {
      locations: [source.coordinates, destination.coordinates]
    })

    res.json({
      message: 'ok',
      distance,
      duration,
      fare
    })
  }
  catch(err) {
    let errors = [err.message]

    if (err.response && err.response.data) {
      errors = err.response.data.errors
    }

    res.status(400).json({
      errors
    })
  }
}