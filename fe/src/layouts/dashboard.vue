<template>
  <v-main>
    <v-app-bar density="compact">
      <template #append>
        <v-btn size="small" flat icon @click="setupDrawer = !setupDrawer">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <template #prepend>
        <v-btn size="small" flat icon @click="mainDrawer = !mainDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-responsive class="pa-2 h-100">
      <v-card class="h-100">
        <template #title>
          <div class="text-uppercase">
            {{ store.page.title }}
          </div>
        </template>
        <template #subtitle>
          {{ store.page.subtitle }}
        </template>
        <template #prepend>
          <v-icon size="45">{{ store.page.icon }}</v-icon>
        </template>
        <template #append>
          <v-btn
            rounded="pill"
            prepend-icon="mdi-multimedia"
            @click="videoDialog = true"
          >
            Tutorial Video
          </v-btn>
        </template>
        <v-card-text class="h-100">
          <div class="h-100">
            <v-divider></v-divider>
            <router-view />
          </div>
        </v-card-text>
      </v-card>
    </v-responsive>
    <v-navigation-drawer temporary="" v-model="mainDrawer">
      <featureMenus
        :key="store.roleUpdate"
        :close-menu="
          () => {
            mainDrawer = false;
          }
        "
      />
      <template #append>
        <v-list>
          <v-list-item @click="dialog = true" nav prepend-icon="mdi-logout">
            <template #title> Sign Out </template>
            <template #subtitle> Sign out of the app. </template>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-navigation-drawer
      width="290"
      temporary=""
      location="right"
      v-model="setupDrawer"
    >
      <setupMenus
        :key="store.roleUpdate"
        :close-menu="
          () => {
            setupDrawer = false;
          }
        "
      />
    </v-navigation-drawer>
    <div class="swal-custom-zindex floating-button-bottom">
      <v-btn size="small" @click="dark = !dark" icon="">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="text-center">
        <v-card elevation="0">
          <template #prepend>
            <v-icon color="warning" size="50">mdi-help</v-icon>
          </template>
          <template #title>
            <div class="text-h6">Are you sure you want to sign out?</div>
          </template>
          <template #subtitle>
            <div>All unsaved changes will be lost.</div>
          </template>
          <template #text>
            <v-row>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="6">
                <v-btn
                  prepend-icon="mdi-cancel"
                  variant="outlined"
                  rounded="pill"
                  block
                  @click="dialog = false"
                  >Cancel</v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn
                  @click="logOut"
                  prepend-icon="mdi-logout"
                  variant="outlined"
                  rounded="pill"
                  block
                  >Sign Out</v-btn
                >
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="videoDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn @click="videoDialog = false" flat icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>
          <v-card-title>Tutorial Video</v-card-title>
        </template>
        <v-card-text>
          <div
            v-for="(item, index) in [...store.menus, ...store.setups]"
            :key="index"
          >
            <videoViewer
              :item="item"
              v-if="$router.currentRoute.value.fullPath === item.path"
            ></videoViewer>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
const store = useAppStore();
const mainDrawer = ref(false);
const setupDrawer = ref(false);
const dialog = ref(false);
const videoDialog = ref(false);

watch(mainDrawer, (f) => {
  if (f) {
    setupDrawer.value = false;
  }
});

watch(setupDrawer, (f) => {
  if (f) {
    mainDrawer.value = false;
  }
});

const dark = ref(store.appConfig.themeDark);
watch(dark, (f) => {
  store.toggleTheme(f);
});

const logOut = () => {
  store.preload = true;
  store.userData = {
    userNik: "",
    userRole: 0,
    userName: "",
    roleName: "",
    homePage: "",
    akses: [],
  };

  router.push("/");
};

//
</script>
