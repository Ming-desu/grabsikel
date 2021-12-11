const express = require('express')
const Router = express.Router()

const controller = require('../../controllers/api/commuters.controller')

Router.route('')
  .get(controller.read)
  .post(controller.store)
  .patch(controller.update)
  .delete(controller.delete)

Router.get('/:id', controller.find)

module.exports = Router