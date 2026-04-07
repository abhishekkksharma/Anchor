const nodemailer = require("nodemailer");
const User = require("../models/user.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Anchor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verify your account</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">

            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                  <h2 style="margin:0;">Anchor</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333;">
                  
                  <h3 style="margin-top:0;">Verify your account</h3>
                  
                  <p>Hello,</p>
                  
                  <p>Use the following One-Time Password (OTP) to complete your verification process:</p>

                  <!-- OTP Box -->
                  <div style="text-align:center; margin:30px 0;">
                    <span style="display:inline-block; font-size:28px; letter-spacing:8px; padding:15px 25px; background:#f1f5f9; border-radius:8px; font-weight:bold;">
                      ${otp}
                    </span>
                  </div>

                  <p>This OTP is valid for <strong>5 minutes</strong>.</p>

                  <p>If you didn’t request this, you can safely ignore this email.</p>

                  <p style="margin-top:30px;">Thanks,<br/>Anchor Team</p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
                  © ${new Date().getFullYear()} Anchor Community. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
  });
};

// const nodemailer = require("nodemailer");

async function SendConnectionMail({ toEmail, fromUser }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const profileUrl = `https://anchor-ten-pi.vercel.app/profile/${fromUser.username || fromUser._id}`;

  const mailOptions = {
    from: `"Anchor" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${fromUser.name} sent you a connection request`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Connection Request</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">

            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
              
              <!-- Header -->
              <tr>
                <td style="background:#000000; padding:20px; text-align:center; color:#ffffff;">
                  <h2 style="margin:0;">Anchor</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333;">
                  
                  <h3 style="margin-top:0;">New Connection Request</h3>
                  
                  <p>Hello,</p>
                  
                  <p>
                    <strong>${fromUser.name}</strong> wants to connect with you on <strong>Anchor</strong>.
                  </p>

                  <!-- User Info Card -->
                  <div style="margin:20px 0; padding:15px; background:#f9fafb; border-radius:8px;">
                    <p style="margin:0;"><strong>Name:</strong> ${fromUser.name}</p>
                    <p style="margin:5px 0 0;"><strong>Email:</strong> ${fromUser.email}</p>
                  </div>

                  <p>You can view their profile and decide whether to connect:</p>

                  <!-- CTA Button -->
                  <div style="text-align:center; margin:30px 0;">
                    <a href="${profileUrl}" 
                      style="display:inline-block; padding:12px 24px; background:#000000; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">
                      View Profile
                    </a>
                  </div>

                  <p>If you’re interested, you can connect directly from their profile.</p>

                  <p style="margin-top:30px;">Thanks,<br/>Anchor Team</p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
                  © ${new Date().getFullYear()} Anchor Community. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = {sendOTP,SendConnectionMail};
