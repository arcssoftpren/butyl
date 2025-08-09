<template>
  <div>
    <v-table class="mytable">
      <thead>
        <tr>
          <th colspan="5" class="text-h4">{{ inspection.partNumber }}</th>
        </tr>
        <tr>
          <th rowspan="2" class="text-center">
            <h1 class="text-h3">N{{ inspection.inspectionStep.n }}</h1>
          </th>
          <th>Customer</th>
          <th>{{ inspection.partData.customer }}</th>
          <th>Production Qty.</th>
          <th>{{ inspection.headerData.prodQty }}</th>
        </tr>
        <tr>
          <th>Kneading Lot</th>
          <th>{{ inspection.headerData.kneadingLot }}</th>
          <th>Extruding Lot</th>
          <th>{{ inspection.headerData.extrudingLot }}</th>
        </tr>
      </thead>
    </v-table>
    <v-divider class="my-5"></v-divider>

    <v-table class="mytable">
      <thead>
        <tr>
          <th rowspan="2" class="text-center">No.</th>
          <th rowspan="2" class="text-center">Inspection Items</th>
          <th rowspan="2" class="text-center">Standard</th>
          <th rowspan="2" class="text-center">Inspection Tool</th>
          <th class="text-center" :colspan="inspection.currentData.data.length">
            Inspection Result
          </th>
        </tr>
        <tr>
          <th
            class="text-center"
            v-for="(item, index) in inspection.currentData.data"
            :key="index"
          >
            {{ item.key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableStructure" :key="index">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">
            {{ item.label }}
          </td>
          <td class="text-center">See the kneading result</td>
          <td class="text-center">{{ item.method.romaji }}</td>
          <td
            class="text-center"
            v-if="index == 0"
            :colspan="inspection.currentData.data.length"
            :rowspan="tableStructure.length"
          >
            <v-btn-toggle
              v-model="kneadingAtoggle"
              mandatory=""
              variant="outlined"
              rounded="lg"
              block
            >
              <v-btn color="success" variant="outlined" value="OK"> OK </v-btn>
              <v-btn color="error" variant="outlined" value="0"> NG </v-btn>
            </v-btn-toggle>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-divider class="my-5"></v-divider>
    <v-row>
      <v-col cols="6">
        <v-text-field
          label="Quality PIC"
          variant="outlined"
          rounded="pill"
          density="compact"
          hide-details=""
          v-model="inspection.kneadingData.kneadingQlt.pic"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Date Approval"
          variant="outlined"
          rounded="pill"
          density="compact"
          hide-details=""
          type="date"
          v-model="inspection.kneadingData.kneadingQlt.date"
        />
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <v-btn
      :disabled="
        kneadingAtoggle == null ||
        inspection.kneadingData.kneadingQlt.date == '' ||
        inspection.kneadingData.kneadingQlt.pic == ''
      "
      @click="save"
      variant="outlined"
      rounded="pill"
      block
      :color="kneadingAtoggle == 'OK' ? 'submit' : 'error'"
      :text="kneadingAtoggle == 'OK' ? 'success' : 'submit ng'"
    />
  </div>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const emits = defineEmits(["refresh"]);
const props = defineProps(["inspectionData", "refresh"]);
let localizedData = { ...toRaw(props.inspectionData) };
let inspection = new Inspection();
let tableStructure = [];
let kneadingAtoggle = ref(null);

onBeforeMount(() => {
  inspection.registerData(localizedData);
  inspection.initInspection(inspection.inspectionStep.step);
  tableStructure = inspection.generateTableStructure();
});

watch(kneadingAtoggle, (e) => {
  inspection.judgement = e;
  if (e == "0") {
    inspection.rejectionData.data.kneading = [{ key: "kneading A" }];
  }
  inspection.kneadingData.judgement = e;
});

async function save() {
  const { userId, userName } = store.userData;
  store.preload = true;
  inspection.inspectionStep.step = "appearance";
  inspection.kneadingData.inspector = { userId, userName };
  const data = inspection.toJSON();
  nextTick().then(async () => {
    await store.ajax(data, "/inspection/save", "post");
    props.refresh();
  });
}
</script>
