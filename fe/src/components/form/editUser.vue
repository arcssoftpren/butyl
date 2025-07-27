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
          <v-col cols="12">
            <v-divider
              >Leave the password empty if you are not change it</v-divider
            >
          </v-col>
          <v-col class="pb-0 mb-0" cols="6">
            <v-text-field
              label="New Password"
              density="compact"
              rounded="pill"
              variant="outlined"
              :type="showPass ? 'text' : 'password'"
              v-model="formData.userPass"
            />
          </v-col>
          <v-col class="pb-0 mb-0" cols="6">
            <v-text-field
              label="Confirm Password"
              density="compact"
              rounded="pill"
              variant="outlined"
              :type="showPass ? 'text' : 'password'"
              v-model="formData.confirmPass"
              :error-messages="
                validate.confirmPass.$errors.map((e) => e.$message)
              "
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-card>
          <template #title> Signature File Preview </template>
          <v-card-text>
            <v-divider></v-divider>
            <div
              class="h-100 w-100 d-flex flex-column justify-center align-center"
            >
              <v-icon size="110" v-if="fileDataURL == null"
                >mdi-draw-pen</v-icon
              >
              <v-img width="300" :src="fileDataURL" v-else></v-img>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="mb-5"></v-divider>
    <v-btn rounded="pill" variant="outlined" @click="submit" block>Edit</v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["closeMe", "selectedData"]);

const store = useAppStore();
const roles = ref([]);
const formData = reactive({
  userId: props.selectedData.userId,
  userNik: props.selectedData.userNik,
  userName: props.selectedData.userName,
  userRole: props.selectedData.userRole,
  signFile: null,
  userPass: "",
  confirmPass: "",
});

const changePassToggle = ref(false);

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
  userRole: {
    req: helpers.withMessage("This field is required", required),
  },
  signFile: {
    req: helpers.withMessage("This field is required", required),
  },
  confirmPass: {
    match: helpers.withMessage(
      "Password did not match!",
      () => formData.userPass == formData.confirmPass
    ),
  },
};

const validate = useVuelidate(rules, formData);

const refresh = async () => {
  try {
    store.togglePreload(true);

    roles.value = await store.ajax({}, "/auth/getroles", "post");
    fileDataURL.value = await store.ajax(
      { userId: formData.userId },
      "/auth/getsignfile",
      "post"
    );

    signFile.value = store.dataUrlToFile(
      fileDataURL.value,
      `${props.selectedData.userName}_signature.png`
    );
    console.log(signFile.value);
    store.togglePreload(false);
  } catch (error) {
    fileDataURL.value = null;
    store.togglePreload(false);
  }
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

    await store.ajax(fd, "/auth/edituser", "post", true);
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
    fileDataURL.value = null;
  }
});

onBeforeMount(() => {
  refresh();
});
</script>
