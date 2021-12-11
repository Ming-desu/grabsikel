const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/admin/auth.controller')

Router.get('/login', controller.index)
Router.post('/login', controller.login)

module.exports = Router