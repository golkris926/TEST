const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or 'smtp.gmail.com'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App-specific password
    }
  });
};

module.exports = { createTransporter };