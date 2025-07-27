<template>
  <v-toolbar density="compact" color="transparent">
    <template #title>
      <v-btn-toggle
        variant="tonal"
        density="compact"
        mandatory
        v-model="filter"
      >
        <v-btn value="date" color="success">Daily</v-btn>
        <v-btn value="month" color="success">Monthly</v-btn>
        <v-btn value="year" color="success">Annual</v-btn>
        <v-btn value="all" color="success">All</v-btn>
      </v-btn-toggle>
    </template>
    <template #append>
      <v-btn
        @click="openDialog('new')"
        variant="outlined"
        rounded="pill"
        prepend-icon="mdi-plus"
      >
        Initiate Inspection
      </v-btn>
    </template>
  </v-toolbar>
  <v-data-table density="compact" :search="search" :items="reports">
    <template #top>
      <v-divider class="my-2"></v-divider>
      <v-row>
        <v-col cols="9">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="Search Data"
            variant="outlined"
            rounded="pill"
            density="compact"
            v-model="search"
            type="text"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            variant="outlined"
            rounded="pill"
            density="compact"
            v-model="date"
            type="date"
            v-if="filter == 'date'"
          />
          <v-text-field
            variant="outlined"
            rounded="pill"
            density="compact"
            v-model="month"
            type="month"
            v-if="filter == 'month'"
          />
          <v-autocomplete
            v-if="filter == 'year'"
            v-model="year"
            :items="years"
            label="Year"
            variant="outlined"
            rounded="pill"
            density="compact"
            hideDetails=""
          />
        </v-col>
      </v-row>
    </template>
    <template #headers>
      <tr class="text-uppercase">
        <th class="text-center">No</th>
        <th class="text-no-wrap">
          Part Number <br />
          <small>Part Name</small>
        </th>
        <th class="text-center text-no-wrap">Delivery Date</th>
        <th class="text-center text-no-wrap">Order Number</th>
        <th class="text-center">Kneading</th>
        <th class="text-center">Extruding</th>
        <th class="text-center">Press</th>
        <th class="text-center">Outgoing</th>
      </tr>
    </template>
    <template #item="{ item, index }">
      <tr class="text-uppercase">
        <td class="text-center">{{ index + 1 }}</td>
        <td class="text-no-wrap">
          {{ item.partNumber }} <br />
          <small>{{ item.partData.partName }}</small>
        </td>
        <td class="text-center">
          {{
            item.deliveryDate
              ? moment(item.deliveryDate).format("DD/MM/YYYY")
              : "-"
          }}
        </td>
        <td class="text-center">
          {{ item.orderNumber != "not required" ? item.orderNumber : "-" }}
        </td>
        <td class="text-center">
          <v-btn
            block=""
            @click="openDialog('kneading', item)"
            :disabled="!isValid('kneading', item)"
            v-if="item.kneadingIns == null"
            density="compact"
            color="primary"
            rounded="pill"
          >
            Check
          </v-btn>
          <v-btn
            disabled
            block
            v-else
            density="compact"
            rounded="pill"
            :color="item.kneadingIns.judgement == 'OK' ? 'success' : 'warning'"
            :text="item.kneadingIns.judgement == 'OK' ? 'OK' : 'CA'"
          >
          </v-btn>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('extruding', item)"
            :disabled="!isValid('extruding', item)"
            v-if="item.extrudingIns == null"
            density="compact"
            color="primary"
            rounded="pill"
          >
            Check
          </v-btn>
          <v-btn
            disabled
            block
            v-else
            density="compact"
            rounded="pill"
            :color="item.extrudingIns.judgement == 'OK' ? 'success' : 'error'"
          >
            {{ item.extrudingIns.judgement }}
          </v-btn>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('press', item)"
            :disabled="!isValid('press', item)"
            v-if="item.pressIns == null && item.partData.pressEnable == '1'"
            density="compact"
            color="primary"
            rounded="pill"
          >
            Check
          </v-btn>
          <v-btn
            disabled
            block
            v-if="item.pressIns != null"
            density="compact"
            rounded="pill"
            :color="item.pressIns.judgement == 'OK' ? 'success' : 'error'"
          >
            {{ item.pressIns.judgement }}
          </v-btn>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('outgoing', item)"
            :disabled="!isValid('outgoing', item)"
            v-if="
              item.outgoingIns == null && item.partData.outGoingEnabled == '1'
            "
            density="compact"
            color="primary"
            rounded="pill"
          >
            Check
          </v-btn>
          <v-btn
            disabled
            block
            v-if="item.outgoingIns != null"
            density="compact"
            rounded="pill"
            :color="item.outgoingIns.judgement == 'OK' ? 'success' : 'error'"
          >
            {{ item.outgoingIns.judgement }}
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    transition="dialog-transition"
  >
    <v-card>
      <template #title>{{ dialogData.title }}</template>
      <template #subtitle>{{ dialogData.subtitle }}</template>
      <template #append>
        <v-btn flat icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #text>
        <div class="pt-2" v-if="dialogData.key == 'new'">
          <newInspectionForm :close-me="refresh" />
        </div>
        <div v-if="dialogData.key == 'kneading'">
          <kneadingInspection
            :part-number="selected.partNumber"
            v-on:kneading-add="addReport($event, 'kneading')"
            :selected-data="selected"
            v-if="selected.partData.kneadingType == 'a'"
          />
          <inspectionForm
            :ins-id="selected.id"
            :heater-temp="selected.heaterTemp"
            :part-data="selected.partData"
            :act-image-url="actPreview"
            :ext-data="selected.extAppData"
            :part-number="selected.partNumber"
            v-on:emit-data="addReport($event, 'kneading')"
            :inspection-data="selected.kneading"
            v-else
          />
        </div>

        <div v-if="dialogData.key == 'extruding'">
          <div v-if="extStep == 1">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  density="compact"
                  class="mt-2"
                  rounded="pill"
                  variant="outlined"
                  label="Dies Temperature "
                  hide-details=""
                  hide-spin-buttons=""
                  v-model="selected.heaterTemp"
                  type="number"
                >
                  <template #append-inner> °C </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-btn
                  :disabled="selected.heaterTemp == 0"
                  rounded="pill"
                  variant="outlined"
                  class="mt-2"
                  block
                  color="primary"
                  dark
                  @click="extStep++"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
          </div>
          <div v-if="extStep == 2">
            <div class="w-100">
              <v-row>
                <v-col cols="12">
                  <div v-if="selected.partData.extrudingType == 'c'">
                    <v-row>
                      <v-col cols="3">
                        <v-img height="300" :src="actPreview" />
                        <v-btn
                          @click="() => inputFile?.click()"
                          block
                          variant="outlined"
                          rounded="pill"
                          dark
                          prepend-icon="mdi-camera"
                          >Take Picture</v-btn
                        >
                      </v-col>
                      <v-col cols="9">
                        Standards
                        <v-divider></v-divider>
                        <v-table striped="even" fixed-header="" height="320">
                          <thead>
                            <tr>
                              <th class="text-center">Surface</th>

                              <th class="text-center">Check Item</th>

                              <th class="text-center">Standard</th>
                              <th class="text-center" width="200">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Layout</th>
                              <th class="text-center text-no-wrap">
                                Sheet layout/ <br />シートレイアウト
                              </th>
                              <th class="text-center">
                                {{ selected.appInsResult.sheetLayout.standard }}
                                Pcs/sheet
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  @keyup="
                                    verify(
                                      selected.appInsResult.sheetLayout,
                                      'sheetLayout'
                                    )
                                  "
                                  name="name"
                                  label="Sheet layout/ シートレイアウト"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="
                                    selected.appInsResult.sheetLayout.input
                                  "
                                  hide-details=""
                                >
                                  <template #append-inner>Pcs/sheet</template>
                                </v-text-field>
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center-2" rowspan="6">
                                Upper Surface
                              </th>
                              <th class="text-center">
                                Aluminum foil <br />
                                アルミ付き
                              </th>
                              <th class="text-center">
                                <input type="checkbox" checked disabled />
                              </th>
                              <th>
                                <v-checkbox-btn
                                  :label="extBlabel['arumi']"
                                  density="compact"
                                  hide-details=""
                                  v-model="selected.appInsResult.upper.input"
                                  value="arumi"
                                  @change="
                                    verify(selected.appInsResult.upper, 'upper')
                                  "
                                />
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center">Hole Count</th>
                              <th class="text-center">
                                {{ selected.appInsResult.holeCount.standard }}
                                holes
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  @keyup="
                                    verify(
                                      selected.appInsResult.holeCount,
                                      'holeCount'
                                    )
                                  "
                                  name="name"
                                  label="Hole Count"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="
                                    selected.appInsResult.holeCount.input
                                  "
                                  hide-details=""
                                >
                                  <template #append-inner>Pcs/sheet</template>
                                </v-text-field>
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center">Hole A</th>
                              <th class="text-center">
                                {{ selected.appInsResult.a.standard }}
                                mm
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  hide-details=""
                                  @keyup="verify(selected.appInsResult.a, 'a')"
                                  name="name"
                                  label="Hole A"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="selected.appInsResult.a.input"
                                >
                                  <template #append-inner>mm</template>
                                </v-text-field>
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center">Hole B</th>
                              <th class="text-center">
                                {{ selected.appInsResult.b.standard }}
                                mm
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  hide-details=""
                                  @keyup="verify(selected.appInsResult.b, 'b')"
                                  name="name"
                                  label="Hole B"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="selected.appInsResult.b.input"
                                >
                                  <template #append-inner>mm</template>
                                </v-text-field>
                              </th>
                            </tr>

                            <tr>
                              <th class="text-center">Hole C</th>
                              <th class="text-center">
                                {{ selected.appInsResult.c.standard }}
                                mm
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  hide-details=""
                                  @keyup="verify(selected.appInsResult.c, 'c')"
                                  name="name"
                                  label="Hole C"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="selected.appInsResult.c.input"
                                >
                                  <template #append-inner>mm</template>
                                </v-text-field>
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center">Hole D</th>
                              <th class="text-center">
                                {{ selected.appInsResult.d.standard }}
                                mm
                              </th>
                              <th class="py-3">
                                <v-text-field
                                  hide-details=""
                                  @keyup="verify(selected.appInsResult.d, 'd')"
                                  name="name"
                                  label="Hole D"
                                  variant="outlined"
                                  rounded="pill"
                                  density="compact"
                                  v-model="selected.appInsResult.d.input"
                                >
                                  <template #append-inner>mm</template>
                                </v-text-field>
                              </th>
                            </tr>
                            <tr>
                              <th rowspan="2">Bottom Surface</th>
                              <th rowspan="2">Release Paper</th>
                              <th rowspan="2">
                                {{
                                  extBlabel[
                                    selected.appInsResult.bottom.standard
                                  ]
                                }}
                              </th>
                              <th class="py-5">
                                <v-checkbox-btn
                                  :label="extBlabel['releasePaperYellow']"
                                  density="compact"
                                  hide-details=""
                                  v-model="selected.appInsResult.bottom.input"
                                  value="releasePaperYellow"
                                  @change="
                                    verify(
                                      selected.appInsResult.bottom,
                                      'bottom'
                                    )
                                  "
                                />
                              </th>
                            </tr>
                            <tr>
                              <th>
                                <v-checkbox-btn
                                  density="compact"
                                  hide-details=""
                                  :label="extBlabel['releasePaperWhite']"
                                  v-model="selected.appInsResult.bottom.input"
                                  value="releasePaperWhite"
                                  @change="
                                    verify(
                                      selected.appInsResult.bottom,
                                      'bottom'
                                    )
                                  "
                                />
                              </th>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-card class="w-100">
                    <template #title>
                      <v-btn
                        @click="extStep++"
                        :disabled="selected.actImage == null"
                        block
                        variant="outlined"
                        rounded="pill"
                        :color="
                          selected.appInsResult.judgement ? 'primary' : 'error'
                        "
                        :text="
                          selected.appInsResult.judgement
                            ? 'Submit'
                            : 'Submit NG'
                        "
                      />
                    </template>
                  </v-card>
                </v-col>
              </v-row>
              <v-file-input
                type="file"
                capture="environment"
                ref="inputFile"
                v-model="selected.actImage"
                class="d-none"
              />
            </div>
          </div>
          <inspectionForm
            :extruding="true"
            :ins-id="selected.id"
            :heater-temp="selected.heaterTemp"
            :part-data="selected.partData"
            :act-image-url="actPreview"
            :ext-data="selected.appInsResult"
            v-if="extStep == 3"
            :part-number="selected.partNumber"
            v-on:emit-data="addReport($event, 'extruding')"
            :inspection-data="selected.extruding"
          />
        </div>
        <div v-if="dialogData.key == 'press'">
          <inspectionForm
            :ins-id="selected.id"
            :heater-temp="selected.heaterTemp"
            :part-data="selected.partData"
            :act-image-url="actPreview"
            :ext-data="selected.extAppData"
            :part-number="selected.partNumber"
            v-on:emit-data="addReport($event, 'press')"
            :inspection-data="selected.press"
          />
        </div>
        <div v-if="dialogData.key == 'outgoing'">
          <!--  -->
          <inspectionForm
            :heater-temp="selected.heaterTemp"
            :part-data="selected.partData"
            :act-image-url="actPreview"
            :ins-id="selected.id"
            :ext-data="selected.extAppData"
            :part-number="selected.partNumber"
            v-on:emit-data="addReport($event, 'outgoing')"
            :inspection-data="selected.outgoing"
          />
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";
import defaultImage from "@/assets/defaultDesign.png";

