// Utilities
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import $ from "jquery";

export const useAppStore = defineStore("app", {
  persist: {
    pick: ["appConfig", "userData", "page"],
  },
  state: () => ({
    //

    extBlabel: {
      releasePaperYellow: "Release Paper Yellow",
      releasePaperWhite: "Release Paper White",
      filmNoShiwa: "Film (No Shiwa)",
      filmShiwa: "Film (Shiwa)",
      arumi: "Aluminum Foil",
    },
    extLabel: {
      color: "Release Paper color",
      peel: "Butyl tape",
      upper: "Upper Surface",
      bottom: "Bottom Surface",
      sheetLayout: "Sheet Layout",
      holeCount: "Hole Count",
      holeA: "Hole A",
      holeB: "Hole B",
      holeC: "Hole C",
      holeD: "Hole D",
      heaterTemp: "Heater Temp",
    },
    page: {
      title: "Dashboard",
      subtitle: "Home page of your role.",
      icon: "mdi-view-dashboard",
      path: "/dashboard",
    },
    roleUpdate: 0,
    preload: false,
    apiServer: `http://${import.meta.env.VITE_SERVER_IP || "localhost"}:${
      import.meta.env.VITE_SERVER_PORT || 3235
    }`,
    // apiServer: "http://192.168.1.10:3235",
    appConfig: {
      themeDark: true,
    },
    userData: {
      userNik: "",
      userRole: 0,
      userName: "",
      roleName: "",
      homePage: "",
      akses: [],
    },
    swal: Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        container: "swal-custom-zindex",
        cancelButton:
          "swal-btn swal-btn-cancel v-btn v-theme--light v-btn--density-default rounded-pill v-btn--size-default v-btn--variant-outlined",
        confirmButton:
          "swal-btn swal-btn-confirm text-error v-btn v-theme--light v-btn--density-default rounded-pill v-btn--size-default v-btn--variant-outlined",
      },
    }),
    setups: [
      {
        title: "Roles Setup",
        subtitle: "Manage your system's roles here.",
        icon: "mdi-shield-account",
        path: "/setup/role",
        video: "roleSetup.mp4",
      },
      {
        title: "Accounts Setup",
        subtitle: "Manage your system's accounts here.",
        icon: "mdi-account-multiple",
        path: "/setup/accounts",
        video: "accountSetup.mp4",
      },
      {
        title: "Methode Setup",
        subtitle: "Manage your inspection method data here.",
        icon: "mdi-ruler-square",
        path: "/setup/methods",
        video: "methodSetup.mp4",
      },
      {
        title: "Inspection Item Setup",
        subtitle: "Manage your inspection item template here.",
        icon: "mdi-format-list-group",
        path: "/setup/inspectionitem",
        video: "itemSetup.mp4",
      },
      {
        title: "WIP Type Setup",
        subtitle: "Manage your type data here.",
        icon: "mdi-shape",
        path: "/setup/type",
        video: "typeSetup.mp4",
      },
      {
        title: "Inspection Logic",
        subtitle: "Setup inspection logics here.",
        icon: "mdi-application-cog",
        path: "/setup/inspectionlogic",
      },
      {
        title: "Tutorial Video",
        subtitle: "See tutorial videos here.",
        icon: "mdi-video",
        path: "/setup/tutorial",
      },
    ],
    menus: [
      {
        title: "New Inspection Page",
        subtitle: "Generate and run a new inspection.",
        icon: "mdi-ruler",
        path: "/dashboard/newinspection",
      },
      {
        title: "NG Inspection",
        subtitle: "review rejected inspections.",
        icon: "mdi-exclamation",
        path: "/dashboard/nginspection",
      },
      {
        title: "Approval Page",
        subtitle: "Make an ispection approval.",
        icon: "mdi-draw",
        path: "/dashboard/approval",
      },
      {
        title: "Finished Inspection Page",
        subtitle: "review rejected inspections.",
        icon: "mdi-check",
        path: "/dashboard/finishinspection",
      },

      {
        title: "Parts Registration",
        subtitle: "Manage your parts data here.",
        icon: "mdi-cube",
        path: "/setup/parts",
      },
    ],
    insAccess: ["kneading", "appearance", "extruding", "press", "outgoing"],
  }),
  actions: {
    togglePreload(f) {
      this.preload = f;
    },
    toggleTheme(f) {
      this.appConfig.themeDark = f;
    },
    ajax(data, url, methode, isFile = false) {
      const store = useAppStore(); // satu instance yang konsisten
      store.togglePreload(true);

      return new Promise((resolve, reject) => {
        $.ajax({
          type: methode,
          url: `${store.apiServer}${url}`,
          data: data,
          dataType: isFile ? undefined : "JSON",
          processData: !(data instanceof FormData),
          contentType: !(data instanceof FormData)
            ? "application/x-www-form-urlencoded; charset=UTF-8"
            : false,
          success: function (response) {
            resolve(response); // pakai togglePreload juga bisa
          },
          error: (error) => {
            reject(error.responseJSON);
          },
        });
      });
    },
    async refreshAccountData() {
      const userNik = this.userData.userNik;
      this.userData = await this.ajax({ userNik }, "/auth/getuserdata", "post");
      // this.preload = false;
    },

    dataUrlToFile(dataUrl, fileName) {
      let arr = dataUrl.split(","), // Pisahkan header dan data
        mime = arr[0].match(/:(.*?);/)[1], // Ambil MIME type
        bstr = atob(arr[1]), // Decode base64
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    },

    fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // Hasil dalam bentuk Data URL
        reader.onerror = (error) => reject(error);
      });
    },
    checkLogic(logicType, standar, input, isLabel) {
      if (input === undefined || input === null) return false;
      let inputVal = typeof input === "string" ? input.trim() : input;

      const logicT = parseInt(logicType);
      switch (logicT) {
        case 1: // OK/NG Option
          if (!isLabel) {
            return inputVal === "OK";
          } else {
            return standar[0];
          }

        case 2: // Number Range [min, max]
          const min2 = parseFloat(standar[0]);
          const max2 = parseFloat(standar[1]);
          if (!isLabel) {
            return input >= min2 && input <= max2;
          } else {
            return `${min2} ~ ${max2}`;
          }

        case 3: // Larger Than (>)
          const min3 = parseFloat(standar[0]);
          if (!isLabel) {
            return input > min3;
          } else {
            return `> ${min3}`;
          }

        case 4: // Less Than (<)
          const max4 = parseFloat(standar[0]);

          if (!isLabel) {
            return input < max4;
          } else {
            return `< ${max4}`;
          }

        case 5: // Upper and Lower Limit [target, +x, -x]
          const round = (v, d = 3) =>
            Math.round(v * Math.pow(10, d)) / Math.pow(10, d);

          const target = round(parseFloat(standar[0]));
          const plus = round(parseFloat(standar[1]));
          const minus = round(parseFloat(standar[2]));
          inputVal = round(parseFloat(input));

          if (!isLabel) {
            return (
              inputVal >= round(target - minus) &&
              inputVal <= round(target + plus)
            );
          } else {
            return `${target}, +${plus}, -${minus}`;
          }
        case 6: // ≥ target
          const min6 = parseFloat(standar[0]);
          if (!isLabel) {
            return input >= min6;
          } else {
            return `≥ ${min6}`;
          }

        case 7: // ≤ target
          const max7 = parseFloat(standar[0]);
          if (!isLabel) {
            return input <= max7;
          } else {
            return `≤ ${max7}`;
          }

        case 8: // Match Text (case-insensitive)
          const expectedText = standar[0]?.toString().toLowerCase();
          if (!isLabel) {
            return inputVal?.toString().toLowerCase() === expectedText;
          } else {
            return `${standar[0]}`;
          }

        case 9: // Match Number (exact)
          const expectedNumber = parseFloat(standar[0]);
          if (!isLabel) {
            return parseFloat(input) === expectedNumber;
          } else {
            return `${standar[0]}`;
          }
        case 10: // Not equal
          const number = parseFloat(standar[0]);
          if (!isLabel) {
            return parseFloat(input) != number;
          } else {
            return `≠ ${standar[0]}`;
          }
        case 16: // custom OK/NG
          if (!isLabel) {
            return inputVal === "OK";
          } else {
            return `${standar[0]}`;
          }
        case 17: // custom OK/NG
          inputVal = parseFloat(input);
          let t = parseFloat(standar[0]);
          const tol = parseFloat(standar[1]);
          const u = t + tol;
          const l = t - tol;
          if (!isLabel) {
            return input <= u && input >= l;
          } else {
            return `${t} ± ${tol}`;
          }

        default:
          return false;
      }
    },
    isValidJSONObject(str) {
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    },
  },
});
