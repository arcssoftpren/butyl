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
      </div>
    </v-col>
    <v-col cols="12">
      <v-row>
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
                  <v-btn
                    variant="outlined"
                    class="w-50"
                    color="primary"
                    value="a"
                  >
                    Type A
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    class="w-50"
                    value="b"
                  >
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
                  <v-btn
                    variant="outlined"
                    class="w-50"
                    color="primary"
                    value="a"
                  >
                    Type A
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    class="w-50"
                    value="b"
                  >
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
              <div class="w-100 text-center">
                <v-btn-toggle
                  density="compact"
                  rounded="pill"
                  mandatory
                  v-model="formData.extrudingType"
                >
                  <v-btn
                    variant="outlined"
                    class="w-30"
                    color="primary"
                    value="a"
                  >
                    Type A
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    class="w-30"
                    value="b"
                  >
                    Type B
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    class="w-30"
                    value="c"
                  >
                    Type C
                  </v-btn>
                </v-btn-toggle>
                <v-divider class="my-2"></v-divider>
                <v-img height="150" :src="extType"> </v-img>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-divider class="my-5">Inspection Item Template</v-divider>
    </v-col>
  </v-row>
  <div class="w-100" style="height: 250px; overflow-y: scroll">
    <v-row>
      <v-col cols="6" v-for="(item, index) in steps" :key="index">
        <v-divider>{{ item }}</v-divider>
        <v-table fixed-header height="200" density="compact">
          <thead>
            <tr>
              <th class="text-start w-100">Items</th>
              <th class="text-center">Enable</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(insItem, insIndex) in insItems" :key="insIndex">
              <td class="text-start">
                <div
                  @click="
                    () => {
                      const key = `${item.toLowerCase()}Items`;
                      const index = formData[key].findIndex(
                        (e) => e === insItem.insId
                      );

                      if (index === -1) {
                        formData[key].push(insItem.insId);
                      } else {
                        formData[key].splice(index, 1);
                      }
                    }
                  "
                >
                  {{ insItem.inspectionLable }}
                </div>
              </td>
              <td class="text-center">
                <v-checkbox-btn
                  :value="insItem.insId"
                  v-model="formData[`${item.toLowerCase()}Items`]"
                ></v-checkbox-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </div>
  <v-row>
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
import { fa } from "vuetify/locale";

const props = defineProps(["closeMe", "selected"]);
const emit = defineEmits(["editData"]);
const store = useAppStore();
const extType = ref(extA);
const insItems = ref([]);
let formData = reactive({
  id: props.selected.id,
  typeNumber: props.selected.typeNumber,
  kneadingType: "",
  extrudingType: "",
  headerType: "",
  pressOn: props.selected.pressOn == 1 ? true : false,
  outGoingOn: props.selected.outGoingOn == 1 ? true : false,
  heaterOn: props.selected.heaterOn == 1 ? true : false,
  kneadingItems: JSON.parse(props.selected.kneadingItems),
  extrudingItems: JSON.parse(props.selected.extrudingItems),
  pressItems: JSON.parse(props.selected.pressItems),
  outgoingItems: JSON.parse(props.selected.outgoingItems),
  roomTemp: props.selected.roomTemp,
});

const steps = ["Kneading", "Extruding", "Press", "Outgoing"];

onMounted(async () => {
  formData.extrudingType = props.selected.extrudingType;
  formData.headerType = props.selected.headerType;
  formData.kneadingType = props.selected.kneadingType;

  insItems.value = await store.ajax({}, "/inspection/items", "post");
  store.preload = false;
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
      formData.outgoingItems = JSON.stringify(formData.outgoingItems);
      formData.pressItems = JSON.stringify(formData.pressItems);
      formData.kneadingItems = JSON.stringify(formData.kneadingItems);
      formData.extrudingItems = JSON.stringify(formData.extrudingItems);

      emit("editData", { ...formData });
    }
  } catch (error) {
    store.preload = false;
    console.log(error);
  }
};
</script>
