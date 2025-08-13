<template>
  <table class="mytable">
    <thead>
      <tr>
        <th colspan="5" class="text-h6">
          {{ inspection.partNumber }}
        </th>
        <th>Judgement</th>
      </tr>
      <tr>
        <th rowspan="2" class="text-center">
          <h1 class="text-h6 text-uppercase">
            {{ inspection.inspectionStep.step }}
            <br />
            N{{ inspection.inspectionStep.n }}
          </h1>
        </th>
        <th>Customer</th>
        <th>{{ inspection.partData.customer }}</th>
        <th>Production Qty.</th>
        <th>{{ inspection.headerData.prodQty }}</th>
        <th
          :class="appearanceValid ? 'bg-success' : 'bg-error'"
          rowspan="2"
          v-if="inspection.inspectionStep.step == 'appearance'"
        >
          <div v-if="!appearanceValid" class="text-h5">NG</div>
          <div v-if="appearanceValid" class="text-h5">OK</div>
        </th>
        <th
          :class="inspection.currentData.judgement ? 'bg-success' : 'bg-error'"
          rowspan="2"
          v-else
        >
          <div v-if="!inspection.currentData.judgement" class="text-h5">NG</div>
          <div v-if="inspection.currentData.judgement" class="text-h5">OK</div>
        </th>
      </tr>
      <tr>
        <th>Kneading Lot</th>
        <th>{{ inspection.headerData.kneadingLot }}</th>
        <th>Extruding Lot</th>
        <th>{{ inspection.headerData.extrudingLot }}</th>
      </tr>
    </thead>
  </table>
  <div v-if="inspection.inspectionStep.step == 'appearance'">
    <v-divider class="my-2"></v-divider>
    <div class="my-2" v-if="inspection.partData.heaterCheck">
      <v-text-field
        @keyup="validateAppearance"
        type="number"
        variant="outlined"
        rounded="pill"
        density="compact"
        hide-details=""
        v-model="inspection.appearanceData.data.heaterTemp.input"
        label="Heater Temperature (Check temperature at beginning of production)"
      >
        <template #append-inner> °C </template>
        <template #append>Standard: 45 ~ 80 °C </template>
      </v-text-field>
    </div>
    <div v-if="inspection.partData.extrudingType == 'c'">
      <v-row>
        <v-col cols="4">
          <v-card title="Images">
            <template #text>
              <div class="d-flex align-center justify-center w-100 flex-column">
                <v-img
                  width="100%"
                  :src="drw == null ? defDrawing : drw"
                ></v-img>
                <v-divider class="my-2"></v-divider>
                <v-img
                  width="100%"
                  :src="drw == null ? defDrawing : drw"
                ></v-img>
              </div>
            </template>
          </v-card>
        </v-col>
        <v-col cols="8">
          <table class="mytable">
            <thead>
              <tr>
                <th class="text-start">
                  Sheet Layout
                  <br />
                  <hr />
                  <br />
                  Standard:
                  <br />
                  {{ inspection.appearanceData.standard.sheetLayout }} pcs/sheet
                </th>
                <th class="text-start">
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.sheetLayout.input"
                    :true-value="inspection.appearanceData.standard.sheetLayout"
                  >
                    <template #label>
                      {{ inspection.appearanceData.standard.sheetLayout }}
                      pcs/sheet
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th class="text-start" rowspan="6">
                  Upper Surface
                  <br />
                  <hr />
                  <br />
                  Standard:
                  <br />
                  {{
                    store.extBlabel[inspection.appearanceData.standard.upper]
                  }}
                </th>
                <th class="text-start">
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.upper.input"
                    :value="inspection.appearanceData.standard.upper"
                  >
                    <template #label>
                      {{
                        store.extBlabel[
                          inspection.appearanceData.standard.upper
                        ]
                      }}
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.holeCount.input"
                    :value="inspection.appearanceData.standard.holeCount"
                  >
                    <template #label>
                      Hole Count:
                      {{ inspection.appearanceData.standard.holeCount }}
                      hole(s)
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.holeA.input"
                    :value="inspection.appearanceData.standard.holeA"
                  >
                    <template #label>
                      Hole A:
                      {{ inspection.appearanceData.standard.holeA }}
                      mm
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.holeB.input"
                    :value="inspection.appearanceData.standard.holeB"
                  >
                    <template #label>
                      Hole B:
                      {{ inspection.appearanceData.standard.holeB }}
                      mm
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.holeC.input"
                    :value="inspection.appearanceData.standard.holeC"
                  >
                    <template #label>
                      Hole C:
                      {{ inspection.appearanceData.standard.holeC }}
                      mm
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.holeD.input"
                    :value="inspection.appearanceData.standard.holeD"
                  >
                    <template #label>
                      Hole D:
                      {{ inspection.appearanceData.standard.holeD }}
                      mm
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th class="text-start">
                  Bottom Layout
                  <br />
                  <hr />
                  <br />
                  Standard:
                  <br />
                  {{
                    store.extBlabel[inspection.appearanceData.standard.bottom]
                  }}
                </th>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.bottom.input"
                    :value="'releasePaperWhite'"
                  >
                    <template #label>
                      {{ store.extBlabel.releasePaperWhite }}
                    </template>
                  </v-checkbox-btn>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.bottom.input"
                    :value="'releasePaperYellow'"
                  >
                    <template #label>
                      {{ store.extBlabel.releasePaperYellow }}
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
            </thead>
          </table>
        </v-col>
      </v-row>
    </div>
    <div v-if="inspection.partData.extrudingType == 'b'">
      <v-row>
        <v-col cols="4">
          <v-card title="Images">
            <template #text>
              <div class="d-flex align-center justify-center w-100 flex-column">
                <v-img
                  width="220"
                  :src="drw == null ? defDrawing : drw"
                ></v-img>
                <v-divider class="my-2"></v-divider>
                <v-img
                  width="220"
                  :src="drw == null ? defDrawing : drw"
                ></v-img>
              </div>
            </template>
          </v-card>
        </v-col>
        <v-col cols="8">
          <table class="mytable">
            <thead>
              <tr>
                <th class="text-start">
                  Sheet Layout
                  <br />
                  <hr />
                  <br />
                  Standard:
                  <br />
                  {{ inspection.appearanceData.standard.sheetLayout }} pcs/sheet
                </th>
                <th class="text-start">
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.sheetLayout.input"
                    :true-value="inspection.appearanceData.standard.sheetLayout"
                  >
                    <template #label>
                      {{ inspection.appearanceData.standard.sheetLayout }}
                      pcs/sheet
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th class="text-start" rowspan="6">
                  Upper Surface
                  <br />
                  <hr />
                  <br />
                  Standard: <br />
                  {{
                    store.extBlabel[inspection.appearanceData.standard.upper]
                  }}
                </th>
              </tr>
              <tr v-for="(item, index) in store.extBlabel" :key="index">
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.upper.input"
                    :value="index"
                  >
                    <template #label>
                      {{ item }}
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
              <tr>
                <th class="text-start">
                  Bottom Surface
                  <hr />
                  <br />
                  Standard:
                  <br />
                  {{ inspection.appearanceData.standard.bottom }} pcs/sheet
                </th>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.bottom.input"
                    :value="'releasePaperWhite'"
                  >
                    <template #label>
                      {{ store.extBlabel.releasePaperWhite }}
                    </template>
                  </v-checkbox-btn>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    v-model="inspection.appearanceData.data.bottom.input"
                    :value="'releasePaperYellow'"
                  >
                    <template #label>
                      {{ store.extBlabel.releasePaperYellow }}
                    </template>
                  </v-checkbox-btn>
                </th>
              </tr>
            </thead>
          </table>
        </v-col>
      </v-row>
    </div>
    <div v-if="inspection.partData.extrudingType == 'a'">
      <v-row>
        <v-col cols="12">
          <table class="mytable">
            <thead>
              <tr>
                <td>Part Drawing</td>
                <td>Actual Image</td>
              </tr>
              <tr>
                <td>
                  <v-img
                    height="180"
                    :src="drw == null ? defDrawing : drw"
                  ></v-img>
                </td>
                <td>
                  <v-img
                    height="180"
                    :src="act == null ? defDrawing : act"
                  ></v-img>
                </td>
              </tr>
              <tr>
                <td colspan="2"></td>
              </tr>
              <tr>
                <th>Item Inspection</th>
                <th>Standard</th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    :label="`Release Paper color ${inspection.appearanceData.standard.color}`"
                    v-model="inspection.appearanceData.data.color.input"
                    :true-value="inspection.appearanceData.standard.color"
                  ></v-checkbox-btn>
                </th>
                <th class="text-capitalize text-center">
                  {{ inspection.appearanceData.standard.color }}
                </th>
              </tr>
              <tr>
                <th>
                  <v-checkbox-btn
                    false-value=""
                    @change="validateAppearance"
                    :label="`Butyl tape can be peeled off`"
                    v-model="inspection.appearanceData.data.peel.input"
                    :true-value="inspection.appearanceData.standard.peel"
                  >
                  </v-checkbox-btn>
                </th>

                <th class="text-capitalize text-center">
                  Butyl tape can be peeled off from Release paper
                </th>
              </tr>
            </thead>
          </table>
        </v-col>
      </v-row>
    </div>

    <v-divider class="my-2"></v-divider>

    <v-btn @click="appProceed" variant="outlined" rounded="pill" block
      >Save</v-btn
    >
  </div>
  <div v-else>
    <v-divider class="my-5"></v-divider>
    <div>
      <v-table class="mytable">
        <thead>
          <tr>
            <td rowspan="2" class="text-center">No.</td>
            <td rowspan="2" class="text-center">Inspection Items</td>
            <td rowspan="2" class="text-center">Standard</td>
            <td rowspan="2" class="text-center">Inspection Tool</td>
            <td
              class="text-center"
              :colspan="inspection.currentData.data.length"
            >
              Inspection Result
            </td>
          </tr>
          <tr>
            <td
              class="text-center text-h6"
              v-show="item.key == `N${inspection.inspectionStep.n}`"
              v-for="(item, index) in inspection.currentData.data"
              :key="index"
            >
              {{ item.key }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, Yindex) in tableStructure" :key="Yindex">
            <td class="text-center">{{ Yindex + 1 }}</td>
            <td class="text-center">
              {{ item.label }}
            </td>
            <td class="text-center">
              {{ store.checkLogic(item.logic.id, item.standard, "", true) }}
              {{ item.unit }}
            </td>
            <td class="text-center">{{ item.method.romaji }}</td>

            <td
              :class="getBg(inspection.currentData.data[index].items[Yindex])"
              v-show="itm.key == `N${inspection.inspectionStep.n}`"
              v-for="(itm, index) in inspection.currentData.data"
              :key="index"
            >
              <v-text-field
                @keyup="validateInput(index, Yindex)"
                hide-details=""
                variant="outlined"
                rounded="pill"
                density="compact"
                v-model="inspection.currentData.data[index].items[Yindex].input"
                v-if="
                  inspection.currentData.data[index].items[Yindex].logic
                    .inputType != 'buttonToggle' &&
                  inspection.currentData.data[index].items[Yindex].isCheck
                "
              />
              <v-btn-toggle
                mandatory=""
                @click="validateInput(index, Yindex)"
                density="compact"
                v-if="
                  inspection.currentData.data[index].items[Yindex].logic
                    .inputType == 'buttonToggle' &&
                  inspection.currentData.data[index].items[Yindex].isCheck
                "
                v-model="inspection.currentData.data[index].items[Yindex].input"
              >
                <v-btn value="OK" color="success">OK</v-btn>
                <v-btn value="NG" color="error">NG</v-btn>
              </v-btn-toggle>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <v-divider class="my-5"></v-divider>
    <v-row>
      <v-col cols="6">
        <v-btn
          @click="
            () => {
              inspection.inspectionStep.n--;
              populateInput();
            }
          "
          text="Previous"
          :disabled="inspection.inspectionStep.n == 1"
          variant="outlined"
          rounded="pill"
          block
        ></v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          :disabled="!next"
          variant="outlined"
          rounded="pill"
          block
          text="next"
          @click="procceed"
        ></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import defDrawing from "@/assets/defaultDesign.png";
