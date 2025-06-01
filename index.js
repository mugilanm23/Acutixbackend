const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Missing EMAIL_USER or EMAIL_PASS in .env');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: ['https://acutix-website.vercel.app'], // replace with your frontend domain
  methods: ['GET','POST'],
  credentials: true
}));
app.use(express.json());

// Reusable mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Utility to send email
function sendMail({ subject, text, html }, res, successMessage) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'proprietor@digitaltouchcorp.com',
    subject,
    text,
    html
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error('Mail error:', err);
      return res.status(500).json({ message: 'Failed to send mail.' });
    }
    res.status(200).json({ message: successMessage });
  });
}

// Contact form API
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, helpType, additionalInfo } = req.body;

  const subject = `New Contact: ${helpType}`;
  const text = `
    First Name: ${firstName}
    Last Name: ${lastName}
    Email: ${email}
    Phone: ${phone}
    Purpose: ${helpType}
    Additional Info: ${additionalInfo || 'N/A'}
  `;

  const html = `
    <h3>Contact Form Submission</h3>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Purpose:</strong> ${helpType}</p>
    <p><strong>Additional Info:</strong><br/>${additionalInfo || 'N/A'}</p>
  `;

  sendMail({ subject, text, html }, res, 'Form submitted successfully!');
});

// Schedule call/meeting API
app.post('/api/schedule', (req, res) => {
  const { name, email, type, date, time, additionalInfo } = req.body;

  const subject = `New ${type} Request`;
  const text = `
    Name: ${name}
    Email: ${email}
    Type: ${type}
    Date: ${date}
    Time: ${time}
    Additional Info: ${additionalInfo || 'N/A'}
  `;

  const html = `
    <h3>Schedule Request</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Additional Info:</strong><br/>${additionalInfo || 'N/A'}</p>
  `;

  sendMail({ subject, text, html }, res, 'Schedule request submitted successfully!');
});

// Tech meetup API
app.post('/api/schedule-meetup', (req, res) => {
  const { topic, date, time, host, mode, description } = req.body;

  const subject = `Tech Meetup Scheduled: ${topic}`;
  const text = `
    Topic: ${topic}
    Date: ${date}
    Time: ${time}
    Host: ${host}
    Mode: ${mode}
    Description: ${description}
  `;

  const html = `
    <h3>Tech Meetup Request</h3>
    <p><strong>Topic:</strong> ${topic}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Host:</strong> ${host}</p>
    <p><strong>Mode:</strong> ${mode}</p>
    <p><strong>Description:</strong><br/>${description}</p>
  `;

  sendMail({ subject, text, html }, res, 'Meetup mail sent successfully');
});

// Internship API
app.post('/api/apply-internship', (req, res) => {
  const { name, email, phone, college, department,year, domain, message } = req.body;

  const subject = `Internship Application - ${name}`;
  const text = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    College: ${college}
    Department: ${department}
    Year:${year}
    Domain: ${domain}
    Message: ${message}
  `;

  const html = `
    <h3>Internship Application</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>College:</strong> ${college}</p>
    <p><strong>Department:</strong> ${department}</p>
    <p><strong>Year:</strong> ${year}</p>
    <p><strong>Domain:</strong> ${domain}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `;

  sendMail({ subject, text, html }, res, 'Internship application sent successfully');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 