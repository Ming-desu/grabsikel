const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows index page for users
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('admin/users/index.twig')
}

/**
 * Shows create page for users
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.create = function(req, res) {
  res.render('admin/users/create.twig')
}

/**
 * Reads users information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.read = async function(req, res) {
  const q = req.query.q || ''

  try {
    const { data: { sub } } = await axios.get(`/api/admins?q=${q}`, {
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
 * Stores user information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const { data: { message } } = await axios.post('/api/admins', { ...req.body, password: '12345678' }, {
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

/**
 * Shows edit page for users
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.edit = async function(req, res) {
  try {
    const { id } = req.params

    const { data: { sub } } = await axios.get(`/api/admins/${id}`, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.locals.user = sub

    res.render('admin/users/edit.twig')
  }
  catch(err) {
    res.redirect('/admin/users')
  }
}

/**
 * Updates user information from the database 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.update = async function(req, res) {
  try {
    const { data: { message } } = await axios.patch('/api/admins', req.body, {
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

/**
 * Deletes user information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.delete = async function(req, res) {
  try {
    const { data: { message } } = await axios.delete('/api/admins', {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      },
      data: req.body
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