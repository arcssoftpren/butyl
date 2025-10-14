require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
const fs = require("fs");

const IP = process.env.SERVER_IP || "127.0.0.1";
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const cron = require("node-cron");

const auth = require("./controller/auth");

// Menjadwalkan task setiap hari jam 2 pagi
cron.schedule("00 01 * * *", async () => {
  const backupDir = path.join(__dirname, "autobackup");

  if (fs.existsSync(backupDir)) {
    fs.readdirSync(backupDir).forEach((file) => {
      fs.unlinkSync(path.join(backupDir, file));
    });
  }
  await auth.fullBackup();
});

// app.get("/", (req, res) => res.send("Hello World!"));

const router = require("./controller");
app.use("/", router);

app.use(express.static(path.join(__dirname, "backups")));
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);

const updateDB = require("./helpers/addRoomTempColumn");

updateDB();

server.listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}`);
});
