import Fee from "../models/Fee.js";
import Tenant from "../models/Tenant.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private
export const getFees = asyncHandler(async (req, res) => {
  const { month, status, tenant_id } = req.query;

  let query = {};
  if (month) query.month = month;
  if (status) query.status = status;
  if (tenant_id) query.tenant_id = tenant_id;

  const fees = await Fee.find(query)
    .populate("tenant_id", "name phone room_id")
    .populate({
      path: "tenant_id",
      populate: {
        path: "room_id",
        select: "room_no",
      },
    })
    .lean();

  res.status(200).json({
    success: true,
    count: fees.length,
    data: fees,
  });
});

// @desc    Get single fee
// @route   GET /api/fees/:id
// @access  Private
export const getFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id).populate(
    "tenant_id",
    "name phone room_id"
  );

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee record not found",
    });
  }

  res.status(200).json({
    success: true,
    data: fee,
  });
});

// @desc    Create fee
// @route   POST /api/fees
// @access  Private
export const createFee = asyncHandler(async (req, res) => {
  const { tenant_id } = req.body;

  // Check if tenant exists
  const tenant = await Tenant.findById(tenant_id);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }

  const fee = await Fee.create(req.body);

  res.status(201).json({
    success: true,
    message: "Fee record created successfully",
    data: fee,
  });
});

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private
export const updateFee = asyncHandler(async (req, res) => {
  let fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee record not found",
    });
  }

  fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Fee record updated successfully",
    data: fee,
  });
});

// @desc    Soft delete fee
// @route   DELETE /api/fees/:id
// @access  Private
export const deleteFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee || fee.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Fee record not found or already deleted",
    });
  }

  // 👇 Soft delete instead of hard delete
  fee.isDeleted = true;
  fee.deletedAt = new Date();
  await fee.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Fee record soft deleted successfully",
    data: fee,
  });
});
