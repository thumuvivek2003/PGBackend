const express = require('express');
const router = express.Router();
const {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createTenantSchema, updateTenantSchema } = require('../validations/tenantValidation');

router.use(protect);

router.route('/')
  .get(getTenants)
  .post(validate(createTenantSchema), createTenant);

router.route('/:id')
  .get(getTenant)
  .put(validate(updateTenantSchema), updateTenant)
  .delete(deleteTenant);

module.exports = router;
