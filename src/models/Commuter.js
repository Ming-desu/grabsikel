const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: {
    first_name: String,
    middle_name: String,
    last_name: String
  },
  sex: {
    type: String,
    enum: ['Male', 'Female']
  },
  picture: String,
  contact_number: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

schema.virtual('full_name').get(function() {
  return [this.name.first_name, this.name.last_name].join(' ')
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Commuter', schema)