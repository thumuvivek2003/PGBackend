import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email().required().trim().lowercase().messages({
    "any.required": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  phone: Joi.string().required().trim().messages({
    "any.required": "Phone number is required",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  role: Joi.string().valid("owner", "manager").default("owner"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "any.required": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
