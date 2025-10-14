import { parsePaging, ok, created, noContent } from "./helpers.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getTransactions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.billId) filter.billId = req.query.billId;
  if (req.query.method) filter.method = req.query.method;
  if (req.query.from && req.query.to) {
    filter.dateTime = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) };
  }
  const [items, total] = await Promise.all([
    Transaction.find(filter).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const item = await Transaction.findById(req.params.id).lean();
  return ok(res, item);
});

export const createTransaction = asyncHandler(async (req, res) => {
  const txn = await Transaction.create(req.body);
  return created(res, txn);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const txn = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, txn);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Tenant helper
export const getTenantTransactions = asyncHandler(async (req, res) => {
  const items = await Transaction.find({ tenantId: req.params.id }).lean();
  return ok(res, items);
});
