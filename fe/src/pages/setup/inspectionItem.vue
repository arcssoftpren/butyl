<template>
  <div>
    <v-data-table
      :items-per-page="10"
      class="text-uppercase"
      :items="insItems"
      :headers="headers"
      item-value="insId"
    >
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <v-text-field
              class="mt-2"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded="pill"
              label="Search"
              hide-details
              density="compact"
              v-model="search"
            />
          </template>
          <template #append>
            <v-btn
              @click="openDialog('new')"
              density="compact"
              variant="outlined"
              icon
              class="mt-2 ms-2"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
        <v-divider class="my-2"></v-divider>
      </template>
      <template #item="{ item }">
        <tr>
          <td class="text-center">
            {{ item.no }}
          </td>
          <td class="text-center">
            {{ item.inspectionLable }}
          </td>
          <td class="text-center">
            {{ item.label }}
          </td>
          <td class="text-center">
            {{ item.romaji }}
          </td>
          <td class="text-center">
            <v-btn-group rounded="pill" density="compact" variant="outlined">
              <v-btn color="primary" @click="openDialog('edit', item)">
                <v-icon>mdi-database-edit </v-icon>
              </v-btn>
              <v-btn color="error" @click="openDialog('delete', item)">
                <v-icon>mdi-delete </v-icon>
              </v-btn>
            </v-btn-group>
          </td>
        </tr>
      </template>
    </v-data-table>
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
          <v-btn @click="dialog = false" flat="" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #prepend v-if="dialogData.key == 'delete'">
          <v-icon size="50" color="warning">mdi-help</v-icon>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
          <newinspectionItem
            v-if="dialogData.key == 'new'"
            :close-me="refresh"
            :methods="methods"
            :logics="logics"
          />
          <editInsItem
            v-if="dialogData.key == 'edit'"
            :close-me="refresh"
            :methods="methods"
            :selected="selected"
            :logics="logics"
          />
          <div v-if="dialogData.key == 'delete'">
            <h1 class="text-h6">
              You are about to delete
              <span class="text-uppercase">
                {{ selected.inspectionLable }},
              </span>
            </h1>
            <div>Are you sure?</div>
            <v-divider class="my-2"></v-divider>
            <v-btn-group class="w-100" variant="outlined" rounded="pill">
              <v-btn class="w-50" color="" @click="refresh"> Cancel </v-btn>
              <v-btn
                @click="deleteMe"
                class="w-50"
                color="error"
                prepend-icon="mdi-delete"
              >
                delete
              </v-btn>
            </v-btn-group>
          </div>
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
const methods = ref([]);
const logics = ref([]);
const insItems = ref([]);
const search = ref("");
const n = ref(1);
const headers = [
  {
    title: "No",
    key: "no",
    align: "center",
  },
  {
    title: "Item Name",
    key: "inspectionLable",
    align: "center",
  },
  {
    title: "Logic Type",
    key: "label",
    align: "center",
    sort: true,
  },
  {
    title: "tools/method",
    key: "romaji",
    align: "center",
  },
  {
    title: "Actions",
    key: "insId",
    align: "center",
  },
];
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "new":
      dialogData.title = "Create Template";
      dialogData.subtitle = "Please fill all required data below";
      break;
    case "edit":
      dialogData.title = "Edit Template";
      dialogData.subtitle = "Please fill all required data below";
      selected.value = item;
      break;
    case "delete":
      dialogData.title = "Delete Template";
      dialogData.subtitle = "Please confirm your action";
      selected.value = item;
      break;
  }
  dialog.value = true;
};

const refresh = async () => {
  insItems.value = await store.ajax({}, "/inspection/items", "post");
  methods.value = await store.ajax({}, "/inspection/methods", "post");
  logics.value = await store.ajax({}, "/inspection/logics", "post");
  store.preload = false;
  dialog.value = false;

  insItems.value = await Promise.all(
    insItems.value.map((e) => {
      e.no = n.value;
      n.value++;
      return e;
    })
  );
};

const deleteMe = async () => {
  await store.ajax(selected.value, "/inspection/deleteitem", "post");
  refresh();
};

onBeforeMount(() => {
  refresh();
});
</script>
