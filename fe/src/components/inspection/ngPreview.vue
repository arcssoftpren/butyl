<template>
  <v-table class="mytable">
    <thead>
      <tr class="text-center text-uppercase">
        <th class="text-center">Process</th>
        <th class="text-center">Sample Number</th>
        <th class="text-center">Inspection Item</th>
        <th class="text-center">Standard</th>
        <th class="text-center">Inspection Result</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="text-center text-uppercase"
        v-for="(row, index) in flatItems"
        :key="index"
      >
        <td>{{ row.process }}</td>
        <td
          v-if="
            (row.process == 'kneading' &&
              localData2.partData.kneadingType == 'a') ||
            row.process == 'appearance'
          "
        >
          -
        </td>

        <td v-else>{{ row.key }}</td>
        <td
          v-if="
            row.process != 'kneading' || localData2.partData.kneadingType != 'a'
          "
        >
          {{ row.label }}
        </td>
        <td v-else>All</td>
        <td
          v-if="
            (row.process != 'kneading' && row.process != 'appearance') ||
            (row.process == 'kneading' &&
              localData2.partData.kneadingType == 'b')
          "
        >
          {{ store.checkLogic(row.logic.id, row.standard, "", true) }}
        </td>
        <td
          v-if="
            row.process == 'kneading' && localData2.partData.kneadingType == 'a'
          "
        >
          See Kneading Result
        </td>
        <td v-if="row.process == 'appearance'">
          <div v-if="localData2.partData.extrudingType == 'a'">
            <div v-if="row.appKey == 'color'">
              {{ row.standard[0] }}
            </div>
            <div v-if="row.appKey == 'peel'">
              can be peeled off from Release paper
            </div>
            <div v-if="row.appKey == 'heaterTemp'">
              {{ store.checkLogic(2, row.standard, "", true) }} °C
            </div>
          </div>

          <div v-if="localData2.partData.extrudingType == 'b'">
            <div v-if="row.appKey == 'sheetLayout'">
              {{ row.standard[0] }} pcs/sheet
            </div>
            {{ store.extBlabel[row.standard[0]] }}
          </div>

          <div v-if="localData2.partData.extrudingType == 'c'">
            <div v-if="row.appKey == 'sheetLayout'">
              {{ row.standard[0] }} pcs/sheet
            </div>
            <div v-if="['upper', 'bottom'].includes(row.appKey)">
              {{ store.extBlabel[row.standard[0]] }}
            </div>
            <div
              v-if="['holeA', 'holeB', 'holeC', 'holeD'].includes(row.appKey)"
            >
              {{ row.standard[0] }} mm
            </div>
            <div v-if="row.appKey == 'holeCount'">
              {{ row.standard[0] }} Hole(s)
            </div>
            <div v-if="row.appKey == 'heaterTemp'">
              {{ store.checkLogic(2, row.standard, "", true) }} °C
            </div>
          </div>
        </td>
        <td v-if="row.process == 'appearance'">
          <div v-if="localData2.partData.extrudingType == 'a'">
            <div v-if="row.appKey == 'heaterTemp'">{{ row.input }} °C</div>
            <div v-else>Not Confirmed</div>
          </div>
          <div v-else>
            <div
              v-if="
                [
                  'holeA',
                  'holeB',
                  'holeC',
                  'holeD',
                  'sheetLayout',
                  'holeCount',
                ].includes(row.appKey)
              "
            >
              Not Confirmed
            </div>

            <div v-if="row.appKey == 'heaterTemp'">{{ row.input }} °C</div>
            <div
              v-if="row.input != '' && ['upper', 'bottom'].includes(row.appKey)"
            >
              {{ extLabel[row.input] }}
            </div>
            <div
              v-if="row.input == '' && ['upper', 'bottom'].includes(row.appKey)"
            >
              Not Confirmed
            </div>
          </div>
        </td>
        <td
          v-if="
            row.process == 'kneading' && localData2.partData.kneadingType == 'a'
          "
        >
          NG
        </td>

        <td
          v-if="
            (row.process == 'kneading' &&
              localData2.partData.kneadingType == 'b') ||
            (row.process != 'kneading' &&
              localData2.partData.kneadingType == 'a' &&
              row.process != 'appearance')
          "
        >
          {{ row.input }}
        </td>
        <td>
          <v-btn-toggle
            @click="actions(row.process, row.index)"
            v-model="localData[row.process][row.index].action"
            density="compact"
            variant="outlined"
            rounded="xl"
            block
            mandatory=""
          >
            <v-btn value="1" color="error">Reject</v-btn>
            <v-btn value="2" color="success">Repair</v-btn>
            <v-btn value="3" color="warning">Special</v-btn>
          </v-btn-toggle>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <template #append>
        <v-btn flat icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #title>Reject Review Report</template>
      <template #subtitle>Please add note to your actions</template>
      <template #text>
        <table class="mytable">
          <thead>
            <tr>
              <th>Action</th>
              <th class="bg-error" v-if="process.action == 1">Rejected</th>
              <th class="bg-success" v-if="process.action == 2">Repaired</th>
              <th class="bg-warning" v-if="process.action == 3">
                Special Acceptance
              </th>
            </tr>
            <tr>
              <th colspan="2" class="pa-5 text-start">
                Action Note
                <v-textarea
                  v-model="localData[coodinate.pro][coodinate.ind].note"
                  variant="outlined"
                  hide-details=""
                />
              </th>
            </tr>
            <tr>
              <th>Review By</th>
              <th>{{ process.inspector }}</th>
            </tr>
            <tr>
              <th>Review Date</th>
              <th>{{ moment(process.reviewDate).format("DD/MM/YYYY") }}</th>
            </tr>
          </thead>
        </table>
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col cols="6">
            <v-btn
              @click="dialog = false"
              variant="outlined"
              rounded="pill"
              block
              >Cancel</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="submit"
              :disabled="localData[coodinate.pro][coodinate.ind].note == ''"
              variant="outlined"
              rounded="pill"
              block
              >Submit Review</v-btn
            >
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";
import { computed } from "vue";

