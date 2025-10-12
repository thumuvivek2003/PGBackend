import Bill from "../models/Bill.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
export const getBills = asyncHandler(async (req, res) => {
  const { month, type } = req.query;
  
  let query = {};
  if (month) query.month = month;
  if (type) query.type = type;

  const bills = await Bill.find(query)
    .populate("shared_between", "room_no")
    .lean();

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills,
  });
});

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
export const getBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate("shared_between", "room_no");

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Bill not found",
    });
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

// @desc    Create bill
// @route   POST /api/bills
// @access  Private
export const createBill = asyncHandler(async (req, res) => {
  const bill = await Bill.create(req.body);

  res.status(201).json({
    success: true,
    message: "Bill created successfully",
    data: bill,
  });
});

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
export const updateBill = asyncHandler(async (req, res) => {
  let bill = await Bill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Bill not found",
    });
  }

  bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Bill updated successfully",
    data: bill,
  });
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Bill not found",
    });
  }

  await bill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Bill deleted successfully",
    data: {},
  });
});
