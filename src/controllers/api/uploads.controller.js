const { Request, Response } = require('express')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { ROOT_DIR } = require('../../../config')

/**
 * Gets uploaded images from the filesystem and resize it
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = function(req, res) {
  const { file } = req.params
  const { width, height } = req.query
  
  if (!file || !width || !height) {
    return res.status(400).send('Missing arguments, check the parameters.')
  }

  const file_path = path.join(ROOT_DIR, 'public/uploads/', file)

  if (!fs.existsSync(file_path)) {
    return res.status(404).send('File does not exists.')
  }

  const chunks = file.split('.')
  const extension = chunks.pop()
  const file_name = `${chunks.join('.')}-${width}x${height}.${extension}`
  const tmp_path = path.join(ROOT_DIR, 'public/uploads', file_name)

  if (!extension || ['jpg', 'png'].indexOf(extension) == -1) {
    return res.status(400).send('Only supports image file types .jpg and .png.')
  }

  if (fs.existsSync(tmp_path)) {
    return res.sendFile(tmp_path)
  }

  sharp(file_path)
    .resize(parseInt(width), parseInt(height))
    .toFile(tmp_path, (err, info) => {
      if (!err) {
        res.sendFile(tmp_path)
      }
    })
}

/**
 * Uploads image to the server
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.upload = async function(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length == 0) {
      throw new Error('No files were uploaded.')
    }

    const picture = req.files.picture
    const extension = picture.name.split('.').pop()

    if (['jpg', 'png'].indexOf(extension.toLowerCase()) == -1) {
      throw new Error('Only accepting image format in .jpg and .png.')
    }

    if (!fs.existsSync(path.join(ROOT_DIR, 'public/uploads'))) {
      fs.mkdirSync(path.join(ROOT_DIR, 'public/uploads/'))
    }

    const file_name = uuidv4() + '.' + extension
    const upload_path = path.join(ROOT_DIR, 'public/uploads/', file_name)

    picture.mv(upload_path, err => {
      if (!err) {
        return res.json({
          path: file_name
        })
      }
      else {
        throw new Error(err.message)
      }
    })
  }
  catch(err) {
    res.status(400).json({
      errors: [err.message]
    })
  }
}