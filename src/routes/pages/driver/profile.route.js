const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/driver/profile.controller')

Router.get('', controller.index)
Router.patch('', controller.update)

module.exports = Router