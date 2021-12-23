const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows index page for driver profile
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('driver/profile/index.twig')
}

/**
 * Updates commuter information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.update = async function(req, res) {
  try {
    const { data: { message } } = await axios.patch('/api/drivers', req.body, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.cookie('r', '', {
      maxAge: 1000 * 60 * 60 * 1,
      httpOnly: true
    })

    res.json({
      message
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