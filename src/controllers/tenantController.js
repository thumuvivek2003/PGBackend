const Tenant = require('../models/Tenant');
const Room = require('../models/Room');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
exports.getTenants = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().populate('room_id', 'room_no type').lean();

  res.status(200).json({
    success: true,
    count: tenants.length,
    data: tenants
  });
});

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private
exports.getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id).populate('room_id');

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  res.status(200).json({
    success: true,
    data: tenant
  });
});

// @desc    Create tenant
// @route   POST /api/tenants
// @access  Private
exports.createTenant = asyncHandler(async (req, res) => {
  const { room_id } = req.body;

  // Check if room exists
  const room = await Room.findById(room_id);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  // Check if room has capacity
  if (room.occupied_count >= room.capacity) {
    return res.status(400).json({
      success: false,
      message: 'Room is full'
    });
  }

  const tenant = await Tenant.create(req.body);

  // Update room occupied count
  room.occupied_count += 1;
  await room.save();

  res.status(201).json({
    success: true,
    message: 'Tenant created successfully',
    data: tenant
  });
});

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private
exports.updateTenant = asyncHandler(async (req, res) => {
  let tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  // If changing room
  if (req.body.room_id && req.body.room_id !== tenant.room_id.toString()) {
    const oldRoom = await Room.findById(tenant.room_id);
    const newRoom = await Room.findById(req.body.room_id);

    if (!newRoom) {
      return res.status(404).json({
        success: false,
        message: 'New room not found'
      });
    }

    if (newRoom.occupied_count >= newRoom.capacity) {
      return res.status(400).json({
        success: false,
        message: 'New room is full'
      });
    }

    // Update room counts
    if (oldRoom) {
      oldRoom.occupied_count -= 1;
      await oldRoom.save();
    }
    newRoom.occupied_count += 1;
    await newRoom.save();
  }

  // If tenant is leaving
  if (req.body.status === 'left' && tenant.status === 'active') {
    const room = await Room.findById(tenant.room_id);
    if (room) {
      room.occupied_count -= 1;
      await room.save();
    }
    req.body.leave_date = req.body.leave_date || new Date();
  }

  tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Tenant updated successfully',
    data: tenant
  });
});

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private
exports.deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant not found'
    });
  }

  // Update room occupied count if tenant is active
  if (tenant.status === 'active') {
    const room = await Room.findById(tenant.room_id);
    if (room) {
      room.occupied_count -= 1;
      await room.save();
    }
  }

  await tenant.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tenant deleted successfully',
    data: {}
  });
});
