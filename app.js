const express = require("express");
const authRoutes = require("./routes/authRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const coreValuesRoutes = require("./routes/coreValuesRoutes");
const albumsRoutes = require("./routes/albumRoutes");
const albumFilesRoutes = require("./routes/albumFilesRoutes");
const locationRoutes = require("./routes/locationRoutes");
const classCategoriesRoutes = require("./routes/classCategoriesRoutes");
const classesRoutes = require("./routes/classesRoutes");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const learnTowSwimRoutes = require("./routes/learnToSwimRoutes");
const shopRoutes = require("./routes/shopRoutes");
const footerRoutes = require("./routes/footerRoutes");
const feebackRoutes = require("./routes/feedbackRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);

app.use("/home", homePageRoutes);

app.use("/core-values", coreValuesRoutes);

app.use("/albums", albumsRoutes);

app.use("/album-files", albumFilesRoutes);

app.use("/locations", locationRoutes);

app.use("/class-categories", classCategoriesRoutes);

app.use("/classes", classesRoutes);

app.use("/about-us", aboutUsRoutes);

app.use("/learn-to-swim", learnTowSwimRoutes);

app.use("/shop", shopRoutes);

app.use("/footer", footerRoutes);

app.use("/feedback", feebackRoutes);

app.use("/contact-us", contactUsRoutes);

module.exports = app;
