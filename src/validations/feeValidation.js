const Joi = require('joi');

exports.createFeeSchema = Joi.object({
  tenant_id: Joi.string().required().messages({
    'any.required': 'Tenant ID is required'
  }),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required().messages({
    'any.required': 'Month is required',
    'string.pattern.base': 'Month format should be YYYY-MM'
  }),
  rent_amount: Joi.number().min(0).required().messages({
    'any.required': 'Rent amount is required'
  }),
  paid_amount: Joi.number().min(0).default(0),
  payment_date: Joi.date()
});

exports.updateFeeSchema = Joi.object({
  paid_amount: Joi.number().min(0),
  payment_date: Joi.date()
});
