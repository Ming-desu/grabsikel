const { Request, Response } = require('express')
const schema = require('../../validators/admin.validator')
const { getErrors } = require('../../utils/joi.helper')
const bcrypt = require('bcrypt')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

const Admin = require('../../models/Admin')
const { ROOT_DIR } = require('../../../config')

/**
 * Reads admin information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.read = async function(req, res) {
  const q = req.query.q || ''
  const page = req.query.page || 1
  const limit = 30

  try {
    const admins = await Admin.find({
      $or: [
        { 'name.first_name': new RegExp(q) },
        { 'name.last_name': new RegExp(q) },
        { 'email': new RegExp(q) }
      ]
    })
      .select('-password')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort('name.first_name')

    res.status(200).json({
      sub: admins
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Finds admin information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.find = async function(req, res) {
  try {
    const id = req.params.id

    const admin = await Admin.findById(id).select('-password')

    if (!admin) {
      throw new Error('Admin does not exists.')
    }

    res.json({
      sub: admin
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Stores admin information to the database
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
    const admin = new Admin()

    const exists = await Admin.findOne({
      email: req.body.email
    })

    if (exists) {
      throw new Error('Email already exists.')
    }

    admin.set(req.body)

    const password_hash = bcrypt.hashSync(admin.password, 10)
    
    admin.password = password_hash

    await admin.save()

    res.status(200).json({
      message: 'Successfully added a new admin.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Updates admin information from the database
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
      email,
      picture
    } = req.body

    const admin = await Admin.findById(req.body._id)

    const prev_picture = admin.picture

    if (!admin) {
      throw new Error('Admin does not exists.')
    }

    const exists = await Admin.findOne({
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

    admin.set({
      name,
      sex,
      email,
      picture
    })

    if (req.body.password) {
      const password_hash = bcrypt.hashSync(req.body.password, 10)

      admin.password = password_hash
    }

    if (req.body.picture && prev_picture) {
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

    await admin.save()

    res.json({
      message: 'Successfully updated an admin.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}

/**
 * Deletes admin information from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.delete = async function(req, res) {
  try {
    const id = req.body.id

    if (id == req.api_user._id) {
      throw new Error('Cannot delete own account.')
    }

    const admin = await Admin.findById(id).select('-password')

    if (!admin) {
      throw new Error('Admin does not exists.')
    }

    if (admin.picture) {
      const chunks = admin.picture.split('.')
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

    await admin.delete()

    res.json({
      message: 'Successfully deleted an admin.'
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}