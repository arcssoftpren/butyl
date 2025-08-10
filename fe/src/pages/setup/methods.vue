<template>
  <v-data-table :search="search" :items="methods">
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
            @click="openDialog"
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
    <template #headers>
      <tr>
        <th class="text-center">No</th>
        <th>Method Name Romaji</th>
        <th>Method Name Japanse</th>
        <th class="text-center">Actions</th>
      </tr>
    </template>
    <template #item="{ item, index }">
      <tr>
        <td class="text-center">{{ index + 1 }}</td>
        <td>{{ item.romaji }}</td>
        <td>{{ item.japanese }}</td>
        <td class="text-center">
          <v-btn-group density="compact" variant="outlined">
            <v-btn
              @click="openDialog(item, false)"
              color="primary"
              density="compact"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              @click="openDialog(item, true)"
              color="error"
              density="compact"
            >
              <v-icon>mdi-delete</v-icon>
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
    :max-width="dialogData.key == 'delete' ? '400' : ''"
    :overlay="false"
    transition="dialog-transition"
  >
    <v-card>
      <template #item>
        <v-divider class="mb-5"></v-divider>
      </template>
      <template #title>{{ dialogData.title }}</template>
      <template #subtitle>{{ dialogData.subtitle }}</template>
      <template #prepend>
        <v-icon
          size="40"
          :color="dialogData.key == 'delete' ? 'warning' : 'primary'"
          >{{ dialogData.icon }}</v-icon
        >
      </template>
      <template #append>
        <v-btn flat icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #text>
        <newMethod :close-me="refresh" v-if="dialogData.key == 'new'" />
        <newMethod
          :selected-data="selected"
          :close-me="refresh"
          v-if="dialogData.key == 'edit'"
        />

        <div class="text-center" v-if="dialogData.key == 'delete'">
          <h1 class="text-h5">Delete {{ selected.romaji }}?</h1>
          <v-divider class="my-2"></v-divider>
          <v-row>
            <v-col cols="6">
              <v-btn
                @click="dialog = false"
                rounded="pill"
                variant="outlined"
                block
                >Cancel</v-btn
              >
            </v-col>

            <v-col cols="6">
              <v-btn
                prepend-icon="mdi-delete"
                rounded="pill"
                variant="outlined"
                block
                color="error"
                @click="deleteMethod"
                >Delete</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const methods = ref([]);
const search = ref("");
const selected = ref(null);
const dialog = ref(false);
const dialogData = ref({
  title: "Creat New Method",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});

const refresh = async () => {
  methods.value = await store.ajax({}, "/inspection/methods", "post");
  store.preload = false;
  dialog.value = false;
};

onBeforeMount(() => {
  refresh();
});

const openDialog = (item, del) => {
  if (item.id) {
    selected.value = item;
    dialogData.value = {
      title: del ? "Delete Method" : "Edit Method",
      subtitle: del
        ? "Please confirm your action"
        : "Please fill all required field bellow",
      icon: del ? "mdi-help" : "mdi-database-edit",
      key: del ? "delete" : "edit",
    };
  } else {
    dialogData.value = {
      title: "Creat New Method",
      subtitle: "Please fill all required field bellow",
      icon: "mdi-new-box",
      key: "new",
    };
  }
  dialog.value = true;
};

const deleteMethod = async () => {
  const id = selected.value.id;
  store.preload = true;
  await store.ajax({ id }, "/inspection/deletemethod", "post");
  refresh();
};
</script>
