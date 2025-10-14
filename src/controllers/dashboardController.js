import { parsePaging, ok, created, noContent } from "./helpers.js";
import Bill from "../models/Bill.js";
import Transaction from "../models/Transaction.js";
import Occupancy from "../models/Occupancy.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const tenantDashboard = asyncHandler(async (req, res) => {
  const tenantId = req.params.tenantId;
  const [bills, txns, occ] = await Promise.all([
    Bill.find({ tenantId }).sort({ createdAt: -1 }).limit(10).lean(),
    Transaction.find({ tenantId }).sort({ dateTime: -1 }).limit(10).lean(),
    Occupancy.find({ tenantId, end_date: null }).lean()
  ]);
  return ok(res, { bills, txns, activeOccupancies: occ });
});
