<template>
  <div>
    <v-row>
      <v-col
        cols="6"
        class="mt-2"
        v-for="(item, index) in structure"
        :key="index"
      >
        <v-text-field
          v-model="formData[item.key]"
          v-if="item.type == 'text'"
          variant="outlined"
          rounded="pill"
          density="compact"
          :label="item.label"
          :type="item.type"
          :hint="item.hint"
          :error-messages="validate[item.key].$errors.map((e) => e.$message)"
        />
        <v-autocomplete
          v-model="formData[item.key]"
          item-title="title"
          item-value="path"
          v-else
          variant="outlined"
          rounded="pill"
          density="compact"
          :label="item.label"
          :type="item.type"
          :hint="item.hint"
          :items="homePages"
          :error-messages="validate[item.key].$errors.map((e) => e.$message)"
        />
      </v-col>
      <v-col cols="4">
        <v-divider>Menu Access Rights</v-divider>
        <v-table>
          <tbody>
            <tr v-for="(item, index) in menus" :key="index">
              <td>
                <v-checkbox
                  :value="item.path"
                  hide-details
                  :label="item.title"
                  density="compact"
                  v-model="formData.akses"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="4">
        <v-divider>Setup Access Rights</v-divider>
        <v-table>
          <tbody>
            <tr v-for="(item, index) in setups" :key="index">
              <td>
                <v-checkbox
                  :value="item.path"
                  hide-details
                  :label="item.title"
                  density="compact"
                  v-model="formData.akses"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="4">
        <v-divider class="my-2">Inspection Access Rights</v-divider>
        <v-table>
          <tbody>
            <tr v-for="(item, index) in insAccess" :key="index">
              <td>
                <v-checkbox
                  class="text-capitalize"
                  :value="item"
                  hide-details
                  :label="item"
                  density="compact"
                  v-model="formData.inspectionAccess"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-divider class="mb-2"></v-divider>
    <v-btn @click="submit" variant="outlined" rounded="pill" block dark>
      Edit
    </v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();
const props = defineProps(["closeDialog", "selectedData"]);
const formData = reactive({
  roleId: props.selectedData.roleId,
  roleName: props.selectedData.roleName,
  homePage: props.selectedData.homePage,
  akses: props.selectedData.akses,
  inspectionAccess: props.selectedData.inspectionAccess,
});

const menus = store.menus;
const setups = store.setups;
const insAccess = store.insAccess;

const structure = [
  {
    key: "roleName",
    label: "Role Name",
    hint: "Please enter your new role's name.",
    type: "text",
  },
  {
    key: "homePage",
    label: "Home Page",
    hint: "Please enter your new role's home page. ",
    type: "autocomplete",
  },
];

const homePages = store.menus;

const rules = {
  roleName: {
    req: helpers.withMessage("This field is required", required),
  },
  homePage: {
    req: helpers.withMessage("This field is required", required),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        title: "Please fill all required field",
        icon: "error",
      };

    store.preload = true;
    await store.ajax(formData, "/auth/editrole", "post");
    await store.refreshAccountData();
    store.preload = false;
    store.roleUpdate++;
    props.closeDialog();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};
</script>
