// middleware/validation.js
const Joi = require('joi');

const emailSchema = Joi.object({
  to: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Recipient email is required'
  }),
  subject: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Subject cannot be empty',
    'string.max': 'Subject cannot exceed 200 characters',
    'any.required': 'Subject is required'
  }),
  message: Joi.string().min(1).max(5000).required().messages({
    'string.min': 'Message cannot be empty',
    'string.max': 'Message cannot exceed 5000 characters',
    'any.required': 'Message is required'
  }),
  from: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid sender email address'
  })
});

const validateEmail = (req, res, next) => {
  const { error } = emailSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

module.exports = { validateEmail };