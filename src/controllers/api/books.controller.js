const { Request, Response } = require('express')
const Book = require('../../models/Book')
const moment = require('moment')

/**
 * Reads driver information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.read = async function(req, res) {
  const q = req.query.q || ''
  const page = req.query.page || 1
  const limit = 30

  try {
    let books = await Book.aggregate([
      {
        $lookup: {
          from: 'drivers',
          localField: 'driver',
          foreignField: '_id',
          as: 'drivers'
        }
      },
      {
        $lookup: {
          from: 'commuters',
          localField: 'commuter',
          foreignField: '_id',
          as: 'commuters'
        }
      },
      {
        $project: {
          driver: {
            $mergeObjects: [
              {
                $arrayElemAt: [
                  '$drivers',
                  {
                    $indexOfArray: ['$drivers._id', '$driver']
                  }
                ]
              }
            ]
          },
          commuter: {
            $mergeObjects: [
              {
                $arrayElemAt: [
                  '$commuters',
                  {
                    $indexOfArray: ['$commuters._id', '$commuter']
                  }
                ]
              }
            ]
          },
          ride: 1,
          status: 1,
          feedback: 1,
        }
      },
      {
        $match: {
          $or: [
            { 'driver.profile.name.first_name': new RegExp(q) },
            { 'driver.profile.name.last_name': new RegExp(q) },
            { 'commuter.name.first_name': new RegExp(q) },
            { 'commuter.name.last_name': new RegExp(q) },
            { 'status': new RegExp(q) }
          ]
        }
      },
      {
        $limit: limit
      },
      {
        $skip: (page - 1) * limit
      }
    ])

    books = books.map(b => {
      b.commuter.password = null
      b.driver.password = null
      b.formatted_date = moment(b.created_at).format('lll')
      return b
    })

    res.status(200).json({
      sub: books
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Stores book information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const book = await Book.create(req.body)

    res.json({
      message: 'Successfully booked a ride. Please wait for a driver to accept it.',
      sub: book
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}