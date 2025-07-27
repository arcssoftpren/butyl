<template>
  <v-data-table density="compact" :search="search" :items="reports">
    <template #top>
      <v-divider class="my-2"></v-divider>
      <v-row>
        <v-col cols="12">
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
            @click="openDialog('kneading', item)"
            density="compact"
            v-if="
              item.kneadingIns != null &&
              item.saNote.kneading.note == '' &&
              item.kneadingIns.judgement == 'NG'
            "
            block
            color="error"
            dark
          >
            NG
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.kneadingIns != null &&
              item.saNote.kneading.note != '' &&
              item.kneadingIns.judgement == 'NG'
            "
            block
            color="warning"
            dark
          >
            CA
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.kneadingIns == null &&
              item.saNote.kneading.note == '' &&
              item.kneadingIns.judgement == null
            "
            block
            color="primary"
            dark
          >
            Not Checked
          </v-btn>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('extruding', item)"
            density="compact"
            v-if="
              item.extrudingIns != null &&
              item.saNote.extruding.note == '' &&
              item.extrudingIns.judgement == 'NG'
            "
            block
            color="error"
            dark
          >
            NG
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.extrudingIns != null &&
              item.saNote.extruding.note != '' &&
              item.extrudingIns.judgement == 'NG'
            "
            block
            color="warning"
            dark
          >
            CA
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.extrudingIns == null &&
              item.saNote.extruding.note == '' &&
              item.extrudingIns.judgement == null
            "
            block
            color="primary"
            dark
          >
            Not Checked
          </v-btn>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('press', item)"
            density="compact"
            v-if="
              item.pressIns != null &&
              item.saNote.press.note == '' &&
              item.pressIns.judgement == 'NG'
            "
            block
            color="error"
            dark
          >
            NG
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.pressIns != null &&
              item.saNote.press.note != '' &&
              item.pressIns.judgement == 'NG'
            "
            block
            color="warning"
            dark
          >
            CA
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.partData.pressEnable == 1 &&
              item.pressIns == null &&
              item.saNote.press.note == '' &&
              item.pressIns.judgement == null
            "
            block
            color="primary"
            dark
          >
            Not Checked
          </v-btn>
          <span v-if="item.partData.pressEnable == 0">Disabled</span>
        </td>
        <td class="text-center">
          <v-btn
            @click="openDialog('outgoing', item)"
            density="compact"
            v-if="
              item.outgoingIns != null &&
              item.saNote.outgoing.note == '' &&
              item.pressIns.outgoingIns == 'NG'
            "
            block
            color="error"
            dark
          >
            NG
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.outgoingIns != null &&
              item.saNote.outgoing.note != '' &&
              item.pressIns.outgoingIns == 'NG'
            "
            block
            color="warning"
            dark
          >
            CA
          </v-btn>
          <v-btn
            density="compact"
            disabled=""
            v-if="
              item.partData.outGoingEnabled == 1 &&
              item.outgoingIns == null &&
              item.saNote.outgoing.note == '' &&
              item.pressIns.outgoingIns == ''
            "
            block
            color="primary"
            dark
          >
            Not Checked
          </v-btn>
          <span v-if="item.partData.outGoingEnabled == 0">Disabled</span>
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
        <v-table>
          <thead>
            <tr>
              <th rowspan="2" class="text-center">Inspection Item</th>
              <th rowspan="2" class="text-center">Standard</th>
              <th rowspan="2" class="text-center">Measurement tool</th>
              <th :colspan="selected.max" class="text-center">Result</th>
            </tr>
            <tr>
              <th
                class="text-center"
                v-for="(item, index) in selected.insObj.result"
                :key="index"
              >
                {{ index }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="selected.item.partData.heaterOn == 1">
              <td class="text-center">Heater Temperature</td>
              <td class="text-center">
                Check temperature at beginning of production
              </td>
              <td class="text-center">Non-contact Thermometer</td>
              <td class="text-center" :colspan="selected.max">
                {{ selected.item.heaterTemp }} °C
              </td>
            </tr>
            <tr v-if="selected.item.extAppData">
              <td class="text-center">Appearance Inspection</td>
              <td class="text-center">All Checked</td>
              <td class="text-center">Visual Check</td>
              <td
                :class="
                  selected.item.extAppData.judgement
                    ? 'text-center bg-grey-lighten-2'
                    : 'text-center bg-error'
                "
                :colspan="selected.max"
              >
                <div v-if="!selected.item.extAppData.judgement">NG</div>
                <div v-else>OK</div>
              </td>
            </tr>
            <tr v-if="selected.item.extAppData">
              <td :colspan="selected.max + 3" class="pa-5">
                <v-row>
                  <v-col cols="4">
                    <v-img :src="selected.actImage" height="250"></v-img>
                  </v-col>
                  <v-col cols="8">
                    <v-row>
                      <v-col
                        v-show="index != 'judgement' && index != 'pcsPerSheet'"
                        cols="6"
                        v-for="(item, index) in selected.item.extAppData"
                        :key="index"
                      >
                        <div>
                          <div class="text-uppercase">{{ index }} Surface</div>
                          <div
                            class="mb-2"
                            v-for="(item2, index2) in item"
                            :key="index2"
                          >
                            <v-chip
                              class="w-100"
                              :color="item2 ? 'success' : 'error'"
                              v-if="typeof item2 == 'boolean'"
                              close
                            >
                              <template #default>
                                {{ extBlabel[index2] }}
                                <span v-if="index2 == 'hole'">
                                  ({{
                                    selected.item.extAppData[index].holeCount
                                  }}
                                  Holes)
                                </span>
                              </template>
                              <template #prepend>
                                <v-icon
                                  :icon="item2 ? 'mdi-check' : 'mdi-close'"
                                >
                                </v-icon>
                              </template>
                            </v-chip>
                            <div
                              v-else
                              class="d-flex w-100 align-center justify-center"
                            >
                              <div
                                v-if="index2 != 'holeCount'"
                                class="w-100 text-center text-uppercase"
                                cols="6"
                              >
                                {{ index2 }} Hole: {{ item2 }}
                                <span class="text-lowercase">mm</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <h1 class="text-h6 w-100 text-center">
                          Sheet layout/ シートレイアウト:
                          {{ selected.item.extAppData.pcsPerSheet }} Pcs/sheet
                        </h1>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </td>
            </tr>
            <tr v-for="(item, index) in selected.inspectionData" :key="index">
              <td class="text-center">{{ item.itemLabel }}</td>
              <td class="text-center">{{ item.view.standard }}</td>
              <td class="text-center">{{ item.view.method.romaji }}</td>
              <td
                class="text-center"
                v-for="(itm, i) in selected.insObj.result"
                :key="i"
              >
                <div v-if="itm[index]">
                  <div v-if="itm[index].result == 'NG'" class="text-error">
                    {{ itm[index].input }}
                  </div>
                  <div v-else>
                    {{ itm[index].input }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-divider class="my-2"></v-divider>
        <v-btn
          @click="dialog2 = true"
          color="warning"
          class="my-2"
          block
          variant="outlined"
          rounded="pill"
          dark
        >
          Make Special Acceptance
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialog2"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <template #append>
        <v-btn flat icon @click="dialog2 = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #title>Special Acceptance Condition</template>
      <template #text>
        <v-textarea
          :error-messages="validate.saNote.$errors.map((e) => e.$message)"
          class="mt-2"
          label="Special Acceptance Note"
          rounded="xl"
          variant="outlined"
          rows="3"
          v-model="saForm.saNote"
        />
        <v-btn
          @click="addReport"
          block
          color="warning"
          rounded="pill"
          variant="outlined"
          dark
        >
          submit
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import moment from "moment";

const extBlabel = {
  releasePaperYellow: "Release Paper Yellow 離型紙 黄",
  releasePaperWhite: "Release Paper White 離型紙 白",
  filmNoShiwa: "Film (No Shiwa) フィルムシワなし",
  filmShiwa: "Film (Shiwa) フィルムシワあり",
  arumi: "Aluminum foil アルミ付き",
};
const dialog2 = ref(false);
const store = useAppStore();
const parts = ref([]);
const part = ref(null);
const search = ref("");
const reports = ref([]);
const dialog = ref(false);
const selected = ref(null);
const dialogData = reactive({
  title: "Create New Inspection",
  subtitle: "Please fill all required field bellow",
  icon: "mdi-new-box",
  key: "new",
});

const saForm = reactive({
  saNote: "",
  id: 0,
  step: "",
});

watch(dialog, (f) => {
  if (!f) part.value = null;
});

const rules = {
  saNote: {
    req: helpers.withMessage("This field is required", required),
  },
};

const validate = useVuelidate(rules, saForm);

const openDialog = (key, item) => {
  dialogData.key = key;
  saForm.step = key;
  saForm.id = item.id;
  switch (key) {
    case "kneading":
      selected.value = {
        insObj: item.kneadingIns,
        inspectionData: item.kneading,
        max: Object.keys(item.kneadingIns).length,
        item,
      };
      dialogData.icon = "mdi-magnifier";
      dialogData.title = "NG Review - Kneading";
      break;
    case "extruding":
      selected.value = {
        insObj: item.extrudingIns,
        inspectionData: item.extruding,
        max: Object.keys(item.extrudingIns).length,
        item,
        actImage: null,
      };

      store
        .ajax({ id: item.id }, "/parts/getactimage", "post", false)
        .then((e) => {
          selected.value.actImage = e;
        });
      store.preload = false;

      dialogData.icon = "mdi-magnifier";
      dialogData.title = "NG Review - Extruding";
      break;
    case "press":
      selected.value = {
        insObj: item.pressIns,
        inspectionData: item.press,
        max: Object.keys(item.pressIns).length,
        item,
      };
      dialogData.icon = "mdi-magnifier";
      dialogData.title = "NG Review - Press";
      break;
    case "outgoing":
      selected.value = {
        insObj: item.outgoingIns,
        inspectionData: item.outgoing,
        max: Object.keys(item.outgoingIns).length,
        item,
      };
      dialogData.icon = "mdi-magnifier";
      dialogData.title = "NG Review - Outgoing";
      break;
  }

  dialog.value = true;
};

const refresh = async () => {
  dialog.value = false;
  dialog2.value = false;
  parts.value = await store.ajax({}, "/parts", "post");
  reports.value = await store.ajax({}, "/inspection/getng", "post");

  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});

const addReport = async () => {
  try {
    const valid = await validate.value.$validate();
    if (valid) {
      store.preload = true;
      let data = {
        id: saForm.id,
        saNote: saForm.saNote,
        author: store.userData.userName,
        key: dialogData.key,
      };
      await store.ajax(data, "/inspection/sa", "post");
      refresh();
    }
  } catch (error) {}
};
</script>
