const Joi = require('joi')

const schema = Joi.object().keys({
  _id: Joi.string(),
  name: Joi.object().keys({
    first_name: Joi.string().max(255).required().label('First name'),
    middle_name: Joi.string().max(255).allow('', null).label('Middle name'),
    last_name: Joi.string().max(255).required().label('Last name')
  }),
  sex: Joi.string().required().label('Sex'),
  picture: Joi.string().label('Picture'),
  email: Joi.string().email().label('Email'),
  password: Joi.string().min(8).label('Password')
})

module.exports = schema