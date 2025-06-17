// routes/emailRoutes.js
const express = require('express');
const { sendEmail, getEmailHistory, testEmailService } = require('../controllers/emailController');
const { validateEmail } = require('../middleware/validation');

const router = express.Router();

// Test email service configuration
router.get('/test', testEmailService);

// Send email route with validation
router.post('/send', validateEmail, sendEmail);

// Get email history route
router.get('/history', getEmailHistory);

// Health check for email routes
router.get('/health', (req, res) => {
  res.json({ 
    message: 'Email routes are working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      test: 'GET /api/email/test',
      send: 'POST /api/email/send',
      history: 'GET /api/email/history'
    }
  });
});

module.exports = router;