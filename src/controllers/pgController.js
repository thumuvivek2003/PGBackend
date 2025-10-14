import { parsePaging, ok, created, noContent } from "./helpers.js";
import Pg from "../models/Pg.js";
import Room from "../models/Room.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// CRUD
export const getPgs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const q = req.query.q?.trim();
  const filter = q ? { pgName: { $regex: q, $options: "i" } } : {};
  const [items, total] = await Promise.all([
    Pg.find(filter).skip(skip).limit(limit).lean(),
    Pg.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getPg = asyncHandler(async (req, res) => {
  const item = await Pg.findById(req.params.id).lean();
  return ok(res, item);
});

export const createPg = asyncHandler(async (req, res) => {
  const item = await Pg.create(req.body);
  return created(res, item);
});

export const updatePg = asyncHandler(async (req, res) => {
  const item = await Pg.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, item);
});

export const deletePg = asyncHandler(async (req, res) => {
  await Pg.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Nested: rooms under PG
export const getRoomsByPg = asyncHandler(async (req, res) => {
  const items = await Room.find({ pgId: req.params.pgId }).lean();
  return ok(res, items);
});

export const createRoomForPg = asyncHandler(async (req, res) => {
  const payload = { ...req.body, pgId: req.params.pgId };
  const room = await Room.create(payload);
  return created(res, room);
});
