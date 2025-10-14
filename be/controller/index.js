const express = require("express");
const router = express.Router();
const auth = require("./auth");
const part = require("./part");

router.post("/login", auth.login);

router.post("/auth/getroles", auth.getRoles);
router.post("/auth/newrole", auth.newRoles);
router.post("/auth/editrole", auth.editRole);
router.post("/auth/deleterole", auth.deleteRole);
router.post("/auth/adduser", auth.addUser);
router.post("/auth", auth.getUsers);
router.post("/auth/getsignfile", auth.getSignFile);
router.post("/auth/edituser", auth.editUser);
router.post("/auth/deleteuser", auth.deleteUser);
router.post("/auth/getuserdata", auth.getUserData);
router.post("/auth/newbackup", auth.fullBackup);
router.post("/auth/getbackups", auth.getBackups);
router.post("/auth/downloadbackup", auth.downloadBackup);
router.post("/auth/deletebackup", auth.deleteBackup);
router.post("/auth/restorebackup", auth.restoreBackup);
router.post("/auth/getautobackup", auth.getautobackupData);

router.post("/inspection/logics", part.getLogics);
router.post("/inspection/methods", part.getTools);
router.post("/inspection/addmethod", part.addMethod);
router.post("/inspection/editmethod", part.editMethod);
router.post("/inspection/deletemethod", part.deleteMethode);
router.post("/inspection/init", part.inititateInspection);
router.post("/inspection/newinsitem", part.newInsItem);
router.post("/inspection/items", part.getInsItems);
router.post("/inspection/editinsitem", part.editInsItem);
router.post("/inspection/deleteitem", part.deleteInsItem);
router.post("/inspection/", part.getInspections);
router.post("/inspection/save", part.saveInspection);
router.post("/inspection/editinstheader", part.editInstHeader);
router.post("/inspection/getinspectiondata", part.getInspectionData);

router.post("/parts/add", part.addPart);
router.post("/parts/", part.getParts);
router.post("/parts/getdrawing", part.getPartDrawing);
router.post("/parts/edit", part.editPart);
router.post("/parts/delete", part.deletePart);
router.post("/parts/addtype", part.addType);
router.post("/parts/gettypes", part.getTypes);
router.post("/parts/edittype", part.editType);
router.post("/parts/deletetype", part.deleteType);
router.post("/parts/getroomcheck", part.getRoomCheck);

router.get("/update/approval", part.checkApproval);

module.exports = router;
