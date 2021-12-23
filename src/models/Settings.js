const mongoose = require('mongoose')

const schema = mongoose.Schema({
  rate: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('settings', schema)