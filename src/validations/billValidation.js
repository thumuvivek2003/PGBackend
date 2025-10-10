const Joi = require('joi');

exports.createBillSchema = Joi.object({
  type: Joi.string().valid('electricity', 'water', 'maintenance').required().messages({
    'any.required': 'Bill type is required'
  }),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required().messages({
    'any.required': 'Month is required',
    'string.pattern.base': 'Month format should be YYYY-MM'
  }),
  amount: Joi.number().min(0).required().messages({
    'any.required': 'Amount is required'
  }),
  shared_between: Joi.array().items(Joi.string()),
  remarks: Joi.string().trim().allow('')
});
