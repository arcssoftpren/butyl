// Script untuk menambah kolom roomTemp ke t_types jika belum ada
// Ganti konfigurasi koneksi sesuai kebutuhan
require("dotenv").config();
const mysql = require("mysql2/promise");

async function addRoomTempColumn() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: process.env.SQL_USER, // ganti user sesuai kebutuhan
    password: process.env.SQL_PASSWORD, // ganti password sesuai kebutuhan
    database: process.env.DB_NAME, // ganti nama database
  });

  const [rows] = await connection.execute(
    "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [process.env.DB_NAME, "t_types", "roomTemp"]
  );

  if (rows[0].cnt === 0) {
    await connection.execute(
      "ALTER TABLE `t_types` ADD `roomTemp` BOOLEAN NOT NULL DEFAULT FALSE AFTER `outgoingItems`"
    );
    console.log("Kolom roomTemp berhasil ditambahkan.");
  } else {
    console.log("Kolom roomTemp sudah ada, tidak perlu ditambah.");
  }

  await connection.end();
}

async function updateDB() {
  await addRoomTempColumn().catch((err) => {
    console.error("Terjadi error:", err);
  });
}

module.exports = updateDB;
