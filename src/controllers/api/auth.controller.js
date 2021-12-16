const { Request, Response } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Admin = require('../../models/Admin')
const Commuter = require('../../models/Commuter')
const Driver = require('../../models/Driver')
const { JWT_SECRET } = require('../../../config')

/**
 * Log in user to the system
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.login = async function(req, res) {
  const type = req.params.type.toLowerCase()

  try {
    const {
      email,
      password
    } = req.body

    let user;

    if (type == 'admin') {
      user = await Admin.findOne({ email })
    }
    
    if (type == 'commuter') {
      user = await Commuter.findOne({ email })
    }

    if (type == 'driver') {
      user = await Driver.findOne({ email })

      if (user.status != 'accepted') {
        throw new Error('Account is not authorized to log in, please contact your administrator.')
      }
    }

    if (!user || !password || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid username or password.')
    }

    user.password = null

    const token = jwt.sign({
      sub: {
        ...user.toJSON(),
        type
      }
    }, JWT_SECRET, {
      expiresIn: '7d'
    })

    const refresh_token = jwt.sign({
      sub: Date.now()
    }, JWT_SECRET, {
      expiresIn: '3h'
    })

    res.json({
      message: 'ok',
      token,
      refresh_token
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Verifies the token
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.verifyToken = async function(req, res) {
  try {
    const flag = req.query.r || null
    const { token } = req.body
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })

    let sub = decoded.sub
    const type = sub.type.toLowerCase()

    if (flag) {
      if (type == 'admin') {
        sub = await Admin.findById(sub._id)
      }

      if (type == 'commuter') {
        sub = await Commuter.findById(sub._id)
      }

      if (type == 'driver') {
        sub = await Driver.findById(sub._id)
      }

      if (!sub) {
        throw new Error('User does not exists.')
      }

      sub.password = null

      sub = sub.toJSON()
    }

    const new_token = jwt.sign({
      sub: {
        ...sub,
        type
      }
    }, JWT_SECRET, {
      expiresIn: '7d'
    })

    const new_refresh_token = jwt.sign({
      sub: Date.now()
    }, JWT_SECRET, {
      expiresIn: '3h'
    })
    
    res.json({
      message: 'ok',
      token: new_token,
      refresh_token: new_refresh_token,
      sub
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}