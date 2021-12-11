const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/admin/commuters.controller.js')

Router.get('', controller.index)
Router.get('/read', controller.read)

module.exports = Router