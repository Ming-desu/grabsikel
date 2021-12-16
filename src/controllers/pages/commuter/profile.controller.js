const { Request, Response } = require('express')

/**
 * Shows index page for commuter profile
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('commuter/profile/index.twig')
}