import moment from "moment";

const store = useAppStore();
const props = defineProps(["inspectionData", "refresh"]);
let localizedData = { ...toRaw(props.inspectionData) };
let inspection = reactive(new Inspection());
const drw = ref(null);
const act = ref(null);
let tableStructure = [];
let max = ref(0);
let next = ref(false);
let appearanceValid = ref(false);
let appEntries = ref([]);
let stepValid = ref(false);

onBeforeMount(async () => {
  inspection.registerData(localizedData);

  inspection.initInspection(inspection.inspectionStep.step);
  if (inspection.inspectionStep.step != "appearance") {
    tableStructure = inspection.generateTableStructure();

    max.value = inspection.currentData.data.length;
    populateInput();
  } else {
    let type = inspection.partData.extrudingType;
    let entries;

    switch (type) {
      case "c":
        entries = [
          "sheetLayout",
          "upper",
          "bottom",
          "holeCount",
          "holeA",
          "holeB",
          "holeC",
          "holeD",
        ];
        break;
      case "b":
        entries = ["sheetLayout", "upper", "bottom"];
        break;
      case "a":
        entries = ["color", "peel"];
        inspection.appearanceData.standard.peel = "1";
        break;
    }

    appEntries.value = entries;

    entries.forEach((key) => {
      let input = {
        input: "",
        judgement: false,
      };
      inspection.appearanceData.data[key] = input;
    });

    if (inspection.partData.heaterCheck) {
      inspection.appearanceData.standard.heaterTemp = [45, 80];
      inspection.appearanceData.data.heaterTemp = {
        input: "",
        judgement: false,
      };
    }

    validateAppearance();
  }

  const images = await store.ajax(
    { partNumber: inspection.partNumber },
    "/parts/getdrawing",
    "post"
  );

  act.value = images.act;
  drw.value = images.drw;

  store.preload = false;
});

