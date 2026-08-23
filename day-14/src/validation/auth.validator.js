import { body, validationResult } from "express-validator";




export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};





export const registerValidation = [
  body("username").isString().withMessage("Username should be a string"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").custom((value) => {
    if(value.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(value)) {
        throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
    }
    return true;
  }),
    body("userid").isMongoId().withMessage("Invalid userid"),
  validate,
];
