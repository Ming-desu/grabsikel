const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/admin/settings.controller')
Router.get('', controller.index)
Router.post('', controller.store)

module.exports = Router