const { Request, Response } = require('express')
const schema = require('../../validators/commuter.validator')
const { getErrors } = require('../../utils/joi.helper')
const bcrypt = require('bcrypt')

const Commuter = require('../../models/Commuter')

/**
 * Reads commuter information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.read = async function(req, res) {
  const q = req.query.q || ''
  const page = req.query.page || 1
  const limit = 30

  try {
    const commuters = await Commuter.find({
      $or: [
        { 'name.first_name': new RegExp(q) },
        { 'name.last_name': new RegExp(q) },
        { 'username': new RegExp(q) }
      ]
    })
      .select('-password')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort('name.first_name')

    res.status(200).json({
      sub: commuters
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Finds commuter information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.find = async function(req, res) {
  try {
    const id = req.params.id

    const commuter = await Commuter.findById(id).select('-password')

    if (!commuter) {
      throw new Error('Commuter does not exists.')
    }

    res.json({
      sub: commuter
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Stores commuter information to the database
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
    const commuter = new Commuter()

    const exists = await Commuter.findOne({
      email: req.body.email
    })

    if (exists) {
      throw new Error('Email already exists.')
    }

    commuter.set(req.body)

    const password_hash = bcrypt.hashSync(commuter.password, 10)
    
    commuter.password = password_hash

    await commuter.save()

    res.status(200).json({
      message: 'Successfully added a new commuter.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Updates commuter information from the database
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
      name,
      sex,
      contact_number,
      email
    } = req.body

    const commuter = await Commuter.findById(req.body._id)

    if (!commuter) {
      throw new Error('Commuter does not exists.')
    }

    const exists = await Commuter.findOne({
      $and: [
        { email },
        {
          _id: {
            $ne: req.body._id
          }
        }
      ]
    })

    if (exists) {
      throw new Error('Email already exists.')
    }

    commuter.set({
      name,
      sex,
      contact_number,
      email
    })

    // TODO :: Update with file upload handling ...
    if (req.body.picture) {
      commuter.picture = req.body.picture
    }

    if (req.body.password) {
      const password_hash = bcrypt.hashSync(req.body.password, 10)

      commuter.password = password_hash
    }

    await commuter.save()

    res.json({
      message: 'Successfully updated a commuter.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Deletes commuter information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.delete = async function(req, res) {
  try {
    const id = req.body.id

    const commuter = await Commuter.findById(id).select('-password')

    if (!commuter) {
      throw new Error('Commuter does not exists.')
    }

    await commuter.delete()

    res.json({
      message: 'Successfully deleted a commuter.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}