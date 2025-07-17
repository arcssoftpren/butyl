<template>
  <div class="h-100">
    <v-data-table
      fixed-header
      max-height="60vh"
      :search="search"
      :items="roles"
    >
      <template #top>
        <v-toolbar color="transparent">
          <template #title>Roles List</template>
          <template #extension>
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
          </template>
        </v-toolbar>
        <v-divider class="my-2"></v-divider>
      </template>
      <template #headers>
        <tr class="text-uppercase">
          <th>#</th>
          <th>Role Name</th>
          <th>Home Page</th>
          <th>Access Rights</th>
          <th class="text-center">Actions</th>
        </tr>
      </template>
      <template #item="{ item, index }">
        <tr class="text-uppercase">
          <td>{{ index }}</td>
          <td>{{ item.roleName }}</td>
          <td>{{ item.homePage }}</td>
          <td>
            <v-row>
              <v-col cols="3" v-for="acc in access" :key="acc.path">
                <v-switch
                  class="text-sm-body-1"
                  @change="editAkses(item)"
                  :value="acc.path"
                  density="compact"
                  hide-details
                  :label="acc.title"
                  v-model="roles[index].akses"
                  :disabled="acc.path == item.homePage"
                />
              </v-col>
            </v-row>
          </td>
          <td class="text-center">
            <v-btn-group density="compact">
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
      max-width="400"
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
          <newRole
            :close-dialog="
              () => {
                dialog = false;
                refresh();
              }
            "
            v-if="dialogData.key == 'new'"
          />
          <editRole
            :close-dialog="
              () => {
                dialog = false;
                refresh();
              }
            "
            :selected-data="selected"
            v-if="dialogData.key == 'edit'"
          >
          </editRole>
          <div class="text-center" v-if="dialogData.key == 'delete'">
            <h1 class="text-h5">Delete {{ selected.roleName }}?</h1>
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
                  @click="deleteRole"
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
const search = ref("");
const roles = ref([]);
const dialog = ref(false);
const selected = ref(null);
const dialogData = ref({
  title: "Creat New Role",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});
const refresh = async () => {
  try {
    store.togglePreload(true);

    roles.value = await store.ajax({}, "/auth/getroles", "post");

    store.togglePreload(false);
    roles.value = await Promise.all(
      roles.value.map((role) => {
        role.akses = JSON.parse(role.akses);
        return role;
      })
    );
  } catch (error) {}
};
const openDialog = (item, del) => {
  if (item.roleId) {
    selected.value = item;
    dialogData.value = {
      title: del ? "Delete Role" : "Edit Role",
      subtitle: del
        ? "Please confirm your action"
        : "Please fill all required field bellow",
      icon: del ? "mdi-help" : "mdi-database-edit",
      key: del ? "delete" : "edit",
    };
  } else {
    dialogData.value = {
      title: "Creat New Role",
      subtitle: "Please fill all required field bellow",
      icon: "mdi-new-box",
      key: "new",
    };
  }

  dialog.value = true;
};

const setups = store.setups;
const menus = store.menus;
const access = ref([...setups, ...menus]);
onBeforeMount(() => {
  refresh();
});

const editAkses = async (item) => {
  try {
    let formData = item;

    await store.ajax(formData, "/auth/editrole", "post");
    store.preload = false;
  } catch (error) {
    console.log(error);
  }
};

const deleteRole = async () => {
  try {
    const { roleId } = selected.value;
    store.preload = true;
    await store.ajax({ roleId }, "/auth/deleterole", "post");
    dialog.value = false;
    refresh();
  } catch (error) {
    console.log(error);
  }
};
</script>
