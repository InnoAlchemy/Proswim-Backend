const express = require("express");
const authRoutes = require("./routes/authRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const coreValuesRoutes = require("./routes/coreValuesRoutes");
const albumsRoutes = require("./routes/albumRoutes");
const albumFilesRoutes = require("./routes/albumFilesRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/home", homePageRoutes);

app.use("/core-values", coreValuesRoutes);

app.use("/albums", albumsRoutes);

app.use("/album-files", albumFilesRoutes);

app.use("/locations", locationRoutes);

module.exports = app;
