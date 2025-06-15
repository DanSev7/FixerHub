const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, otp) => {
  // Configure transporter (use environment variables in production)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Use Gmail; replace with your email service
    auth: {
      user: process.env.EMAIL_USER || 'daniel.ayele@anbesg.com',
      pass: process.env.EMAIL_PASS || 'lonjvqsuqrbdaled',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'daniel.ayele@anbesg.com',
    to: email,
    subject: 'Verify Your FixerHub Account',
    text: `Your verification OTP is: ${otp}. This code expires in 10 minutes. Do not share it with anyone.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };