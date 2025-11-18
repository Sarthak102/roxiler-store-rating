// backend/src/validators/adminValidators.ts
import Joi from "joi";
import { Request, Response, NextFunction } from "express";


const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,64}$/;

const schema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required(),
  address: Joi.string().max(400).allow("", null),
  role: Joi.string().valid("admin", "user", "store_owner").required(),
});

export const validateAdminCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });
  next();
};
