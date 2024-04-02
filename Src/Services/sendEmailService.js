import nodemailer from "nodemailer";

async function sendEmailService({
  to = "",
  subject = "Hello User",
  message = "",
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: "abdoosama087@gmail.com",
      pass: "gyqr sozn yxoh bmsq",
    },
  });

  const emailInfo = await transporter.sendMail({
    from: '"SarahaApp 👻" <abdoosama087@gmail.com>',
    to,
    subject,
    html: message,
    attachments,
  });
  console.log(emailInfo);
}

export default sendEmailService;