function validateAppearance() {
  appEntries.value.forEach((key) => {
    inspection.appearanceData.data[key].judgement = store.checkLogic(
      8,
      [inspection.appearanceData.standard[key]],
      inspection.appearanceData.data[key].input
    );
  });

  if (inspection.partData.heaterCheck) {
    inspection.appearanceData.data.heaterTemp.judgement = store.checkLogic(
      2,
      inspection.appearanceData.standard.heaterTemp,
      inspection.appearanceData.data.heaterTemp.input
    );
  }

  let valid = Object.entries(inspection.appearanceData.data).every(
    ([key, value]) => value.judgement
  );

  appearanceValid.value = valid;
  inspection.judgement = valid ? null : 0;

  const step = inspection.inspectionStep.step;
  const data = inspection.appearanceData.data;
  let item = Object.entries(data).filter(([key, value]) => !value.judgement);

  let rejectionData = [];

  item.forEach((e, i) => {
    rejectionData[i] = {
      label: store.extLabel[e[0]],
      judgement: e[1].judgement,
      input: e[1].input,
      standard:
        e[0] != "heaterTemp"
          ? [inspection.appearanceData.standard[e[0]]]
          : [45, 80],
      logic: { id: 8 },
      appKey: e[0],
    };
  });

  inspection.rejectionData.data[step] = rejectionData;

  console.log(rejectionData);
}

