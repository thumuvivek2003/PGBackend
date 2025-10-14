import { parsePaging, ok, created, noContent } from "./helpers.js";
import Bed from "../models/Bed.js";
import Occupancy from "../models/Occupancy.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getBeds = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.roomId) filter.roomId = req.query.roomId;
  if (req.query.pgId) filter.pgId = req.query.pgId; // only if denormalized; else ignore
  if (req.query.isOccupied !== undefined) filter.isOccupied = req.query.isOccupied === "true";
  const [items, total] = await Promise.all([
    Bed.find(filter).skip(skip).limit(limit).lean(),
    Bed.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getBed = asyncHandler(async (req, res) => {
  const item = await Bed.findById(req.params.id).lean();
  return ok(res, item);
});

export const createBed = asyncHandler(async (req, res) => {
  const bed = await Bed.create(req.body);
  return created(res, bed);
});

export const updateBed = asyncHandler(async (req, res) => {
  const item = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, item);
});

export const deleteBed = asyncHandler(async (req, res) => {
  await Bed.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Availability helper
export const getBedAvailability = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = { bedId: req.params.id };
  if (from && to) {
    filter.$or = [
      { start_date: { $lt: new Date(to) }, end_date: { $gt: new Date(from) } },
      { start_date: { $lte: new Date(to) }, end_date: null }
    ];
  }
  const occs = await Occupancy.find(filter).lean();
  return ok(res, { occupancies: occs });
});
