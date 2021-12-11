const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/admin/drivers.controller')

Router.get('', controller.index)
Router.get('/create', controller.create)
Router.get('/read', controller.read)
Router.post('/create', controller.store)
Router.get('/:id/edit', controller.edit)
Router.patch('/:id/edit', controller.update)

module.exports = Router