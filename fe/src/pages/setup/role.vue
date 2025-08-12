<template>
  <div class="h-100">
    <v-data-table
      fixed-header
      max-height="60vh"
      :search="search"
      :items="roles"
      :items-per-page-options="[]"
      items-per-page="4"
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
          <th rowspan="2">#</th>
          <th rowspan="2">Role Name</th>
          <th rowspan="2">Home Page</th>
          <!-- <th colspan="2">Access Rights</th> -->
          <th rowspan="2" class="text-center">Actions</th>
        </tr>
        <!-- <tr>
          <th>Setups</th>
          <th>Menus</th>
        </tr> -->
      </template>
      <template #item="{ item, index }">
        <tr class="text-uppercase">
          <td>{{ index + 1 }}</td>
          <td class="text-no-wrap">{{ item.roleName }}</td>
          <td class="text-no-wrap">{{ item.homePage }}</td>
          <!-- <td>
            <v-row class="">
              <v-col cols="6" v-for="acc in access.setups" :key="acc.path">
                <v-checkbox
                  class="text-sm-body-1 text-no-wrap"
                  @change="editAkses(item)"
                  :value="acc.path"
                  density="compact"
                  hide-details
                  :label="acc.title"
                  v-model="roles[index].akses"
                  :disabled="
                    acc.path == item.homePage || item.roleId == systemId
                  "
                />
              </v-col>
            </v-row>
          </td>
          <td>
            <v-row>
              <v-col cols="6" v-for="acc in access.menus" :key="acc.path">
                <v-checkbox
                  class="text-sm-body-1 text-no-wrap"
                  @change="editAkses(item)"
                  :value="acc.path"
                  density="compact"
                  hide-details
                  :label="acc.title"
                  v-model="roles[index].akses"
                  :disabled="
                    acc.path == item.homePage || item.roleId == systemId
                  "
                />
              </v-col>
            </v-row>
          </td> -->
          <td class="text-center">
            <v-btn-group v-if="item.roleId != 0" density="compact">
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
      width="800"
      :overlay="false"
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

const systemId = ref(0);
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

    roles.value = roles.value.filter((role) => role.roleId != 1);
    roles.value = await Promise.all(
      roles.value.map((role) => {
        role.akses = JSON.parse(role.akses);
        role.inspectionAccess = JSON.parse(role.inspectionAccess);
        return role;
      })
    );
    store.preload = false;
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
const access = ref({
  setups,
  menus,
});
onBeforeMount(() => {
  refresh();
});

const deleteRole = async () => {
  try {
    const { roleId } = selected.value;
    store.preload = true;
    await store.ajax({ roleId }, "/auth/deleterole", "post");
    dialog.value = false;
    store.roleUpdate++;
    refresh();
  } catch (error) {
    console.log(error);
  }
};
</script>
