const database = require("../config/database");

async function updateScript() {
  try {
    const connection = await database.promise().getConnection();
    await connection.beginTransaction();
    const sqlFile = require("fs").readFileSync(
      __dirname + "/migrateUpdate.sql",
      "utf8"
    );
    const sqlCommands = sqlFile
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0);
    for (const command of sqlCommands) {
      await connection.query(command);
    }
    await connection.commit();
    connection.release();
    console.log("Database update script executed successfully.");
  } catch (error) {
    console.error("Error executing update script:", error);
  }
}

module.exports = updateScript;
