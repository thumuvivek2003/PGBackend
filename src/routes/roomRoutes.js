import express from "express";
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createRoomSchema,
  updateRoomSchema,
} from "../validations/roomValidation.js";

const router = express.Router();

// 🔒 Protect all room routes
router.use(protect);

router
  .route("/")
  .get(getRooms)
  .post(validate(createRoomSchema), createRoom);

router
  .route("/:id")
  .get(getRoom)
  .put(validate(updateRoomSchema), updateRoom)
  .delete(deleteRoom);

export default router;
