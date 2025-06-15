export const Verification_Email_Template = `
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color:rgb(59, 130, 246);
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .userName{
          font-size:19px;
          font-weight: bold;
          text-transform: capitalize;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-email
           {
              display: block;
              margin: 20px 0;
              font-size: 15px;
              color: black;
              background:rgb(232, 245, 233);
              border: 1px dashed rgb(59, 130, 246);
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello <span class='userName'>{userName}</span>,</p>
              <p>We received a request to reset the password for your account associated with this email address</p>
              <p>If you made this request, please click the link below to reset your password</p>
              <span class="verification-email">{verificationEmail}</span>
              <p>This link will expire in 10 minutes for security reasons. If you didn’t request a password reset, you can safely ignore this email — your password will remain unchanged.

                Thanks,</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ReelMates. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
