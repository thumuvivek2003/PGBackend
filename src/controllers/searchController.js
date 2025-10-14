import { parsePaging, ok, created, noContent } from "./helpers.js";
import Tenant from "../models/Tenant.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";
import Bill from "../models/Bill.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return ok(res, { tenants: [], rooms: [], beds: [], bills: [] });
  const rx = new RegExp(q, "i");
  const [tenants, rooms, beds, bills] = await Promise.all([
    Tenant.find({ $or: [{ name: rx }, { email: rx }, { mobile: rx }] }).limit(10).lean(),
    Room.find({ $or: [{ no: rx }] }).limit(10).lean(),
    Bed.find({ $or: [{ bedNo: rx }] }).limit(10).lean(),
    Bill.find({ remarks: rx }).limit(10).lean(),
  ]);
  return ok(res, { tenants, rooms, beds, bills });
});
