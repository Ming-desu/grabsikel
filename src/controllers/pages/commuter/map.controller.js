const { Request, Response } = require('express')

/**
 * Shows index page for map
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('commuter/map/index.twig', { time: Date.now() })
}