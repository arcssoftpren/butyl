const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const patchDir = path.join(__dirname, "patch");
const backupDir = path.join(__dirname, "rollback");

// 1. Kosongkan folder /patch
console.log("Mengosongkan folder /patch...");
if (fs.existsSync(patchDir)) {
  fs.rmSync(patchDir, { recursive: true, force: true });
}
fs.mkdirSync(patchDir, { recursive: true });
console.log("Folder /patch berhasil dikosongkan");

// 2. Clone repository ke dalam /patch
console.log("Melakukan clone repository...");
let cloneAttempts = 0;
const maxAttempts = 3;

while (cloneAttempts < maxAttempts) {
  try {
    execSync("git clone https://github.com/arcssoftpren/butyl.git", {
      cwd: patchDir,
      stdio: "inherit",
    });
    console.log("Clone repository berhasil");
    break;
  } catch (error) {
    cloneAttempts++;
    if (cloneAttempts >= maxAttempts) {
      console.error("Error: Clone repository gagal setelah 3 percobaan");
      process.exit(1);
    }
    console.warn(`Percobaan ${cloneAttempts} gagal, mencoba lagi...`);
  }
}

// Validasi hasil clone
const sourceFe = path.join(patchDir, "butyl", "fe");
const sourceBe = path.join(patchDir, "butyl", "be");
if (!fs.existsSync(sourceFe) || !fs.existsSync(sourceBe)) {
  console.error("Error: Repository tidak lengkap setelah clone");
  process.exit(1);
}

// 3. Backup code lama untuk rollback
console.log("Membuat backup code lama...");
if (fs.existsSync(backupDir)) {
  fs.rmSync(backupDir, { recursive: true, force: true });
}
fs.mkdirSync(backupDir, { recursive: true });

const targetFe = path.join(__dirname, "fe");
const targetBe = path.join(__dirname, "be");
const backupFe = path.join(backupDir, "fe");
const backupBe = path.join(backupDir, "be");

// Fungsi untuk copy dengan exclude node_modules
function copyWithExclude(source, destination, excludeDirs = []) {
  if (!fs.existsSync(source)) return;

  fs.mkdirSync(destination, { recursive: true });
  const items = fs.readdirSync(source);

  items.forEach((item) => {
    if (excludeDirs.includes(item)) {
      console.log(`  Skipping ${item}/`);
      return;
    }

    const sourceItem = path.join(source, item);
    const destItem = path.join(destination, item);

    const stat = fs.statSync(sourceItem);
    if (stat.isDirectory()) {
      copyWithExclude(sourceItem, destItem, excludeDirs);
    } else {
      fs.copyFileSync(sourceItem, destItem);
    }
  });
}

if (fs.existsSync(targetFe)) {
  copyWithExclude(targetFe, backupFe, ["node_modules"]);
  console.log("Backup fe berhasil (exclude node_modules)");
}
if (fs.existsSync(targetBe)) {
  copyWithExclude(targetBe, backupBe, [
    "node_modules",
    "autobackup",
    "backups",
    "tempbackup",
    "uploads",
  ]);
  console.log("Backup be berhasil (exclude node_modules & data)");
}

// 4. Copy patch/butyl/fe ke root/fe dengan overwrite
console.log("Mengcopy folder fe dari patch/butyl/fe ke root/fe...");

if (fs.existsSync(sourceFe)) {
  fs.cpSync(sourceFe, targetFe, { recursive: true, force: true });
  console.log("Copy folder fe berhasil");
} else {
  console.error("Error: Folder sumber patch/butyl/fe tidak ditemukan");
  process.exit(1);
}

// 5. npm install dari root/fe
console.log("Menjalankan npm install di root/fe...");
try {
  execSync("npm install", {
    cwd: targetFe,
    stdio: "inherit",
  });
  console.log("npm install berhasil");
} catch (error) {
  console.error("Error saat npm install:", error.message);
  console.log("Melakukan rollback...");
  if (fs.existsSync(backupFe)) {
    fs.cpSync(backupFe, targetFe, { recursive: true, force: true });
    // Restore npm dependencies
    try {
      execSync("npm install", { cwd: targetFe, stdio: "inherit" });
    } catch (e) {}
  }
  process.exit(1);
}

// 6. Copy patch/butyl/be ke root/be dengan pengecualian
console.log("Mengcopy folder be dari patch/butyl/be ke root/be...");

const excludedFolders = ["autobackup", "backups", "tempbackup", "uploads"];

