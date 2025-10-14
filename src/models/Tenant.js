import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    home_mobile: { type: String, trim: true },
    address: { type: String, trim: true },
    join_date: { type: Date },
    advance: { type: Number, default: 0 },

    // keep for convenience; prefer Occupancies for history
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },

    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Unique email when present
TenantSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

// Search helpers
TenantSchema.index({ name: 'text', mobile: 'text', email: 'text' });

export default mongoose.model('Tenant', TenantSchema);
