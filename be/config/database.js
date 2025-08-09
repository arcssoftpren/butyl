const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.SERVER_IP,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db_ = mysql.createPool({
  host: "153.92.15.16",
  user: "u572955615_butyl",
  password: "Monksayang111988",
  database: "u572955615_butyl",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
