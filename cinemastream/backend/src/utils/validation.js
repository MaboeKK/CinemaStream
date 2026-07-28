const Joi = require('joi');

// Generic Express middleware factory: validates & normalizes req.body against a Joi schema.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: 'FAILED',
      message: error.details.map((d) => d.message).join(', '),
    });
  }

  req.body = value;
  next();
};

const nameField = Joi.string()
  .trim()
  .pattern(/^[a-zA-Z ]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Name must contain letters and spaces only',
    'string.empty': 'Name is required',
  });

const emailField = Joi.string().trim().email().required().messages({
  'string.email': 'Invalid email entered',
  'string.empty': 'Email is required',
});

const passwordField = Joi.string().min(8).required().messages({
  'string.min': 'Password must be at least 8 characters',
  'string.empty': 'Password is required',
});

const otpField = Joi.string()
  .trim()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required()
  .messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must be numeric',
    'string.empty': 'OTP is required',
  });

const schemas = {
  register: Joi.object({
    first_name: nameField,
    last_name: nameField,
    email: emailField,
    password: passwordField,
  }),

  login: Joi.object({
    email: emailField,
    password: Joi.string().required().messages({ 'string.empty': 'Password is required' }),
    rememberMe: Joi.boolean().optional(),
  }),

  forgotPassword: Joi.object({
    email: emailField,
  }),

  resetPassword: Joi.object({
    email: emailField,
    resetToken: Joi.string()
      .trim()
      .required()
      .messages({ 'string.empty': 'Reset token is required' }),
    newPassword: passwordField,
  }),

  verifyOtp: Joi.object({
    email: emailField,
    otp: otpField,
  }),

  resendOtp: Joi.object({
    email: emailField,
  }),

  watch: Joi.object({
    movie_id: Joi.number().integer().optional(),
    series_id: Joi.number().integer().optional(),
    movie_title: Joi.string().trim().optional(),
    series_name: Joi.string().trim().optional(),
  })
    .or('movie_id', 'series_id')
    .messages({ 'object.missing': 'movie_id or series_id is required' }),
};

module.exports = { validate, schemas };
