import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.model.js";

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store in DB for validation and revocation
  await RefreshToken.create({ token, user: userId, expiresAt });

  return token;
};

export { generateAccessToken, generateRefreshToken };
