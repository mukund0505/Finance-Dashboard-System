import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, data, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  // Optionally set refresh token as httpOnly cookie
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json(new ApiResponse(200, data, "Login successful"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const data = await authService.refresh(token);
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json(new ApiResponse(200, data, "Token refreshed"));
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  await authService.logout(token);
  res.clearCookie("refreshToken");
  res.json(new ApiResponse(200, null, "Logged out successfully"));
});

export { register, login, refreshToken, logout };
