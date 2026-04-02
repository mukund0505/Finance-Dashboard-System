import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

const refresh = async (token) => {
  if (!token) throw new ApiError(401, "Refresh token required");

  const stored = await RefreshToken.findOne({ token });
  if (!stored) throw new ApiError(403, "Invalid or revoked refresh token");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    await RefreshToken.deleteOne({ token }); // revoke if tampered
    throw new ApiError(403, "Refresh token expired or invalid");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(403, "User not found");

  // Rotate: delete old, issue new
  await RefreshToken.deleteOne({ token });
  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = await generateRefreshToken(user._id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (token) => {
  if (token) await RefreshToken.deleteOne({ token });
};

export default { register, login, refresh, logout };
