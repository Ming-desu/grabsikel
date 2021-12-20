const express = require('express')
const Router = express.Router()
const axios = require('axios')

Router.use('/auth', require('./auth.route'))

Router.use(async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error('Token not found. Please log in again.')
    }

    const { data: { token, refresh_token, sub } } = await axios.post(`/api/auth/verify${'r' in req.cookies ? '?r=true' : ''}`, { token: req.cookies.token })

    if (!req.cookies.refresh_token || 'r' in req.cookies) {
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
      })
  
      res.cookie('refresh_token', refresh_token, {
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: true
      })
    }

    if ('r' in req.cookies) {
      res.cookie('r', '', {
        maxAge: -1000 * 60 * 60 * 1,
        httpOnly: true
      })
    }

    if (sub.type != 'driver') {
      return res.redirect(`/${sub.type == 'commuter' ? '' : sub.type}`)
    }

    res.locals.AUTHENTICATED_USER = sub
  }
  catch(err) {
    return res.redirect('/driver/auth')
  }

  next()
})

const Book = require('../../../models/Book')
const moment = require('moment')

Router.use(async (req, res, next) => {
  res.locals.CURRENT_BOOK = await Book.findOne({
    driver: res.locals.AUTHENTICATED_USER._id,
    created_at: {
      $gt: moment().subtract(1, 'day').endOf('day').toDate(),
      $lt: moment().add(1, 'day').startOf('day').toDate()
    },
    status: {
      $in: ['pending', 'accepted']
    }
  })
    .populate('commuter')

  next()
})

// Router.get('', (req, res) => res.redirect('/driver/commuters'))
// Router.use('/commuters', require('./commuters.route'))
// Router.use('/drivers', require('./drivers.route'))
// Router.use('/users', require('./users.route'))
Router.get('', (req, res) => res.redirect('/driver/map'))
Router.use('/map', require('./map.route'))
Router.use('/profile', require('./profile.route'))

module.exports = Router