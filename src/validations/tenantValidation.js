const Joi = require('joi');

exports.createTenantSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'any.required': 'Tenant name is required'
  }),
  phone: Joi.string().required().trim().messages({
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().trim().lowercase().allow(''),
  address: Joi.string().trim().allow(''),
  room_id: Joi.string().required().messages({
    'any.required': 'Room ID is required'
  }),
  join_date: Joi.date().default(Date.now),
  advance_amount: Joi.number().min(0).default(0),
  id_docs: Joi.array().items(Joi.string())
});

exports.updateTenantSchema = Joi.object({
  name: Joi.string().trim(),
  phone: Joi.string().trim(),
  email: Joi.string().email().trim().lowercase().allow(''),
  address: Joi.string().trim().allow(''),
  room_id: Joi.string(),
  leave_date: Joi.date(),
  advance_amount: Joi.number().min(0),
  status: Joi.string().valid('active', 'left')
});
