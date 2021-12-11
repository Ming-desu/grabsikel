const express = require('express')
const Router = express.Router()
const axios = require('axios')

Router.use('/auth', require('./auth.route'))

Router.use(async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error('Token not found. Please log in again.')
    }

    if (!req.cookies.refresh_token || req.cookies.r) {
      const { data: { token, refresh_token, sub } } = await axios.post(`/api/auth/verify${req.cookies.r ? '?r=true' : ''}`, { token: req.cookies.token })

      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
      })
  
      res.cookie('refresh_token', refresh_token, {
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: true
      })

      res.locals.AUTHENTICATED_USER = sub
    }

    if (req.cookies.r) {
      res.cookie('r', '', {
        maxAge: -1000 * 60 * 60 * 1,
        httpOnly: true
      })
    }
  }
  catch(err) {
    return res.redirect('/admin/auth')
  }

  next()
})

Router.get('', (req, res) => res.redirect('/admin/commuters'))
Router.use('/commuters', require('./commuters.route'))
Router.use('/drivers', require('./drivers.route'))
Router.use('/users', require('./users.route'))

module.exports = Router