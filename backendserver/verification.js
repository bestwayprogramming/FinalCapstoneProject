const nodemailer = require("nodemailer");
const twilio = require("twilio");
const otpGenerator = require("otp-generator");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOtp = () => {
  return otpGenerator.generate(6, { upperCase: false, specialChars: false });
};

export const sendOtp = async (contact, method) => {
  const otp = generateOtp();

  if (method === "email") {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact,
        subject: "OTP Verification",
        text: `Your OTP code is: ${otp}`,
      });
      return { success: true };
    } catch (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send OTP");
    }
  } else if (method === "mobile") {
    try {
      await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact,
      });
      return { success: true };
    } catch (error) {
      console.error("SMS send error:", error);
      throw new Error("Failed to send OTP");
    }
  }
};
