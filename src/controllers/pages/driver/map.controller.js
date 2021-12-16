const { Request, Response } = require('express')

/**
 * Shows index page for map
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  return res.render('driver/map/index.twig', { time: Date.now() })
}