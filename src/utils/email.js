// const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

exports.sendEmail = async (to, subject, text) => {
  await resend.emails.send({
    from: 'Auth System <onboarding@resend.dev>',
    to,
    subject,
    html: `
      <div style="font-family: sans-serif">
        <h2>${subject}</h2>
        <p>${text}</p>
      </div>
    `,
  });
};

// exports.sendEmail = (to, subject, text) =>
//   transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
