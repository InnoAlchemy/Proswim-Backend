const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Token = require("../models/Token");

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res) => {
  const { id, email, password, is_verified, role } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    if (await User.createUser(id, email, hashedPassword, is_verified, role)) {
      res.status(201).json({ message: "User registered successfully." });
    } else {
      res.status(500).json({ message: "User was not registered." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.google_signin = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const Id = payload["sub"];
    const email = payload["email"];

    const existingUser = await User.findByEmail(email);
    if (!existingUser) {
      hashedPassword = null;
      is_verified = 0;
      role = "user";
      await User.createUser(id, email, hashedPassword, is_verified, role);
    }

    const jwtToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "User signed in with Google successfully.",
      data: {
        token: jwtToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Invalid Google token.",
    });
  }
};

exports.forgot_password = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      return res.status(404).json({ message: "Email not found" });
    }
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const expiryTime = Date.now() + 3600000; // 1 h

    const createdToken = await Token.createToken(email, resetToken, expiryTime);
    if (createdToken !== resetToken) {
      return res.status(500).json({ message: "Failed to create token" });
    }

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to send email" });
      }

      res.status(200).json({ message: "Password reset link sent" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function generateAndSendOtp(email, res) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; // OTP valid for 5 mins

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        error: true,
        message: "Error sending OTP.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  });
}

exports.send_otp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required.",
    });
  }

  generateAndSendOtp(email, res);
};

exports.verify_otp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      error: true,
      message: "Email and OTP are required.",
    });
  }

  const storedOtpData = otpStore[email];

  if (!storedOtpData || Date.now() > storedOtpData.expiresAt) {
    return res.status(400).json({
      error: true,
      message: "OTP expired or invalid.",
    });
  }

  if (storedOtpData.otp !== otp) {
    return res.status(400).json({
      error: true,
      message: "Invalid OTP.",
    });
  }

  delete otpStore[email];
  return res.status(200).json({
    success: true,
    message: "OTP verified successfully.",
  });
};
