const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/commuter/map.controller')

Router.get('', controller.index)
Router.post('/book', controller.store)

module.exports = Router