const express = require("express");
require("dotenv").config();

const path = require("path");
const ejs = require("ejs");

const session = require("express-session");
const passport = require("passport");
const configurePassport = require("./config/passport");

// routes (лежать у src/routes)
const rootRoutes = require("./routes/root.routes.js");
const usersRoutes = require("./routes/users.routes.js");
const articlesRoutes = require("./routes/articles.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const protectedRoutes = require("./routes/protected.routes.js");
const dbRoutes = require("./routes/db.routes");

// middlewares (лежать у src/middlewares)
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandlers");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static: public у корені
app.use(express.static(path.join(__dirname, "..", "public")));


// views у src/views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.engine("ejs", ejs.__express);

// Sessions
const isProd = process.env.NODE_ENV === "production";
if (isProd) app.set("trust proxy", 1);

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

// Passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", rootRoutes);
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/db", dbRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
