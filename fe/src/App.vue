<template>
  <v-app :theme="store.appConfig.themeDark ? 'dark' : 'light'">
    <router-view />
    <appPreload></appPreload>
  </v-app>
</template>

<script setup>
//

import { useAppStore } from "@/stores/app";

const store = useAppStore();
</script>
