import nodemailer from 'nodemailer';

// Function to get the current domain
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.origin;
  } else {
    // Server-side
    return process.env.NEXT_PUBLIC_APP_URL || 'https://unihive-v1.vercel.app'; // Fallback to localhost if env var is not set
  }
};

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thomsonnguems@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Use an app password for security
  }
});

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
    from: 'thomsonnguems@gmail.com',
    to: email,
    subject: 'Reset your password',
    html: createEmailTemplate(
      'Reset Your Password',
      'You have requested to reset your password. Click the button below to set a new password:',
      'Reset Password',
      resetLink
    )
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const domain = getCurrentDomain();
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const mailOptions = {
    from: 'thomsonnguems@gmail.com',
    to: email,
    subject: 'Confirm your email',
    html: createEmailTemplate(
      'Confirm Your Email',
      'Thank you for signing up! Please confirm your email address by clicking the button below:',
      'Confirm Email',
      confirmLink
    )
  };

  await transporter.sendMail(mailOptions);
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const domain = getCurrentDomain();
  const mailOptions = {
    from: 'thomsonnguems@gmail.com',
    to: email,
    subject: '2FA Code',
    html: createEmailTemplate(
      'Your Two-Factor Authentication Code',
      `Your 2FA code is: <strong>${token}</strong>. This code will expire in 5 minutes.`,
      'Enter Code',
      `${domain}/auth/two-factor`
    )
  };

  await transporter.sendMail(mailOptions);
};