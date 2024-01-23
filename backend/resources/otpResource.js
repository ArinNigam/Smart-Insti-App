const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


// Nodemailer configuration using Ethereal
async function getTestAccount() {
  return nodemailer.createTestAccount();
}

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'sigrid15@ethereal.email',
    pass: 'M6t3PqMAAzkw4bHK6E',
  },
});

// Store generated OTPs temporarily (for demo purposes)
const otpStorage = new Map();

otpRouter.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate OTP
  const otp = generateOTP();
  console.log(otp);
  // Store OTP with the associated email
  otpStorage.set(email, otp);

  // Nodemailer options
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'OTP for Login',
    text: `Your OTP for login is: ${otp}`
  };

  // Send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }
    res.json({ message: 'OTP sent successfully', email });
  });
});

otpRouter.post('/verify-otp', (req, res) => {s
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  // Retrieve stored OTP for the email
  const storedOTP = otpStorage.get(email);

  if (!storedOTP) {
    return res.status(400).json({ error: 'No OTP found for the email' });
  }

  // Compare the provided OTP with the stored OTP
  if (otp === storedOTP) {
    // Clear OTP from storage after successful verification (for demo purposes)
    otpStorage.delete(email);
    return res.json({ message: 'OTP verified successfully' });
  }

  res.status(400).json({ error: 'Incorrect OTP' });
});

export default otpRouter