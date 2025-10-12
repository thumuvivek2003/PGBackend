import Joi from "joi";

export const createRoomSchema = Joi.object({
  room_no: Joi.string().required().trim().messages({
    "any.required": "Room number is required",
  }),
  rent: Joi.number().min(0).required().messages({
    "any.required": "Rent amount is required",
    "number.min": "Rent cannot be negative",
  }),
  capacity: Joi.number().min(1).required().messages({
    "any.required": "Capacity is required",
    "number.min": "Capacity must be at least 1",
  }),
  type: Joi.string().valid("single", "double", "triple").required().messages({
    "any.required": "Room type is required",
  }),
  remarks: Joi.string().trim().allow(""),
});

export const updateRoomSchema = Joi.object({
  room_no: Joi.string().trim(),
  rent: Joi.number().min(0),
  capacity: Joi.number().min(1),
  occupied_count: Joi.number().min(0),
  type: Joi.string().valid("single", "double", "triple"),
  remarks: Joi.string().trim().allow(""),
});
