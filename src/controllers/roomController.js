import { parsePaging, ok, created, noContent } from "./helpers.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getRooms = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.pgId) filter.pgId = req.query.pgId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.floor) filter.floor = Number(req.query.floor);
  const [items, total] = await Promise.all([
    Room.find(filter).skip(skip).limit(limit).lean(),
    Room.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getRoom = asyncHandler(async (req, res) => {
  const item = await Room.findById(req.params.id).lean();
  return ok(res, item);
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  return created(res, room);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const item = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, item);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Nested beds under room
export const getBedsByRoom = asyncHandler(async (req, res) => {
  const items = await Bed.find({ roomId: req.params.id }).lean();
  return ok(res, items);
});

export const createBedForRoom = asyncHandler(async (req, res) => {
  const bed = await Bed.create({ ...req.body, roomId: req.params.id });
  return created(res, bed);
});
