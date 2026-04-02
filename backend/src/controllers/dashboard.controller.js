import dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  res.json(new ApiResponse(200, data));
});

const categoryTotals = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCategoryTotals();
  res.json(new ApiResponse(200, data));
});

const monthlyTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends();
  res.json(new ApiResponse(200, data));
});

const recentActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const data = await dashboardService.getRecentActivity(limit);
  res.json(new ApiResponse(200, data));
});

export { summary, categoryTotals, monthlyTrends, recentActivity };
