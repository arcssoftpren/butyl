<template>
  <div>
    <v-card>
      <v-card-title>Emergency Reset</v-card-title>
      <v-card-subtitle> Emergency Reset for room tempt error. </v-card-subtitle>
      <v-card-text>
        <div>
          Click the button below to reset all inspections with part number
          "TF-26F4" and "DU33***" and with Order Number within range "SPI-336" -
          "SPI-338" to "New Inspection" status. This action is intended to
          resolve issues related to room temperature errors during inspection.
        </div>
        <v-btn
          class="mt-4"
          color="red"
          variant="outlined"
          @click="resetInspections"
        >
          Reset Inspections
        </v-btn>
      </v-card-text>
    </v-card>
    <!-- <v-data-table
      :search="search"
      :headers="[
        { key: 'no', title: 'No' },
        { key: 'insId', title: 'Ins ID' },
        { key: 'partNumber', title: 'Part Number' },
        { key: 'poNumber', title: 'Order Number' },
      ]"
      :items="items"
    >
      <template #top>
        <v-text-field
          variant="outlined"
          rounded="pill"
          density="compact"
          v-model="search"
        />
      </template>
    </v-data-table> -->
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            variant="outlined"
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const items = ref([]);
const search = ref("");
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});
const ids = ref([]);

const openDialog = (key, item) => {
  switch (key) {
    case "new":
      break;
    case "edit":
      selected.value = item;
      break;
    case "delete":
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const refresh = async () => {
  try {
    items.value = await store.ajax({}, "/repair", "post");
    items.value = await Promise.all(
      items.value.map(async (item, index) => {
        return {
          no: index + 1,
          ...item,
        };
      })
    );
    ids.value = items.value.map((item) => item.insId);
    store.preload = false;
  } catch (error) {
    console.log(error);
  }
};

const resetInspections = async () => {
  try {
    await store.ajax({ ids: ids.value }, "/reset", "post");
    await refresh();
    store.preload = false;
    store.swal.fire({
      icon: "success",
      title: "Reset Successful",
      text: "All inspections with part number TF-26F4 have been reset to Pending status.",
    });
  } catch (error) {
    console.log(error);
    store.preload = false;
    store.swal.fire({
      icon: "error",
      title: "Reset Failed",
      text: "An error occurred while resetting inspections. Please try again.",
    });
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
