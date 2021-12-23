const { Request, Response } = require('express')
const Book = require('../../../models/Book')

/**
 * Shows index page of dashboard
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = async function(req, res) {
  try {
    res.locals.rides = await Book.find({
      commuter: res.locals.AUTHENTICATED_USER._id
    })
      .sort('desc')
      .populate('driver')
  }
  catch(err) {
    res.locals.rides = []
  }

  res.render('commuter/dashboard/index.twig')
}