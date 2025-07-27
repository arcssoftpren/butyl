const express = require("express");
const serverless = require("serverless-http");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
// const path = require("path"); // ← Tambahkan ini
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// (Optional) Hapus static file serving
// app.use(express.static(path.join(__dirname, "../dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist", "index.html"));
// });

// Routing
const router = require("../controller");
app.use("/", router);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).send("Internal Server Error");
});

// Ekspor ke Vercel
module.exports = app;
module.exports.handler = serverless(app);
