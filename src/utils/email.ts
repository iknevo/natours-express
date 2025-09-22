import config from "@/config/config";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type Options = {
  email: string;
  subject: string;
  message: string;
};

export const sendEmail = async (options: Options) => {
  const optionsSMTP: SMTPTransport.Options = {
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.username,
      pass: config.email.password,
    },
  };
  const transporter = nodemailer.createTransport(optionsSMTP);
  const mailOptions = {
    from: "NEVO <iknevo.dev@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
