const { Request, Response } = require('express')
const Book = require('../../models/Book')

/**
 * Stores book information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const book = await Book.create(req.body)

    // TODO :: Check drivers online in sockets ...

    res.json({
      message: 'Successfully booked a ride. Please wait for a driver to accept it.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}