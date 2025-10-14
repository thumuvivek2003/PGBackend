import { parsePaging, ok, created, noContent } from "./helpers.js";// This is a stub; wire to your billing service logic.
import { asyncHandler } from "../middlewares/errorHandler.js";

export const createBillingRun = asyncHandler(async (req, res) => {
  // TODO: generate bills based on occupancies & period in req.body
  return created(res, { runId: "stub", createdBills: [] });
});

export const previewBillingRun = asyncHandler(async (req, res) => {
  return ok(res, { preview: true, wouldCreate: [] });
});

export const getBillingRun = asyncHandler(async (req, res) => {
  return ok(res, { id: req.params.id, status: "done", stats: {} });
});
