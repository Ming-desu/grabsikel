const { Request, Response } = require('express')
const schema = require('../../validators/driver.validator')
const { getErrors } = require('../../utils/joi.helper')
const bcrypt = require('bcrypt')

const Driver = require('../../models/Driver')

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
    const drivers = await Driver.find({
      $or: [
        { 'profile.name.first_name': new RegExp(q) },
        { 'profile.name.last_name': new RegExp(q) },
        { 'account.username': new RegExp(q) }
      ]
    })
      .select('-account.password')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort('profile.name.first_name')

    res.status(200).json({
      sub: drivers
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Finds driver information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.find = async function(req, res) {
  try {
    const id = req.params.id

    const driver = await Driver.findById(id).select('-account.password')

    if (!driver) {
      throw new Error('Driver does not exists.')
    }

    res.json({
      sub: driver
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Stores driver information to the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.store = async function(req, res) {
  const result = schema.validate(req.body)

  if (result.error != null) {
    return res.status(400).json({
      errors: getErrors(result.error)
    })
  } 

  try {
    const driver = new Driver()
    driver.set(req.body)

    await driver.save()

    res.status(200).json({
      message: 'Successfully added a new driver.',
      status: 'pending'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Updates driver information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.update = async function(req, res) {
  const result = schema.validate(req.body)

  if (result.error != null) {
    return res.status(400).json({
      errors: getErrors(result.error)
    })
  } 

  try {
    const { 
      profile,
      contact,
      vehicle,
      account
    } = req.body

    const driver = await Driver.findById(req.body._id)

    if (!driver) {
      throw new Error('Driver does not exists.')
    }

    driver.set({
      profile,
      contact,
      vehicle,
    })

    if (account && account.status) {
      driver.account.status = account.status
    }

    if (account && account.username) {
      driver.account.username = account.username
    }

    if (account && account.password) {
      const password_hash = bcrypt.hashSync(account.password, 10)

      driver.account.password = password_hash
    }

    await driver.save()

    res.json({
      message: 'Successfully updated a driver.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Deletes driver information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.delete = async function(req, res) {
  try {
    const id = req.body.id

    const driver = await Driver.findById(id).select('-account.password')

    if (!driver) {
      throw new Error('Driver does not exists.')
    }

    await driver.delete()

    res.json({
      message: 'Successfully deleted a driver.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}