const express = require("express");
const authRoutes = require("./routes/authRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const coreValuesRoutes = require("./routes/coreValuesRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/home", homePageRoutes);

app.use("/core-values", coreValuesRoutes);

module.exports = app;
