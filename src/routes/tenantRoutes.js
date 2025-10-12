import express from "express";
import {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
} from "../controllers/tenantController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createTenantSchema,
  updateTenantSchema,
} from "../validations/tenantValidation.js";

const router = express.Router();

// 🔒 Protect all tenant routes
router.use(protect);

router
  .route("/")
  .get(getTenants)
  .post(validate(createTenantSchema), createTenant);

router
  .route("/:id")
  .get(getTenant)
  .put(validate(updateTenantSchema), updateTenant)
  .delete(deleteTenant);

export default router;
