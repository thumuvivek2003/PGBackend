import { parsePaging, ok, created, noContent } from "./helpers.js";
import Document from "../models/Document.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getDocuments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaging(req);
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.q) filter.file_name = { $regex: req.query.q, $options: "i" };
  const [items, total] = await Promise.all([
    Document.find(filter).skip(skip).limit(limit).lean(),
    Document.countDocuments(filter)
  ]);
  return ok(res, items, { page, limit, total, hasNext: skip + items.length < total });
});

export const getDocument = asyncHandler(async (req, res) => {
  const item = await Document.findById(req.params.id).lean();
  return ok(res, item);
});

export const createDocument = asyncHandler(async (req, res) => {
  const doc = await Document.create(req.body);
  return created(res, doc);
});

export const updateDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  return ok(res, doc);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  return noContent(res);
});
