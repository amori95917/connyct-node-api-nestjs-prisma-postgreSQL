import * as Joi from 'joi';

export const signupInputValidationSchema = Joi.object({
  email: Joi.string().min(2).email().required().messages({
    'string.email': 'Invalid Email',
    'string.min': 'Email length must be at least 2 characters long',
    'string.required': "Field 'email' is required",
  }),
  firstName: Joi.string().min(2).required().messages({
    'string.min': 'First name length must be at least 2 characters long',
    'string.required': "Field 'firstName' is required",
  }),
  lastName: Joi.string().min(2).required().messages({
    'string.min': 'First name length must be at least 2 characters long',
    'string.required': "Field 'firstName' is required",
  }),
  password: Joi.string().min(5).required().messages({
    'string.min': 'Password length must be at least 5 characters long',
    'string.required': "Field 'password' is required",
  }),
});
