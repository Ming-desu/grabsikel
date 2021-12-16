const { Request, Response } = require('express')

/**
 * Shows index page for driver profile
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('driver/profile/index.twig')
}