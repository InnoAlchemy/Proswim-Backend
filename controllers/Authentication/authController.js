const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const OTP = require("../../models/OTP");
const { OAuth2Client } = require("google-auth-library");

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
    const newUser = await User.createUser(
      id,
      email,
      hashedPassword,
      is_verified,
      role
    );
    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User signed up successfully.",
        data: {
          userId: id,
        },
      });
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

    res.json({
      success: true,
      message: "User signed in successfully.",
      data: {
        token: token,
      },
    });
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
    const id = payload["sub"];
    const email = payload["email"];

    let existingUser = await User.findByEmail(email);
    if (!existingUser) {
      const hashedPassword = null;
      const is_verified = 0;
      const role = "user";
      existingUser = await User.createUser(
        id,
        email,
        hashedPassword,
        is_verified,
        role
      );
    }

    const jwtToken = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
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

    const createdToken = await OTP.createOtp(email, resetToken, expiryTime);
    if (!createdToken) {
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
        console.log(err);

        return res.status(500).json({ message: "Failed to send email" });
      }

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function generateAndSendOtp(email, res) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 300000); // OTP valid for 5 minutes

  // Store OTP in the database
  OTP.createOtp(email, otp, expiresAt)
    .then(() => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error) => {
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
    })
    .catch((err) => {
      return res.status(500).json({
        error: true,
        message: "Failed to create OTP.",
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

  try {
    const storedOtpData = await OTP.findOtpByEmail(email);

    if (!storedOtpData || new Date() > new Date(storedOtpData.expires_at)) {
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

    // OTP verified, so delete it
    await OTP.deleteOtpByEmail(email);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};
