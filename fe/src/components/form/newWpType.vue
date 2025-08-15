<template>
  <v-row>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <v-text-field
          :error-messages="validate.typeNumber.$errors.map((e) => e.$message)"
          class="mt-2"
          density="compact"
          rounded="pill"
          variant="outlined"
          label="Type Number"
          v-model="formData.typeNumber"
        />
        <!-- <v-checkbox
          density="compact"
          label="Extruding Dies Temperature Check"
          v-model="formData.heaterOn"
        />
        <v-checkbox
          density="compact"
          label="Press Inspection"
          v-model="formData.pressOn"
        />
        <v-checkbox
          density="compact"
          label="Outgoing Inspection"
          v-model="formData.outGoingOn"
        /> -->
      </div>
    </v-col>

    <v-col cols="3">
      <v-card class="mt-2">
        <template #title>Check Room Temperature</template>
        <template #text>
          <v-btn-toggle
            v-model="formData.roomTemp"
            class="w-100"
            density="compact"
            rounded="pill"
            mandatory
          >
            <v-btn
              prepend-icon="mdi-power"
              variant="outlined"
              class="w-50"
              color="primary"
              :value="1"
            >
              ON
            </v-btn>
            <v-btn
              prepend-icon="mdi-power"
              variant="outlined"
              color="error"
              class="w-50"
              :value="0"
            >
              Off
            </v-btn>
          </v-btn-toggle>
          <v-divider class="my-2"></v-divider>
          <v-sheet height="150px">
            <div
              class="w-100 h-100 d-flex align-center justify-center text-center"
            >
              <div class="text-h6" v-if="formData.roomTemp === 1">
                The room temperature will be checked
              </div>
              <div class="text-h6" v-if="formData.roomTemp === 0">
                The room temperature will not be checked
              </div>
            </div>
          </v-sheet>
        </template>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card class="mt-2">
        <template #title>Header Type</template>
        <template #text>
          <div class="w-100">
            <v-btn-toggle
              class="w-100"
              density="compact"
              rounded="pill"
              mandatory
              v-model="formData.headerType"
            >
              <v-btn variant="outlined" class="w-50" color="primary" value="a">
                Type A
              </v-btn>
              <v-btn variant="outlined" color="primary" class="w-50" value="b">
                Type B
              </v-btn>
            </v-btn-toggle>
            <v-divider class="my-2"></v-divider>
            <v-img
              height="150"
              :src="formData.headerType == 'a' ? headerA : headerB"
            >
            </v-img>
          </div>
        </template>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card class="mt-2">
        <template #title>Kneading Type</template>
        <template #text>
          <div class="w-100">
            <v-btn-toggle
              class="w-100"
              density="compact"
              rounded="pill"
              mandatory
              v-model="formData.kneadingType"
            >
              <v-btn variant="outlined" class="w-50" color="primary" value="a">
                Type A
              </v-btn>
              <v-btn variant="outlined" color="primary" class="w-50" value="b">
                Type B
              </v-btn>
            </v-btn-toggle>
            <v-divider class="my-2"></v-divider>
            <v-img
              height="150"
              :src="formData.kneadingType == 'a' ? kneadingA : kneadingB"
            >
            </v-img>
          </div>
        </template>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card class="mt-2">
        <template #title>Extruding Type</template>
        <template #text>
          <div class="w-100">
            <v-btn-toggle
              class="w-100"
              density="compact"
              rounded="pill"
              mandatory
              v-model="formData.extrudingType"
            >
              <v-btn variant="outlined" class="w-30" color="primary" value="a">
                Type A
              </v-btn>
              <v-btn variant="outlined" color="primary" class="w-30" value="b">
                Type B
              </v-btn>
              <v-btn variant="outlined" color="primary" class="w-30" value="c">
                Type C
              </v-btn>
            </v-btn-toggle>
            <v-divider class="my-2"></v-divider>
            <v-img height="150" :src="extType"> </v-img>
          </div>
        </template>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-btn @click="submit" block variant="outlined" rounded="pill" dark>
        Submit
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import headerA from "@/assets/header_a.png";
import headerB from "@/assets/header_b.png";
import extA from "@/assets/extrudingA.png";
import extB from "@/assets/extrudingB.png";
import extC from "@/assets/extrudingC.png";
import kneadingA from "@/assets/kneading_a.png";
import kneadingB from "@/assets/kneading_b.png";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const props = defineProps(["closeMe"]);
const store = useAppStore();
const extType = ref(extA);
const formData = reactive({
  typeNumber: "",
  kneadingType: "a",
  extrudingType: "a",
  headerType: "a",
  pressOn: false,
  outGoingOn: false,
  heaterOn: false,
  roomTemp: 0,
});

watch(
  () => formData.extrudingType,
  (a) => {
    switch (a) {
      case "a":
        extType.value = extA;
        break;
      case "b":
        extType.value = extB;
        break;
      case "c":
        extType.value = extC;
        break;
    }
  }
);

const rules = {
  typeNumber: {
    req: helpers.withMessage("This field is required", required),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (valid) {
      await store.ajax(formData, "/parts/addtype", "post");
      props.closeMe();
    }
  } catch (error) {
    store.preload = false;
    console.log(error);

    store.swal.fire(error);
  }
};
</script>
