const Category = require("../../models/Shop/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Categories.",
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { id, title, is_active } = req.body;
    await Category.createCategory(id, title, is_active);
    const category = await Category.getCategory(id);
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error creating Category.",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id, title, is_active } = req.body;
    const category = await Category.updateCategory(id, title, is_active);
    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating Category.",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Category.",
    });
  }
};
