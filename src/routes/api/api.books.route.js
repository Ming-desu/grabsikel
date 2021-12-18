const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/books.controller')

Router.post('', controller.store)

module.exports = Router