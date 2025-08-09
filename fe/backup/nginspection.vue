<template>
  <div>
    <v-data-table :search="search" :items="inspection" :headers="headers">
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
        <tr>
          <td>
            <div>{{ item.partType }}</div>
          </td>
          <td class="text-start">
            <div>{{ item.partNumber }}</div>
            <v-divider></v-divider>
            <small>{{ item.poNumber }}</small>
          </td>
          <td class="text-center" v-if="item.headerData.orderNumber == '-'">
            {{ moment(item.headerData.deliveryDate).format("DD/MM/YYYY") }}
          </td>
          <td class="text-center" v-else>-</td>
          <td class="text-center" v-if="item.headerData.orderNumber != '-'">
            {{ item.headerData.orderNumber }}
          </td>
          <td class="text-center" v-else>{{ item.headerData.orderNumber }}</td>
          <td>
            <v-btn
              @click="openDialog('kneading', item)"
              width="100"
              v-if="item.kneadingInput.includes('')"
              variant="outlined"
              rounded="pill"
              block
              >Check</v-btn
            >
          </td>
          <td>
            <v-btn
              width="100"
              @click="openDialog('extruding', item)"
              :disabled="item.kneadingInput.includes('')"
              v-if="item.extrudingInput.includes('')"
              variant="outlined"
              rounded="pill"
              block
              >Check</v-btn
            >
          </td>
          <td>
            <v-btn
              @click="openDialog('press', item)"
              width="100"
              :disabled="item.extrudingInput.includes('')"
              v-if="item.partData.pressOn && item.pressInput.includes('')"
              variant="outlined"
              rounded="pill"
              block
              >Check</v-btn
            >
          </td>
          <td>
            <v-btn
              @click="openDialog('outgoing', item)"
              width="100"
              :disabled="item.pressInput.includes('')"
              v-if="item.partData.outgoingOn && item.outgoingInput.includes('')"
              variant="outlined"
              rounded="pill"
              block
              >Check</v-btn
            >
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog
      min-width="500"
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            flat
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
          <div v-if="dialogData.key == 'new'">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :item-props="itemProps"
                  :items="parts"
                  class="mt-2"
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  hide-details=""
                  label="Select Part"
                  v-model="part"
                />
              </v-col>
              <v-col cols="12" v-if="part != null">
                <v-table class="mytable">
                  <thead>
                    <tr>
                      <td colspan="6" class="bg-grey">PART IDENTITY</td>
                    </tr>
                    <tr>
                      <th>Customer</th>
                      <td>{{ part.customer }}</td>
                      <th>Product Number</th>
                      <td colspan="3">{{ part.partNumber }}</td>
                    </tr>
                    <tr>
                      <th>Product Name</th>
                      <td>{{ part.partName }}</td>
                      <th>Size</th>
                      <td>
                        {{ parseFloat(part.thickness).toFixed(2) }} x
                        {{ parseFloat(part.width).toFixed(2) }} x
                        {{ parseFloat(part.length).toFixed(2) }} mm
                      </td>
                      <td>SG</td>
                      <td>{{ parseFloat(part.sg).toFixed(2) }}</td>
                    </tr>
                  </thead>
                </v-table>
                <v-table class="mytable">
                  <tbody>
                    <tr>
                      <td colspan="5" class="bg-grey">Header</td>
                    </tr>
                    <tr>
                      <td v-for="(item, index) in part.headers" :key="index">
                        {{ headerString[item] }}
                      </td>
                    </tr>
                    <tr>
                      <td v-for="(item, index) in part.headers" :key="index">
                        <v-text-field
                          v-if="item == 'deliveryDate'"
                          type="date"
                          :error-messages="
                            headerValidate[item].$errors.map((e) => e.$message)
                          "
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          hide-details=""
                          v-model="headerData[item]"
                        />
                        <v-text-field
                          :error-messages="
                            headerValidate[item].$errors.map((e) => e.$message)
                          "
                          v-else
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          hide-details=""
                          v-model="headerData[item]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
              <v-col cols="12" v-if="part != null">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" v-if="part != null">
                <v-btn
                  @click="initiate"
                  variant="outlined"
                  rounded="pill"
                  block
                >
                  Initiate
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div v-if="dialogData.key == 'kneading'">
            <div v-if="selected.partData.kneadingType == 'a'">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center" rowspan="2">No</th>
                    <th rowspan="2">Inspection Item</th>
                    <th rowspan="2">Standard</th>
                    <th rowspan="2">Measurement Tool</th>
                    <th class="text-center" rowspan="2">Inspection Number</th>
                    <th
                      class="text-center"
                      :colspan="selected.kneadingData.length + 1"
                    >
                      Result
                    </th>
                  </tr>
                  <tr>
                    <th
                      v-for="(item, index) in selected.kneadingData"
                      :key="index"
                    >
                      {{ item.key }}
                    </th>
                    <th>Judgement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in selected.partData.kneadingItems"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{ item.label }}</td>
                    <td>See the kneading report</td>
                    <td>{{ item.method.romaji }}</td>
                    <td class="text-center">n={{ item.sampleQ }}</td>
                    <td
                      class="text-center"
                      v-if="index == 0"
                      :rowspan="selected.partData.kneadingItems.length"
                      :colspan="selected.kneadingData.length"
                    >
                      <v-btn-toggle
                        class="w-100"
                        variant="tonal"
                        rounded="pill"
                        v-model="kneadingJudgement"
                      >
                        <v-btn color="success" value="OK" style="width: 45%"
                          >OK</v-btn
                        >
                        <v-btn color="error" value="NG" style="width: 45%"
                          >ng</v-btn
                        >
                      </v-btn-toggle>
                    </td>
                    <td
                      :class="`text-center ${
                        kneadingJudgement == 'OK' ? 'bg-success' : 'bg-error'
                      }`"
                      v-if="selected.partData.kneadingType == 'a'"
                    >
                      {{ kneadingJudgement }}
                    </td>

                    <td
                      :class="`text-center ${
                        kneadingJudgement == 'OK' ? 'bg-success' : 'bg-error'
                      }`"
                      v-else
                    ></td>
                  </tr>
                </tbody>
              </v-table>
              <v-divider class="my-2"></v-divider>
              <v-btn
                @click="kneadingAbuffer"
                :disabled="kneadingJudgement == null"
                variant="outlined"
                rounded="pill"
                block
                :text="kneadingJudgement == 'OK' ? 'Submit' : 'Submit NG'"
                :color="kneadingJudgement == 'OK' ? 'success' : 'error'"
              >
              </v-btn>
            </div>
            <insTable
              v-else
              :pos-data="selected.step"
              :table-data="selected.kneadingData"
              v-on:emit-report="kneadingAdd"
            ></insTable>
          </div>
          <div v-if="dialogData.key == 'extruding'">
            <div v-if="selected.partData.heaterCheck && extStep == 0">
              <v-table class="mytable">
                <thead>
                  <tr>
                    <th class="text-center">NO</th>
                    <th class="text-center">Inspection Item</th>
                    <th class="text-center">Standard</th>
                    <th class="text-center">Measurement Tool</th>
                    <th class="text-center">Inspection Number</th>
                    <th class="text-center">Inspection Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">1</td>
                    <td class="text-center">Dies temperature</td>
                    <td class="text-center">
                      Check temperature at beginning of production
                    </td>
                    <td class="text-center">Non-contact Thermometer</td>
                    <td class="text-center">n=1</td>
                    <td class="text-center">
                      <v-text-field
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details=""
                        v-model="selected.heaterTemp"
                      >
                        <template #append-inner> °C </template>
                      </v-text-field>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="6">
                      <v-btn
                        @click="extStep++"
                        :disabled="
                          selected.heaterTemp == null ||
                          selected.heaterTemp == ''
                        "
                        text="submit"
                        variant="outlined"
                        rounded="pill"
                        block
                      ></v-btn>
                    </td>
                  </tr>
                </tfoot>
              </v-table>
            </div>
            <div v-if="extStep == 1">
              <v-row>
                <v-col cols="4">
                  <v-card>
                    <template #title> Part Image </template>
                    <template #text>
                      <v-img
                        height="400"
                        :src="partAct == null ? defDrawing : partAct"
                      />
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="8">
                  <v-table class="mytable">
                    <thead>
                      <tr>
                        <th class="text-center">Inspection Item</th>
                        <th class="text-center">Standard</th>
                        <th class="text-center">Inspection Result</th>
                        <th class="text-center">Judgement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="(group, gIndex) in Object.values(
                          selected.apperanceData
                        )"
                        :key="gIndex"
                      >
                        <tr
                          v-for="(field, fIndex) in Object.entries(
                            group.content
                          )"
                          :key="fIndex"
                        >
                          <!-- Hanya tampilkan label section di baris pertama -->
                          <td
                            v-if="fIndex === 0"
                            :rowspan="Object.keys(group.content).length"
                            class="text-center"
                          >
                            {{ group.label }}
                          </td>
                          <td>{{ field[1].standard }}</td>
                          <td>
                            <v-checkbox-btn
                              v-model="field[1].input"
                              :label="field[1].label"
                              :value="field[1].std"
                            ></v-checkbox-btn>
                          </td>
                          <td
                            :class="
                              validateApp(field[1].input, field[1].std)
                                ? 'text-center bg-success'
                                : 'text-center bg-error'
                            "
                          >
                            <div
                              v-if="validateApp(field[1].input, field[1].std)"
                            >
                              OK
                            </div>
                            <div v-else>NG</div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-table>
                </v-col>
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    @click="extStep++"
                    :disabled="!validateInputs(selected.apperanceData)"
                    text="submit"
                    variant="outlined"
                    rounded="pill"
                    block
                  ></v-btn>
                </v-col>
              </v-row>
            </div>
            <insTable
              v-if="extStep == 2"
              :pos-data="selected.step"
              :table-data="selected.extrudingData"
              v-on:emit-report="extrudingAdd"
            />
          </div>

          <div v-if="dialogData.key == 'press' && selected.partData.pressOn">
            <insTable
              :pos-data="selected.step"
              :table-data="selected.pressData"
              v-on:emit-report="pressAdd"
            ></insTable>
          </div>

          <div
            v-if="dialogData.key == 'outgoing' && selected.partData.outgoingOn"
          >
            <insTable
              :pos-data="selected.step"
              :table-data="selected.outgoingData"
              v-on:emit-report="pressAdd"
            ></insTable>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.mytable td,
.mytable th,
.mytable table,
.mytable tr {
  border: black, 1px, solid !important;
}
</style>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";
import moment from "moment";
import defDrawing from "@/assets/defaultDesign.png";

const store = useAppStore();
const search = ref("");
const dialog = ref(false);
const selected = ref(null);
const parts = ref([]);
const part = ref(null);
const partDrawing = ref(null);
const partAct = ref(null);
const inspection = ref([]);
const extStep = ref(0);
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

const kneadingJudgement = ref(null);

const headerData = reactive({
  prodQty: "",
  kneadingLot: "",
  extrudingLot: "",
  poNumber: "",
  deliveryDate: moment().format("YYYY-MM-DD"),
  orderNumber: "",
});

const headers = [
  {
    title: "Part Type",
    key: "partType",
    align: "start",
  },
  {
    title: "Part Number|PO Number",
    key: "poNumber",
    align: "start",
  },
  {
    title: "Delivery Date",
    key: "headerData.deliveryDate",
    align: "center",
  },
  {
    title: "Order Number",
    key: "headerData.orderNumber",
    align: "center",
  },
  {
    title: "Kneading",
    key: "partNumber",
    align: "center",
    sortable: false,
  },
  {
    title: "Extruding",
    key: "insId",
    align: "center",
    sortable: false,
  },
  {
    title: "Press",
    key: "insId",
    align: "center",
    sortable: false,
  },
  {
    title: "Outgoing",
    key: "insId",
    align: "center",
    sortable: false,
  },
];

const rules = {
  prodQty: {
    required: helpers.withMessage("This field is required", required),
  },
  kneadingLot: {
    required: helpers.withMessage("This field is required", required),
  },
  extrudingLot: {
    required: helpers.withMessage("This field is required", required),
  },
  poNumber: {
    required: helpers.withMessage("This field is required", required),
  },
  deliveryDate: {
    required: requiredIf(
      () => part.value.headers.includes("deliveryDate"),
      "required"
    ),
  },
  orderNumber: {
    required: requiredIf(
      () => part.value.headers.includes("orderNumber"),
      "required"
    ),
  },
};

const headerValidate = useVuelidate(rules, headerData);

const headerString = {
  prodQty: "Produced Qty",
  kneadingLot: "Kneading Lot No.",
  extrudingLot: "Extruding Lot No.",
  poNumber: "PO No.",
  deliveryDate: "Delivery Date",
  orderNumber: "Order No.",
};

const extType = ref("a");

// watch
watch(part, (e) => {
  const parseObject = [
    "headers",
    "kneadingItems",
    "extrudingItems",
    "pressItems",
    "outgoingItems",
    "extAppStd",
  ];

  const boolObject = ["heaterCheck", "pressOn", "outgoingOn"];
  Object.entries(e).forEach(([key, value]) => {
    if (parseObject.includes(key)) {
      part.value[key] = JSON.parse(value);
    }

    if (boolObject.includes(key)) {
      part.value[key] = value == 1 ? true : false;
    }
  });
});

async function addReport(item) {
  Object.entries(item).forEach(([key, value]) => {
    if (value == null) {
      delete item[key];
    } else if (Array.isArray(value) || typeof value === "object") {
      item[key] = JSON.stringify(value);
    } else {
      item[key] = value;
    }
  });

  // console.log(selected.value);

  await store.ajax(item, "/inspection/addreport", "post");

  console.log("...selesai update data");
  refresh();
}

function kneadingAdd(item) {
  let exportData = { ...toRaw(selected.value) };
  exportData.judgement = item.ng ? "NG" : null;
  exportData.kneadingData = item.tableData;
  console.log(exportData);
  nextTick().then(() => {
    addReport(exportData);
  });
}

function pressAdd(item) {
  let exportData = { ...toRaw(selected.value) };
  exportData.judgement = item.ng ? "NG" : null;
  exportData.pressData = item.tableData;
  console.log(exportData);
  nextTick().then(() => {
    addReport(exportData);
  });
}

function kneadingAbuffer() {
  const localSelected = { ...toRaw(selected.value) };
  localSelected.kneadingData.forEach((value, index) => {
    value.items.forEach((itm, ind) => {
      if (itm.check) {
        localSelected.kneadingData[index].items[ind].judgement =
          kneadingJudgement.value;
        localSelected.kneadingData[index].items[ind].input =
          kneadingJudgement.value;
      }
    });
  });
  localSelected.judgement = kneadingJudgement.value == "OK" ? null : "NG";
  addReport(localSelected);
}

function extrudingAdd(item) {
  let exportData = { ...toRaw(selected.value) };
  exportData.judgement = item.ng ? "NG" : null;
  exportData.extrudingData = item.tableData;
  exportData.step = `${item.pos}|0`;
  addReport(exportData);
}

function validateApp(input, std) {
  return input == std;
}

function validateInputs(data) {
  return Object.values(data).every((section) =>
    Object.values(section.content).every(
      (item) => item.input?.toString().trim() === item.std?.toString().trim()
    )
  );
}

function openDialog(key, item) {
  dialogData.key = key;
  switch (key) {
    case "new":
      dialogData.title = "Initiate Inspection";
      dialogData.subtitle = "Please fill all required field below";
      break;
    case "kneading":
      selected.value = item;
      dialogData.title = "Kneading Inspection";
      dialogData.subtitle = "Please fill all required field below";
      break;
    case "press":
      selected.value = item;
      dialogData.title = "Kneading Inspection";
      dialogData.subtitle = "Please fill all required field below";
      break;
    case "outgoing":
      selected.value = item;
      dialogData.title = "Kneading Inspection";
      dialogData.subtitle = "Please fill all required field below";
      break;
    case "extruding":
      store
        .ajax(
          { partNumber: item.partData.partNumber },
          "/parts/getdrawing",
          "post"
        )
        .then((e) => {
          partAct.value = e.act;
          partDrawing.value = e.drw;
          store.preload = false;
        });
      const heaterOn = item.partData.heaterCheck;
      extStep.value = heaterOn ? 0 : 1;
      selected.value = item;
      extType.value = item.partData.extrudingType;
      dialogData.title = "Extruding Inspection";
      dialogData.subtitle = "Please fill all required field below";
      break;
  }
  dialog.value = true;
}

function itemProps(item) {
  return {
    title: item.partName,
    subtitle: item.partNumber,
  };
}

async function refresh() {
  dialog.value = false;
  parts.value = await store.ajax({}, "/parts", "post");
  inspection.value = await store.ajax({ func: "NG" }, "/inspection", "post");
  store.preload = false;
}

async function initiate() {
  try {
    const valid = await headerValidate.value.$validate();
    if (valid) {
      headerData.orderNumber = part.value.headers.includes("orderNumber")
        ? headerData.orderNumber
        : "-";

      headerData.deliveryDate = part.value.headers.includes("deliveryDate")
        ? headerData.deliveryDate
        : "-";
      const fd = {
        headerData: headerData,
        partData: part.value,
      };
      await store.ajax(fd, "/inspection/add", "post");
      refresh();
    } else {
      console.log(headerValidate.value.$errors);
    }
  } catch (error) {
    console.log(error);
  }
}

onBeforeMount(() => {
  refresh();
});
</script>
