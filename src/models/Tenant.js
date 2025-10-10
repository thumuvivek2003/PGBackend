const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  address: {
    type: String,
    trim: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  join_date: {
    type: Date,
    required: [true, 'Join date is required'],
    default: Date.now
  },
  leave_date: {
    type: Date
  },
  advance_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  id_docs: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'left'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
tenantSchema.index({ room_id: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ phone: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
