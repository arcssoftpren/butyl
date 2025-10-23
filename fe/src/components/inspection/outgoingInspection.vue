<template>
  <v-table class="mytable mt-5">
    <thead>
      <tr>
        <td colspan="2" class="text-center">Room Temperature</td>
        <td class="text-center">23 &plusmn; 2 &deg;C</td>
        <td class="text-center">Thermometer</td>
        <td
          :class="
            inspection.outgoingData.roomData.judgement
              ? 'bg-success'
              : 'bg-error'
          "
        >
          <v-text-field
            @keyup="validateRoomTemp"
            variant="outlined"
            rounded="pill"
            density="compact"
            hide-details
            v-model="inspection.outgoingData.roomData.input"
          />
        </td>
      </tr>
    </thead>
  </v-table>
  <v-table class="mytable mt-5">
    <thead>
      <tr>
        <td rowspan="2" class="text-center">No.</td>
        <td rowspan="2" class="text-center">Inspection Items</td>
        <td rowspan="2" class="text-center">Standard</td>
        <td rowspan="2" class="text-center">Inspection Tool</td>
        <td class="text-center" :colspan="inspection.currentData.data.length">
          Inspection Result
        </td>
      </tr>
      <tr>
        <td
          class="text-center text-h6"
          v-for="(item, index) in inspection.currentData.data"
          :key="index"
        >
          {{ item.key }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="
          inspection.inspectionStep.step == 'outgoing' &&
          roomCheck == 1 &&
          inspection.inspectionStep.n == 1
        "
      >
        <td colspan="2" class="text-center">Room Temperature</td>
        <td class="text-center">23 &plusmn; 2 &deg;C</td>
        <td class="text-center">Thermometer</td>
        <td
          :class="
            inspection.outgoingData.roomData.judgement
              ? 'bg-success'
              : 'bg-error'
          "
        >
          <v-text-field
            @keyup="validateRoomTemp"
            variant="outlined"
            rounded="pill"
            density="compact"
            hide-details
            v-model="inspection.outgoingData.roomData.input"
          />
        </td>
      </tr>
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
  <v-row class="mt-5">
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="6">
      <v-btn variant="outlined" @click="saveCurrentData" rounded="pill" block
        >Save</v-btn
      >
    </v-col>
    <v-col cols="6">
      <v-btn
        v-if="state == 1 && ff"
        variant="outlined"
        rounded="pill"
        block
        :disabled="!complete"
        @click="procceed"
      >
        Submit Report
      </v-btn>
      <v-btn
        color="error"
        :disabled="incomplete"
        v-if="!ff"
        variant="outlined"
        rounded="pill"
        block
        @click="procceed"
      >
        Report NG
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import moment from "moment";

const store = useAppStore();
const state = computed(() => {
  return inspection.currentData.data.every((dataItem) =>
    dataItem.items.every((it) => it.judgement === 1)
  )
    ? complete.value
      ? 1
      : 2
    : 0;
});
const props = defineProps(["inspectionData", "refresh", "roomCheck"]);
const emits = defineEmits(["updateOutgoingJudgement", "refresh"]);
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
let roomValid = ref(false);

let complete = ref(false);
let ff = computed(() =>
  inspection.currentData.data.every(
    (dataItem) =>
      dataItem.items.every((it) => it.judgement === 1) &&
      inspection.outgoingData.roomData.judgement
  )
);
let incomplete = ref(false);

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
}

