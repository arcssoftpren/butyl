const Crud = require("../helpers/crud");
const { crypter } = require("../helpers/crypter");
const path = require("path"); // Untuk membangun path file secara aman
const fs = require("fs");
const mime = require("mime-types");
const { title } = require("process");
const moment = require("moment");

module.exports = {
  getLogics: async (req, res) => {
    const db = new Crud();
    db.where("id", "<=", 9);
    const response = await db.get("inspection_logic");
    return res.status(200).json(response);
  },
  getTools: async (req, res) => {
    const db = new Crud();
    const response = await db.get("t_method");
    return res.status(200).json(response);
  },

  addPart: async (req, res) => {
    try {
      let data = req.body;
      const { partNumber } = data;

      const db = new Crud();
      db.where("partNumber", "=", partNumber);
      const dupe = await db.get("t_part");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Part Number",
          text: "The given part number is already used by another part, please try again with a different part number",
          icon: "error",
        };

      const db2 = new Crud();

      await db2.insert("t_part", data);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const uploadedFile = req.files.drawingFile;
      const filePath = path.join(
        __dirname,
        "../uploads/drawings/",
        `${partNumber}_drawing.png`
      );

      uploadedFile.mv(filePath, function (err) {
        if (err) {
          throw {
            title: "Upload Error",
            text: "the file is not uploaded, please try again!",
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
  getParts: async (req, res) => {
    try {
      const db = new Crud();
      let parts = await db.get("t_part");
      return res.status(200).json(parts);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getPartDrawing: async (req, res) => {
    try {
      const { partNumber } = req.body;

      const filePath = `./uploads/drawings/${partNumber}_drawing.png`;

      let fileData;

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
      return res.status(400).json(error);
    }
  },
  editPart: async (req, res) => {
    try {
      let data = req.body;
      const { partNumber, partId } = data;

      const db = new Crud();
      db.where("partNumber", "=", partNumber);
      db.where("partId", "!=", partId);
      const dupe = await db.get("t_part");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Part Number",
          text: "The given part number is already used by another part, please try again with a different part number",
          icon: "error",
        };

      const db2 = new Crud();

      db2.where("partId", "=", partId);
      await db2.update("t_part", data);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const uploadedFile = req.files.drawingFile;
      const filePath = path.join(
        __dirname,
        "../uploads/drawings/",
        `${partNumber}_drawing.png`
      );

      uploadedFile.mv(filePath, function (err) {
        if (err) {
          throw {
            title: "Upload Error",
            text: "the file is not uploaded, please try again!",
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
  deletePart: async (req, res) => {
    const { partId } = req.body;
    const db = new Crud();
    db.where("partId", "=", partId);
    await db.delete("t_part");
    return res.status(200).json({});
  },
  addMethod: async (req, res) => {
    try {
      const data = req.body;
      const { romaji } = data;
      const db = new Crud();
      db.where("romaji", "=", romaji);
      const dupe = await db.get("t_method");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Name",
          text: "The method name you are given is already in use, please use another name",
          icon: "error",
        };

      const db2 = new Crud();
      await db2.insert("t_method", data);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editMethod: async (req, res) => {
    try {
      const data = req.body;
      const { romaji, id } = data;
      const db = new Crud();
      db.where("romaji", "=", romaji);
      db.where("id", "!=", id);
      const dupe = await db.get("t_method");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Name",
          text: "The method name you are given is already in use, please use another name",
          icon: "error",
        };

      const db2 = new Crud();
      db2.where("id", "=", id);
      await db2.update("t_method", data);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  deleteMethode: async (req, res) => {
    const { id } = req.body;
    const db = new Crud();
    db.where("id", "=", id);
    await db.delete("t_method");
    return res.status(200).json({});
  },

  inititateInspection: async (req, res) => {
    try {
      let data = req.body;
      const { deliveryDate, partData, appInsResult } = data;

      const isPress = partData.pressEnable == 1;
      const isOutgoing = partData.outGoingEnabled == 1;

      data.press = isPress ? partData.pressItems : null;
      data.outGoing = isOutgoing ? partData.outGoingItems : null;
      data.extruding = partData.extrudingItems;
      data.kneading = partData.kneadingItems;

      delete data.partData.pressItems;
      delete data.partData.outGoingItems;
      delete data.partData.extrudingItems;
      delete data.partData.kneadingItems;

      data.partData = JSON.stringify(partData);
      data.appInsResult = JSON.stringify(appInsResult);

      const isTypeA = partData.headerType == "a";

      data.deliveryDate = isTypeA ? deliveryDate : null;

      const db = new Crud();
      await db.insert("t_inspection", data);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getInspections: async (req, res) => {
    try {
      const data = req.body;
      const { month, date, year } = data;

      const db = new Crud();
      db.where("judgement", "IS");
      const ins = await db.get("t_inspection");
      let inspections = ins;

      if (year)
        inspections = ins.filter(
          (i) => moment(i.initiateDate, "YYYY-DD-MM").format("YYYY") == year
        );

      if (month)
        inspections = ins.filter(
          (i) => moment(i.initiateDate, "YYYY-DD-MM").format("YYYY-MM") == month
        );

      if (date)
        inspections = ins.filter(
          (i) =>
            moment(i.initiateDate, "YYYY-DD-MM").format("YYYY-MM-DD") == date
        );

      inspections = await Promise.all(
        inspections.map((i) => {
          i.partData = JSON.parse(i.partData);
          i.extruding = JSON.parse(i.extruding);
          i.kneading = JSON.parse(i.kneading);
          i.partName = i.partData.partName;
          const isPres = i.partData.pressEnable == 1;
          const isOut = i.partData.outGoingEnabled == 1;

          if (i.extrudingIns != null) {
            i.extrudingIns = JSON.parse(i.extrudingIns);
          }

          if (i.kneadingIns != null) {
            i.kneadingIns = JSON.parse(i.kneadingIns);
          }

          if (i.pressIns != null) {
            i.pressIns = JSON.parse(i.pressIns);
          }
          if (i.outgoingIns != null) {
            i.outgoingIns = JSON.parse(i.outgoingIns);
          }

          if (i.extAppData != null) {
            i.extAppData = JSON.parse(i.extAppData);
          }

          i.appInsResult = JSON.parse(i.appInsResult);

          if (isPres) i.press = JSON.parse(i.press);
          if (isOut) i.outgoing = JSON.parse(i.outgoing);

          return i;
        })
      );

      return res.status(200).json(inspections);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getNG: async (req, res) => {
    try {
      const data = req.body;

      const db = new Crud();
      db.where("judgement", "=", "NG");
      const ins = await db.get("t_inspection");
      let inspections = ins;

      inspections = await Promise.all(
        inspections.map((i) => {
          i.partData = JSON.parse(i.partData);
          i.extruding = JSON.parse(i.extruding);
          i.kneading = JSON.parse(i.kneading);
          i.partName = i.partData.partName;
          const isPres = i.partData.pressEnable == 1;
          const isOut = i.partData.outGoingEnabled == 1;

          if (i.extrudingIns != null) {
            i.extrudingIns = JSON.parse(i.extrudingIns);
          }

          if (i.kneadingIns != null) {
            i.kneadingIns = JSON.parse(i.kneadingIns);
          }

          if (i.pressIns != null) {
            i.pressIns = JSON.parse(i.pressIns);
          }
          if (i.outgoingIns != null) {
            i.outgoingIns = JSON.parse(i.outgoingIns);
          }

          if (i.extAppData != null) {
            i.extAppData = JSON.parse(i.extAppData);
          }

          if (i.saNote != null) {
            i.saNote = JSON.parse(i.saNote);
          }

          if (isPres) i.press = JSON.parse(i.press);
          if (isOut) i.outgoing = JSON.parse(i.outgoing);

          return i;
        })
      );

      return res.status(200).json(inspections);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editInspections: async (req, res) => {
    try {
      let data = req.body;
      const { id } = data;

      const {
        kneadingIns,
        extrudingIns,
        pressIns,
        outgoingIns,
        heaterTemp,
        extAppData,
      } = data;

      delete data.partName;

      const db = new Crud();
      db.where("id", "=", id);
      await db.update("t_inspection", {
        kneadingIns,
        extrudingIns,
        pressIns,
        outgoingIns,
        heaterTemp,
        extAppData,
      });

      if (req.files) {
        const uploadedFile = req.files.actImage;
        const filePath = path.join(
          __dirname,
          "../uploads/insImage/",
          `${id}_img.png`
        );
        uploadedFile.mv(filePath, function (err) {
          if (err) {
            throw {
              title: "Upload Error",
              text: "the file is not uploaded, please try again!",
              icon: "error",
              timer: 3000,
            };
          }
          return res.status(200).json({ message: "success" });
        });
      } else {
        return res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editInspectionsNG: async (req, res) => {
    try {
      let data = req.body;
      const { id } = data;

      const {
        kneadingIns,
        extrudingIns,
        pressIns,
        outgoingIns,
        heaterTemp,
        extAppData,
      } = data;

      delete data.partName;

      const db = new Crud();
      db.where("id", "=", id);
      await db.update("t_inspection", {
        kneadingIns,
        extrudingIns,
        pressIns,
        outgoingIns,
        judgement: "NG",
        heaterTemp,
        extAppData,
      });

      if (req.files) {
        const uploadedFile = req.files.actImage;
        const filePath = path.join(
          __dirname,
          "../uploads/insImage/",
          `${id}_img.png`
        );
        uploadedFile.mv(filePath, function (err) {
          if (err) {
            throw {
              title: "Upload Error",
              text: "the file is not uploaded, please try again!",
              icon: "error",
              timer: 3000,
            };
          }
          return res.status(200).json({ message: "success" });
        });
      } else {
        return res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  sa: async (req, res) => {
    const { id, saNote, author, key } = req.body;
    const db = new Crud();
    const sanoteData = {
      saNote,
      author,
    };
    db.where("id", "=", id);
    const dbData = await db.get("t_inspection");
    let dbSa = dbData[0].saNote;
    let parsed;
    if (dbSa == null) {
      parsed = {
        kneading: {
          author: "",
          note: "",
        },
        extruding: {
          author: "",
          note: "",
        },
        press: {
          author: "",
          note: "",
        },
        outgoing: {
          author: "",
          note: "",
        },
      };
    } else {
      parsed = JSON.parse(dbSa);
    }

    parsed[key].author = author;
    parsed[key].note = saNote;

    const db2 = new Crud();
    db2.where("id", "=", id);
    await db2.update("t_inspection", {
      saNote: JSON.stringify(parsed),
      judgement: null,
    });
    return res.status(200).json({});
  },
  getActImage: async (req, res) => {
    try {
      const { id } = req.body;

      const filePath = `./uploads/insImage/${id}_img.png`;

      let fileData;

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
      return res.status(400).json(error);
    }
  },
  addType: async (req, res) => {
    try {
      const data = req.body;
      const { typeNumber } = data;
      const db = new Crud();
      db.where("typeNumber", "=", typeNumber);
      const dupe = await db.get("t_types");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Type Number",
          text: "The given type number is already used by another WP, please try again with a different type number",
          icon: "error",
        };

      ["pressOn", "outGoingOn", "heaterOn"].forEach((key) => {
        data[key] = data[key] == true || data[key] === "true" ? 1 : 0;
      });

      const db2 = new Crud();
      await db2.insert("t_types", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getTypes: async (req, res) => {
    try {
      const db = new Crud();
      let types = await db.get("t_types");

      types = await Promise.all(
        types.map((e) => {
          e.pressOn = e.pressOn == 1;
          e.outGoingOn = e.outGoingOn == 1;
          e.heaterOn = e.heaterOn == 1;
          return e;
        })
      );
      return res.status(200).json(types);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  editType: async (req, res) => {
    try {
      let data = req.body;
      const { typeNumber, id, pressOn, outGoingOn, heaterOn } = data;
      const db = new Crud();
      db.where("typeNumber", "=", typeNumber);
      db.where("id", "!=", id);
      const dupe = await db.get("t_types");

      if (dupe.length > 0)
        throw {
          title: "Duplicate Type Number",
          text: "The given type number is already used by another WP, please try again with a different type number",
          icon: "error",
        };

      ["pressOn", "outGoingOn", "heaterOn"].forEach((key) => {
        data[key] = data[key] == true || data[key] === "true" ? 1 : 0;
      });

      delete data.id;

      console.log(data);

      const db2 = new Crud();
      db2.where("id", "=", id);
      await db2.update("t_types", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  deleteType: async (req, res) => {
    try {
      let data = req.body;
      const { id } = data;
      const db = new Crud();
      db.where("id", "=", id);
      await db.delete("t_types");
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
