<template>
  <v-autocomplete
    prepend-inner-icon="mdi-magnify"
    :item-props="itemProps"
    label="Search Part"
    v-model="part"
    :items="parts"
    variant="outlined"
    rounded="pill"
    hide-details
    density="compact"
  />
  <div v-if="part.partNumber">
    <v-divider class="my-5">
      <strong class="text-uppercase">Product identity</strong>
    </v-divider>
    <v-table density="comfortable">
      <tbody>
        <tr>
          <td>
            Customer <br />
            客先
          </td>
          <td>:</td>
          <th>{{ part.customer }}</th>
          <td>
            Product number <br />
            品番
          </td>
          <td>:</td>
          <th colspan="4">{{ part.partNumber }}</th>
        </tr>
        <tr>
          <td>
            Product name <br />
            品名
          </td>
          <td>:</td>
          <th>{{ part.partName }}</th>
          <td>
            Size <br />
            寸法
          </td>
          <td>:</td>
          <th>
            {{ part.thickness }} X {{ part.width }} X {{ part.length }} mm
          </th>
          <td>SG</td>
          <td>:</td>
          <th>{{ part.sg }}</th>
        </tr>
      </tbody>
    </v-table>
    <v-row>
      <v-col cols="8">
        <v-divider class="my-5"><strong>HEADER</strong></v-divider>
        <v-row>
          <v-col
            cols="6"
            v-for="(item, index) in structure"
            :key="index"
            class="py-0"
            v-show="item.view"
          >
            <v-text-field
              class="mt-2"
              hide-spin-buttons
              v-model="formData[index]"
              density="compact"
              rounded="pill"
              variant="outlined"
              :label="item.label"
              :hint="item.hint"
              :type="item.type"
              :error-messages="validate[index].$errors.map((e) => e.$message)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-divider class="my-5">
          <strong class="text-uppercase">Product Drawing</strong>
        </v-divider>
        <v-img :src="imgUrl" height="120"></v-img>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-btn @click="submit" block rounded="pill" variant="outlined" dark>
      Initiate
    </v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, minValue, required } from "@vuelidate/validators";
import moment from "moment";

const store = useAppStore();
const props = defineProps(["closeMe"]);
const part = ref({});
const parts = ref([]);
const a = ref();
const imgUrl = ref(null);
const formData = reactive({
  partNumber: "",
  prodQty: 0,
  kneadingLot: "",
  orderNumber: a ? "not required" : "",
  deliveryDate: a ? moment().format("YYYY-MM-DD") : "not required",
  extrudingLot: "",
  initiateDate: moment().format("YYYY-MM-DD"),
  partData: part,
  initiator: store.userData.userName,
  appInsResult: {
    upper: {},
    bottom: {},
    judgement: "NG",
  },
});

const structure = reactive({
  prodQty: {
    label: "Product Quantity",
    hint: "Please enter the product quantity.",
    type: "number",
    view: true,
  },
  orderNumber: {
    label: "Order Number",
    hint: "Please enter the order number.",
    type: "text",
    view: !a.value,
  },
  deliveryDate: {
    label: "Delivery Date",
    hint: "Please enter the order delivery date.",
    type: "date",
    view: a.value,
  },
  kneadingLot: {
    label: "Kneading Lot Number",
    hint: "Please enter the kneading lot number.",
    type: "text",
    view: true,
  },
  extrudingLot: {
    label: "Extruding Lot Number",
    hint: "Please enter the extruding lot number.",
    type: "text",
    view: true,
  },
});

const rules = {
  prodQty: {
    req: helpers.withMessage("Please enter product quantity", required),
    min: helpers.withMessage(
      "Product quantity can not be less than 1 pcs",
      minValue(1)
    ),
  },
  kneadingLot: {
    req: helpers.withMessage("Please enter the kneading lot number", required),
  },
  orderNumber: {
    req: helpers.withMessage("Please enter the order number", required),
  },
  deliveryDate: {
    req: helpers.withMessage("Please enter the delivery date", required),
  },
  extrudingLot: {
    req: helpers.withMessage("Please enter the extuding lot number", required),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        text: "Please check the required input",
        icon: "error",
      };

    const extrudingType = formData.partData.extrudingType;
    const appStd = JSON.parse(formData.partData.appearanceStandard)[
      extrudingType
    ];

    switch (extrudingType) {
      case "a":
        formData.appInsResult.papercolor = {
          input: "",
          logic: 8,
          standard: appStd.papercolor,
        };
        formData.appInsResult.peelingPaper = {
          input: "NG",
          logic: 1,
          standard: "OK",
        };
        break;
      case "b":
        formData.appInsResult.upper = {
          input: "",
          logic: 8,
          standard: appStd.upper,
        };
        formData.appInsResult.bottom = {
          input: "",
          logic: 8,
          standard: appStd.bottom,
        };
        formData.appInsResult.sheetLayout = {
          input: 0,
          logic: 9,
          standard: appStd.sheetLayout,
        };
        break;
      case "c":
        formData.appInsResult.upper = {
          input: "",
          logic: 8,
          standard: appStd.upper,
        };
        formData.appInsResult.bottom = {
          input: "",
          logic: 8,
          standard: appStd.bottom,
        };
        formData.appInsResult.sheetLayout = {
          input: 0,
          logic: 9,
          standard: appStd.sheetLayout,
        };
        formData.appInsResult.holeCount = {
          input: 0,
          logic: 9,
          standard: appStd.holeCount,
        };
        formData.appInsResult.a = {
          input: 0,
          logic: 9,
          standard: appStd.a,
        };
        formData.appInsResult.b = {
          input: 0,
          logic: 9,
          standard: appStd.b,
        };
        formData.appInsResult.c = {
          input: 0,
          logic: 9,
          standard: appStd.c,
        };
        formData.appInsResult.d = {
          input: 0,
          logic: 9,
          standard: appStd.d,
        };
        break;
    }

    formData.partNumber = part.value.partNumber;

    console.log(formData);
    store.preload = true;
    await store.ajax(formData, "/inspection/initiate", "post");
    store.preload = false;
    props.closeMe();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};

const itemProps = (item) => {
  return {
    title: item.partNumber,
    subtitle: item.partName,
  };
};

watch(part, async (e) => {
  imgUrl.value = await store.ajax(
    { partNumber: e.partNumber },
    "/parts/getdrawing",
    "post",
    false
  );
  a.value = e.headerType == "a";
  formData.deliveryDate = a.value
    ? moment().format("YYYY-MM-DD")
    : "not required";
  formData.orderNumber = a.value ? "not required" : "";
  structure.deliveryDate.view = a.value;
  structure.orderNumber.view = !a.value;
  console.log(a.value);
  store.preload = false;
});

onBeforeMount(async () => {
  parts.value = await store.ajax({}, "/parts", "post");

  store.preload = false;
});
</script>