function validateRoomTemp() {
  const roomData = inspection.outgoingData.roomData;
  const input = roomData.input;
  const logic = roomData.logic;
  const standard = roomData.standard;

  roomData.judgement = store.checkLogic(logic, standard, input);
  roomValid.value = roomData.judgement;
  const valid = roomData.judgement ? 1 : 0;
  inspection.judgement = valid ? null : 0;
  if (!roomData.judgement) {
    let find = inspection.rejectionData.data[
      inspection.inspectionStep.step
    ].find((e) => e.id == "9999");

    if (!find) {
      inspection.rejectionData.data.outgoing.push({
        id: "9999",
        label: "Room Temperature",
        judgement: roomData.judgement,
        input: input,
        standard: standard,
        logic: { id: logic },
      });
    }
  } else {
    inspection.rejectionData.data.outgoing =
      inspection.rejectionData.data.outgoing.filter((e) => e.id != "9999");
  }
  populateInput();
}

function validateInput(index, Yindex) {
  const item = inspection.currentData.data[index].items[Yindex];
  const input = item.input;
  const logic = item.logic.id;
  const standard = item.standard;
  const judgement =
    input == "" ? 0 : store.checkLogic(logic, standard, input) ? 1 : 0;
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

  // Update roomValid jika kondisi room check aktif
  if (
    inspection.inspectionStep.step === "outgoing" &&
    props.roomCheck == 1 &&
    inspection.inspectionStep.n === 1
  ) {
    const roomData = inspection.outgoingData.roomData;
    if (roomData.input) {
      roomData.judgement = store.checkLogic(
        roomData.logic,
        roomData.standard,
        roomData.input
      );
      roomValid.value = roomData.judgement;
    }
  }

  inspection.currentData.judgement =
    inspection.inspectionStep.step === "outgoing" &&
    props.roomCheck == 1 &&
    inspection.inspectionStep.n === 1
      ? stepValid.value && roomValid.value
      : stepValid.value;

  next.value = filtered.every((item) => item.input !== "");

  const outgoingJudgement =
    inspection.currentData.data.every((dataItem) => {
      const filteredItems = dataItem.items.filter((it) => it.isCheck);
      return filteredItems.every((it) => it.judgement === 1);
    }) && inspection.outgoingData.roomData.judgement;

  console.log("Outgoing Judgement:", outgoingJudgement);

  complete.value =
    inspection.currentData.data.every((dataItem) =>
      dataItem.items.every((it) => it.input != "")
    ) && inspection.outgoingData.roomData.input != "";

  incomplete.value = inspection.currentData.data.every((dataItem) =>
    dataItem.items.every((it) => it.input == "")
  );

  emits("updateOutgoingJudgement", outgoingJudgement);

  // Debug log
}

function procceed() {
  const data = inspection.currentData.data;

  const userData = store.userData;
  const { userName, userId } = userData;

  inspection.currentData.inspector = {
    userId,
    userName,
  };

  inspection.currentData.inspectionDate = moment().format("YYYY-MM-DD");
  inspection.outgoingData = inspection.currentData;

  const outgoingJudgement = inspection.currentData.data.every(
    (dataItem) =>
      dataItem.items.every((it) => it.judgement === 1) &&
      inspection.outgoingData.roomData.judgement
  );

  inspection.judgement = outgoingJudgement ? 1 : 0;

  console.log(outgoingJudgement);

  // Simpan data dan lanjut ke step berikutnya
  let json = inspection.toJSON();
  nextTick().then(async () => {
    await store.ajax(json, "/inspection/save", "post");
    // Update state setelah save
    store.preload = false;
    emits("refresh");
  });
}

function saveCurrentData() {
  const data = inspection.currentData.data;
  const index = data.findIndex(
    (e) => e.key == `N${inspection.inspectionStep.n}`
  );
  const userData = store.userData;
  const { userName, userId } = userData;

  inspection.currentData.inspector = {
    userId,
    userName,
  };

  inspection.currentData.inspectionDate = moment().format("YYYY-MM-DD");

  console.log(inspection);

  // Simpan data tanpa mengubah judgement atau step
  let json = inspection.toJSON();
  nextTick().then(async () => {
    await store.ajax(json, "/inspection/save", "post");
    // Update state setelah save
    populateInput();
    store.preload = false;
  });
}

function getBg(item) {
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
