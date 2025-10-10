/**
 * Get current month in YYYY-MM format
 */
exports.getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Get month range for filtering
 */
exports.getMonthRange = (month) => {
  const [year, monthNum] = month.split('-');
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59);
  return { startDate, endDate };
};

/**
 * Format date to readable string
 */
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

/**
 * Check if date is in past
 */
exports.isPastDate = (date) => {
  return new Date(date) < new Date();
};
