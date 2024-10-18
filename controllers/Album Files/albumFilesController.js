const express = require("express");
const AlbumFiles = require("../../models/AlbumFiles");
const router = express.Router();

exports.getAlbumFiles = async (req, res) => {
  try {
    const albumFiles = await AlbumFiles.getAllAlbumFiles();
    if (albumFiles.length > 0) {
      const formattedAlbumFiles = albumFiles.map((albumFile) => ({
        id: albumFile.id,
        title: albumFile.title,
        album_id: albumFile.album_id,
        collection_number: albumFile.collection_number,
        files: JSON.parse(albumFile.files),
        short_description: albumFile.short_description,
      }));

      res.status(200).json({
        success: true,
        message: "Album Files retrieved successfully.",
        data: formattedAlbumFiles,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Album Files found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.addAlbumFile = async (req, res) => {
  try {
    const { title, album_id, collection_number, short_description } = req.body;
    const files = req.files ? req.files.map((file) => file.filename) : [];
    const parsedfiles = typeof images === "string" ? JSON.parse(files) : files;

    const data = await AlbumFiles.createAlbumFile(
      title,
      album_id,
      collection_number,
      JSON.stringify(parsedfiles), // Store files as an array
      short_description
    );
    res.status(200).json({
      success: true,
      message: "Album Files Created Successfully.",
      data: [
        {
          ...data,
          files: JSON.parse(data.files),
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: true,
      message: "Error creating Album Files.",
    });
  }
};
//
exports.updateAlbumFile = async (req, res) => {
  try {
    const { title, album_id, collection_number, short_description } = req.body;
    const id = req.params.id;
    let files = req.files ? req.files.map((file) => file.filename) : [];

    const parsedfiles = files.length > 0 ? JSON.stringify(files) : null;

    const albumFile = await AlbumFiles.updateAlbumFile(
      id,
      title,
      album_id,
      collection_number,
      parsedfiles,
      short_description
    );

    if (albumFile) {
      const formattedAlbumFiles = {
        id: albumFile.id,
        title: albumFile.title,
        album_id: albumFile.album_id,
        collection_number: albumFile.collection_number,
        files: albumFile.files ? JSON.parse(albumFile.files) : [],
        short_description: albumFile.short_description,
      };

      res.status(200).json({
        success: true,
        message: "Album Files Updated Successfully.",
        data: formattedAlbumFiles,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error Updating Album Files.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

//

exports.deleteAlbumFile = async (req, res) => {
  try {
    const id = req.params.id;
    const albumFile = await AlbumFiles.deleteAlbumFile(id);
    if (albumFile) {
      res.status(200).json({
        success: true,
        message: "Album Files Deleted Succefully.",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Error deleting Album Files.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
