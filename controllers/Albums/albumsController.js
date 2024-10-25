const express = require("express");
const Album = require("../../models/Albums");
const AlbumFiles = require("../../models/AlbumFiles");

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

exports.getAlbumsAndFiles = async (req, res) => {
  try {
    const { id } = req.params;
    let albums = await Album.getAllAlbums();
    let albumFiles = await AlbumFiles.getAllAlbumFiles();

    if (id) {
      albums = albums.filter((album) => album.id == id);
      albumFiles = albumFiles.filter((file) => file.album_id == id);
    }

    if (albums.length > 0 && albumFiles.length > 0) {
      const formattedAlbums = albums.map((album) => {
        const filesForAlbum = albumFiles
          .filter((file) => file.album_id == album.id)
          .reduce((acc, albumFile) => {
            const collectionNumber = albumFile.collection_number;
            if (!acc[collectionNumber]) {
              acc[collectionNumber] = [];
            }
            acc[collectionNumber].push({
              id: albumFile.id,
              title: albumFile.title,
              files: JSON.parse(albumFile.files),
              short_description: albumFile.short_description,
            });
            return acc;
          }, {});

        return {
          id: album.id,
          title: album.title,
          description: album.description,
          files: filesForAlbum,
        };
      });

      res.status(200).json({
        success: true,
        message: "Albums and files retrieved successfully.",
        data: formattedAlbums,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No albums or album files found.",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

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

exports.addAlbums = async (req, res) => {
  try {
    const { title, description } = req.body;

    const data = await Album.createAlbum(title, description);

    res.status(200).json({
      success: true,
      message: "Album Created Succefully.",
      data: [data],
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Error creating album.",
    });
  }
};
//
exports.updateAlbums = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const album = await Album.updateAlbum(id, title, description);
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
