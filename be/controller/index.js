const express = require("express");
const router = express.Router();
const auth = require("./auth");

router.post("/login", auth.login);

router.post("/auth/getroles", auth.getRoles);
router.post("/auth/newrole", auth.newRoles);
router.post("/auth/editrole", auth.editRole);
router.post("/auth/deleterole", auth.deleteRole);

module.exports = router;
