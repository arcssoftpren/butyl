<template>
  <v-row>
    <v-col cols="6" v-for="(field, index) in structure" :key="index">
      <v-text-field
        v-model="formData[index]"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
        class="mt-2"
        density="compact"
        rounded="pill"
        variant="outlined"
        :label="field.label"
        :hint="field.hint"
        hide-spin-buttons
        :type="field.type"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-btn @click="submit" rounded="pill" variant="outlined" block dark>
        submit
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["closeMe", "selectedData"]);
const editeOn = props.selectedData ? true : false;
const store = useAppStore();
const formData = reactive({
  id: editeOn ? props.selectedData.id : "",
  romaji: editeOn ? props.selectedData.romaji : "",
  japanese: editeOn ? props.selectedData.japanese : "",
});

const structure = {
  romaji: {
    type: "text",
    label: "Method Name in Romaji",
    hint: "Please enter a method name in Romaji (English etc)",
  },
  japanese: {
    type: "text",
    label: "Method Name in Japanese",
    hint: "Please enter a method name in Japanese (Kanji/Katakana/hiragana)",
  },
};

const rules = {
  romaji: {
    req: helpers.withMessage("This field is ruquired", required),
  },
  japanese: {
    req: helpers.withMessage("", () => true),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) throw { text: "Please check your input", icon: "error" };

    store.preload = true;
    if (!editeOn) {
      delete formData.id;
      await store.ajax(formData, "/inspection/addmethod", "post");
    } else {
      await store.ajax(formData, "/inspection/editmethod", "post");
    }
    props.closeMe();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};
</script>
