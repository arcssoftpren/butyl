<template>
  <div class="h-100">
    <v-data-table
      fixed-header
      max-height="60vh"
      :search="search"
      :items="types"
      :items-per-page-options="[5, 10, 15, 20, -1]"
      items-per-page="10"
      :headers="headers"
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
      <template #item="{ item, index }">
        <tr class="text-uppercase text-center">
          <td>{{ index + 1 }}</td>
          <td>{{ item.typeNumber }}</td>
          <td>
            <v-img height="100" :src="images.header[item.headerType]"></v-img>
          </td>
          <td>
            <v-img height="100" :src="images.kneading[item.kneadingType]" />
          </td>
          <td>
            <v-img height="100" :src="images.extruding[item.extrudingType]" />
          </td>
          <td>
            <v-checkbox
              label="Extruding Dies Temp. Check"
              v-model="item.heaterOn"
              density="compact"
              hide-details=""
              @change="editBool(item)"
            />
            <v-checkbox
              @change="editBool(item)"
              label="Press Inspection"
              v-model="item.pressOn"
              density="compact"
              hide-details=""
            />
            <v-checkbox
              @change="editBool(item)"
              label="Outgoing Inspection"
              v-model="item.outGoingOn"
              density="compact"
              hide-details=""
            />
          </td>
          <td class="text-center">
            <v-btn-group density="compact" variant="outlined" rounded="pill">
              <v-btn @click="openDialog('edit', item)" color="primary">
                <v-icon>mdi-database-edit</v-icon>
              </v-btn>
              <v-btn
                v-on:click="
                  () => {
                    dialog2 = true;
                    selected = item;
                  }
                "
                color="error"
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
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #append>
          <v-btn flat icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #text>
          <newWpType v-if="dialogData.key == 'new'" :close-me="refresh" />
          <editWp
            v-on:edit-data="editBool"
            v-if="dialogData.key == 'edit'"
            :close-me="refresh"
            :selected="selected"
          />
        </template>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #title>Delete Confirmation</template>
        <template #subtitle>Please confirm your actions</template>
        <template #prepend>
          <v-icon size="50" color="warning">mdi-help</v-icon>
        </template>
        <template #text>
          <div class="text-h6">
            You are going to delete {{ selected.typeNumber }}
          </div>
          Do you confirm?
          <v-divider class="my-2"></v-divider>
          <v-row>
            <v-col cols="6">
              <v-btn
                @click="dialog2 = false"
                block=""
                variant="outlined"
                rounded="pill"
                dark
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="primary"
                block=""
                variant="outlined"
                rounded="pill"
                dark
                @click="deleteMe"
                >Confirm</v-btn
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
import headerA from "@/assets/header_a.png";
import headerB from "@/assets/header_b.png";
import extA from "@/assets/extrudingA.png";
import extB from "@/assets/extrudingB.png";
import extC from "@/assets/extrudingC.png";
import kneadingA from "@/assets/kneading_a.png";
import kneadingB from "@/assets/kneading_b.png";
import { error } from "jquery";

const store = useAppStore();
const search = ref("");
const types = ref([]);
const dialog = ref(false);
const dialog2 = ref(false);
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});
const headers = ref([
  {
    title: "No",
    key: "typeNumber",
    align: "center",
  },
  {
    title: "WP Type Name",
    key: "typeNumber",
    align: "center",
  },
  {
    title: "Header Type",
    key: "headerType",
    align: "center",
    align: "center",
  },
  {
    title: "Kneading Type",
    key: "kneadingType",
    align: "center",
  },
  {
    title: "Extruding Type",
    key: "extrudingType",
    align: "center",
  },
  {
    title: "Extra Inspections",
    key: "partNumber",
    align: "center",
  },
  {
    title: "Actions",
    key: "partNumber",
    align: "center",
  },
]);
const selected = ref(null);

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "new":
      dialogData.title = "Create a New WP Type";
      dialogData.subtitle = "Please fill all required data below";
      break;
    case "edit":
      selected.value = item;
      dialogData.title = "Edit WP Type";
      dialogData.subtitle = "Please fill all required data below";
      break;
  }
  dialog.value = true;
};

const refresh = async () => {
  types.value = await store.ajax({}, "/parts/gettypes", "post");
  dialog.value = false;
  dialog2.value = false;
  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});

const images = {
  header: {
    a: headerA,
    b: headerB,
  },
  kneading: {
    a: kneadingA,
    b: kneadingB,
  },
  extruding: {
    a: extA,
    b: extB,
    c: extC,
  },
};

const editBool = async (item) => {
  nextTick()
    .then(async () => {
      await store.ajax(item, "/parts/edittype", "post");
      refresh();
      store.preload = false;
      dialog.value = false;
    })
    .catch((error) => {
      store.swal.fire(error);
    });
};

const deleteMe = () => {
  store.ajax(selected.value, "/parts/deletetype", "post").then(() => {
    refresh();
  });
};
</script>
