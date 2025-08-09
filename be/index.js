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

const IP = process.env.SERVER_IP || "127.0.0.1";
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// app.get("/", (req, res) => res.send("Hello World!"));

const router = require("./controller");
app.use("/", router);

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);

server.listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}`);
});
