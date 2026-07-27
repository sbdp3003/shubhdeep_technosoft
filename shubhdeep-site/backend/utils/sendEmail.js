import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT) || 587,
  //   secure: Number(process.env.SMTP_PORT) === 465,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS
  //   }
  // });
transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});







  return transporter;
}

export async function sendEmail({ to, subject, html, replyTo }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[sendEmail] SMTP env vars not set — skipping email send.');
    return false;
  }

  try {
    const t = getTransporter();
    await t.sendMail({
      from: `"Shubhdeep Technosoft Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo,
      subject,
      html
    });
    return true;
  } catch (err) {
    console.error('[sendEmail] Failed to send email:', err.message);
    return false;
  }
}

export default sendEmail;