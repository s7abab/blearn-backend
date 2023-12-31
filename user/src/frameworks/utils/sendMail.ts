require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: "nfqa qlrp fyxs pzky",
    },
  });
  const { email, subject, template, data } = options;
  // get path to the email template file
  const ejsTemplate = await ejs.renderFile(
    path.join(__dirname, "../mails/activation-mail.ejs"),
    data
  );
  const templatePath = path.join(__dirname, "../mails", template);

  // render the email with ejs
  const html = await ejs.renderFile(templatePath, data);

  // send the email
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
