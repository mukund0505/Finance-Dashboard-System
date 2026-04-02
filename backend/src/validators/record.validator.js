import { body } from "express-validator";
import { handleValidationErrors } from "./auth.validator.js";

// Re-export handleValidationErrors from auth.validator or define it once in a shared file
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,
        "Validation error",
        errors.array().map((e) => e.msg),
      ),
    );
  }
  next();
};

const recordValidator = [
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description too long"),
  validate,
];

export { recordValidator };
