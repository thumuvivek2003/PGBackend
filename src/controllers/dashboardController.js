const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Tenant = require("../models/Tenant");
const Fee = require("../models/Fee");

exports.getDashboardData = asyncHandler(async (req, res) => {
  // 1️⃣ Total rooms and vacant rooms
  const totalRooms = await Room.countDocuments();
  const vacantRoomsList = await Room.find({ status: "vacant" })
    .select("room_no type rent")
    .lean();

  // 2️⃣ Total tenants
  const totalTenants = await Tenant.countDocuments({ status: "active" });

  // 3️⃣ Pending fees (sum of due_amount for pending/partial)
  const pendingFees = await Fee.aggregate([
    { $match: { status: { $in: ["pending", "partial"] } } },
    { $group: { _id: null, total: { $sum: "$due_amount" } } },
  ]);

  // 4️⃣ Monthly income (sum of all rent_amount)
  const monthlyIncome = await Fee.aggregate([
    { $group: { _id: null, total: { $sum: "$rent_amount" } } },
  ]);

  // 5️⃣ Recent fee status (last 5 payments)
  const recentFees = await Fee.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("tenant_id", "name")
    .lean();
    console.log('*'.repeat(10),recentFees)

  // 6️⃣ Respond with structured data
  res.status(200).json({
    success: true,
    data: {
      summary: {
        vacantRooms: vacantRoomsList.length,
        totalRooms,
        totalTenants,
        pendingFees: pendingFees[0]?.total || 0,
        monthlyIncome: monthlyIncome[0]?.total || 0,
        occupancyRate: ((totalRooms - vacantRoomsList.length) / totalRooms) * 100,
      },
      vacantRoomsList: vacantRoomsList.map((room) => ({
        room_no: room.room_no,
        type: room.type,
        rent: room.rent,
      })),
      recentFeeStatus: recentFees.map((fee) => ({
        name: fee?.tenant_id?.name,
        month: fee.month,
        status: fee.status,
        due: fee.due_amount || 0,
      })),
    },
  });
});