const props = defineProps(["items", "allData", "closeMe"]);
const emits = defineEmits(["submitData"]);
const store = useAppStore();
const localData = ref({});
const dialog = ref(false);
let process = ref(null);
let extLabel = { ...store.extBlabel, ...store.extLabel };
let coodinate = reactive({
  pro: "",
  ind: "",
});

let flatItems = computed(() => {
  const result = [];
  for (const process in localData.value) {
    const list = localData.value[process];
    list.forEach((item, index) => {
      result.push({
        process,
        ...item,
        index,
      });
    });
  }
  return result;
});

watch(dialog, (e) => {
  if (!e) {
    refresh();
  }
});

let localData2 = ref({});
// Flattened array from process-object into usable list

const user = store.userData.userName;

function refresh() {
  localData.value = JSON.parse(JSON.stringify(toRaw(props.items)));
  localData2.value = JSON.parse(JSON.stringify(toRaw(props.allData)));

  // if (localData2.value.rejectStep == "appearance") {
  //   let vv = {};
  //   localData.value.appearance.forEach((e, i) => {
  //     localData.value.appearance[i] = {
  //       label: store.extLabel[e[0]],
  //       judgement: e[1].judgement,
  //       input: e[1].input,
  //       standard: [localData2.value.appearanceData.standard[e[0]]],
  //       logic: { id: 8 },
  //     };
  //   });

  //   console.log(localData.value);
  // }

  Object.entries(localData.value).forEach(([key, value]) => {
    let x = {};
    value = value.map((i, k) => {
      i.note = i.note || "";
      i.action = i.action || null;
      i.inspector = i.inspector || user;
      i.reviewDate = i.reviewDate || moment().format("YYYY-MM-DD");
      return toRaw(i);
    });
    localData.value[key] = value;
  });
}

function actions(pro, ind) {
  dialog.value = true;

  coodinate.ind = ind;
  coodinate.pro = pro;

  process = localData.value[pro][ind];
}

function submit() {
  const { pro, ind } = coodinate;
  let data = {
    data: toRaw(localData.value),
    actions: localData.value[pro][ind].action,
  };
  emits("submitData", { ...data });
}

onBeforeMount(() => {
  refresh();
});
</script>
