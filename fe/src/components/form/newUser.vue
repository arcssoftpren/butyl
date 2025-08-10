<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="6"
            class="mt-2 pb-0"
            v-for="(item, index) in struktur"
            :key="index"
          >
            <v-text-field
              :error-messages="
                validate[item.key].$errors.map((e) => e.$message)
              "
              :hint="item.hint"
              :type="item.type()"
              v-model="formData[item.key]"
              density="compact"
              rounded="pill"
              variant="outlined"
              :label="item.label"
              v-if="item.type() != 'select' && item.type() != 'file'"
            />
            <v-autocomplete
              :items="roles"
              item-title="roleName"
              item-value="roleId"
              :error-messages="
                validate[item.key].$errors.map((e) => e.$message)
              "
              v-model="formData[item.key]"
              density="compact"
              rounded="pill"
              variant="outlined"
              :label="item.label"
              v-if="item.type() == 'select'"
            />
            <v-file-input
              :error-messages="
                validate[item.key].$errors.map((e) => e.$message)
              "
              accept="image/png"
              v-model="signFile"
              density="compact"
              rounded="pill"
              variant="outlined"
              :label="item.label"
              v-if="item.type() == 'file'"
              prepend-icon=""
              prepend-inner-icon="mdi-draw-pen"
            >
            </v-file-input>
          </v-col>

          <v-col cols="12" class="mt-0">
            <v-checkbox
              hide-details=""
              label="Show Password"
              v-model="showPass"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-card>
          <template #title> Signature File Preview </template>
          <v-card-text style="height: 170px">
            <v-divider></v-divider>
            <div
              class="h-100 w-100 d-flex flex-column justify-center align-center"
            >
              <v-icon size="100" v-if="signFile == null">mdi-draw-pen</v-icon>
              <v-img width="100" class="my-5" :src="fileDataURL" v-else></v-img>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="mb-5"></v-divider>
    <v-btn rounded="pill" variant="outlined" @click="submit" block>Add</v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["closeMe"]);

const store = useAppStore();
const roles = ref([]);
const formData = reactive({
  userNik: "",
  userName: "",
  userPass: "",
  confirmPass: "",
  userRole: "",
  signFile: null,
});

const signFile = ref(null);
const fileDataURL = ref(null);

const showPass = ref(false);

const struktur = ref([
  {
    type: () => "text",
    key: "userNik",
    label: "User NIK",
    hint: "Please enter your new user's Identification Number (NIK)",
  },
  {
    type: () => "text",
    key: "userName",
    label: "User Full Name",
    hint: "Please enter your new user's full name",
  },
  {
    type: () => (showPass.value ? "text" : "password"),
    key: "userPass",
    label: "User Password",
    hint: "Please enter your new user's password",
  },
  {
    type: () => (showPass.value ? "text" : "password"),
    key: "confirmPass",
    label: "Password Confirmation",
    hint: "Please re-enter your new user's password",
  },
  {
    type: () => "select",
    key: "userRole",
    label: "Select Role",
    hint: "Please select your new user's role",
  },
  {
    type: () => "file",
    key: "signFile",
    label: "Upload Sign File",
    hint: "Please insert your new user's sign file",
  },
]);

const rules = {
  userNik: {
    req: helpers.withMessage("This field is required", required),
  },
  userName: {
    req: helpers.withMessage("This field is required", required),
  },
  userPass: {
    req: helpers.withMessage("This field is required", required),
  },
  confirmPass: {
    match: helpers.withMessage(
      "Password did not match!",
      () => formData.userPass == formData.confirmPass
    ),
  },
  userRole: {
    req: helpers.withMessage("This field is required", required),
  },
  signFile: {
    req: helpers.withMessage("This field is required", required),
  },
};

const validate = useVuelidate(rules, formData);

const refresh = async () => {
  try {
    store.togglePreload(true);

    roles.value = await store.ajax({}, "/auth/getroles", "post");
    roles.value = roles.value.filter((role) => role.roleId != 1);
    store.togglePreload(false);
  } catch (error) {}
};

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        text: "Please fill all required data",
        icon: "error",
      };

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    await store.ajax(fd, "/auth/adduser", "post", true);
    store.preload = false;
    props.closeMe();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};

watch(signFile, async (f) => {
  if (f) {
    fileDataURL.value = await store.fileToDataURL(f);
    formData.signFile = f;
  } else {
    formData.signFile = null;
  }
});

onBeforeMount(() => {
  refresh();
});
</script>
