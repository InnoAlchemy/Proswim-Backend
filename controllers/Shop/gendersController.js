const Gender = require("../../models/Shop/Gender");

exports.getGenders = async (req, res) => {
  try {
    const genders = await Gender.getAllGenders();
    res.status(200).json({
      success: true,
      message: "Genders retrieved successfully.",
      data: genders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Genders.",
    });
  }
};

exports.addGender = async (req, res) => {
  try {
    console.log(req.body);
    const { title, is_active } = req.body;
    const data = await Gender.createGender(title, is_active);
    res.status(201).json({
      success: true,
      message: "Gender created successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error creating Gender.",
    });
  }
};

exports.updateGender = async (req, res) => {
  try {
    const { id, title, is_active } = req.body;
    const gender = await Gender.updateGender(id, title, is_active);
    res.status(200).json({
      success: true,
      message: "Gender updated successfully.",
      data: gender,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating Gender.",
    });
  }
};

exports.deleteGender = async (req, res) => {
  try {
    const id = req.params.id;
    await Gender.deleteGender(id);
    res.status(200).json({
      success: true,
      message: "Gender deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Gender.",
    });
  }
};
