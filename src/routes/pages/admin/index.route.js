const express = require('express')
const Router = express.Router()

Router.get('', (req, res) => res.redirect('/admin/commuters'))
Router.use('/auth', require('./auth.route'))
Router.use('/commuters', require('./commuters.route'))
Router.use('/drivers', require('./drivers.route'))
Router.use('/users', require('./users.route'))

module.exports = Router