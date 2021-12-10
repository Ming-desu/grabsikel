const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/auth.controller')

Router.post('/:type/login', controller.login)
Router.post('/verify', controller.verifyToken)

module.exports = Router