if (fs.existsSync(sourceBe)) {
  // Baca semua item di sourceBe
  const items = fs.readdirSync(sourceBe);

  items.forEach((item) => {
    const sourceItem = path.join(sourceBe, item);
    const targetItem = path.join(targetBe, item);

    // Skip folder yang dikecualikan
    if (excludedFolders.includes(item)) {
      console.log(`  Skipping ${item}/`);
      return;
    }

    // Copy item
    fs.cpSync(sourceItem, targetItem, { recursive: true, force: true });
    console.log(`  Copied ${item}`);
  });

  console.log("Copy folder be berhasil");
} else {
  console.error("Error: Folder sumber patch/butyl/be tidak ditemukan");
  process.exit(1);
}

// 7. npm install dari root/be
console.log("Menjalankan npm install di root/be...");
try {
  execSync("npm install", {
    cwd: targetBe,
    stdio: "inherit",
  });
  console.log("npm install berhasil");
} catch (error) {
  console.error("Error saat npm install:", error.message);
  console.log("Melakukan rollback...");
  if (fs.existsSync(backupBe)) {
    fs.cpSync(backupBe, targetBe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetBe, stdio: "inherit" });
    } catch (e) {}
  }
  if (fs.existsSync(backupFe)) {
    fs.cpSync(backupFe, targetFe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetFe, stdio: "inherit" });
    } catch (e) {}
  }
  process.exit(1);
}

// 8. Kosongkan folder be/dist sebelum build
const distDir = path.join(targetBe, "dist");
if (fs.existsSync(distDir)) {
  console.log("Mengosongkan folder be/dist...");
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log("Folder be/dist berhasil dikosongkan");
}

// 9. npm run build di root/fe
console.log("Menjalankan npm run build di root/fe...");
try {
  execSync("npm run build", {
    cwd: targetFe,
    stdio: "inherit",
  });
  console.log("npm run build berhasil");
} catch (error) {
  console.error("Error saat npm run build:", error.message);
  console.log("Melakukan rollback...");
  if (fs.existsSync(backupBe)) {
    fs.cpSync(backupBe, targetBe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetBe, stdio: "inherit" });
    } catch (e) {}
  }
  if (fs.existsSync(backupFe)) {
    fs.cpSync(backupFe, targetFe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetFe, stdio: "inherit" });
      execSync("npm run build", { cwd: targetFe, stdio: "inherit" });
    } catch (e) {}
  }
  process.exit(1);
}

// 10. Restart aplikasi dengan PM2 (zero-downtime)
console.log("Merestart aplikasi dengan PM2...");
try {
  // Coba reload dulu (zero-downtime)
  try {
    execSync("pm2 reload butyl", {
      stdio: "inherit",
    });
    console.log("PM2 reload berhasil");
  } catch (reloadError) {
    // Jika reload gagal (app belum ada), delete lalu start
    console.log("PM2 reload gagal, mencoba delete dan start...");
    try {
      execSync("pm2 delete butyl", { stdio: "inherit" });
    } catch (e) {
      // Ignore jika delete gagal (app memang tidak ada)
    }

    execSync("pm2 start index.js --name butyl", {
      cwd: targetBe,
      stdio: "inherit",
    });
    console.log("PM2 start berhasil");
  }
} catch (error) {
  console.error("Error saat restart PM2:", error.message);
  console.log("Melakukan rollback...");

  // Rollback code
  if (fs.existsSync(backupBe)) {
    fs.cpSync(backupBe, targetBe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetBe, stdio: "inherit" });
    } catch (e) {}
  }
  if (fs.existsSync(backupFe)) {
    fs.cpSync(backupFe, targetFe, { recursive: true, force: true });
    try {
      execSync("npm install", { cwd: targetFe, stdio: "inherit" });
      execSync("npm run build", { cwd: targetFe, stdio: "inherit" });
    } catch (e) {}
  }

  // Restart dengan code lama
  try {
    execSync("pm2 reload butyl", { stdio: "inherit" });
  } catch (e) {
    execSync("pm2 start index.js --name butyl", {
      cwd: targetBe,
      stdio: "inherit",
    });
  }

  process.exit(1);
}

// 10. pm2 save
console.log("Menjalankan pm2 save...");
try {
  execSync("pm2 save", {
    stdio: "inherit",
  });
  console.log("pm2 save berhasil");
} catch (error) {
  console.error("Error saat pm2 save:", error.message);
}

// 11. Cleanup - Delete folder /patch
console.log("Membersihkan folder temporary...");
if (fs.existsSync(patchDir)) {
  fs.rmSync(patchDir, { recursive: true, force: true });
  console.log("Folder /patch berhasil dihapus");
}

console.log("\n=================================");
console.log("✅ Update berhasil!");
console.log("=================================");
console.log(`Backup versi lama tersimpan di: ${backupDir}`);
console.log("Gunakan backup tersebut untuk rollback manual jika diperlukan");
