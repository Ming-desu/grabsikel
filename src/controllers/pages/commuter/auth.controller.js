const { Request, Response } = require('express')
const axios = require('axios')
const Commuter = require('./../../../models/Commuter')
const bcrypt = require('bcrypt')

/**
 * Shows login page for admin
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('commuter/auth/index.twig')
}

/**
 * Shows register page for commuter 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.register = function(req, res) {
  res.render('commuter/auth/register.twig')
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

    const { data: { token, refresh_token, message } } = await axios.post('/api/auth/commuter/login', { email, password })
    
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
 * Register commuter to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.signup = async function(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Please fill out all the required fields.')
    }

    const commuter = new Commuter()

    const exists = await Commuter.findOne({
      email: req.body.email
    })

    if (exists) {
      throw new Error('Email already exists.')
    }

    commuter.set(req.body)

    const password_hash = bcrypt.hashSync(commuter.password, 10)
    
    commuter.password = password_hash

    await commuter.save()

    res.status(200).json({
      message: 'Successfully added a new commuter.'
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

  res.redirect('/auth/login')
}