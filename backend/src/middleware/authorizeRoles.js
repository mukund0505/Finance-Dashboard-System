import ApiError from "../utils/ApiError.js";

// Usage: authorizeRoles('admin', 'analyst')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role '${req.user.role}' is not allowed to perform this action`,
        ),
      );
    }
    next();
  };
};

export default authorizeRoles;