const appResultArr = ref([]);
const store = useAppStore();
const month = ref(moment().format("YYYY-MM"));
const date = ref(moment().format("YYYY-MM-DD"));
const year = ref(moment().format("YYYY"));
const filter = ref("all");
const parts = ref([]);
const part = ref(null);
const currentYear = moment().format("YYYY");
const years = ref(Array.from({ length: 21 }, (_, i) => currentYear - 10 + i));
const search = ref("");
const reports = ref([]);
const dialog = ref(false);
const selected = ref(null);
const extStep = ref(1);
const inputFile = ref(null);
const actPreview = ref(defaultImage);
const dialogData = reactive({
  title: "Create New Inspection",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});
const extBlabel = {
  releasePaperYellow: "Release Paper Yellow\n離型紙 黄",
  releasePaperWhite: "Release Paper White\n離型紙 白",
  filmNoShiwa: "Film (No Shiwa)\nフィルムシワなし",
  filmShiwa: "Film (Shiwa)\nフィルムシワあり",
  arumi: "Aluminum foil\nアルミ付き",
};

function verify(item, index) {
  const valid = store.checkLogic(item.logic, [item.standard], item.input);
  if (!valid) {
    const dupe = appResultArr.value.find((e) => e == index);
    if (dupe == undefined) {
      appResultArr.value.push(index);
    }
  } else {
    const dupe = appResultArr.value.findIndex((e) => e == index);
    if (dupe !== -1) {
      appResultArr.value.splice(dupe, 1);
    }
  }

  selected.value.appInsResult.judgement = appResultArr.value.length < 1;
}

