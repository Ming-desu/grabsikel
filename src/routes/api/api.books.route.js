const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/books.controller')

Router.route('')
  .get(controller.read)
  
Router.post('', controller.store)

module.exports = Router