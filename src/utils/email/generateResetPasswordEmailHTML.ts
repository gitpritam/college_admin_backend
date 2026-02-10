/**
 * Generates HTML content for password reset email
 * @param {string} name - The name of the recipient
 * @param {string} token - The password reset token
 * @returns {string} - The complete HTML email content
 */
const generateResetPasswordEmailHTML = (
  name: string,
  token: string,
): string => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            margin: 15px 0;
            font-size: 16px;
          }
          .content .greeting {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .reset-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          .token-info {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .token-info p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning p {
            margin: 5px 0;
            color: #856404;
            font-size: 14px;
          }
          .footer {
            background-color: #f9f9f9;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p class="greeting">Hello ${name},</p>
            <p>We received a request to reset the password for your College Admin account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div class="button-container">
              <a href="${resetUrl}" class="reset-button">Reset Password</a>
            </div>

            <div class="token-info">
              <p><strong>Alternative Method:</strong></p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            </div>

            <div class="warning">
              <p><strong>⚠️ Important:</strong></p>
              <p>• This link will expire in 15 minutes</p>
              <p>• If you didn't request this password reset, please ignore this email</p>
              <p>• Your password won't change until you access the link above and create a new one</p>
            </div>
          </div>
          <div class="footer">
            <p><strong>College Admin</strong></p>
            <p>&copy; ${new Date().getFullYear()} College Admin. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default generateResetPasswordEmailHTML;
