const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/uploads.controller')

Router.get('/:file', controller.index)
Router.post('', controller.upload)

module.exports = Router