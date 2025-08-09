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
          <template #append>
            <v-btn
              @click="openDialog('new')"
              density="compact"
              variant="outlined"
              icon
              class="mt-2 ms-2"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
      </template>
      <template #item="{ item, index }">
        <tr :class="item.judgement == 3 ? 'bg-pink-lighten-3 text-white' : ''">
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
            {{ item.inspectionStep.step }} | N{{ item.inspectionStep.n }}
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
          <th class="text-center">Current Check</th>
          <th class="text-center">Action</th>
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
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <div class="h-100">
            <initiate
              :close-me="refresh"
              v-if="dialogData.key == 'new'"
            ></initiate>
            <div v-if="dialogData.key == 'open'">
              <InspectionStep_kneadingA
                :inspection-data="selected"
                v-if="
                  selected.inspectionStep.step == 'kneading' &&
                  selected.partData.kneadingType == 'a'
                "
                :refresh="refresh"
              >
              </InspectionStep_kneadingA>
              <inspectionStep
                :inspection-data="selected"
                :refresh="refresh"
                v-else
              ></inspectionStep>
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
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
      };
      selected.value = data;

      const step = item.inspectionStep.step;

      switch (step) {
        case "kneading":
          dialogData.title = "Kneading Inspection";
          dialogData.subtitle = "Please fill all required data.";

          break;
        case "appearance":
          dialogData.title = "Appearance Inspection";
          dialogData.subtitle = "Please fill all required data.";
          break;
        case "extruding":
          dialogData.title = "Kneading inspection";
          dialogData.subtitle = "Please fill all required data.";
          break;
        case "press":
          dialogData.title = "Kneading inspection";
          dialogData.subtitle = "Please fill all required data.";
          break;
        case "outgoing":
          dialogData.title = "Kneading inspection";
          dialogData.subtitle = "Please fill all required data.";
          break;
      }

      break;
    case "delete":
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const refresh = async () => {
  dialog.value = false;
  inspections.value = await store.ajax(
    { func: "neutral" },
    "/inspection",
    "post"
  );
  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});
</script>
