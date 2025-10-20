const database = require("../config/database");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

class Crud {
  constructor() {
    this.selectArr = [];
    this.whereArr = [];
    this.joinArr = [];
    this.group_By = "";
    this.query = ``;
    this.order = {
      field: "",
      order: "ASC",
    };
    this.whereOrArr = [];
  }

  select(str) {
    this.selectArr.push(str);
  }

  groupBy(str) {
    this.group_By = str;
  }

  where(key, operator = "=", value) {
    this.whereArr.push({ key, operator, value });
  }
  whereOr(where1, where2) {
    this.whereOrArr.push({
      where1,
      where2,
    });
  }

  join(type, table, a, b) {
    this.joinArr.push({ table: table, type: type, a: a, b: b });
  }

  orderBy(field, order) {
    this.order.field = field;
    this.order.order = order;
  }

  async get(table) {
    if (this.selectArr.length === 0) {
      this.selectArr.push("*");
    }

    this.query = `SELECT ${this.selectArr.join(", ")} FROM ${table}`;
    let wherequery = "";
    let joinQuery = "";

    if (this.joinArr.length > 0) {
      this.joinArr.forEach((element) => {
        joinQuery += ` ${element.type.toUpperCase()} JOIN ${element.table} ON ${
          element.a
        } = ${element.b}`;
      });
    }
    this.query += joinQuery;

    if (this.whereArr.length > 0) {
      this.whereArr.forEach((element, index) => {
        wherequery +=
          index === 0
            ? ` WHERE (${element.key} ${element.operator} ?)`
            : ` AND (${element.key} ${element.operator} ?)`;
      });

      let orquery = "";

      if (this.whereOrArr.length > 0) {
        this.whereOrArr.forEach((element) => {
          orquery += ` AND (${element.where1.key} ${element.where1.operator} ${element.where1.value} OR ${element.where2.key} ${element.where2.operator} ${element.where2.value})`;
        });
        wherequery = `${wherequery} ${orquery}`;
      }
    }
    this.query += wherequery;

    if (this.order.field) {
      this.query += ` ORDER BY ${this.order.field} ${this.order.order}`;
    }

    if (this.group_By != "") {
      this.query += ` GROUP BY ${this.group_By}`;
    }

    try {
      const [rows] = await database.promise().query(
        this.query,
        this.whereArr.map((w) => w.value)
      );

      this.selectArr = [];
      this.whereArr = [];
      this.joinArr = [];
      this.order = { field: "", order: "ASC" };

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async insert(table, data) {
    try {
      const [result] = await database
        .promise()
        .query("INSERT INTO ?? SET ?", [table, data]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(table, data) {
    this.query = `UPDATE ${table} SET ?`;
    let wherequery = ``;

    if (this.whereArr.length > 0) {
      this.whereArr.forEach((element, index) => {
        wherequery +=
          index === 0
            ? ` WHERE ${element.key} ${element.operator} ?`
            : ` AND ${element.key} ${element.operator} ?`;
      });
    }
    this.query += wherequery;

    try {
      const [result] = await database
        .promise()
        .query(this.query, [data, ...this.whereArr.map((w) => w.value)]);

      this.selectArr = [];
      this.whereArr = [];
      this.joinArr = [];
      this.order = { field: "", order: "ASC" };
      this.query = ``;

      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(table) {
    this.query = `DELETE FROM ${table}`;
    let wherequery = ``;

    if (this.whereArr.length > 0) {
      this.whereArr.forEach((element, index) => {
        wherequery +=
          index === 0
            ? ` WHERE ${element.key} ${element.operator} ?`
            : ` AND ${element.key} ${element.operator} ?`;
      });
    }
    this.query += wherequery;

    try {
      const [result] = await database.promise().query(
        this.query,
        this.whereArr.map((w) => w.value)
      );

      this.selectArr = [];
      this.whereArr = [];
      this.joinArr = [];
      this.order = { field: "", order: "ASC" };
      this.query = ``;

      return result;
    } catch (err) {
      throw err;
    }
  }

  // async whereOr(table, orConditions) {
  //   try {
  //     if (this.selectArr.length === 0) {
  //       this.selectArr.push("*");
  //     }

  //     const whereClause = orConditions
  //       .map((cond) => {
  //         return (
  //           "(" +
  //           Object.entries(cond)
  //             .map(([key, val]) =>
  //               val === null ? `${key} IS NULL` : `${key} = ?`
  //             )
  //             .join(" AND ") +
  //           ")"
  //         );
  //       })
  //       .join(" OR ");

  //     const values = orConditions.flatMap((cond) =>
  //       Object.values(cond).filter((v) => v !== null)
  //     );

  //     const query = `SELECT ${this.selectArr.join(
  //       ", "
  //     )} FROM ${table} WHERE ${whereClause}`;

  //     const [rows] = await database.promise().query(query, values);

  //     return rows;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async alter(table) {
    try {
      const [result] = await database
        .promise()
        .query(`ALTER TABLE ${table} AUTO_INCREMENT=1`);
      return result;
    } catch (err) {
      throw err;
    }
  }

  viewQuery() {
    return this.query;
  }

  /**
   * Melakukan full backup (export) database MySQL ke file .sql tanpa menggunakan cmd.
   * @param {string} backupFilePath - Path file hasil backup (misal: './backup.sql')
   * @returns {Promise<string>} - Path file backup jika sukses
   */
  async fullBackup(backupFilePath) {
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const host = process.env.DB_HOST || "localhost";
    const databaseName = "butyl";

    // Pastikan direktori tujuan ada
    fs.mkdirSync(path.dirname(backupFilePath), { recursive: true });

    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database: databaseName,
      multipleStatements: true,
    });

    try {
      // Ambil semua tabel
      const [tables] = await connection.query("SHOW TABLES");
      const tableKey = `Tables_in_${databaseName}`;
      let sqlDump = `-- Backup database ${databaseName} ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n\n`;
      // Tambahkan statement CREATE DATABASE jika belum ada
      sqlDump += `--\n-- Create database if not exists\n--\n`;
      sqlDump += `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;\nUSE \`${databaseName}\`;\n\n`;
      for (const row of tables) {
        const table = row[tableKey];

        // Struktur tabel
        const [[{ "Create Table": createTableSql }]] = await connection.query(
          `SHOW CREATE TABLE \`${table}\``
        );
        sqlDump += `--\n-- Table structure for table \`${table}\`\n--\n\n`;
        sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n${createTableSql};\n\n`;

        // Data tabel
        const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
        if (rows.length > 0) {
          sqlDump += `--\n-- Dumping data for table \`${table}\`\n--\n\n`;
          const columns = Object.keys(rows[0])
            .map((col) => `\`${col}\``)
            .join(", ");
          for (const rowData of rows) {
            const values = Object.values(rowData)
              .map((val) => (val === null ? "NULL" : connection.escape(val)))
              .join(", ");
            sqlDump += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
          }
          sqlDump += "\n";
        }
      }

      fs.writeFileSync(backupFilePath, sqlDump, "utf8");
      await connection.end();
      return backupFilePath;
    } catch (err) {
      await connection.end();
      throw new Error("Backup gagal: " + err.message);
    }
  }
  /**
   * Mengimpor file SQL ke database MySQL.
   * @param {string} sqlFile - Path file SQL yang akan diimpor.
   * @returns {Promise<void>}
   */
  async importDb(sqlFile) {
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const host = process.env.DB_HOST || "localhost";
    const databaseName = "butyl";

    if (!fs.existsSync(sqlFile)) {
      throw new Error("File SQL tidak ditemukan: " + sqlFile);
    }

    const connection = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true,
    });

    try {
      const stream = fs.createReadStream(sqlFile, { encoding: "utf8" });
      let buffer = "";

      for await (const chunk of stream) {
        buffer += chunk;

        // Split the buffer into individual statements
        const statements = buffer.split(";\n");
        buffer = statements.pop(); // Keep the last incomplete statement

        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }
      }

      // Execute any remaining statement in the buffer
      if (buffer.trim()) {
        await connection.query(buffer);
      }

      await connection.end();
    } catch (err) {
      await connection.end();
      throw new Error("Import gagal: " + err.message);
    }
  }
}

module.exports = Crud;
