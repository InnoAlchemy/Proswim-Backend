const Brand = require("../../models/Shop/Brand");

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.getAllBrands();
    res.status(200).json({
      success: true,
      message: "Brands retrieved successfully.",
      data: brands,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Brands.",
    });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const { title, is_active } = req.body;
    const data = await Brand.createBrand(title, is_active);
    res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error creating Brand.",
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id, title, is_active } = req.body;
    const brand = await Brand.updateBrand(id, title, is_active);
    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      data: brand,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error updating Brand.",
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    await Brand.deleteBrand(id);
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Brand.",
    });
  }
};
