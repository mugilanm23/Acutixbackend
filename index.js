const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send mail
function sendMail(subject, text, html, callback) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // authenticated sender
    to: 'mugilanm23112005@gmail.com',
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, callback);
}

// Schedule API
app.post('/api/schedule', async (req, res) => {
  const { name, email, type, date, time, additionalInfo } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Must be your authenticated email
    to: 'mugilanm23112005@gmail.com',
    subject: `New Schedule Request: ${type}`,
    text: `
      Name: ${name}
      Email: ${email}
      Type: ${type}
      Date: ${date}
      Time: ${time}
      Additional Info: ${additionalInfo || 'N/A'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Schedule request submitted successfully!' });
  } catch (error) {
    console.error('Error sending schedule mail:', error);
    res.status(500).json({ message: 'Failed to send schedule request.' });
  }
});

// Contact form API
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, helpType, additionalInfo } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mugilanm23112005@gmail.com',
    subject: `New Contact Form Submission: ${helpType}`,
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Phone: ${phone}
      Help Type: ${helpType}
      Additional Info: ${additionalInfo || 'N/A'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error sending contact mail:', error);
    res.status(500).json({ message: 'Failed to send form.' });
  }
});

// Schedule Meetup API
app.post('/api/schedule-meetup', (req, res) => {
  const { topic, date, time, host, mode, description } = req.body;

  const subject = `New Tech Meetup Scheduled: ${topic}`;
  const text = `
    Topic: ${topic}
    Date: ${date}
    Time: ${time}
    Host: ${host}
    Mode: ${mode}
    Description: ${description}
  `;

  const html = `
    <h2>Tech Meetup Request</h2>
    <p><strong>Topic:</strong> ${topic}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Host:</strong> ${host}</p>
    <p><strong>Mode:</strong> ${mode}</p>
    <p><strong>Description:</strong><br/>${description}</p>
  `;

  sendMail(subject, text, html, (err) => {
    if (err) {
      console.error('Error sending meetup mail:', err);
      return res.status(500).json({ message: 'Failed to send mail' });
    }
    res.status(200).json({ message: 'Meetup mail sent successfully' });
  });
});

// Internship Application API
app.post('/api/apply-internship', (req, res) => {
  const { name, email, phone, college, department, year, message } = req.body;

  const subject = `New Internship Application from ${name}`;
  const text = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    College: ${college}
    Department: ${department}
    Year: ${year}
    Message: ${message}
  `;

  const html = `
    <h2>Internship Application</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>College:</strong> ${college}</p>
    <p><strong>Department:</strong> ${department}</p>
    <p><strong>Year:</strong> ${year}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `;

  sendMail(subject, text, html, (err) => {
    if (err) {
      console.error('Error sending internship mail:', err);
      return res.status(500).json({ message: 'Failed to send mail' });
    }
    res.status(200).json({ message: 'Internship application sent successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
