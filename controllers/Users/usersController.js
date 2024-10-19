const jwt = require("jsonwebtoken");
const User = require("../../models/User");

exports.get_user_details = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error token." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users." });
  }
};
