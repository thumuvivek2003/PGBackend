import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema(
  {
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    // (Optional) add occupancyId later for tighter linkage
    occupancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Occupancy' },

    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },

    amount: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    remarks: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

// One bill per tenant/bed per exact period (tune if you need month-based uniqueness)
BillSchema.index({ tenantId: 1, bedId: 1, period_start: 1, period_end: 1 }, { unique: true });
BillSchema.index({ status: 1 });
BillSchema.index({ period_start: 1, period_end: 1 });


// Bill.js
BillSchema.pre('validate', async function () {
  if (!this.occupancyId) return; // skip if you didn’t add occupancy link
  const occ = await this.model('Occupancy').findById(this.occupancyId).lean();
  if (!occ) throw new Error('Invalid occupancyId');
  const ps = new Date(this.period_start);
  const pe = new Date(this.period_end);
  if (!(ps < pe)) throw new Error('period_start must be before period_end');
  const occStart = new Date(occ.start_date);
  const occEnd = occ.end_date ? new Date(occ.end_date) : null;

  const inside =
    ps >= occStart && (occEnd ? pe <= occEnd : true);

  if (!inside) {
    throw new Error('Bill period must be within occupancy window');
  }
});


BillSchema.pre('save', async function () {
  if (!this.isModified('period_start') && !this.isModified('period_end') && !this.isModified('occupancyId')) return;
  if (!this.occupancyId) return;

  const ps = this.period_start;
  const pe = this.period_end;

  const overlap = await this.constructor.exists({
    _id: { $ne: this._id },
    occupancyId: this.occupancyId,
    // overlap if: start < other_end AND end > other_start
    period_start: { $lt: pe },
    period_end: { $gt: ps },
  });

  if (overlap) {
    throw new Error('Overlapping bill exists for this occupancy and period');
  }
});



export default mongoose.model('Bill', BillSchema);
