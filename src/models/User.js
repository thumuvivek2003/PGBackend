import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      // NOTE: uniqueness is enforced via a partial index below (not `unique: true` here)
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["owner", "manager"],
      default: "owner",
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
  { timestamps: true }
);

// 🔑 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 🔑 Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// 🧹 Soft delete / restore helpers
userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save({ validateBeforeSave: false });
};
userSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save({ validateBeforeSave: false });
};

// 📌 Indexes
// Partial unique index so email must be unique only among non-deleted users
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);
export default User;
