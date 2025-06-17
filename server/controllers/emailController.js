// controllers/emailController.js
const nodemailer = require('nodemailer');

// Create transporter function with better error handling
const createTransporter = () => {
  // Check if environment variables are set
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER environment variable is required');
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS environment variable is required');
  }

  console.log('Creating transporter for:', process.env.EMAIL_USER);

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add some additional options for better reliability
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Test transporter connection
const testConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email transporter connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email transporter connection failed:', error.message);
    return false;
  }
};

// In-memory storage for email history
let emailHistory = [];

const sendEmail = async (req, res) => {
  try {
    console.log('📧 Attempting to send email...');
    console.log('Request body:', req.body);

    const { to, subject, message, from } = req.body;
    
    // Validate required fields
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and message are required'
      });
    }

    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      return res.status(500).json({
        success: false,
        message: 'Email service connection failed. Please check your email credentials.'
      });
    }

    // Create transporter
    const transporter = createTransporter();
    
    // Configure mail options
    const mailOptions = {
      from: from || process.env.EMAIL_USER,
      to: to.trim(),
      subject: subject.trim(),
      text: message,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
               <p style="margin-bottom: 15px;">${message.replace(/\n/g, '<br>')}</p>
               <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
               <p style="font-size: 12px; color: #666;">Sent via NodeMailer App</p>
             </div>`
    };

    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    // Store in memory
    const emailRecord = {
      id: Date.now().toString(),
      to: to.trim(),
      subject: subject.trim(),
      message,
      from: from || process.env.EMAIL_USER,
      messageId: info.messageId,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    
    emailHistory.unshift(emailRecord);
    
    // Keep only last 50 emails
    if (emailHistory.length > 50) {
      emailHistory = emailHistory.slice(0, 50);
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
      data: {
        messageId: info.messageId,
        to: emailRecord.to,
        subject: emailRecord.subject,
        sentAt: emailRecord.sentAt
      }
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your email credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Please check your internet connection.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Invalid credentials. Please check your email and app password.';
    } else if (error.message.includes('Invalid login')) {
      errorMessage = 'Invalid email credentials. Make sure you\'re using an App Password for Gmail.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};

const getEmailHistory = async (req, res) => {
  try {
    console.log('📋 Fetching email history, count:', emailHistory.length);
    
    res.status(200).json({
      success: true,
      message: 'Email history retrieved successfully',
      emails: emailHistory,
      count: emailHistory.length
    });
  } catch (error) {
    console.error('❌ Error fetching email history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email history',
      error: error.message
    });
  }
};

// Test endpoint
const testEmailService = async (req, res) => {
  try {
    const connectionOk = await testConnection();
    
    res.status(200).json({
      success: connectionOk,
      message: connectionOk 
        ? 'Email service is working correctly' 
        : 'Email service connection failed',
      config: {
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
        emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message
    });
  }
};

module.exports = { sendEmail, getEmailHistory, testEmailService };