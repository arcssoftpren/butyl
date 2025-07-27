/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";
import { useAppStore } from "@/stores/app";

routes.forEach((route) => {
  if (route.path != "/") {
    route.meta = { ...(route.meta || {}), layout: "dashboard" };
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;

router.beforeEach((e) => {
  const path = e.path;
  const store = useAppStore();
  const akses = store.userData.akses;
  const homePage = store.userData.homePage;
  const matched = e.matched;

  if (matched.length < 1) {
    router.push("/");
  }

  if (path != "/") {
    if (akses.length == 0) {
      router.push("/");
    }
    const menus = store.menus;
    const setups = store.setups;

    const findMenus = menus.find((m) => m.path == path);
    const findSetups = setups.find((m) => m.path == path);
    if (findMenus) {
      store.page = findMenus;
    } else {
      store.page = findSetups;
    }

    let acc = store.userData.akses;

    if (!acc.includes(path)) {
      router.push(homePage);
      store.swal.fire({
        title: "Forbiden",
        text: "You have not enough right to access the page.",
        icon: "error",
      });
    }
  } else {
    if (akses.length > 0) {
      router.push(homePage);
    }
  }
});
