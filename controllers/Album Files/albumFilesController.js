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
        file: albumFile.file,
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
    const { title, album_id, collection_number, file, short_description } =
      req.body;

    const data = await AlbumFiles.createAlbumFile(
      title,
      album_id,
      collection_number,
      file,
      short_description
    );
    res.status(200).json({
      success: true,
      message: "Album Files Created Succefully.",
      data: [data],
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error creating Album Files.",
    });
  }
};
//
exports.updateAlbumFile = async (req, res) => {
  try {
    const { id, title, album_id, collection_number, file, short_description } =
      req.body;
    console.log(req.body);
    const albumFile = await AlbumFiles.updateAlbumFile(
      id,
      title,
      album_id,
      collection_number,
      file,
      short_description
    );
    if (albumFile) {
      const formattedAlbumFiles = {
        id: albumFile.id,
        title: albumFile.title,
        album_id: albumFile.album_id,
        collection_number: albumFile.collection_number,
        file: albumFile.file,
        short_description: albumFile.short_description,
      };

      res.status(200).json({
        success: true,
        message: "Album Files Updated Succefully.",
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
    console.log(id);
    const albumFile = await AlbumFiles.deleteAlbumFile(id);
    console.log(albumFile);
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
