import Joi from "joi";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const registerSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required(),
  address: Joi.string().max(400).allow(null, ""),
  role: Joi.string().valid("admin", "user", "store_owner").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateRegister = (req: any, res: any, next: any) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error)
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });
  next();
};

export const validateLogin = (req: any, res: any, next: any) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error)
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });
  next();
};
