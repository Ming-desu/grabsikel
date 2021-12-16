const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/driver/profile.controller')

Router.get('', controller.index)

module.exports = Router