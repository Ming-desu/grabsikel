const express = require('express')
const Router = express.Router()

Router.use('/drivers', require('./api.driver.route'))
Router.use('/commuters', require('./api.commuter.route'))
Router.use('/admins', require('./api.admin.route'))
Router.use('/auth', require('./api.auth.route'))

module.exports = Router