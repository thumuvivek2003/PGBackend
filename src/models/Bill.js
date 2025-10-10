const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['electricity', 'water', 'maintenance'],
    required: [true, 'Bill type is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month format should be YYYY-MM']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  shared_between: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
billSchema.index({ month: 1, type: 1 });

module.exports = mongoose.model('Bill', billSchema);
