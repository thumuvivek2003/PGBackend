import { parsePaging, ok, created, noContent } from "./helpers.js";
import Tenant from "../models/Tenant.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getTenants = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.active !== undefined) filter.active = req.query.active === "true";
  if (req.query.email) filter.email = req.query.email.toLowerCase();
  if (req.query.mobile) filter.mobile = req.query.mobile;
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
      { mobile: { $regex: req.query.q, $options: "i" } }
    ];
  }
  const [items, total] = await Promise.all([
    Tenant.find(filter).skip(skip).limit(limit).lean(),
    Tenant.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getTenant = asyncHandler(async (req, res) => {
  const item = await Tenant.findById(req.params.id).lean();
  return ok(res, item);
});

export const createTenant = asyncHandler(async (req, res) => {
  const t = await Tenant.create(req.body);
  return created(res, t);
});

export const updateTenant = asyncHandler(async (req, res) => {
  const t = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, t);
});

export const deleteTenant = asyncHandler(async (req, res) => {
  await Tenant.findByIdAndDelete(req.params.id);
  return noContent(res);
});
