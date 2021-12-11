const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows login page for admin
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('admin/auth/index.twig')
}

/**
 * Login user to the system
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.login = async function(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Invalid username or password.')
    }

    const { data: { token, refresh_token, message } } = await axios.post('/api/auth/admin/login', { email, password })
    
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    })

    res.cookie('refresh_token', refresh_token, {
      maxAge: 1000 * 60 * 60 * 3,
      httpOnly: true
    })

    res.json({
      token,
      refresh_token,
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
 * Logouts user from the system
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.logout = function(req, res) {
  res.cookie('token', '', {
    maxAge: -1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  })

  res.cookie('refresh_token', '', {
    maxAge: -1000 * 60 * 60 * 3,
    httpOnly: true
  })

  res.redirect('/admin/auth/login')
}