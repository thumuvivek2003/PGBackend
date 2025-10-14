import { parsePaging, ok, created, noContent } from "./helpers.js";
import Bill from "../models/Bill.js";
import Transaction from "../models/Transaction.js";
import Occupancy from "../models/Occupancy.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const arrearsReport = asyncHandler(async (req, res) => {
  const asOf = req.query.asOf ? new Date(req.query.asOf) : new Date();
  const bills = await Bill.aggregate([
    { $match: { period_start: { $lte: asOf } } },
    { $lookup: { from: "transactions", localField: "_id", foreignField: "billId", as: "txns" } },
    { $addFields: { paid: { $sum: "$txns.amount" }, balance: { $subtract: ["$amount", { $sum: "$txns.amount" }] } } },
    { $project: { txns: 0 } },
    { $match: { balance: { $gt: 0 } } }
  ]);
  return ok(res, bills);
});

export const occupancyRateReport = asyncHandler(async (req, res) => {
  // Minimal stub; implement proper date-bucketed occupancy % later
  const total = await Occupancy.countDocuments({});
  return ok(res, { totalOccupancies: total });
});

export const revenueReport = asyncHandler(async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date("1970-01-01");
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const tx = await Transaction.aggregate([
    { $match: { dateTime: { $gte: from, $lte: to } } },
    { $group: { _id: null, revenue: { $sum: "$amount" } } }
  ]);
  return ok(res, { revenue: tx[0]?.revenue || 0 });
});
