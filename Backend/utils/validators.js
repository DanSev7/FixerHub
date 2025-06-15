const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 255 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).optional().messages({
    'string.length': 'Phone number must be 10 digits',
    'string.pattern.base': 'Phone number must contain only digits',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
  role: Joi.string().valid('client', 'professional').required().messages({
    'any.only': 'Role must be either "client" or "professional"',
    'string.empty': 'Role is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

const validateSignup = (data) => signupSchema.validate(data, { abortEarly: false });
const validateLogin = (data) => loginSchema.validate(data, { abortEarly: false });

module.exports = { validateSignup, validateLogin };