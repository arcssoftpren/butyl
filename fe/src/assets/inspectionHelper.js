import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import moment from "moment";

const store = useAppStore();

export default class Inspection {
  constructor() {
    this.insId;
    this.partData = reactive({});
    this.partNumber = null;
    this.pressOn = null;
    this.outgoingOn = null;
    this.judgement = null;
    this.headerData = reactive({
      prodQty: "",
      deliveryDate: "",
      kneadingLot: "",
      extrudingLot: "",
      orderNumber: "",
      poNumber: "",
    });
    this.kneadingData = {
      insItem: [],
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: null,
      kneadingQlt: {
        pic: "",
        date: "",
      },
    };
    this.appearanceData = {
      inspector: null,
      inspectionDate: "",
      standard: {},
      data: {},
      judgement: null,
    };
    this.extrudingData = {
      insItem: [],
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: null,
    };
    this.pressData = {
      insItem: [],
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: null,
    };
    this.outgoingData = {
      insItem: [],
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: null,
    };
    this.approval = {
      date: "",
      picData: {},
    };
    this.inspectionStep = {
      step: "kneading",
      n: 1,
    };
    this.rejectionData = {
      current: "",
      data: {
        kneading: [],
        appearance: [],
        extruding: [],
        press: [],
        outgoing: [],
      },
    };
    // not included in data
    this.headerRules = {
      prodQty: {
        req: required,
      },
      deliveryDate: {
        req: () => {
          const partHeaders = this.partData.headers;
          if (partHeaders.includes("deliveryDate")) {
            return this.headerData.deliveryDate != "";
          } else {
            return true;
          }
        },
      },
      kneadingLot: {
        req: required,
      },
      extrudingLot: {
        req: required,
      },
      orderNumber: {
        req: () => {
          const partHeaders = this.partData.headers;
          if (partHeaders.includes("orderNumber")) {
            console.log("included orderNumber");
            return this.headerData.orderNumber != "";
          } else {
            return true;
          }
        },
      },
      poNumber: {
        req: required,
      },
    };
    this.headerValidate = useVuelidate(this.headerRules, this.headerData);
    this.currentData = {};
  }

  initInspectionData() {
    return new Promise(async (resolve, reject) => {
      const mapping = [
        {
          on: true,
          items: this.partData.kneadingItems,
          target: this.kneadingData.data,
        },
        {
          on: true,
          items: this.partData.extrudingItems,
          target: this.extrudingData.data,
        },
        {
          on: this.pressOn,
          items: this.partData.pressItems,
          target: this.pressData.data,
        },
        {
          on: this.outgoingOn,
          items: this.partData.outgoingItems,
          target: this.outgoingData.data,
        },
      ];

      mapping.forEach((m) => m.target.splice(0));

      mapping.forEach(({ on, items, target }) => {
        if (on && Array.isArray(items)) {
          this.generateInspectionStep(items, target);
        }
      });

      const appStd = this.partData.extAppStd;

      Object.entries(appStd).forEach(([key, val]) => {
        this.appearanceData.standard[key] = val;
      });

      try {
        const valid = await this.headerValidate.$validate();
        if (!valid) throw this.headerValidate.$errors;

        resolve(this.toJSON());
      } catch (error) {
        reject(error);
      }
    });
  }

  registerStep(step, n) {
    this.inspectionStep.n = n;
    this.inspectionStep.step = step;
  }

  initInspection(step) {
    this.registerStep(step, this.inspectionStep.n);
    switch (step) {
      case "kneading":
        this.currentData = this.kneadingData;
        this.currentData.insItem = this.partData.kneadingItems;
        break;
      case "extruding":
        this.currentData = this.extrudingData;
        this.currentData.insItem = this.partData.extrudingItems;
        break;
      case "press":
        this.currentData = this.pressData;
        this.currentData.insItem = this.partData.pressItems;
        break;
      case "outgoing":
        this.currentData = this.outgoingData;
        this.currentData.insItem = this.partData.outgoingItems;
        break;
    }
  }

  generateInspectionStep(items, targetArray) {
    const max = Math.max(...items.map((e) => parseInt(e.sampleQ || "0")));

    for (let i = 0; i < max; i++) {
      const index = i + 1;
      const key = `N${index}`;
      const stepItems = items.map((item) => ({
        ...item,
        input: "",
        judgement: "",
        isCheck: parseInt(item.sampleQ || "0") >= index,
      }));
      targetArray.push({ key, items: stepItems, judgement: "" });
    }
  }

  registerPart(part) {
    this.partData = { ...part };
    this.partNumber = part.partNumber;
    this.pressOn = part.pressOn;
    this.outgoingOn = part.outgoingOn;

    part.headers.forEach((key) => {
      if (key == "deliveryDate") {
        this.headerData.deliveryDate = moment().format("YYYY-MM-DD");
      } else {
        this.headerData[key] = "";
      }
    });

    this.headerValidate = useVuelidate(this.headerRules, this.headerData);
  }

  registerData(savedInspection) {
    if (!savedInspection || typeof savedInspection !== "object") return;

    // Langsung set semua property satu per satu
    this.partData = savedInspection.partData || null;
    this.insId = savedInspection.insId || null;
    this.partNumber = savedInspection.partNumber || null;
    this.judgement = savedInspection.judgement || null;
    this.pressOn = savedInspection.pressOn == 1 ? true : false || null;
    this.outgoingOn = savedInspection.outgoingOn == 1 ? true : false || null;

    this.headerData = savedInspection.headerData || {
      prodQty: "",
      deliveryDate: "",
      kneadingLot: "",
      extrudingLot: "",
      orderNumber: "",
      poNumber: "",
    };

    this.kneadingData = savedInspection.kneadingData || {
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: undefined,
      kneadingQlt: {
        pic: "",
        date: "",
      },
    };

    this.appearanceData = savedInspection.appearanceData || {
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: undefined,
    };

    this.extrudingData = savedInspection.extrudingData || {
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: undefined,
    };

    this.pressData = savedInspection.pressData || {
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: undefined,
    };

    this.outgoingData = savedInspection.outgoingData || {
      inspector: null,
      inspectionDate: "",
      data: [],
      judgement: undefined,
    };

    this.approval = savedInspection.approval || {
      date: "",
      picData: {},
    };

    this.inspectionStep = savedInspection.inspectionStep || {
      step: "kneading",
      n: 1,
    };

    this.rejectionData.data = savedInspection.rejectionData.data || {
      kneading: [],
      appearance: [],
      extruding: [],
      press: [],
      outgoing: [],
    };
  }

  toJSON() {
    let response = {
      partNumber: this.partNumber,
      headerData: JSON.stringify(this.headerData),
      inspectionStep: JSON.stringify(this.inspectionStep),
      insData: JSON.stringify({
        partData: this.partData,
        pressOn: this.pressOn,
        outgoingOn: this.outgoingOn,
        kneadingData: this.kneadingData,
        appearanceData: this.appearanceData,
        extrudingData: this.extrudingData,
        pressData: this.pressData,
        outgoingData: this.outgoingData,
        approval: this.approval,
        rejectionData: this.rejectionData,
      }),
    };

    if (this.judgement == 0) {
      response.judgement = 0;
    } else if (this.judgement == 1) {
      response.judgement = 1;
    }

    if (this.insId != null) {
      response.insId = this.insId;
    }
    return response;
  }

  generateTableStructure() {
    let data = this.currentData;
    return data.insItem.map((ins) => {
      ins.steps = [...data.data];
      return ins;
    });
  }
}
