const express = require("express");
const Album = require("../../models/Albums");
const router = express.Router();

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.getAllAlbums();
    console.log(albums);
    if (albums.length > 0) {
      const formattedAlbums = albums.map((album) => ({
        id: album.id,
        title: album.title,
        description: album.description,
      }));

      res.status(200).json({
        success: true,
        message: "Albums retrieved successfully.",
        data: formattedAlbums,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No albums found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addAlbums = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    await Album.createAlbum(id, title, description);

    const album = await Album.getAlbum(id);
    if (album) {
      const formattedAlbums = {
        id: album.id,
        title: album.title,
        description: album.description,
      };

      res.status(200).json({
        success: true,
        message: "Album Created Succefully.",
        data: formattedAlbums,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating album.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//
exports.updateAlbums = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    console.log(req.body);
    const album = await Album.updateAlbum(id, title, description);
    if (album) {
      const formattedAlbums = {
        id: album.id,
        title: album.title,
        description: album.description,
      };

      res.status(200).json({
        success: true,
        message: "Album Updated Succefully.",
        data: formattedAlbums,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error creating album.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
//

exports.deleteAlbums = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const album = await Album.deleteAlbum(id);
    console.log(album);
    if (album) {
      res.status(200).json({
        success: true,
        message: "Album Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting album.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
