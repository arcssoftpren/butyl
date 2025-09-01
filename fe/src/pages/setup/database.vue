<template>
  <div>
    <v-card class="my-5">
      <template #title>Restore Backup </template>
      <template #append>
        <v-btn
          @click="openDialog('restore')"
          :disabled="!file"
          variant="outlined"
          rounded="pill"
          block
          >Restore Now</v-btn
        >
      </template>
      <template #text>
        <v-file-input
          variant="outlined"
          rounded="pill"
          hide-details
          density="compact"
          label="Select SQL File"
          v-model="file"
        ></v-file-input>
      </template>
    </v-card>
    <v-card class="my-5">
      <template #title>Auto Daily Backup</template>
      <template #subtitle v-if="autoBackup !== null"
        >Last Update:
        {{ moment(autoBackup.backupDate).format("LLLL") }}</template
      >
      <template #append>
        <v-btn
          variant="outlined"
          rounded="pill"
          block
          @click="download(autoBackup, true)"
        >
          Download Now
        </v-btn>
      </template>
    </v-card>
    <v-card>
      <template #title>Manual Backups</template>
      <template #text>
        <v-data-table
          items-per-page="4"
          :headers="headers"
          :items="backups"
          :search="search"
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
                  @click="newBackup()"
                  rounded="pill"
                  variant="outlined"
                  class="mt-2 ms-2"
                >
                  Create New Manual Backup
                </v-btn>
              </template>
            </v-toolbar>
            <v-divider class="my-2"></v-divider>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              class="me-1"
              size="small"
              @click="download(item, false)"
              icon
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn
              class="mx-1"
              size="small"
              @click="openDialog('delete', item)"
              icon
            >
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="mx-1"
              size="small"
              @click="openDialog('restore', item)"
              icon
            >
              <v-icon color="primary">mdi-restore</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </template>
    </v-card>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card v-if="dialogData.key !== 'delete'" class="text-center">
        <template #title>Restore Backup Confirmation</template>
        <template #subtitle>You are about to restore a backup. </template>
        <template #text>
          <h1 class="text-h6" v-if="selected != null">
            {{ selected.fileName }}
          </h1>
          <p>Are you sure you want to restore this backup?</p>
          <v-icon size="150" color="warning">mdi-help</v-icon>
          <br />
          This action cannot be undone.
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="6">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="dialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                color="primary"
                prepend-icon="mdi-restore"
                variant="outlined"
                rounded="pill"
                block
                @click="restore"
                >Restore</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-card>
      <v-card v-else class="text-center">
        <template #title>Confirm Delete</template>
        <template #text>
          You are about to delete the backup file:
          <h1 class="text-h6">
            {{ selected.fileName }}
          </h1>
          <p>Are you sure you want to delete this backup file?</p>
          <p>This action cannot be undone.</p>
          <v-icon size="150" color="warning">mdi-help</v-icon>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="6">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="dialog = false"
                >cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                prepend-icon="mdi-delete"
                variant="outlined"
                rounded="pill"
                block
                @click="deleteBackup(selected)"
                >delete</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";

const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const backups = ref([]);
const search = ref(null);
const autoBackup = ref(null);
const file = ref(null);
let fd = ref(new FormData());
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

watch(dialog, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      selected.value = null;
      fd.value = new FormData();
      file.value = null;
    }, 200);
  }
});

watch(file, (newFile) => {
  if (newFile) {
    fd.value.append("sqlFile", newFile);
  } else {
    fd.value.delete("sqlFile");
  }
});

const headers = ref([
  { title: "No", key: "no", align: "center" },
  { title: "File Name", key: "fileName", align: "center" },
  { title: "Created At", key: "createdAt", align: "center" },
  { title: "Actions", key: "actions", align: "center", sortable: false },
]);

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "restore":
      selected.value = item;
      if (item) {
        fd.value.append("fileName", item.fileName);
      }
      break;
    case "edit":
      selected.value = item;
      break;
    case "delete":
      selected.value = item;
      break;
  }
  dialog.value = true;
};

const refresh = async () => {
  try {
    const response = await store.ajax({}, "/auth/getbackups", "POST", false);
    backups.value = response.map((item, index) => ({
      no: index + 1,
      fileName: item.fileName,
      createdAt: moment(item.backupDate).format("DD/MM/YYYY HH:mm:ss"),
      actions: item.fileName,
    }));
    autoBackup.value = await store.ajax(
      {},
      "/auth/getautobackup",
      "POST",
      false
    );
    setTimeout(() => {
      store.preload = false;
    }, 2000);
  } catch (error) {
    console.log(error);
  }
};

const download = async (item, autoBackup) => {
  try {
    const fileName = item.fileName;
    // Request the file as a blob
    store.preload = true;
    const response = await fetch(
      `http://${import.meta.env.VITE_SERVER_IP || "localhost"}:${
        import.meta.env.VITE_SERVER_PORT || 3235
      }/auth/downloadbackup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header otorisasi jika perlu
        },
        body: JSON.stringify({ fileName, autoBackup }),
      }
    );

    if (!response.ok) throw new Error("Failed to download file");

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName.endsWith(".sql") ? fileName : `${fileName}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    store.preload = false;
  } catch (error) {
    console.log(error);
  }
};

const newBackup = async () => {
  try {
    store.preload = true;
    await store.ajax({}, "/auth/newbackup", "POST", false);
    await refresh();
  } catch (error) {
    console.log(error);
  } finally {
    store.preload = false;
  }
};

const deleteBackup = async (item) => {
  try {
    store.preload = true;
    const fileName = item.fileName;
    await store.ajax({ fileName }, "/auth/deletebackup", "POST", false);
    await refresh();
  } catch (error) {
    console.log(error);
  } finally {
    store.preload = false;
    dialog.value = false;
  }
};

onBeforeMount(() => {
  refresh();
});

const restore = async () => {
  try {
    store.preload = true;
    await store.ajax(fd.value, "/auth/restorebackup", "POST", false, true);
    store.swal.fire(
      "Success",
      "Database has been restored successfully.",
      "success"
    );
  } catch (error) {
    store.swal.fire(
      "Error",
      "Failed to restore database. Make sure it is butyl database file.",
      "error"
    );
    console.log(error);
  } finally {
    fd.value = new FormData();
    file.value = null;
    store.preload = false;
    dialog.value = false;
  }
};
</script>
