const express = require('express')
const Router = express.Router()

const controller = require('../../../controllers/pages/admin/auth.controller')

Router.get('', (req, res) => res.redirect('/admin/auth/login'))
Router.get('/login', controller.index)
Router.post('/login', controller.login)
Router.get('/logout', controller.logout)

module.exports = Router