<template>
  <v-main>
    <v-app-bar>
      <template #append>
        <v-btn flat icon @click="setupDrawer = !setupDrawer">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <template #prepend>
        <v-btn flat icon @click="mainDrawer = !mainDrawer">
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
        <v-card-text class="h-100">
          <div class="h-100">
            <v-divider></v-divider>
            <router-view />
          </div>
        </v-card-text>
      </v-card>
    </v-responsive>
    <v-navigation-drawer
      temporary=""
      v-model="mainDrawer"
    ></v-navigation-drawer>
    <v-navigation-drawer
      width="290"
      temporary=""
      location="right"
      v-model="setupDrawer"
    >
      <setupMenus
        :close-menu="
          () => {
            setupDrawer = false;
          }
        "
      ></setupMenus>
    </v-navigation-drawer>
    <div class="floating-button-bottom">
      <v-btn size="small" @click="dark = !dark" icon="">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </div>
  </v-main>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();
const mainDrawer = ref(false);
const setupDrawer = ref(false);

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

//
</script>
