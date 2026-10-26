import { body, validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body().custom((value, { req }) => {
    const amount =
      req.body.priceAmount ??
      req.body?.price?.amount ??
      req.body["price.amount"] ??
      req.body["price[amount]"];
    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      throw new Error("Price amount must be a positive number");
    }
    const currency =
      req.body.priceCurrency ??
      req.body?.price?.currency ??
      req.body["price.currency"] ??
      req.body["price[currency]"] ??
      "INR";
    if (!["USD", "INR"].includes(String(currency).toUpperCase())) {
      throw new Error("Invalid price currency (must be INR or USD)");
    }
    return true;
  }),
  validateRequest,
];
