<template>
  <div class="w-100">
    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col
        v-show="show(index)"
        cols="6"
        v-for="(item, index) in headerLabel"
        :key="index"
      >
        <v-text-field
          :error-messages="validate[index].$errors.map((e) => e.$message)"
          v-model="formData[index]"
          :label="item"
          variant="outlined"
          rounded="pill"
          density="compact"
          hide-details=""
          :type="
            index == 'deliveryDate'
              ? 'date'
              : index == 'prodQty'
              ? 'number'
              : 'text'
          "
        />
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-btn variant="outlined" rounded="pill" block @click="submit">
          Edit
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["headerData", "insId"]);
const emits = defineEmits(["refresh"]);

const show = (index) => {
  return Object.entries(props.headerData)
    .filter(([key, value]) => value != "")
    .map(([key, value]) => key)
    .includes(index);
};

const headerLabel = {
  prodQty: "Production Qty",
  deliveryDate: "Delivery Date",
  kneadingLot: "Kneading Lot",
  extrudingLot: "Extruding Lot",
  orderNumber: "Order Number",
  poNumber: "PO Number (SPI-)",
};

const store = useAppStore();
const formData = reactive({
  prodQty: props.headerData.prodQty || "",
  deliveryDate: props.headerData.deliveryDate || "",
  kneadingLot: props.headerData.kneadingLot || "",
  extrudingLot: props.headerData.extrudingLot || "",
  orderNumber: props.headerData.orderNumber || "",
  poNumber: props.headerData.poNumber || "",
});
const rules = {
  prodQty: {
    required,
  },
  deliveryDate: {
    req: helpers.withMessage("Delivery Date is required", () => {
      return !show("deliveryDate") ? true : formData.deliveryDate !== "";
    }),
  },
  kneadingLot: {
    required,
  },
  extrudingLot: {
    required,
  },
  orderNumber: {
    req: helpers.withMessage("Order Number is required", () => {
      return !show("orderNumber") ? true : formData.orderNumber !== "";
    }),
  },
  poNumber: {
    required,
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

    const data = {
      insId: props.insId,
      headerData: {
        ...formData,
      },
    };
    store.ajax(data, "/inspection/editinstheader", "post").then((e) => {
      emits("refresh");
    });
  } catch (error) {
    store.swal.fire(error);
  }
};
</script>
