import { parsePaging, ok, created, noContent } from "./helpers.js";
import Occupancy from "../models/Occupancy.js";
import Bed from "../models/Bed.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getOccupancies = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.tenantId) filter.tenantId = req.query.tenantId;
  if (req.query.bedId) filter.bedId = req.query.bedId;
  if (req.query.active !== undefined) {
    filter.end_date = req.query.active === "true" ? null : { $ne: null };
  }
  if (req.query.from && req.query.to) {
    filter.start_date = { $lt: new Date(req.query.to) };
    filter.$or = [{ end_date: null }, { end_date: { $gt: new Date(req.query.from) } }];
  }
  const [items, total] = await Promise.all([
    Occupancy.find(filter).skip(skip).limit(limit).lean(),
    Occupancy.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getOccupancy = asyncHandler(async (req, res) => {
  const item = await Occupancy.findById(req.params.id).lean();
  return ok(res, item);
});

export const createOccupancy = asyncHandler(async (req, res) => {
  // Optional: enforce one active occupancy per bed
  if (!req.body.end_date) {
    const active = await Occupancy.exists({ bedId: req.body.bedId, end_date: null });
    if (active) return res.status(409).json({ success: false, message: "Bed already occupied" });
  }
  const occ = await Occupancy.create(req.body);
  // OPTIONAL: update Bed.isOccupied flag
  await Bed.updateOne({ _id: occ.bedId }, { $set: { isOccupied: true } });
  return created(res, occ);
});

export const updateOccupancy = asyncHandler(async (req, res) => {
  const occ = await Occupancy.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, occ);
});

export const deleteOccupancy = asyncHandler(async (req, res) => {
  await Occupancy.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Actions
export const closeOccupancy = asyncHandler(async (req, res) => {
  const { end_date } = req.body;
  const occ = await Occupancy.findByIdAndUpdate(
    req.params.id,
    { $set: { end_date: end_date || new Date(), status: "moved_out" } },
    { new: true }
  ).lean();
  // OPTIONAL: recompute Bed.isOccupied
  const stillActive = await Occupancy.exists({ bedId: occ.bedId, end_date: null });
  await Bed.updateOne({ _id: occ.bedId }, { $set: { isOccupied: !!stillActive } });
  return ok(res, occ);
});

export const transferOccupancy = asyncHandler(async (req, res) => {
  const { toBedId, transfer_date } = req.body;
  const closed = await Occupancy.findByIdAndUpdate(
    req.params.id,
    { $set: { end_date: transfer_date || new Date(), status: "moved_out" } },
    { new: true }
  ).lean();
  await Bed.updateOne({ _id: closed.bedId }, { $set: { isOccupied: false } });
  const reopened = await Occupancy.create({
    bedId: toBedId,
    tenantId: closed.tenantId,
    start_date: transfer_date || new Date(),
    status: "active"
  });
  await Bed.updateOne({ _id: toBedId }, { $set: { isOccupied: true } });
  return ok(res, { from: closed, to: reopened });
});
