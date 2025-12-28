const express = require("express");
require("dotenv").config();

const rootRoutes = require("./routes/root.routes");
const usersRoutes = require("./routes/users.routes");
const articlesRoutes = require("./routes/articles.routes");
const cookieParser = require("cookie-parser");
const themeRoutes = require("./routes/theme.routes");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandlers");

const path = require("path");
const ejs = require("ejs");

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public"))); //CSS

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.engine("ejs", ejs.__express);

app.use(express.json());

app.use("/", rootRoutes);
app.use("/theme", themeRoutes);
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
