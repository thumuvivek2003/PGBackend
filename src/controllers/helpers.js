// Common helpers
export const parsePaging = (req) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const ok = (res, data, meta) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(200).json(body);
};

export const created = (res, data) => res.status(201).json({ success: true, data });
export const noContent = (res) => res.status(204).json({ success: true });
