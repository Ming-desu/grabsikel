const { Request, Response } = require('express')
const axios = require('axios')

/**
 * Shows index page for books
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  res.render('admin/books/index.twig')
}

/**
 * Reads books from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
 exports.read = async function(req, res) {
  const q = req.query.q || ''

  try {
    const { data: { sub } } = await axios.get(`/api/books?q=${q}`, {
      headers: {
        'Authorization': `Bearer ${req.cookies.token}`
      }
    })

    res.json({
      message: 'ok',
      sub
    })
  }
  catch(err) {
    let errors = [err.message]

    if (err.response && err.response.data) {
      errors = err.response.data.errors
    }

    res.status(400).json({
      errors
    })
  }
}