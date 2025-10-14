import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    file_name: { type: String, required: true, trim: true },
    file_path: { type: String, required: true, trim: true }, // e.g., S3 path
    type: { type: String, trim: true }, // 'aadhar', 'agreement', ...
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Document', DocumentSchema);
