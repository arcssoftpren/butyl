<template>
  <div>
    <div class="pt-2" v-for="(item, index) in structure" :key="index">
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
    </div>
    <v-divider class="mb-2"></v-divider>
    <v-btn @click="submit" variant="outlined" rounded="pill" block dark>
      Create
    </v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();
const props = defineProps(["closeDialog"]);
const formData = reactive({
  roleName: "",
  homePage: "",
  akses: [],
});

const structure = [
  {
    key: "roleName",
    label: "Role Name",
    hint: "Please insert your new role's name.",
    type: "text",
  },
  {
    key: "homePage",
    label: "Home Page",
    hint: "Please select your new role's home page. ",
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
  akses: {
    req: helpers.withMessage("This field is required", required),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    formData.akses.push(formData.homePage);
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        title: "Please fill all required field",
        icon: "error",
      };

    store.preload = true;
    await store.ajax(formData, "/auth/newrole", "post");
    store.preload = false;
    props.closeDialog();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};
</script>
