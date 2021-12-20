const mongoose = require('mongoose')

const schema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'Driver'
  },
  location: {
    text: String,
    coordinates: {
      type: [Number, Number],
      index: '2dsphere'
    }
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('ActiveDriver', schema)