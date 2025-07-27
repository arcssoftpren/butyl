const Crud = require("../helpers/crud");
const { crypter } = require("../helpers/crypter");
const path = require("path"); // Untuk membangun path file secara aman
const fs = require("fs");
const mime = require("mime-types");

module.exports = {
  login: async (req, res) => {
    try {
      const data = req.body;
      let { userNik, userPass } = data;
      const db = new Crud();

      db.join("left", "t_role", "t_role.roleId", "t_user.userRole");
      db.where("userNik", "=", userNik);
      let dupe = await db.get("t_user");
      if (dupe.length < 1)
        throw {
          title: "Unknown User",
          text: "There is no account related to the submitted data.",
          icon: "error",
          errorElement: "userNik",
        };

      const pass = dupe[0].userPass;
      const decPass = crypter.decryptText(pass);

      if (userPass != decPass)
        throw {
          title: "Invalid Password",
          text: "Your submited password is incorrect",
          icon: "error",
          errorElement: "userPass",
        };

      delete dupe[0].userPass;
      delete dupe[0].roleId;

      dupe[0].akses = JSON.parse(dupe[0].akses);

      return res.status(200).json(dupe[0]);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getUserData: async (req, res) => {
    const data = req.body;
    let { userNik } = data;
    const db = new Crud();

    db.join("left", "t_role", "t_role.roleId", "t_user.userRole");
    db.where("userNik", "=", userNik);
    let dupe = await db.get("t_user");
    delete dupe[0].userPass;
    delete dupe[0].roleId;

    dupe[0].akses = JSON.parse(dupe[0].akses);

    return res.status(200).json(dupe[0]);
  },
  getRoles: async (req, res) => {
    try {
      const db = new Crud();
      const roles = await db.get("t_role");
      return res.status(200).json(roles);
    } catch (error) {
      console.log(error);
    }
  },
  newRoles: async (req, res) => {
    try {
      let data = req.body;
      const { roleName } = data;

      const db = new Crud();
      db.where("roleName", "=", roleName);
      const dupe = await db.get("t_role", data);
      if (dupe.length > 0)
        throw {
          title: "Duplicate Name",
          text: "Your new role's name is already used by another role, please use a new one.",
          icon: "error",
        };

      data.akses = JSON.stringify(data.akses);
      const newData = new Crud();
      await newData.insert("t_role", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editRole: async (req, res) => {
    try {
      let data = req.body;
      const { roleName, roleId, akses, inspectionAccess } = data;

      const db = new Crud();
      db.where("roleName", "=", roleName);
      db.where("roleId", "!=", roleId);
      const dupe = await db.get("t_role");
      if (dupe.length > 0)
        throw {
          title: "Duplicate Name",
          text: "Your new role's name is already used by another role, please use a new one.",
          icon: "error",
        };

      if (inspectionAccess) {
        data.inspectionAccess = JSON.stringify(inspectionAccess);
      }

      if (akses) {
        data.akses = JSON.stringify(akses);
      }

      const ud = new Crud();
      ud.where("roleId", "=", roleId);
      await ud.update("t_role", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  deleteRole: async (req, res) => {
    try {
      const { roleId } = req.body;
      const db = new Crud();
      db.where("roleId", "=", roleId);
      await db.delete("t_role");
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
    }
  },
  addUser: async (req, res) => {
    try {
      const db = new Crud();
      let data = req.body;
      let { userNik, userPass } = data;
      db.where("userNik", "=", userNik);
      const user = await db.get("t_user");
      if (user.length > 0) {
        throw {
          title: "DUPLICATE NIK",
          text: "The given NIK is already used by another user, please try again with a different NIK",
          icon: "error",
        };
      }

      data.userPass = crypter.encryptText(userPass);
      delete data.confirmPass;
      let insert = await db.insert("t_user", data);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const uploadedFile = req.files.signFile;
      const filePath = path.join(
        __dirname,
        "../uploads/signs/",
        `${insert.insertId}_signature.png`
      );
      uploadedFile.mv(filePath, function (err) {
        if (err) {
          throw {
            title: "Upload Error",
            text: "the file is not uploaded, please try again from tools edit menu!",
            icon: "error",
            timer: 3000,
          };
        }
        return res.status(200).json({ message: "success" });
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const db = new Crud();
      db.join("left", "t_role", "t_role.roleId", "t_user.userRole");
      let users = await db.get("t_user");
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  },
  getSignFile: async (req, res) => {
    try {
      const { userId } = req.body;
      const db = new Crud();
      db.where("userId", "=", userId);
      const dupe = await db.get("t_user");

      if (dupe.length < 1)
        throw {
          title: "Unknown User",
          text: "There is no account related to the submitted data.",
          icon: "error",
        };

      const filePath = `./uploads/signs/${userId}_signature.png`;

      let fileData;

      // Pakai promises

      try {
        fileData = await fs.promises.readFile(filePath);
      } catch (err) {
        throw {
          title: "File Not Found",
          text: "There is no signature file related to the account, please add new file.",
          icon: "error",
        };
      }

      const mimeType = mime.lookup(filePath) || "application/octet-stream";
      const base64 = fileData.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return res.status(200).json(dataUrl);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editUser: async (req, res) => {
    try {
      const data = req.body;
      const { userNik, userId, userPass } = data;
      const db = new Crud();
      db.where("userNik", "=", userNik);
      db.where("userId", "!=", userId);
      const dupe = await db.get("t_user");
      if (dupe.length > 0)
        throw {
          title: "DUPLICATE NIK",
          text: "The given NIK is already used by another user, please try again with a different NIK",
          icon: "error",
        };

      if (userPass == "") {
        delete data.userPass;
        delete data.confirmPass;
      } else {
        delete data.confirmPass;
        data.userPass = crypter.encryptText(userPass);
      }

      const dbw = new Crud();
      dbw.where("userId", "=", userId);
      await dbw.update("t_user", data);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const uploadedFile = req.files.signFile;
      const filePath = path.join(
        __dirname,
        "../uploads/signs/",
        `${userId}_signature.png`
      );
      uploadedFile.mv(filePath, function (err) {
        if (err) {
          throw {
            title: "Upload Error",
            text: "the file is not uploaded, please try again from tools edit menu!",
            icon: "error",
            timer: 3000,
          };
        }
        return res.status(200).json({ message: "success" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.body;
      const db = new Crud();
      db.where("userId", "=", userId);
      await db.delete("t_user");
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
    }
  },
};
