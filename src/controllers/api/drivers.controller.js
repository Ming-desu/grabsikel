const { Request, Response } = require('express')
const schema = require('../../validators/driver.validator')
const { getErrors } = require('../../utils/joi.helper')
const bcrypt = require('bcrypt')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const Driver = require('../../models/Driver')
const { ROOT_DIR } = require('../../../config')

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
        { 'email': new RegExp(q) }
      ]
    })
      .select('-password')
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

    const driver = await Driver.findById(id).select('-password')

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

    const exists = await Driver.findOne({
      email: req.body.email
    })

    if (exists) {
      throw new Error('Email already exists.')
    }

    driver.set(req.body)

    if (req.body.password) {
      const password_hash = bcrypt.hashSync(req.body.password, 10)

      driver.password = password_hash
    }
    else {
      const password_hash = bcrypt.hashSync("12345678", 10)

      driver.password = password_hash
    }

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
    if (!req.body.email) {
      throw new Error('Email is required.')
    }

    const { 
      profile: {
        name,
        sex,
        picture
      },
      contact,
      vehicle,
      email
    } = req.body

    const driver = await Driver.findById(req.body._id)

    const prev_picture = driver.profile.picture

    if (!driver) {
      throw new Error('Driver does not exists.')
    }

    const exists = await Driver.findOne({
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

    driver.set({
      profile: {
        ...driver.profile,
        name,
        sex
      },
      contact,
      vehicle,
      email
    })

    if (req.body.status) {
      driver.status = req.body.status
    }

    if (req.body.password) {
      const password_hash = bcrypt.hashSync(req.body.password, 10)

      driver.password = password_hash
    }

    if (picture) {
      driver.profile.picture = picture
    }

    if (picture != null && prev_picture != null) {
      const chunks = prev_picture.split('.')
      chunks.pop()

      const pattern = `${chunks.join('.')}*`

      glob(pattern, {
        cwd: path.join(ROOT_DIR, 'public/uploads')
      }, (err, files) => {
        if (err) {
          return
        }

        files.forEach(file => {
          if (fs.existsSync(path.join(ROOT_DIR, 'public/uploads', file))) {
            fs.unlinkSync(path.join(ROOT_DIR, 'public/uploads', file))
          }
        })
      })
    }  

    await driver.save()

    res.json({
      message: 'Successfully updated a driver.'
    })
  }
  catch(err) {
    console.log(err)
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

    const driver = await Driver.findById(id).select('-password')

    if (!driver) {
      throw new Error('Driver does not exists.')
    }

    if (driver.profile.picture) {
      const chunks = driver.profile.picture.split('.')
      chunks.pop()

      const pattern = `${chunks.join('.')}*`

      glob(pattern, {
        cwd: path.join(ROOT_DIR, 'public/uploads')
      }, (err, files) => {
        if (err) {
          return
        }

        files.forEach(file => {
          if (fs.existsSync(path.join(ROOT_DIR, 'public/uploads', file))) {
            fs.unlinkSync(path.join(ROOT_DIR, 'public/uploads', file))
          }
        })
      })
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