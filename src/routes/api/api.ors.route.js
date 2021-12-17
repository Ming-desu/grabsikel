const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/ors.controller')

Router.post('/matrix', controller.matrix)

module.exports = Router