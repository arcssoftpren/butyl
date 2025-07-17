const Crud = require("../helpers/crud");
const crypter = require("../helpers/crypter");

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
      const { roleName, roleId, akses } = data;

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
};
