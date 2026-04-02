import FinancialRecord from "../models/FinancialRecord.model.js";

const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const income = result.find((r) => r._id === "income")?.total || 0;
  const expense = result.find((r) => r._id === "expense")?.total || 0;

  return {
    totalIncome: income,
    totalExpenses: expense,
    netBalance: income - expense,
    totalRecords: result.reduce((acc, r) => acc + r.count, 0),
  };
};

const getCategoryTotals = async () => {
  return FinancialRecord.aggregate([
    {
      $group: {
        _id: { type: "$type", category: "$category" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const getMonthlyTrends = async () => {
  return FinancialRecord.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};

const getRecentActivity = async (limit = 10) => {
  return FinancialRecord.find()
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export default {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
};
