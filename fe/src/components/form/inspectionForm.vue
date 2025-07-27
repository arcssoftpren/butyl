<template>
  <div>
    <v-row v-if="parsedPos <= max">
      <v-col :cols="actImage ? '6' : '12'">
        <h1 class="text-h6">Part Drawing</h1>
        <v-img height="150" :src="partDrawing"></v-img>
      </v-col>
      <v-col cols="6" v-if="actImage">
        <h1 class="text-h6">Actual Image</h1>
        <v-img height="150" :src="actImage"></v-img>
      </v-col>

      <v-col cols="12">
        <div v-for="(item, index) in insObj" :key="index">
          <div v-if="index == npos" class="mb-2 h-100">
            <div class="h-100" v-for="(q, qindex) in item" :key="qindex">
              <v-card v-if="qindex == qpos && !q.disabled" class="mb-2">
                <template #prepend>
                  <h1 class="text-h4">{{ `${index}` }}</h1>
                </template>
                <template #title>{{ q.itemLabel }}</template>
                <template #subtitle>Standard: {{ q.view.standard }}</template>
                <template #text>
                  <div v-if="q.logicType == 9">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 8">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="text"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 7">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 6">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>

                  <div v-if="q.logicType == 5">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 4">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 3">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 2">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Inspection Result"
                      v-model="insObj[index][qindex].input"
                    />
                  </div>
                  <div v-if="q.logicType == 1">
                    <v-btn-toggle
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      class="w-100"
                      mandatory
                      v-model="insObj[index][qindex].input"
                    >
                      <v-btn class="w-50" color="success" value="OK">OK</v-btn>
                      <v-btn class="w-50" color="error" value="NG">NG</v-btn>
                    </v-btn-toggle>
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <v-btn
                    @click="submit(index, qindex)"
                    :disabled="
                      insObj[index][qindex].input == '' ||
                      insObj[index][qindex].input === null
                    "
                    block
                    color="primary"
                    dark
                    variant="outlined"
                    rounded="pill"
                  >
                    Submit
                  </v-btn>
                </template>
                <template #append>
                  <h1 class="text-h5">
                    <v-avatar
                      v-if="
                        store.checkLogic(
                          q.logicType,
                          q.standard,
                          insObj[index][qindex].input
                        )
                      "
                      color="success"
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-avatar>
                    <v-avatar v-else color="error">
                      <v-icon>mdi-close</v-icon>
                    </v-avatar>
                  </h1>
                </template>
              </v-card>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div class="w-100" v-if="parsedPos > max">
      <v-card>
        <template #title>SUMMARY</template>
        <template #text>
          <v-table density="compact">
            <thead></thead>
            <tbody>
              <tr v-if="partData.heaterOn == '1' && extruding">
                <td class="text-center">Dies temperature</td>
                <td class="text-center">
                  Check temperature at <br />beginning of production
                </td>
                <td class="text-center">Non-contact Thermometer</td>
                <td class="text-center">N=1</td>
                <td :colspan="max" class="text-center bg-success">
                  {{ heaterTemp }} °C
                </td>
              </tr>
              <tr v-if="extData && extruding && partData.extrudingType == 'c'">
                <td colspan="5" class="text-center">
                  <v-table density="compact">
                    <thead>
                      <tr class="text-uppercase text-center">
                        <th colspan="4" class="text-center">
                          Appearance Inspection
                        </th>
                      </tr>
                      <tr>
                        <th class="text-uppercase text-center">
                          Actual Picture
                        </th>
                        <th class="text-uppercase text-center">
                          Inspection Item
                        </th>
                        <th class="text-uppercase text-center">Standard</th>
                        <th class="text-uppercase text-center">result</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="text-uppercase"
                        v-show="index != 'judgement'"
                        v-for="(item, index) in extData"
                        :key="index"
                      >
                        <td
                          v-if="index == 'upper'"
                          :rowspan="Object.keys(extData).length + 1"
                        >
                          <v-img :src="actImage"></v-img>
                        </td>
                        <td v-if="index == 'upper' || index == 'bottom'">
                          {{ index }} Surface
                        </td>
                        <td v-if="index == 'sheetLayout'">
                          Sheet layout/ <br />シートレイアウト
                        </td>
                        <td
                          v-if="
                            index != 'upper' &&
                            index != 'bottom' &&
                            index != 'sheetLayout' &&
                            index != 'holeCount'
                          "
                        >
                          Hole Count
                        </td>
                        <td v-if="index == 'holeCount'">Hole {{ index }}</td>

                        <td v-if="index == 'upper' || index == 'bottom'">
                          {{ extBlabel[item.standard] }}
                        </td>
                        <td v-else>
                          {{ item.standard }}
                          <span
                            v-if="
                              index != 'sheetLayout' && index != 'holeCount'
                            "
                            class="text-lowercase"
                          >
                            mm
                          </span>
                          <span
                            v-if="
                              index != 'sheetLayout' && index == 'holeCount'
                            "
                            class="text-lowercase"
                          >
                            holes
                          </span>

                          <span
                            v-if="
                              index == 'sheetLayout' && index != 'holeCount'
                            "
                            class="text-lowercase"
                          >
                            pcs/sheet
                          </span>
                        </td>
                        <td
                          :class="
                            store.checkLogic(
                              item.logic,
                              [item.standard],
                              item.input
                            )
                              ? 'text-center bg-success'
                              : 'text-center bg-error'
                          "
                          v-if="index != 'upper' && index != 'bottom'"
                        >
                          {{ item.input }}
                        </td>
                        <td v-else>
                          {{ extBlabel[item.input] }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>

              <tr>
                <th colspan="5" class="text-center">EXTRUDING INSPECTION</th>
              </tr>
              <tr>
                <th rowspan="2" class="text-center">Inspection Item</th>
                <th rowspan="2" class="text-center">Standard</th>
                <th rowspan="2" class="text-center">Measurement tool</th>
                <th rowspan="2" class="text-center">N=</th>
                <th :colspan="max" class="text-center">Result</th>
              </tr>
              <tr>
                <th
                  class="text-center"
                  v-for="(item, index) in insObj"
                  :key="index"
                >
                  {{ index }}
                </th>
              </tr>
              <tr v-for="(item, index) in props.inspectionData" :key="index">
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center">{{ item.view.standard }}</td>
                <td class="text-center">{{ item.view.method.romaji }}</td>
                <td class="text-center">N={{ item.sampleQ }}</td>
                <td
                  :class="
                    itm[index].result == 'NG'
                      ? 'text-center bg-error'
                      : 'text-center bg-success'
                  "
                  v-for="(itm, i) in insObj"
                  :key="i"
                >
                  <div @click="goto(index, i)">
                    {{ itm[index].input }}
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="text-h6">
              <tr>
                <td class="text-center" colspan="4">Judgement</td>
                <td
                  :class="
                    resultArr.includes('NG')
                      ? 'text-center text-error'
                      : 'text-center text-success'
                  "
                  :colspan="max"
                >
                  {{ resultArr.includes("NG") ? "NG" : "OK" }}
                </td>
              </tr>
            </tfoot>
          </v-table>
          <small>
            *Ketuk hasil jika ingin melakukan perbaikan kesalahan.
          </small>
          <v-divider></v-divider>
          <v-btn
            @click="final"
            class="my-5"
            block
            :color="resultArr.includes('NG') ? 'error' : 'success'"
            variant="outlined"
            rounded="pill"
            :text="resultArr.includes('NG') ? 'report ng' : 'submit report'"
          >
          </v-btn>
        </template>
      </v-card>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";

let props = defineProps([
  "inspectionData",
  "partNumber",
  "extData",
  "actImageUrl",
  "heaterTemp",
  "partData",
  "insId",
  "extruding",
]);
const actImage = ref(null);
const emits = defineEmits(["emitData"]);
const insObj = ref({});
const iData = props.inspectionData;
let max;
const npos = ref("N1");
const qpos = ref(0);
const store = useAppStore();
const resultArr = ref([]);
const partDrawing = ref(null);
const parsedPos = ref(parseInt(npos.value.replace("N", "")));
const edit = ref(false);

let n = 1;
let nArr = iData.map((element) => {
  return element.sampleQ;
});
max = Math.max(...nArr);

const labelArr = ref(Array(max).fill(0));

const extBlabel = {
  hole: "Hole",
  releasePaperYellow: "Release Paper Yellow 離型紙 黄",
  releasePaperWhite: "Release Paper White 離型紙 白",
  filmNoShiwa: "Film (No Shiwa) フィルムシワなし",
  filmShiwa: "Film (Shiwa) フィルムシワあり",
  arumi: "Aluminum foil アルミ付き",
};

onMounted(async () => {
  nextTick().then(async () => {
    labelArr.value.forEach((e, index) => {
      const label = `N${n}`;
      let item = [];
      iData.forEach((i) => {
        const clone = {
          ...JSON.parse(JSON.stringify(i)), // deep clone
          input: null,
          result: null,
          disabled: i.sampleQ < n,
        };
        item.push(clone);
      });
      labelArr[index] = label;
      insObj.value[label] = item;
      n++;
    });
    const drURL = await store.ajax(
      { partNumber: props.partNumber },
      "/parts/getdrawing",
      "post",
      false
    );
    store
      .ajax({ id: props.insId }, "/parts/getactimage", "post", false)
      .then((e) => {
        actImage.value = e;
      })
      .catch((e) => {
        actImage.value = props.actImageUrl;
      });
    partDrawing.value = drURL;
    store.preload = false;
  });
});
const goto = (index, pos) => {
  edit.value = true;
  npos.value = pos;
  qpos.value = index;
};

const submit = (index, qindex) => {
  let data = insObj.value[index][qindex];

  if (!data.disabled) {
    resultArr.value = [];
    if (props.extData) {
      resultArr.value.push(props.extData.judgement ? "OK" : "NG");
    }
    const standard = data.standard;
    const input = data.input;
    const result = store.checkLogic(data.logicType, standard, input)
      ? "OK"
      : "NG";

    insObj.value[index][qindex].result = result;
    Object.keys(insObj.value).forEach((index) => {
      const dt = insObj.value[index];
      dt.forEach((d) => {
        resultArr.value.push(d.result);
      });
    });
  }

  if (!edit.value) {
    let next = checkNext(index, qindex);
    if (!next) {
      const pos = parseInt(npos.value.replace("N", ""));
      if (pos <= max) {
        npos.value = `N${pos + 1}`;
        qpos.value = 0;
      }
    } else {
      qpos.value++;
    }

    isDisabled(npos.value, qpos.value);
  } else {
    npos.value = `N${max + 1}`;
  }
};

const isDisabled = (index, pos) => {
  if (insObj.value[index]) {
    let disabled = insObj.value[index][pos].disabled;
    if (disabled) {
      submit(index, pos);
    }
  }
};

function checkNext(index, pos) {
  return insObj.value[index][pos + 1];
}

watch(npos, (a) => {
  parsedPos.value = parseInt(a.replace("N", ""));
});

const final = () => {
  const emitData = {
    inspectionDate: moment().format("YYYY-MM-HH"),
    inspector: store.userData.userName,
    result: insObj.value,
    judgement: resultArr.value.includes("NG") ? "NG" : "OK",
  };

  nextTick().then(() => {
    console.log("...emiting");
    emits("emitData", { ...emitData });
  });
};
</script>
