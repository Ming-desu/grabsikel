const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../../config')

Router.use('/auth', require('./api.auth.route'))

Router.use((req, res, next) => {
  try {
    const bearer = req.header('Authorization')

    if (!bearer) {
      throw new Error('Token not found.')
    }

    const token = bearer.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })

    req.api_user = decoded.sub
  }
  catch(err) {
    return res.status(400).json({
      errors: [err.message]
    })
  }

  next()
})
Router.use('/drivers', require('./api.driver.route'))
Router.use('/commuters', require('./api.commuter.route'))
Router.use('/admins', require('./api.admin.route'))

module.exports = Router