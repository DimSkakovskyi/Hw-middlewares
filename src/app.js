const express = require("express");

const rootRoutes = require("./routes/root.routes");
const usersRoutes = require("./routes/users.routes");
const articlesRoutes = require("./routes/articles.routes");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandlers");

const app = express();

app.use(express.json());

app.use("/", rootRoutes);
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
