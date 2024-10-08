const express = require("express");
const Location = require("../../models/Locations");
const router = express.Router();

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.getAllLocations();
    const formattedLocations = locations.map((location) => ({
      id: location.id,
      image: location.image,
      supervisor: location.supervisor,
      phone_number: location.phone_number,
      website: location.website,
      info: location.info,
      is_active: location.is_active,
    }));

    res.status(200).json({
      success: true,
      message: "Locations retrieved successfully.",
      data: formattedLocations,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error retrieving Locations.",
    });
  }
};

//
exports.addLocations = async (req, res) => {
  try {
    const { supervisor, phone_number, website, info, is_active } = req.body;
    const image = req.file ? req.file.filename : null;
    const data = await Location.createLocation(
      image,
      supervisor,
      phone_number,
      website,
      info,
      is_active
    );
    res.status(200).json({
      success: true,
      message: "Location created successfully.",
      data: [data],
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error creating location.",
    });
  }
};

exports.updateLocations = async (req, res) => {
  try {
    const { supervisor, phone_number, website, info, is_active } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.filename : null;

    const locationData = {
      image,
      supervisor,
      phone_number,
      website,
      info,
      is_active,
    };

    const location = await Location.updateLocation(id, locationData);
    res.status(200).json({
      success: true,
      message: "Location updated successfully.",
      data: {
        id: location.id,
        image: location.image,
        supervisor: location.supervisor,
        phone_number: location.phone_number,
        website: location.website,
        info: location.info,
        is_active: location.is_active,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error updating location.",
    });
  }
};

exports.deleteLocations = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const location = await Location.deleteLocation(id);
    console.log(location);
    if (location) {
      res.status(200).json({
        success: true,
        message: "Location Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting location.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
