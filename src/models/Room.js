import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    no: { type: String, required: true, trim: true },
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pg', required: true },
    capacity: { type: Number, default: 1, min: 1 },
    floor: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'maintenance'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
);

// Room number unique within a PG
RoomSchema.index({ pgId: 1, no: 1 }, { unique: true });

export default mongoose.model('Room', RoomSchema);
