const Crud = require("../helpers/crud");
const { crypter } = require("../helpers/crypter");
const path = require("path"); // Untuk membangun path file secara aman
const fs = require("fs");
const mime = require("mime-types");
const database = require("../config/database");

module.exports = {
  getRoomCheck: async (req, res) => {
    try {
      const data = req.body;
      const { type } = data;
      const db = new Crud();
      db.where("id", "=", type);
      const roomCheck = await db.get("t_types");
      return res.status(200).json(roomCheck[0]);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  getLogics: async (req, res) => {
    const db = new Crud();
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
        return res.status(200).json(data);
      } else {
        const uploadedFile = req.files.partDrawing;
        const uploadedFile2 = req.files.actImage;
        const filePath = path.join(
          __dirname,
          "../uploads/drawings/",
          `${partNumber}_drawing.png`
        );

        const filePath2 = path.join(
          __dirname,
          "../uploads/drawings/",
          `${partNumber}_actual.png`
        );

        if (uploadedFile) {
          uploadedFile.mv(filePath, function (err) {
            if (err) {
              throw {
                title: "Upload Error",
                text: "the file is not uploaded, please try again!",
                icon: "error",
                timer: 3000,
              };
            }
          });
        }

        if (uploadedFile2) {
          uploadedFile2.mv(filePath2, function (err2) {
            if (err2) {
              throw {
                title: "Upload Error",
                text: "the file is not uploaded, please try again!",
                icon: "error",
                timer: 3000,
              };
            }
          });
        }

        return res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getParts: async (req, res) => {
    try {
      const db = new Crud();
      let parts = await db.get("t_part");

      parts = await Promise.all(
        parts.map((part) => {
          Object.entries(part).forEach(async ([key, value]) => {
            if (isValidJSONObject(value)) {
              part[key] = JSON.parse(value);
            } else {
              part[key] = value;
            }
          });
          return part;
        })
      );
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
      const filePath2 = `./uploads/drawings/${partNumber}_actual.png`;

      const drawingExists = fs.existsSync(filePath);
      const actExists = fs.existsSync(filePath2);

      let fileData = {
        act: null,
        drw: null,
      };

      let act = null;
      let drw = null;

      try {
        if (actExists) {
          fileData.act = await fs.promises.readFile(filePath2);
          const mimeType2 =
            mime.lookup(filePath2) || "application/octet-stream";
          const base642 = fileData.act.toString("base64");
          act = `data:${mimeType2};base64,${base642}`;
        }

        if (drawingExists) {
          fileData.drw = await fs.promises.readFile(filePath);
          const mimeType1 = mime.lookup(filePath) || "application/octet-stream";
          const base641 = fileData.drw.toString("base64");
          drw = `data:${mimeType1};base64,${base641}`;
        }
      } catch (err) {
        console.log(err);
        return res.status(200).json({
          title: "File Not Found",
          text: "There is no signature file related to the account, please add new file.",
          icon: "info",
        });
      }

      return res.status(200).json({ drw, act });
    } catch (error) {
      console.log(error);
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
        return res.status(200).json(data);
      } else {
        const uploadedFile = req.files.partDrawing;
        const uploadedFile2 = req.files.actImage;
        const filePath = path.join(
          __dirname,
          "../uploads/drawings/",
          `${partNumber}_drawing.png`
        );

        const filePath2 = path.join(
          __dirname,
          "../uploads/drawings/",
          `${partNumber}_actual.png`
        );

        if (uploadedFile) {
          uploadedFile.mv(filePath, function (err) {
            if (err) {
              throw {
                title: "Upload Error",
                text: "the file is not uploaded, please try again!",
                icon: "error",
                timer: 3000,
              };
            }
          });
        }

        if (uploadedFile2) {
          uploadedFile2.mv(filePath2, function (err2) {
            if (err2) {
              throw {
                title: "Upload Error",
                text: "the file is not uploaded, please try again!",
                icon: "error",
                timer: 3000,
              };
            }
          });
        }

        return res.status(200).json(data);
      }
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
  editInstHeader: async (req, res) => {
    const data = req.body;
    const { insId, headerData } = data;
    const db = new Crud();
    db.where("insId", "=", insId);
    await db.update("t_inspection", { headerData: JSON.stringify(headerData) });
    return res.status(200).json({});
  },

  deleteMethode: async (req, res) => {
    const { id } = req.body;
    const db = new Crud();
    db.where("id", "=", id);
    await db.delete("t_method");
    return res.status(200).json({});
  },

  getInspections: async (req, res) => {
    try {
      const startTime = Date.now(); // Start timing
      const { func, partNumber } = req.body;
      const db = new Crud();
      db.select("insId, headerData, partNumber, judgement, inspectionStep");
      let response;

      switch (func) {
        case "neutral":
          response = await db.get("t_inspection");
          response = response.filter(
            (r) => r.judgement === null || r.judgement === 3
          );
          break;
        case "NG":
          db.select("insData");
          db.where("judgement", "=", 0);
          response = await db.get("t_inspection");
          break;
        case "OK":
          db.where("judgement", "=", 1);
          db.where("done", "=", 0);
          response = await db.get("t_inspection");
          break;
        case "FINISH":
          db.where("judgement", "=", 1);
          db.where("done", "=", 1);
          response = await db.get("t_inspection");
          break;
      }

      response = await Promise.all(
        response.map((resp) => {
          Object.entries(resp).forEach(([key, value]) => {
            const parsable = isValidJSONObject(value);
            if (parsable) {
              resp[key] = JSON.parse(value);
            }
          });

          Object.entries(resp.headerData).forEach(([key, value]) => {
            resp[key] = value;
          });

          return resp;
        })
      );

      // const db2 = new Crud();
      // const rr = await db2.get("t_inspection");

      // console.log(
      //   "[getInspections] Step: test Data",
      //   Date.now() - startTime,
      //   "ms"
      // );

      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  getInspectionData: async (req, res) => {
    try {
      const { insId } = req.body;
      const db = new Crud();
      db.where("insId", "=", insId);
      let response = await db.get("t_inspection");
      response = await Promise.all(
        response.map((resp) => {
          Object.entries(resp).forEach(([key, value]) => {
            const parsable = isValidJSONObject(value);
            if (parsable) {
              resp[key] = JSON.parse(value);
            }
          });

          Object.entries(resp.headerData).forEach(([key, value]) => {
            resp[key] = value;
          });

          return resp;
        })
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  saveInspection: async (req, res) => {
    try {
      const data = req.body;
      const { insId } = data;
      const db = new Crud();
      db.where("insId", "=", insId);
      await db.update("t_inspection", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  inititateInspection: async (req, res) => {
    try {
      const data = req.body;
      const db = new Crud();
      await db.insert("t_inspection", data);
      return res.status(200).json({});
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  addType: async (req, res) => {
    try {
      let data = req.body;
      data.extrudingItems = "[]";
      data.kneadingItems = "[]";
      data.outgoingItems = "[]";
      data.pressItems = "[]";
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
  newInsItem: async (req, res) => {
    try {
      const data = req.body;
      const db2 = new Crud();
      await db2.insert("t_insitem", data);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getInsItems: async (req, res) => {
    try {
      const db = new Crud();
      db.select("*");
      db.select("t_insitem.id as insId");
      db.join("left", "t_method", "t_method.id", "t_insitem.method");
      db.join(
        "left",
        "inspection_logic",
        "inspection_logic.id",
        "t_insitem.logic"
      );
      const items = await db.get("t_insitem");

      return res.status(200).json(items);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  editInsItem: async (req, res) => {
    try {
      const data = req.body;
      const { inspectionLable, id } = data;
      const db = new Crud();
      db.where("inspectionLable", "=", inspectionLable);
      db.where("id", "!=", id);
      const dupe = await db.get("t_insitem");
      if (dupe.length > 0)
        throw {
          title: "Duplicate Name",
          text: "The name is already taken by another item, please use a new name.",
          icon: "error",
        };

      const db2 = new Crud();
      db2.where("id", "=", id);
      await db2.update("t_insitem", data);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  deleteInsItem: async (req, res) => {
    try {
      const data = req.body;
      const { insId } = data;
      const db = new Crud();
      db.where("id", "=", insId);
      await db.delete("t_insitem");

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  checkApproval: async (req, res) => {
    try {
      const test = await testf();
      if (test) {
        const database = require("../config/database");
        await database
          .promise()
          .query(
            `ALTER TABLE t_inspection ADD COLUMN done TINYINT(1) DEFAULT 0;`
          );

        const dbi = new Crud();
        const items = await dbi.get("t_inspection");
        await Promise.all(
          items.map(async (item) => {
            const insData = JSON.parse(item.insData);
            if (insData.approval.date != "") {
              const dbu = new Crud();
              dbu.where("insId", "=", item.insId);
              await dbu.update("t_inspection", { done: 1 });
            }
          })
        );
        return res.status(200).json({ updated: true });
      } else {
        return res.status(200).json({ updated: true });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  repairInsData: async (req, res) => {
    try {
      const orderNumber = ["spi-336", "spi-337", "spi-338", "by air"];
      const repairDb = new Crud();
      const repairDb2 = new Crud();
      repairDb.select(
        "insId, partNumber, headerData, judgement, inspectionStep"
      );

      let response = await repairDb.get("t_inspection");
      response = response.filter((r) => r.judgement != null);
      response = await Promise.all(
        response.map(async (resp) => {
          const headerData = JSON.parse(resp.headerData);
          resp.poNumber = headerData.poNumber || "";
          return resp;
        })
      );
      response = response.filter((r) =>
        orderNumber.includes(r.poNumber.toLowerCase())
      );
      response = response.filter(
        (r) =>
          r.partNumber.startsWith("DU33") ||
          r.partNumber.startsWith("TF-26F4") ||
          r.partNumber.startsWith("17H37284D")
      );

      const ids = response.map((r) => r.insId);

      // const query = `UPDATE t_inspection SET judgement = null WHERE insId IN (${ids
      //   .map(() => "?")
      //   .join(", ")});`;
      // await database.promise().query(query, ids);

      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  },
  resetInspections: async (req, res) => {
    try {
      const database = require("../config/database");
      const ids = req.body.ids;
      const query = `UPDATE t_inspection SET judgement = null, done = 0 WHERE insId IN (${ids
        .map(() => "?")
        .join(", ")});`;
      await database.promise().query(query, ids);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};

function isValidJSONObject(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

async function testf() {
  const database = require("../config/database");
  const test = await database.promise().query(`SELECT COUNT(*) AS ada
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'butyl'
  AND TABLE_NAME = 't_inspection'
  AND COLUMN_NAME = 'done';`);
  return test[0][0].ada == 0;
}
