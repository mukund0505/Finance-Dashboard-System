import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import authenticate from "../middleware/authenticate.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

router.use(authenticate);

// Admin: get all users
router.get(
  "/",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(new ApiResponse(200, users));
  }),
);

// Admin: update user role or status
router.patch(
  "/:id",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true },
    );
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(200, user, "User updated"));
  }),
);

// Any user: get their own profile
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    res.json(new ApiResponse(200, req.user));
  }),
);

export default router;
