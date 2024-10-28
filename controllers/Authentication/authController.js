const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/User");
const OTP = require("../../models/OTP");
const { sendEmail } = require("../../helper/emailService"); // Import the email service

/**
 * User signup function.
 */
exports.signup = async (req, res) => {
  const { email, password, is_verified, role } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(
      email,
      hashedPassword,
      is_verified,
      role
    );

    const user = await User.findById(newUser);

    res.status(201).json({
      success: true,
      message: "User signed up successfully.",
      data: { userId: user.id },
    });
  } catch (error) {
    res.status(400).json({ message: "User was not registered." });
  }
};

/**
 * User signin function.
 */
exports.signin = async (req, res) => {
  const { email, password } = req.body;

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
      data: { token },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Google signin function.
 */
exports.google_signin = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: true, message: "Token is required." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let existingUser = await User.findByEmail(email);
    if (!existingUser) {
      existingUser = await User.createUser(email, null, 0, "user");
    }

    const jwtToken = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "User signed in with Google successfully.",
      data: { token: jwtToken },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Google token." });
  }
};

/**
 * Forgot password function.
 */
exports.forgot_password = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "Email not found." });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const expiryTime = Date.now() + 3600000; // 1 hour

    const createdToken = await OTP.createOtp(email, resetToken, expiryTime);
    if (!createdToken) {
      return res.status(500).json({ message: "Failed to create token." });
    }

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
    const subject = "Password Reset";
    const text = `You requested a password reset. Click this link to reset your password: ${resetUrl}`;

    // Send the reset password email
    sendEmail(email, subject, text)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Password reset email sent successfully.",
        });
      })
      .catch(() => {
        res.status(500).json({ message: "Failed to send email." });
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Generate and send OTP function.
 */
function generateAndSendOtp(email, res) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 300000); // OTP valid for 5 minutes

  OTP.createOtp(email, otp, expiresAt)
    .then(() => {
      const subject = "Your OTP Code";
      const text = `Your OTP code is ${otp}`;

      // Send OTP email
      sendEmail(email, subject, text)
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "OTP sent successfully." });
        })
        .catch(() => {
          res.status(400).json({ error: true, message: "Error sending OTP." });
        });
    })
    .catch(() => {
      res.status(500).json({ error: true, message: "Failed to create OTP." });
    });
}

/**
 * Send OTP function.
 */
exports.send_otp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required." });
  }

  generateAndSendOtp(email, res);
};

/**
 * Verify OTP function.
 */
exports.verify_otp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ error: true, message: "Email and OTP are required." });
  }

  try {
    const storedOtpData = await OTP.findOtpByEmail(email);

    if (!storedOtpData || new Date() > new Date(storedOtpData.expires_at)) {
      return res
        .status(400)
        .json({ error: true, message: "OTP expired or invalid." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ error: true, message: "Invalid OTP." });
    }

    await OTP.deleteOtpByEmail(email); // OTP verified, delete it

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server error." });
  }
};
