import { parsePaging, ok, created, noContent } from "./helpers.js";
import TenantDocument from "../models/TenantDocument.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getTenantDocuments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.tenantId) filter.tenantId = req.query.tenantId;
  if (req.query.type) filter.type = req.query.type;
  const items = await TenantDocument.find(filter).lean();
  return ok(res, items);
});

export const linkTenantDocument = asyncHandler(async (req, res) => {
  const link = await TenantDocument.create(req.body);
  return created(res, link);
});

export const unlinkTenantDocument = asyncHandler(async (req, res) => {
  const { tenantId, docId } = req.params;
  await TenantDocument.findOneAndDelete({ tenantId, docId });
  return noContent(res);
});
