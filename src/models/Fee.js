import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      match: [/^\d{4}-\d{2}$/, "Month format should be YYYY-MM"],
    },
    rent_amount: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: 0,
    },
    paid_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    due_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "pending",
    },
    payment_date: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 📌 Calculate due_amount and status before saving
feeSchema.pre("save", function (next) {
  this.due_amount = this.rent_amount - this.paid_amount;

  if (this.paid_amount === 0) {
    this.status = "pending";
  } else if (this.paid_amount >= this.rent_amount) {
    this.status = "paid";
  } else {
    this.status = "partial";
  }

  next();
});

// 📌 Indexes
feeSchema.index({ tenant_id: 1, month: 1 }, { unique: true });
feeSchema.index({ month: 1 });
feeSchema.index({ status: 1 });

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
