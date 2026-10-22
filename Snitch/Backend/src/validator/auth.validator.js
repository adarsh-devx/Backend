import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateRegisterUser = [
  body("email").trim().isEmail().withMessage("invalid Email formate"),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^\d{10}$/)
    .withMessage("Contact must be 10 digit number"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  validateRequest,
];
