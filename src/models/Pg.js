import mongoose from 'mongoose';

const PgSchema = new mongoose.Schema(
  {
    pgName: { type: String, required: true, trim: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String, trim: true },

    // Flexible: store lat/long or any map payload; change to GeoJSON if you prefer
    location: { type: mongoose.Schema.Types.Mixed },

    contact: { type: String, trim: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, versionKey: false }
);

export default mongoose.model('Pg', PgSchema);
