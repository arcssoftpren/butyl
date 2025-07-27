<template>
  <v-table>
    <template #top>
      <h1 class="text-h6">Logic List</h1>
    </template>
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>Logic Label</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in logics" :key="index">
        <td class="text-center">{{ index + 1 }}</td>
        <td class="text-no-wrap">{{ item.label }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const logics = ref([]);
const refresh = async () => {
  logics.value = await store.ajax({}, "/inspection/logics", "post");
  store.preload = false;
};
onBeforeMount(() => {
  refresh();
});
</script>
