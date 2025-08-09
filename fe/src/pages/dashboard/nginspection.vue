<template>
  <div>
    <v-data-table :items="inspections" :search="search">
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <v-text-field
              class="mt-2"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded="pill"
              label="Search"
              hide-details
              density="compact"
              v-model="search"
            />
          </template>
        </v-toolbar>
      </template>
      <template #item="{ item, index }">
        <tr>
          <td class="text-center" :key="item.partNumber">{{ index + 1 }}</td>
          <td :key="item.poNumber">
            {{ item.poNumber }}
            <v-divider></v-divider>
            {{ item.partNumber }}
          </td>
          <td :key="item.deliveryDate">
            {{
              item.deliveryDate != ""
                ? moment(item.deliveryDate).format("DD/MM/YYYY")
                : "-"
            }}
            <v-divider></v-divider>
            {{ item.orderNumber }}
          </td>
          <td>
            Kneading Lot: {{ item.kneadingLot }}
            <v-divider></v-divider>
            Extruding Lot: {{ item.extrudingLot }}
          </td>
          <td class="text-end">
            {{ item.prodQty }}
          </td>
          <td class="text-center text-capitalize">
            {{ item.rejectStep }}
          </td>
          <td class="text-center">
            <v-btn
              density="compact"
              variant="outlined"
              rounded="pill"
              block
              @click="openDialog('open', item)"
              >Check</v-btn
            >
          </td>
        </tr>
      </template>
      <template #headers>
        <tr>
          <th class="text-center">No</th>
          <th>
            PO Number <br />
            <v-divider></v-divider>
            Part Number
          </th>
          <th>
            Delivery Date <br />
            <v-divider></v-divider>
            Order Number
          </th>
          <th>Lot Number</th>
          <th class="text-end">Qty.</th>
          <th class="text-center">NG Step</th>
          <th class="text-center">Review</th>
        </tr>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      fullscreen=""
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>Rejection List</template>
        <template #subtitle
          >Please select a rejection to take action on it</template
        >
        <template #text>
          <div class="h-100">
            <div v-if="dialogData.key == 'open'">
              <ngPreview
                :close-me="refresh"
                @submit-data="emited"
                :all-data="selected"
                :items="selected.rejectionData.data"
              ></ngPreview>
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import moment from "moment";

const store = useAppStore();
const search = ref();
const dialog = ref(false);
const selected = ref(null);
const inspections = ref([]);
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "new":
      dialogData.title = "Initiate new inspection";
      dialogData.subtitle = "Please fill all required data.";
      break;
    case "open":
      let data = {
        ...item.insData,
        headerData: item.headerData,
        insId: item.insId,
        judgement: item.judgement,
        partNumber: item.partNumber,
        inspectionStep: item.inspectionStep,
        rejectStep: item.rejectStep,
      };
      selected.value = data;

      const step = item.inspectionStep.step;

      break;
    case "delete":
      selected.value = item;
      return;
  }
  dialog.value = true;
};

watch(dialog, (e) => {
  if (!e) {
    refresh();
  }
});

const refresh = async () => {
  dialog.value = false;
  inspections.value = await store.ajax({ func: "NG" }, "/inspection", "post");

  inspections.value.forEach((value, index) => {
    let reject = Object.entries(value.insData.rejectionData.data).filter(
      ([key, v]) => v.length > 0
    );
    value.rejectStep = reject[reject.length - 1][0];
  });
  store.preload = false;
};

const emited = async (data) => {
  let newData = JSON.parse(JSON.stringify(toRaw(selected.value)));
  newData.rejectionData.data = data.data;
  let allDone = [];
  Object.entries(data.data).forEach(([key, value]) => {
    let myData = data.data[key];
    if (myData.length > 0) {
      let valid = myData.every((d) => d.action != "1" && d.note != "");
      allDone.push(valid);
    }
  });
  let inspection = new Inspection();
  inspection.registerData(newData);
  let json = inspection.toJSON();

  allDone = allDone.every((done) => done);

  if (allDone) {
    json.judgement = 3;
  }

  nextTick().then(async () => {
    await store.ajax(json, "/inspection/save", "post");
    refresh();
  });
};

onBeforeMount(() => {
  refresh();
});
</script>
