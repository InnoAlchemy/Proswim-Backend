const express = require("express");
const Banner = require("../models/Banners");
const Core = require("../models/Core");
const LearnToSwim = require("../models/Buttons");
const Album = require("../models/Albums");
const AlbumFiles = require("../models/AlbumFiles");
const Location = require("../models/Locations");

const formatItems = (items, formatFn) => (items || []).map(formatFn);

exports.getHomePage = async (req, res) => {
  try {
    const [banners, cores, buttons, albums, albumFiles, locations] =
      await Promise.all([
        Banner.getAllBanners(),
        Core.getAllcores(),
        LearnToSwim.getAllButtons(),
        Album.getAllAlbums(),
        AlbumFiles.getAllAlbumFiles(),
        Location.getAllLocations(),
      ]);

    const formattedBanners = formatItems(banners, (banner) => ({
      id: banner.id,
      image: banner.image,
      title: banner.title,
      is_active: banner.is_active,
    }));

    const formattedCores = formatItems(cores, (core) => ({
      id: core.id,
      image: core.image,
      title: core.title,
      description: core.description,
      is_active: core.is_active,
    }));

    const formattedButtons = formatItems(buttons, (button) => ({
      id: button.id,
      image: button.image,
      page_link: button.page_link,
      is_active: button.is_active,
    }));

    const formattedAlbums = formatItems(albums, (album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
    }));

    const formattedAlbumFiles = formatItems(albumFiles, (albumFile) => ({
      id: albumFile.id,
      title: albumFile.title,
      album_id: albumFile.album_id,
      collection_number: albumFile.collection_number,
      file: albumFile.file,
      short_description: albumFile.short_description,
    }));

    const formattedLocations = formatItems(locations, (location) => ({
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
      message: "Data retrieved successfully.",
      data: {
        banners: formattedBanners,
        "core-values": formattedCores,
        "learn-how-to-swim-buttons": formattedButtons,
        albums: formattedAlbums,
        albumFiles: formattedAlbumFiles,
        locations: formattedLocations,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
