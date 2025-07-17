<template>
  <div>
    <div class="mt-2" v-for="item in struktur" :key="item.key">
      <v-text-field
        @keyup="
          () => {
            validity[item.key] = true;
          }
        "
        v-model="formData[item.key]"
        density="compact"
        rounded="pill"
        variant="outlined"
        :label="item.label"
        :hint="item.hint"
        :type="item.type()"
        :error-messages="validate[item.key].$errors.map((e) => e.$message)"
      ></v-text-field>
    </div>
    <v-switch
      v-model="showPass"
      density="compact"
      hide-details
      label="Show Password"
    ></v-switch>
    <v-divider class="my-2"></v-divider>
    <v-btn @click="submit" rounded="pill" variant="outlined" block dark>
      submit
    </v-btn>
  </div>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();

const formData = reactive({
  userNik: "",
  userPass: "",
});

const validity = reactive({
  userNik: true,
  userPass: false,
});

const showPass = ref(false);

const struktur = ref([
  {
    type: () => "text",
    key: "userNik",
    label: "User NIK",
    hint: "Please insert your Employee Identification Number (NIK)",
  },
  {
    type: () => (showPass.value ? "text" : "password"),
    key: "userPass",
    label: "User Password",
    hint: "Please insert your password",
  },
]);

const rules = {
  userNik: {
    req: helpers.withMessage("This field is required an input", required),
    unknown: helpers.withMessage(
      "There is no account related to the submitted data.",
      () => validity.userNik
    ),
  },
  userPass: {
    req: helpers.withMessage("This field is required an input", required),
    unknown: helpers.withMessage(
      "Your submited password is incorrect.",
      () => validity.userPass
    ),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        icon: "error",
        text: "Please fill all required field",
      };

    store.togglePreload(true);
    const response = await store.ajax(formData, "/login", "post");
    store.userData = response;
    nextTick().then((e) => {
      const homePage = response.homePage;
      router.push(homePage);
    });
  } catch (error) {
    console.log(error);
    store.swal.fire(error);

    const errorElement = error.errorElement;

    if (errorElement) {
      validity[errorElement] = false;
    }
  }
};
</script>
