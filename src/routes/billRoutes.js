import express from "express";
import {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/billController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import { createBillSchema } from "../validations/billValidation.js";

const router = express.Router();

// 🔒 Protect all bill routes
router.use(protect);

router
  .route("/")
  .get(getBills)
  .post(validate(createBillSchema), createBill);

router
  .route("/:id")
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

export default router;
