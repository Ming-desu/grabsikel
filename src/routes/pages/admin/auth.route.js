const express = require('express')
const Router = express.Router()
const axios = require('axios')

const controller = require('../../../controllers/pages/admin/auth.controller')

Router.get('/logout', controller.logout)

Router.use(async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error('Token not found.')
    }

    await axios.post('/api/auth/verify', { token: req.cookies.token })
    return res.redirect('/admin')
  }
  catch(err) {
    next()
  }
})

Router.get('', (req, res) => res.redirect('/admin/auth/login'))
Router.get('/login', controller.index)
Router.post('/login', controller.login)

module.exports = Router