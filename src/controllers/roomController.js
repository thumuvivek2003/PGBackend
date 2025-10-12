import Room from "../models/Room.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().lean();

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create room
// @route   POST /api/rooms
// @access  Private
export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
export const updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

// @desc    Soft delete room
// @route   DELETE /api/rooms/:id
// @access  Private
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room || room.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Room not found or already deleted",
    });
  }

  // 👇 Soft delete instead of hard delete
  room.isDeleted = true;
  room.deletedAt = new Date();
  await room.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Room soft deleted successfully",
    data: room,
  });
});
