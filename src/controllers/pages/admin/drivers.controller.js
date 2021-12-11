const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows index page of drivers
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('admin/drivers/index.twig')
}

/**
 * Shows create page for driver
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.create = function(req, res) {
  res.render('admin/drivers/create.twig')
}

/**
 * Reads drivers from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.read = async function(req, res) {
  const q = req.query.q || ''

  try {
    const { data: { sub } } = await axios.get(`/api/drivers?q=${q}`, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.json({
      message: 'ok',
      sub
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

/**
 * Stores driver information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const { data: { message, status } } = await axios.post('/api/drivers', req.body, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.json({
      message,
      status
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

/**
 * Shows edit page for drivers
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.edit = async function(req, res) {
  try {
    const { id } = req.params

    const { data: { sub } } = await axios.get(`/api/drivers/${id}`, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.locals.driver = sub

    res.render('admin/drivers/edit.twig')
  }
  catch(err) {
    res.redirect('/admin/drivers')
  }
}

/**
 * Updates driver information from the database 
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