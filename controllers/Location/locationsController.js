const express = require("express");
const Location = require("../../models/Locations");
const router = express.Router();

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.getAllLocations();
    console.log(locations);
    if (locations.length > 0) {
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
    } else {
      res.status(404).json({
        success: false,
        message: "No locations found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addLocations = async (req, res) => {
  try {
    const { id, image, supervisor, phone_number, website, info, is_active } =
      req.body;

    await Location.createLocation(
      id,
      image,
      supervisor,
      phone_number,
      website,
      info,
      is_active
    );

    const location = await Location.getLocation(id);
    if (location) {
      const formattedLocations = {
        id,
        image,
        supervisor,
        phone_number,
        website,
        info,
        is_active,
      };

      res.status(200).json({
        success: true,
        message: "Location Created Succefully.",
        data: formattedLocations,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating location.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updateLocations = async (req, res) => {
  try {
    const { id, image, supervisor, phone_number, website, info, is_active } =
      req.body;
    console.log(req.body);
    const location = await Location.updateLocation(
      id,
      image,
      supervisor,
      phone_number,
      website,
      info,
      is_active
    );
    if (location) {
      const formattedLocations = {
        id,
        image,
        supervisor,
        phone_number,
        website,
        info,
        is_active,
      };

      res.status(200).json({
        success: true,
        message: "Location Updated Succefully.",
        data: formattedLocations,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating location.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

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