watch(dialog, (e) => {
  if (!e) {
    refresh();
  }
});

watch(
  () => selected.value?.actImage,
  async (e) => {
    if (e != null) {
      actPreview.value = await store.fileToDataURL(e);
    } else {
      actPreview.value = defaultImage;
    }
  }
);

watch(filter, () => {
  refresh();
});
watch(part, (e) => {
  console.log(e);
});

watch(dialog, (f) => {
  if (!f) part.value = null;
});

watch(month, () => {
  refresh();
});

watch(date, () => {
  refresh();
});

watch(year, () => {
  refresh();
});

const openDialog = (key, item) => {
  dialogData.key = key;
  if (item) {
    item.appInsResult.judgement = false;
  }
  switch (key) {
    case "new":
      dialogData.icon = "mdi-new-box";
      dialogData.title = "Create New Inspection";
      break;
    case "kneading":
      selected.value = item;
      dialogData.icon = "mdi-ruler-square";
      dialogData.title = "Kneading Inspection";
      break;
    case "extruding":
      selected.value = item;
      dialogData.icon = "mdi-ruler-square";
      dialogData.title = "Extruding Inspection";

      const heaterOn = item.partData.heaterOn == "1";
      const extType = item.partData.extrudingType;
      let extData = {};

      switch (extType) {
        case "a":
          extStep.value = 3;
          break;
        case "b":
          selected.value.actImage = null;
          extStep.value = 2;
          extData = {
            upper: {},
            bottom: {},
            judgement: false,
            pcsPerSheet: 0,
          };

          const extAppItems = JSON.parse(item.partData.extAppItems);
          extAppItems.upper.forEach((key) => {
            extData.upper[key] = false;
            if (key == "hole") {
              extData.upper["holeCount"] = 0;
            }
          });

          // Isi bottom (jika perlu juga)
          extAppItems.bottom.forEach((key) => {
            extData.bottom[key] = false;
            if (key == "hole") {
              extData.bottom["holeCount"] = 0;
            }
          });
          break;
        case "c":
          appResultArr.value = [
            "upper",
            "bottom",
            "sheetLayout",
            "holeCount",
            "a",
            "b",
            "c",
            "d",
          ];
          selected.value.actImage = null;
          extData = {
            upper: {
              arumi: false,
              hole: false,
              holeCount: 0,
              a: 0,
              b: 0,
              c: 0,
              d: 0,
            },
            bottom: {
              releasePaperYellow: false,
              releasePaperWhite: false,
            },
            pcsPerSheet: 0,
            judgement: false,
          };
          extStep.value = 2;
          break;
      }

      if (heaterOn) {
        extStep.value = 1;
        selected.value.heaterTemp = 0;
      } else {
        selected.value.heaterTemp = null;
      }

      selected.value.extAppData = extData;
      break;
    case "press":
      selected.value = item;
      dialogData.icon = "mdi-ruler-square";
      dialogData.title = "Press Inspection";
      break;
    case "outgoing":
      selected.value = item;
      dialogData.icon = "mdi-ruler-square";
      dialogData.title = "Outgoing Inspection";
      break;
  }

  dialog.value = true;
};

