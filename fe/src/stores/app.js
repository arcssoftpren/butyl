// Utilities
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import $ from "jquery";
import { tr } from "vuetify/locale";

export const useAppStore = defineStore("app", {
  persist: {
    pick: ["appConfig", "userData", "page"],
  },
  state: () => ({
    //
    page: {
      title: "Dashboard",
      subtitle: "Home page of your role.",
      icon: "mdi-view-dashboard",
      path: "/dashboard",
    },
    preload: false,
    apiServer: "http://192.168.1.188:3235",
    // apiServer: "http://192.168.1.188:3235",
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
      },
      {
        title: "Accounts Setup",
        subtitle: "Manage your system's accounts here.",
        icon: "mdi-account-multiple",
        path: "/setup/accounts",
      },
    ],
    menus: [
      {
        title: "Dashboard",
        subtitle: "Home page of your role.",
        icon: "mdi-view-dashboard",
        path: "/dashboard",
      },
    ],
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
  },
});
