const mongoose = require('mongoose')

const schema = mongoose.Schema({
  profile: {
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
    picture: String
  },
  contact: {
    number: {
      type: String,
      required: true
    },
    address: {
      street: String,
      barangay: {
        type: String,
        required: true
      },
      municipality: {
        type: String,
        required: true
      },
      province: {
        type: String,
        required: true
      }
    },
  },
  vehicle: {
    plate_number: {
      type: String,
      required: true
    },
    franchise_number: {
      type: String,
      required: true
    },
    license_number: {
      type: String,
      required: true
    },
  },
  email: {
    type: String,
    required: true
  },
  password: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

schema.virtual('full_name').get(function() {
  return [this.profile.name.first_name, this.profile.name.last_name].join(' ')
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Driver', schema)