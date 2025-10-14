import { parsePaging, ok, created, noContent } from "./helpers.js";
import Bill from "../models/Bill.js";
import Transaction from "../models/Transaction.js";
import Bed from "../models/Bed.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// GET /bills
export const getBills = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.tenantId) filter.tenantId = req.query.tenantId;
  if (req.query.bedId) filter.bedId = req.query.bedId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.from && req.query.to) {
    filter.period_start = { $lt: new Date(req.query.to) };
    filter.period_end = { $gt: new Date(req.query.from) };
  }
  const [items, total] = await Promise.all([
    Bill.find(filter).skip(skip).limit(limit).lean(),
    Bill.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getBill = asyncHandler(async (req, res) => {
  const item = await Bill.findById(req.params.id).lean();
  return ok(res, item);
});

export const createBill = asyncHandler(async (req, res) => {
  const bill = await Bill.create(req.body);
  return created(res, bill);
});

export const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, bill);
});

export const deleteBill = asyncHandler(async (req, res) => {
  await Bill.findByIdAndDelete(req.params.id);
  return noContent(res);
});

// Helpers
const computePaidForBill = async (billId) => {
  const agg = await Transaction.aggregate([
    { $match: { billId } },
    { $group: { _id: "$billId", paid: { $sum: "$amount" } } }
  ]);
  return agg[0]?.paid || 0;
};

const deriveStatus = (amount, paid) => {
  if (paid <= 0) return "pending";
  if (paid < amount) return "partial";
  return "paid";
};

// GET /bills/:id/summary
export const getBillSummary = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).lean();
  if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
  const paid = await computePaidForBill(bill._id);
  const balance = Number((bill.amount - paid).toFixed(2));
  return ok(res, {
    ...bill,
    summary: { amount: bill.amount, paid, balance, status: deriveStatus(bill.amount, paid) }
  });
});

// POST /bills/:id/recalculate  (basic proration using bed.defaultCost)
export const recalculateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).lean();
  if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

  const bed = await Bed.findById(bill.bedId).lean();
  const cost = bed?.defaultCost || bill.amount;

  const start = new Date(bill.period_start);
  const end = new Date(bill.period_end);
  const msDay = 24*60*60*1000;
  const days = Math.max(1, Math.ceil((end - start) / msDay));
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
  const nextMonth = new Date(start.getFullYear(), start.getMonth()+1, 1);
  const daysInMonth = Math.round((nextMonth - monthStart) / msDay);

  const newAmount = Number(((cost / daysInMonth) * days).toFixed(2));
  const updated = await Bill.findByIdAndUpdate(req.params.id, { $set: { amount: newAmount } }, { new: true }).lean();
  return ok(res, updated);
});

// POST /bills/:id/mark-paid  (usually you won’t need this if deriving from transactions)
export const markBillPaid = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).lean();
  if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
  const paid = await computePaidForBill(bill._id);
  const status = deriveStatus(bill.amount, paid);
  const updated = await Bill.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true }).lean();
  return ok(res, updated);
});

// Tenant helpers
export const getTenantBills = asyncHandler(async (req, res) => {
  const items = await Bill.find({ tenantId: req.params.id }).lean();
  return ok(res, items);
});
