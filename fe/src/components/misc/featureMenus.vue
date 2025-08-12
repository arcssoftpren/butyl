<template>
  <div class="px-2">
    <v-list>
      <v-list-item
        :color="item.path == currentPath ? 'primary' : ''"
        nav
        rounded="pill"
        :prepend-icon="item.icon"
        @click="goto(item)"
        v-for="(item, index) in setups"
        :key="index"
        :active="item.path == currentPath"
      >
        <template #title>{{ item.title }}</template>
        <template #subtitle>{{ item.subtitle }}</template>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
  </div>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
const props = defineProps(["closeMenu"]);

const store = useAppStore();
let setups = ref(store.menus);

const goto = (item) => {
  store.page = item;
  router.push(item.path);
  props.closeMenu();
};

const currentPath = computed(() => router.currentRoute.value.path);

onBeforeMount(async () => {
  await store.refreshAccountData();
  let acc = store.userData.akses;
  setups.value = setups.value.filter((item) => acc.includes(item.path));
  store.preload = false;
});
</script>
