<template>
  <div>
    <v-data-table :search="search" :items="parts">
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
          <th>
            Part Name <br />
            <small>Part Number</small>
          </th>
          <th>Customer</th>
          <th class="text-center">Actions</th>
        </tr>
      </template>
      <template #item="{ item, index }">
        <tr class="text-uppercase">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-start">
            <strong>{{ item.partName }}</strong>
            <div>
              <small>{{ item.partNumber }}</small>
            </div>
          </td>
          <td>
            {{ item.customer }}
          </td>
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

        <template #append>
          <v-btn flat icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #text>
          <!-- <newPart :close-me="refresh" v-if="dialogData.key == 'new'"></newPart> -->

          <addpart :close-me="refresh" v-if="dialogData.key == 'new'"></addpart>
          <editPart
            :selected-item="selected"
            :close-me="refresh"
            v-if="dialogData.key == 'edit'"
          >
          </editPart>
          <div class="text-center" v-if="dialogData.key == 'delete'">
            <v-row>
              <v-col cols="12">
                <h1 class="text-h5">
                  You are Going to delete {{ selected.partNumber }}
                </h1>
                <div>Do you confirm?</div>
              </v-col>
              <v-col cols="12">
                <v-divider class="my-2"></v-divider>
              </v-col>
            </v-row>
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
                  @click="deletePart"
                  >Delete</v-btn
                >
              </v-col>
            </v-row>
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
const search = ref("");
const parts = ref([]);
const dialogData = ref({
  title: "Creat New Part",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});
const selected = ref(null);
const openDialog = async (item, del) => {
  if (item.partNumber) {
    selected.value = item;
    // console.log(item);
    dialogData.value = {
      title: del ? "Delete Part" : "Edit Part",
      subtitle: del
        ? "Please confirm your action"
        : "Please fill all required field bellow",
      icon: del ? "mdi-help" : "mdi-database-edit",
      key: del ? "delete" : "edit",
    };
  } else {
    dialogData.value = {
      title: "Creat New Part",
      subtitle: "Please fill all required field bellow",
      icon: "mdi-new-box",
      key: "new",
    };
  }

  dialog.value = true;
};

const refresh = async () => {
  try {
    parts.value = await store.ajax({}, "/parts", "post");
    dialog.value = false;
    store.preload = false;
  } catch (error) {}
};

const deletePart = async () => {
  await store.ajax({ partId: selected.value.partId }, "/parts/delete", "post");
  refresh();
};

onBeforeMount(() => {
  refresh();
});
</script>
