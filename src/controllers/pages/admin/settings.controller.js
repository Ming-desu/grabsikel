const { Request, Response } = require('express')
const Settings = require('../../../models/Settings')

/**
 * Shows index page for settings
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = async function(req, res) {
  try {
    res.locals.CURRENT_SETTINGS = await Settings.findOne({ })
  }
  catch(err) {
    res.locals.CURRENT_SETTINGS = null
  }

  res.render('admin/settings/index.twig')
}

/**
 * Stores information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  try {
    const { _id, rate } = req.body

    let settings;

    if (!_id) {
      settings = new Settings()
    }
    else {
      settings = await Settings.findById(_id)
    }

    settings.set({
      rate
    })

    await settings.save()

    res.json({
      message: 'ok',
      sub: settings
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