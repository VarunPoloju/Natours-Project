const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a Transporter --> it's just a service that will actually end the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  // 2)Define the email options
  const mailOptions = {
    from: 'varun Poloju <varunpoloju@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :
  };

  // 3)Send email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
