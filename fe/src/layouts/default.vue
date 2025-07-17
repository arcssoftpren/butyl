<template>
  <v-main>
    <router-view />
  </v-main>
  <div class="floating-button">
    <v-btn @click="dark = !dark" flat="" icon="">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();

const dark = ref(store.appConfig.themeDark);
watch(dark, (f) => {
  store.toggleTheme(f);
});

//
</script>