function validateInput(index, Yindex) {
  const item = inspection.currentData.data[index].items[Yindex];
  const input = item.input;
  const logic = item.logic.id;
  const standard = item.standard;
  const judgement = store.checkLogic(logic, standard, input) ? 1 : 0;
  const key = inspection.currentData.data[index].key;

  item.judgement = judgement;

  const step = inspection.inspectionStep.step;
  const rejectionArray = inspection.rejectionData.data[step];

  const pusshed = { ...item, key };

  // Cek apakah item sudah ada di dalam rejectionArray
  const existingIndex = rejectionArray.findIndex(
    (i) => i.key == key && i.id == item.id
  );

  if (judgement === 0) {
    // Push hanya jika belum ada
    if (existingIndex === -1) {
      inspection.rejectionData.data[step].push(pusshed);
    } else {
      inspection.rejectionData.data[step].splice(existingIndex, 1);
      inspection.rejectionData.data[step].push(pusshed);
    }
  } else {
    // Hapus jika ada
    if (existingIndex !== -1) {
      inspection.rejectionData.data[step].splice(existingIndex, 1);
    }
  }

  populateInput();
}

function populateInput() {
  const data = inspection.currentData.data;
  const index = data.findIndex(
    (e) => e.key == `N${inspection.inspectionStep.n}`
  );

  const items = data[index].items;
  let filtered = items.filter((e) => e.isCheck);

  stepValid.value = filtered.every((value) => value.judgement);

  inspection.currentData.judgement = stepValid.value;

  next.value = filtered.every((item) => item.input !== "");
}

