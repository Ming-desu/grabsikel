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
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true 
  },
  picture: String
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

module.exports = mongoose.model('Admin', schema)