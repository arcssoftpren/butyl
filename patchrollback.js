const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rollbackDir = path.join(__dirname, "rollback");
const targetFe = path.join(__dirname, "fe");
const targetBe = path.join(__dirname, "be");

console.log("\n=================================");
console.log("🔄 MEMULAI ROLLBACK");
console.log("=================================\n");

// 1. Validasi folder rollback ada
if (!fs.existsSync(rollbackDir)) {
  console.error("❌ Error: Folder rollback tidak ditemukan!");
  console.log("Tidak ada backup untuk di-rollback.");
  process.exit(1);
}

const rollbackFe = path.join(rollbackDir, "fe");
const rollbackBe = path.join(rollbackDir, "be");

if (!fs.existsSync(rollbackFe) || !fs.existsSync(rollbackBe)) {
  console.error("❌ Error: Backup tidak lengkap di folder rollback!");
  process.exit(1);
}

console.log("✅ Backup ditemukan, melanjutkan rollback...\n");

// 2. Rollback frontend
console.log("📦 Rollback folder fe...");
try {
  if (fs.existsSync(targetFe)) {
    fs.rmSync(targetFe, { recursive: true, force: true });
  }
  fs.cpSync(rollbackFe, targetFe, { recursive: true });
  console.log("✅ Rollback fe berhasil\n");
} catch (error) {
  console.error("❌ Error saat rollback fe:", error.message);
  process.exit(1);
}

// 3. Rollback backend (dengan exclude folder data)
console.log("📦 Rollback folder be...");
const excludedFolders = ["autobackup", "backups", "tempbackup", "uploads"];

try {
  const items = fs.readdirSync(rollbackBe);

  items.forEach((item) => {
    const sourceItem = path.join(rollbackBe, item);
    const targetItem = path.join(targetBe, item);

    // Skip folder yang dikecualikan
    if (excludedFolders.includes(item)) {
      console.log(`  ⏭️  Skipping ${item}/`);
      return;
    }

    // Copy item
    fs.cpSync(sourceItem, targetItem, { recursive: true, force: true });
    console.log(`  ✅ Rollback ${item}`);
  });

  console.log("✅ Rollback be berhasil\n");
} catch (error) {
  console.error("❌ Error saat rollback be:", error.message);
  process.exit(1);
}

// 4. npm install di frontend
console.log("📥 Menjalankan npm install di fe...");
try {
  execSync("npm install", {
    cwd: targetFe,
    stdio: "inherit",
  });
  console.log("✅ npm install fe berhasil\n");
} catch (error) {
  console.error("❌ Error saat npm install fe:", error.message);
  process.exit(1);
}

// 5. npm install di backend
console.log("📥 Menjalankan npm install di be...");
try {
  execSync("npm install", {
    cwd: targetBe,
    stdio: "inherit",
  });
  console.log("✅ npm install be berhasil\n");
} catch (error) {
  console.error("❌ Error saat npm install be:", error.message);
  process.exit(1);
}

// 6. Kosongkan folder be/dist sebelum build
const distDir = path.join(targetBe, "dist");
if (fs.existsSync(distDir)) {
  console.log("🗑️  Mengosongkan folder be/dist...");
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log("✅ Folder be/dist berhasil dikosongkan\n");
}

// 7. npm run build di frontend
console.log("🔨 Menjalankan npm run build di fe...");
try {
  execSync("npm run build", {
    cwd: targetFe,
    stdio: "inherit",
  });
  console.log("✅ npm run build berhasil\n");
} catch (error) {
  console.error("❌ Error saat npm run build:", error.message);
  process.exit(1);
}

// 8. Restart aplikasi dengan PM2
console.log("🔄 Merestart aplikasi dengan PM2...");
try {
  // Coba reload dulu (zero-downtime)
  try {
    execSync("pm2 reload butyl", {
      stdio: "inherit",
    });
    console.log("✅ PM2 reload berhasil");
  } catch (reloadError) {
    // Jika reload gagal, delete lalu start
    console.log("⚠️  PM2 reload gagal, mencoba delete dan start...");
    try {
      execSync("pm2 delete butyl", { stdio: "inherit" });
    } catch (e) {
      // Ignore jika delete gagal
    }

    execSync("pm2 start index.js --name butyl", {
      cwd: targetBe,
      stdio: "inherit",
    });
    console.log("✅ PM2 start berhasil");
  }
} catch (error) {
  console.error("❌ Error saat restart PM2:", error.message);
  process.exit(1);
}

// 9. pm2 save
console.log("💾 Menjalankan pm2 save...");
try {
  execSync("pm2 save", {
    stdio: "inherit",
  });
  console.log("✅ pm2 save berhasil\n");
} catch (error) {
  console.error("⚠️  Warning saat pm2 save:", error.message);
}

console.log("\n=================================");
console.log("✅ ROLLBACK BERHASIL!");
console.log("=================================");
console.log("Aplikasi telah dikembalikan ke versi backup sebelumnya.");
