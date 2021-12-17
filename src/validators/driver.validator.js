const Joi = require('joi')

const schema = Joi.object().keys({
  _id: Joi.string(),
  profile: Joi.object().keys({
    name: Joi.object().keys({
      first_name: Joi.string().max(255).required().label('First name'),
      middle_name: Joi.string().max(255).allow('', null).label('Middle name'),
      last_name: Joi.string().max(255).required().label('Last name')
    }),
    sex: Joi.string().required().label('Sex'),
    picture: Joi.string().allow(null).label('Picture')
  }),
  contact: Joi.object().keys({
    number: Joi.string().regex(/^(09|\+639)\d{9}$/).message('Please enter a valid phone number.').required().label('Contact number'),
    address: Joi.object().keys({
      street: Joi.string().max(255).allow('', null).label('Street'),
      barangay: Joi.string().max(255).required().label('Barangay'),
      municipality: Joi.string().max(255).required().label('Municipality'),
      province: Joi.string().max(255).required().label('Province')
    }),
  }),
  vehicle: Joi.object().keys({
    plate_number: Joi.string().required().label('Plate number'),
    franchise_number: Joi.string().required().label('Franchise number'),
    license_number: Joi.string().required().label('License number')
  }),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().allow(null).min(8).label('Password'),
  status: Joi.string().default('pending').label('Status')
})

module.exports = schema