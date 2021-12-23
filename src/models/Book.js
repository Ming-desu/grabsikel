const mongoose = require('mongoose')

const schema = mongoose.Schema({
  ride: {
    source: {
      coordinates: [Number, Number],
      text: String
    },
    destination: {
      coordinates: [Number, Number],
      text: String
    },
    directions: String,
    fare: Number,
    distance: Number,
    duration: Number
  },
  commuter: {
    type: mongoose.Types.ObjectId,
    ref: 'Commuter'
  },
  driver: {
    type: mongoose.Types.ObjectId,
    ref: 'Driver'
  },
  geoJSON: Object,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled', 'completed'],
    default: 'pending'
  },
  feedback: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Book', schema)