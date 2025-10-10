const express = require('express');
const router = express.Router();
const {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee
} = require('../controllers/feeController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createFeeSchema, updateFeeSchema } = require('../validations/feeValidation');

router.use(protect);

router.route('/')
  .get(getFees)
  .post(validate(createFeeSchema), createFee);

router.route('/:id')
  .get(getFee)
  .put(validate(updateFeeSchema), updateFee)
  .delete(deleteFee);

module.exports = router;
