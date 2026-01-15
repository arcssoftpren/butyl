const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const patchDir = path.join(__dirname, "patch");

// 1. Kosongkan folder /patch
console.log("Mengosongkan folder /patch...");
if (fs.existsSync(patchDir)) {
  fs.rmSync(patchDir, { recursive: true, force: true });
}
fs.mkdirSync(patchDir, { recursive: true });
console.log("Folder /patch berhasil dikosongkan");

// 2. Clone repository ke dalam /patch
console.log("Melakukan clone repository...");
try {
  execSync("git clone https://github.com/arcssoftpren/butyl.git", {
    cwd: patchDir,
    stdio: "inherit",
  });
  console.log("Clone repository berhasil");
} catch (error) {
  console.error("Error saat clone repository:", error.message);
  process.exit(1);
}

// 3. pm2 delete butyl
console.log("Menghapus aplikasi butyl dari PM2...");
try {
  execSync("pm2 delete butyl", {
    stdio: "inherit",
  });
  console.log("PM2 delete butyl berhasil");
} catch (error) {
  console.warn("Peringatan saat pm2 delete:", error.message);
}

// 4. Copy patch/butyl/fe ke root/fe dengan overwrite
console.log("Mengcopy folder fe dari patch/butyl/fe ke root/fe...");
const sourceFe = path.join(patchDir, "butyl", "fe");
const targetFe = path.join(__dirname, "fe");

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
  process.exit(1);
}

// 6. Copy patch/butyl/be ke root/be dengan pengecualian
console.log("Mengcopy folder be dari patch/butyl/be ke root/be...");
const sourceBe = path.join(patchDir, "butyl", "be");
const targetBe = path.join(__dirname, "be");

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
  process.exit(1);
}

// 8. npm run build di root/fe
console.log("Menjalankan npm run build di root/fe...");
try {
  execSync("npm run build", {
    cwd: targetFe,
    stdio: "inherit",
  });
  console.log("npm run build berhasil");
} catch (error) {
  console.error("Error saat npm run build:", error.message);
  process.exit(1);
}

// 9. pm2 start index.js --name butyl dari root/be
console.log("Menjalankan pm2 start index.js --name butyl di root/be...");
try {
  execSync("pm2 start index.js --name butyl", {
    cwd: targetBe,
    stdio: "inherit",
  });
  console.log("pm2 start berhasil");
} catch (error) {
  console.error("Error saat pm2 start:", error.message);
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
  process.exit(1);
}

console.log("Proses selesai!");
