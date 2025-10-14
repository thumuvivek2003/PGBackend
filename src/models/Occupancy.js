import mongoose from 'mongoose';

const OccupancySchema = new mongoose.Schema(
  {
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, default: null }, // null = current
    advance: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'moved_out', 'on_hold'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
);

// One active occupancy per bed (end_date == null)
OccupancySchema.index(
  { bedId: 1 },
  { unique: true, partialFilterExpression: { end_date: null } }
);

// Useful queries
OccupancySchema.index({ tenantId: 1, start_date: 1 });
OccupancySchema.index({ bedId: 1, start_date: 1 });

export default mongoose.model('Occupancy', OccupancySchema);
