import joi from "joi";

export const signUpSchema = joi.object({
  username: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  confirm_pass: joi.string().valid(joi.ref("password")).required(),
});

export const LoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
});
