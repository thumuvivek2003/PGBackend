const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { createRoomSchema, updateRoomSchema } = require('../validations/roomValidation');

router.use(protect);

router.route('/')
  .get(getRooms)
  .post(validate(createRoomSchema), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(validate(updateRoomSchema), updateRoom)
  .delete(deleteRoom);

module.exports = router;
