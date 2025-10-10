/**
 * Calculate total rent for a month
 */
exports.calculateMonthlyRent = (rooms) => {
  return rooms.reduce((total, room) => total + room.rent, 0);
};

/**
 * Calculate split bill amount per room
 */
exports.splitBillAmount = (totalAmount, numRooms) => {
  return Math.round((totalAmount / numRooms) * 100) / 100;
};

/**
 * Calculate due amount
 */
exports.calculateDueAmount = (rentAmount, paidAmount) => {
  return Math.max(0, rentAmount - paidAmount);
};

/**
 * Calculate occupancy rate
 */
exports.calculateOccupancyRate = (occupiedCount, totalCapacity) => {
  if (totalCapacity === 0) return 0;
  return Math.round((occupiedCount / totalCapacity) * 100);
};
