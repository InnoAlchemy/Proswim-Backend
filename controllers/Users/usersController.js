const jwt = require("jsonwebtoken");
const User = require("../../models/User");

exports.get_user_details = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully.",
      data: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving user details.",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { id } = req.query;
    let users;
    if (id) {
      users = await User.findById(id);
      if (!users) {
        return res.status(404).json({
          error: true,
          message: "User not found.",
        });
      }
      users = [users];
    } else {
      users = await User.getAllUsers();
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving users.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await User.deleteUser(id);
    if (affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting user.",
    });
  }
};
