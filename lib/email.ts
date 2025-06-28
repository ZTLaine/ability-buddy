import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Ability Buddy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function generatePasswordResetEmail(resetUrl: string, userName?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFFDE7; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #B39DDB; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            .logo { color: #00796B; font-size: 24px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🌿 Ability Buddy</div>
            </div>
            <div class="content">
                <h2 style="color: #00796B;">Password Reset Request</h2>
                <p>Hello${userName ? ` ${userName}` : ''},</p>
                <p>We received a request to reset your password for your Ability Buddy account.</p>
                <p>Click the button below to set a new password:</p>
                <p style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p><strong>This link will expire in 15 minutes</strong> for security reasons.</p>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                <p>Need help? Reply to this email or contact us at ${process.env.SMTP_USER}</p>
            </div>
            <div class="footer">
                <p>© 2024 Ability Buddy - Empowering independence through shared knowledge</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset Request - Ability Buddy

    Hello${userName ? ` ${userName}` : ''},

    We received a request to reset your password for your Ability Buddy account.

    Reset your password by visiting this link:
    ${resetUrl}

    This link will expire in 15 minutes for security reasons.

    If you didn't request this password reset, you can safely ignore this email.

    Need help? Contact us at ${process.env.SMTP_USER}

    © 2025 Ability Buddy - Empowering independence through shared knowledge
  `;

  return { html, text };
} 