import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_no: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },
    occupied_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["vacant", "occupied"],
      default: "vacant",
    },
    type: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
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

// 📌 Indexes
roomSchema.index({ room_no: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ isDeleted: 1 }); // optional for faster queries

// 📌 Auto-update status based on occupied_count
roomSchema.pre("save", function (next) {
  this.status = this.occupied_count >= this.capacity ? "occupied" : "vacant";
  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
