import mongoose from 'mongoose';

const TenantDocumentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    // keep type here too if you want per-tenant classification
    type: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

TenantDocumentSchema.index({ tenantId: 1, docId: 1 }, { unique: true });

export default mongoose.model('TenantDocument', TenantDocumentSchema);
