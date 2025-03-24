import nodemailer from 'nodemailer';
import { APP_URL } from "@/constants/paths"
import { Resend } from 'resend';
import { text } from 'stream/consumers';

// Function to get the current domain
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.origin;
  } else {
    // Server-side
    return APP_URL || 'https://dormbiz.net'; // Fallback to localhost if env var is not set
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to create HTML template
const createEmailTemplate = (title: string, body: string, buttonText: string, buttonLink: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${title}</h1>
      <p>${body}</p>
      <a href="${buttonLink}" class="button">${buttonText}</a>
    </div>
  </body>
  </html>
`;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const domain = getCurrentDomain();
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const mailOptions = {
    from: 'notifications@dormbiz.net',
    to: email,
    subject: 'Reset your password',
    text: `You have requested to reset your password. Click the button below to set a new password: ${resetLink}`,
    html: createEmailTemplate(
      'Reset Your Password',
      'You have requested to reset your password. Click the button below to set a new password:',
      'Reset Password',
      resetLink
    )
  };

  await resend.emails.send(mailOptions);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const domain = getCurrentDomain();
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const mailOptions = {
    from: 'notifications@dormbiz.net',
    to: email,
    subject: 'Confirm your email',
    text: `Thank you for signing up! Please confirm your email address by clicking the button below: ${confirmLink}`,
    html: createEmailTemplate(
      'Confirm Your Email',
      'Thank you for signing up! Please confirm your email address by clicking the button below:',
      'Confirm Email',
      confirmLink
    )
  };

  await resend.emails.send(mailOptions);
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const domain = getCurrentDomain();
  const mailOptions = {
    from: 'notifications@dormbiz.net',
    to: email,
    subject: '2FA Code',
    text: `Your 2FA code is: ${token}. This code will expire in 5 minutes.`,
    html: createEmailTemplate(
      'Your Two-Factor Authentication Code',
      `Your 2FA code is: <strong>${token}</strong>. This code will expire in 5 minutes.`,
      'Enter Code',
      `${domain}/auth/two-factor`
    )
  };

  await resend.emails.send(mailOptions);
};


interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 0.8em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${subject}</h1>
      </div>
      <div class="content">
        ${html || `<p>${text}</p>`}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} DormBiz. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  await resend.emails.send({
    from: "notifications@dormbiz.net",
    to,
    subject,
    text,
    html: emailTemplate,
  })
}