const refresh = async () => {
  actPreview.value = defaultImage;
  const e = filter.value;
  let data;
  switch (e) {
    case "date":
      data = { date: date.value };
      break;
    case "month":
      data = { month: month.value };
      break;
    case "year":
      data = { year: year.value };
      break;
    case "all":
      data = {};
      break;
  }
  dialog.value = false;
  parts.value = await store.ajax({}, "/parts", "post");
  reports.value = await store.ajax(data, "/inspection", "post");

  reports.value = reports.value.filter((e) => {
    const { kneadingIns, extrudingIns, pressIns, outgoingIns, partData } = e;
    const { pressEnable, outGoingEnabled } = partData;

    const isKneadingDone = kneadingIns !== null;
    const isExtrudingDone = extrudingIns !== null;
    const isPressDone = pressEnable === "1" ? pressIns !== null : true;
    const isOutgoingDone =
      outGoingEnabled === "1" ? outgoingIns !== null : true;

    return !(
      isKneadingDone &&
      isExtrudingDone &&
      isPressDone &&
      isOutgoingDone
    );
  });

  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});

const addReport = async (item, step) => {
  switch (step) {
    case "kneading":
      selected.value.kneadingIns = item;
      break;
    case "extruding":
      selected.value.extrudingIns = item;
      break;
    case "press":
      selected.value.pressIns = item;
      break;
    case "outgoing":
      selected.value.outgoingIns = item;
      break;
  }

  dialog.value = false;

  const judgement = item.judgement;
  let appDataJudgement = selected.value.extAppData
    ? selected.value.extAppData.judgement
    : true;

  const fd = new FormData();

  Object.entries(selected.value).forEach(([key, value]) => {
    if (value instanceof File || value instanceof Blob) {
      // File atau blob: langsung append
      fd.append(key, value);
    } else if (value instanceof FileList) {
      // Jika FileList (multi-file), tambahkan satu per satu
      Array.from(value).forEach((file, index) => {
        fd.append(`${key}[${index}]`, file);
      });
    } else if (value === "" || value === null) {
      // Empty string dianggap null
      return;
    } else if (value !== null && typeof value === "object") {
      // Object selain file → stringified
      fd.append(key, JSON.stringify(value));
    } else {
      // Value biasa
      fd.append(key, value);
    }
  });

  await store.ajax(
    fd,
    judgement == "OK" && appDataJudgement
      ? "/inspection/edit"
      : "/inspection/ng",
    "post",
    true
  );

  refresh();
};

function isValid(step, data) {
  const { kneadingIns, extrudingIns, pressIns, outgoingIns, partData } =
    data || {};

  const pressRequired = partData?.pressEnable === "1";
  const outgoingRequired = partData?.outGoingEnabled === "1";

  const userAccess = store.userData.inspectionAccess;

  const stepDone = {
    kneading: !!kneadingIns,
    extruding: !!extrudingIns,
    press: !!pressIns,
    outgoing: !!outgoingIns,
  };

  if (userAccess) {
    if (!userAccess.includes(step)) return false;
  }

  switch (step) {
    case "kneading":
      return true;

    case "extruding":
      return stepDone.kneading;

    case "press":
      // press hanya dilakukan kalau kneading + extruding selesai
      return stepDone.kneading && stepDone.extruding;

    case "outgoing":
      // outgoing hanya aktif kalau kneading + extruding selesai
      // serta press selesai jika press dibutuhkan
      return (
        stepDone.kneading &&
        stepDone.extruding &&
        (!pressRequired || stepDone.press) &&
        outgoingRequired
      );

    default:
      return false;
  }
}
</script>
