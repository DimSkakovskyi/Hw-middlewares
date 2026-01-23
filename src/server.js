require("dotenv").config();

const app = require("./app");
const { connectMongo } = require("./db/mongo"); // або твій шлях до mongo.js

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();
