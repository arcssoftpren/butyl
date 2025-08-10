<template>
  <div class="h-100">
    <v-data-table :items="accounts" :search="search">
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
        <tr class="text-uppercase">
          <th class="text-center">#</th>
          <th>User NIK</th>
          <th>user full name</th>
          <th>user role</th>
          <th class="text-center">actions</th>
        </tr>
      </template>
      <template #item="{ item, index }">
        <tr class="text-uppercase">
          <td class="text-center">{{ index + 1 }}</td>
          <td>{{ item.userNik }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.roleName }}</td>
          <td class="text-center">
            <v-btn-group density="compact" v-if="item.roleId != 1">
              <v-btn @click="openDialog(item, false)">
                <v-icon color="primary">mdi-database-edit</v-icon>
              </v-btn>
              <v-btn @click="openDialog(item, true)">
                <v-icon color="error">mdi-delete</v-icon>
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
      :max-width="dialogData.key == 'delete' ? '400' : '75vh'"
      transition="dialog-transition"
    >
      <v-card>
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
          <newUser :close-me="closeDialog" v-if="dialogData.key == 'new'" />
          <editUser
            :selected-data="selected"
            :close-me="closeDialog"
            v-if="dialogData.key == 'edit'"
          ></editUser>
          <div class="text-center" v-if="dialogData.key == 'delete'">
            <h1 class="text-h5">Delete {{ selected.userId }}?</h1>
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
                  @click="deleteUser"
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
const selected = ref(null);
const accounts = ref([]);
const dialogData = ref({
  title: "Add New User",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});
const openDialog = (item, del) => {
  if (item.userNik) {
    selected.value = item;
    dialogData.value = {
      title: del ? "Delete User" : "Edit User",
      subtitle: del
        ? "Please confirm your action"
        : "Please fill all required field bellow",
      icon: del ? "mdi-help" : "mdi-database-edit",
      key: del ? "delete" : "edit",
    };
  } else {
    dialogData.value = {
      title: "Add New User",
      subtitle: "Please fill all required field bellow",
      icon: "mdi-new-box",
      key: "new",
    };
  }
  dialog.value = true;
};

const refresh = async () => {
  try {
    accounts.value = await store.ajax({}, "/auth", "post");

    accounts.value = accounts.value.filter((account) => account.roleId != 1);
    store.preload = false;
  } catch (error) {
    console.log(error);
  }
};

const closeDialog = () => {
  refresh();
  dialogData.value = {};
  selected.value = null;
  dialog.value = false;
};

const deleteUser = async () => {
  try {
    const { userId } = selected.value;
    store.preload = true;
    await store.ajax({ userId }, "/auth/deleteuser", "post");
    dialog.value = false;
    refresh();
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
