require("dotenv").config({ path: "../config/config.env" });
const sendOTP = require('./mailer');

(async () => {
  try {
    await sendOTP("abhisheksharma7340733@gmail.com", 1298);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error:", error);
  }
})();