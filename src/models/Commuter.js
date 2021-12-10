const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: {
    first_name: {
      type: String,
      required: true
    },
    middle_name: String,
    last_name: {
      type: String,
      required: true
    }
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  picture: String,
  contact_number: {
    type: String, 
    required: true
  },
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

module.exports = mongoose.model('Commutersex', schema)