// Bed.js
import mongoose from 'mongoose';

const BedSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    bedNo: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    defaultCost: { type: Number, default: 0 },
    // remove stored isOccupied if you're deriving it
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relation to current (active) occupancy
BedSchema.virtual('occupancy', {
  ref: 'Occupancy',
  localField: '_id',
  foreignField: 'bedId',
  justOne: true,
  match: { end_date: null }, // only active occupancy
});

// Derived boolean from whether the occupancy virtual is present
BedSchema.virtual('isOccupied').get(function () {
  // Will be truthy only if 'occupancy' was populated and found
  return !!this.get('occupancy');
});

// Useful unique constraint (as you already had)
BedSchema.index({ roomId: 1, bedNo: 1 }, { unique: true });

export default mongoose.model('Bed', BedSchema);
