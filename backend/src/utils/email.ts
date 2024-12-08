import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { convert } from 'html-to-text';
import brevo, { TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

class Email {
  constructor() {}
  transporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: Number(process.env.BREVO_PORT),
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_KEY,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template: string, subject: string, data: any) {
    ejs.renderFile(
      `${__dirname}/../view/emails/${template}.ejs`,
      { ...data },
      (err, result) => {
        if (err) {
          throw err;
        } else {
          const mailOptions = {
            from:
              process.env.NODE_ENV === 'development'
                ? process.env.EMAIL_SENDER
                : process.env.SENDER_EMAIL,
            to: data.email,
            subject,
            html: result,
            text: convert(result),
          };
          return this.transporter().sendMail(mailOptions);
        }
      }
    );
  }
  async sendVerificationEmail(data: any) {
    await this.send('emailVerification', 'Email Verification', data);
  }
  async sendPasswordResetEmail(data: any) {
    await this.send(
      'passwordResetEmail',
      'Password Reset: expires in 20 minutes',
      data
    );
  }
  async sendAdminEmailVerification(data: any) {
    await this.send(
      'adminEmailVerification',
      'You have being made an Admin of Mettyhair',
      data
    );
  }
}

export default new Email();
