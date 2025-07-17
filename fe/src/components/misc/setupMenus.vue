<template>
  <div class="px-2">
    <v-list>
      <v-list-item
        rounded="pill"
        density="compact"
        :prepend-icon="item.icon"
        @click="goto(item)"
        v-for="(item, index) in setups"
        :key="index"
        :active="item.path == router.currentRoute.value.path"
      >
        <template #title>{{ item.title }}</template>
        <template #subtitle>{{ item.subtitle }}</template>
      </v-list-item>
    </v-list>
  </div>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
const props = defineProps(["closeMenu"]);

const store = useAppStore();
const setups = store.setups;

const goto = (item) => {
  store.page = item;
  router.push(item.path);
  props.closeMenu();
};
</script>