function appProceed() {
  const user = store.userData;
  const { userId, userName } = user;
  inspection.appearanceData.inspector = { userId, userName };
  inspection.appearanceData.inspectionDate = moment().format("YYYY-MM-DD");

  let json = inspection.toJSON();
  let req = { ...toRaw(json) };
  let step = { step: "extruding", n: 1 };
  req.inspectionStep = JSON.stringify(step);
  // console.log(req);
  nextTick().then(async () => {
    await store.ajax(req, "/inspection/save", "post");
    props.refresh();
  });
}

function procceed() {
  const data = inspection.currentData.data;
  const index = data.findIndex(
    (e) => e.key == `N${inspection.inspectionStep.n}`
  );
  const items = data[index].items;
  let filtered = items.filter((e) => e.isCheck);
  let judgement = filtered.every((item) => item.judgement !== 0);
  if (!judgement) {
    inspection.currentData.judgement = 0;
  } else {
    inspection.currentData.judgement = 1;
  }

  const step = inspection.inspectionStep.step;
  const userData = store.userData;
  const { userName, userId } = userData;

  inspection.currentData.inspector = {
    userId,
    userName,
  };

  inspection.currentData.inspectionDate = moment().format("YYYY-MM-DD");

  const pressOn = inspection.partData.pressOn == 1;
  const outgoingOn = inspection.partData.outgoingOn == 1;
  let nextStep = null;

  switch (step) {
    case "kneading":
      inspection.kneadingData = inspection.currentData;
      nextStep = "appearance";
      break;
    case "extruding":
      inspection.extrudingData = inspection.currentData;
      if (pressOn) {
        nextStep = "press";
      } else {
        if (outgoingOn) {
          nextStep = "outgoing";
        }
      }
      break;
    case "press":
      if (outgoingOn) {
        nextStep = "outgoing";
      }
      inspection.pressData = inspection.currentData;
      break;
    case "outgoing":
      inspection.outgoingData = inspection.currentData;
      break;
  }

  if (max.value != inspection.inspectionStep.n) {
    inspection.inspectionStep.n++;
    if (inspection.currentData.judgement != 1) {
      inspection.judgement = 0;
    }
    let json = inspection.toJSON();
    nextTick().then(async () => {
      await store.ajax(json, "/inspection/save", "post");

      if (inspection.judgement == 0) {
        props.refresh();
      } else {
        store.preload = false;
        populateInput();
      }
    });
  } else {
    let json = inspection.toJSON();

    if (nextStep != null) {
      json.inspectionStep = JSON.stringify({
        step: nextStep,
        n: 1,
      });
      if (!judgement) {
        json.judgement = 0;
      }
    } else {
      if (!judgement) {
        json.judgement = 0;
      } else {
        json.judgement = 1;
      }
    }

    nextTick().then(async () => {
      await store.ajax(json, "/inspection/save", "post");
      props.refresh();
    });
  }
}

function getBg(item) {
  let judgement = item.judgement;
  let isCheck = item.isCheck;
  let green = item.judgement == 1;
  let red = isCheck && item.judgement == 0;
  let grey = !isCheck;

  let response = [green, red, grey];
  let classes = [
    "text-center bg-success",
    "text-center bg-error",
    "text-center bg-grey-lighten-3",
  ];
  return classes[response.findIndex((e) => e)];
}
</script>
