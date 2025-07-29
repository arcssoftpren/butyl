<template>
  <div class="w-100 h-100 pa-2">
    <div class="mb-2" v-for="(item, index) in structure" :key="index">
      <v-text-field
        v-if="item.type == 'text'"
        variant="outlined"
        rounded="pill"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      />
      <v-autocomplete
        v-else
        variant="outlined"
        rounded="pill"
        density="compact"
        item-value="id"
        :item-title="index == 'logic' ? 'label' : 'romaji'"
        :label="item.label"
        :items="props[item.items]"
        v-model="formData[index]"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      />
    </div>
    <v-divider class="mb-5"></v-divider>
    <v-btn
      @click="submit"
      variant="outlined"
      rounded="pill"
      block
      color="primary"
      dark
    >
      submit
    </v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();
const props = defineProps(["closeMe", "methods", "logics", "selected"]);
const formData = reactive({
  id: props.selected.insId,
  inspectionLable: props.selected.inspectionLable,
  logic: props.selected.logic,
  method: props.selected.method,
});
const structure = {
  inspectionLable: {
    label: "Inspection Item Name",
    type: "text",
  },
  logic: {
    label: "Logic Type",
    type: "autocomplete",
    items: "logics",
  },
  method: {
    label: "Inspection Tool/method",
    type: "autocomplete",
    items: "methods",
  },
};
const rules = {
  inspectionLable: {
    req: helpers.withMessage("This field is required", required),
  },
  logic: {
    req: helpers.withMessage("This field is required", required),
  },
  method: {
    req: helpers.withMessage("This field is required", required),
  },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (valid) {
      await store.ajax(formData, "/inspection/editinsitem", "post");
      props.closeMe();
    } else {
    }
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};
</script>
