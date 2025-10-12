import express from "express";
import {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
} from "../controllers/feeController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createFeeSchema,
  updateFeeSchema,
} from "../validations/feeValidation.js";

const router = express.Router();

// 🔒 Protect all fee routes
router.use(protect);

router
  .route("/")
  .get(getFees)
  .post(validate(createFeeSchema), createFee);

router
  .route("/:id")
  .get(getFee)
  .put(validate(updateFeeSchema), updateFee)
  .delete(deleteFee);

export default router;
