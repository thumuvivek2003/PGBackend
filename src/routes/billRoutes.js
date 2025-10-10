const express = require('express');
const router = express.Router();
const {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
} = require('../controllers/billController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createBillSchema } = require('../validations/billValidation');

router.use(protect);

router.route('/')
  .get(getBills)
  .post(validate(createBillSchema), createBill);

router.route('/:id')
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;
