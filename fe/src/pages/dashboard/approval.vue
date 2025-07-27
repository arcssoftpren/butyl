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
        <th class="text-center">Approve</th>
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
        <td>
          <v-btn
            @click="openDialog(item)"
            block
            color="primary"
            rounded="pill"
            density="compact"
            dark
          >
            Preview
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" :overlay="false" transition="dialog-transition">
    <v-card v-if="togle">
      <template #title>{{ dialogData.title }}</template>
      <template #subtitle>{{ dialogData.subtitle }}</template>
      <template #append>
        <v-btn flat icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #text>
        <div v-for="(iter, iterInd) in iterator" :key="iterInd">
          <v-card class="mb-2" v-if="iter.view">
            <template #title>
              <div class="text-uppercase">
                {{ iter.inspectionData }} Item
              </div></template
            >
            <template #text>
              <v-table>
                <thead>
                  <tr>
                    <th rowspan="2" class="text-center">No</th>
                    <th rowspan="2" class="text-center">Inspection Item</th>
                    <th rowspan="2" class="text-center">Standard</th>
                    <th rowspan="2" class="text-center">Measurement tool</th>
                    <th :colspan="selected[iter.max]" class="text-center">
                      Result
                    </th>
                  </tr>
                  <tr>
                    <th
                      v-for="(i, ind) in selected[iter.insObj].result"
                      :key="ind"
                    >
                      {{ ind }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in selected[iter.inspectionData]"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ item.itemLabel }}</td>
                    <td class="text-center">{{ item.view.standard }}</td>
                    <td class="text-center">{{ item.view.method.romaji }}</td>
                    <td
                      :class="
                        i[index].result == 'NG'
                          ? 'text-error font-weight-bold'
                          : ''
                      "
                      v-for="(i, ind) in selected[iter.insObj].result"
                      :key="ind"
                    >
                      {{ i[index].input }}
                    </td>
                  </tr>
                  <tr>
                    <th colspan="4" class="text-end">Inspector</th>
                    <th :colspan="selected[iter.max]" class="text-center">
                      {{ selected[iter.insObj].inspector }}
                    </th>
                  </tr>
                </tbody>
              </v-table>

              <div v-if="selected.saNote[iter.inspectionData].author">
                <v-divider class="mb-5"></v-divider>
                <v-table>
                  <thead>
                    <tr>
                      Special Acceptance
                    </tr>
                    <tr>
                      <th class="w-100">Note</th>
                      <th class="text-no-wrap">Accepted By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{ selected.saNote[iter.inspectionData].note }}
                      </td>
                      <td class="text-no-wrap">
                        {{ selected.saNote[iter.inspectionData].author }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </template>
          </v-card>
        </div>
      </template>
    </v-card>
    <v-card>
      <template #title>{{ dialogData.title }}</template>
      <template #subtitle>{{ dialogData.subtitle }}</template>
      <template #append>
        <v-btn flat icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #text>
        <div class="a4-wrapper">
          <div class="a4">
            <a4Viewer :selected="selected"></a4Viewer>
          </div>
        </div>
        <v-btn class="mt-5" block color="primary" dark>Approve</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.a4-wrapper {
  width: 100%;
  height: 70vh; /* atau tinggi tetap lain, misal: 600px */
  overflow: auto;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center; /* tengah secara horizontal */
  align-items: flex-start; /* atas secara vertikal */
}

.a4 {
  width: 1100px;
  height: 1556px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 5mm;
  font-family: "MS PGothic", "MS PGothic Regular", sans-serif;
  box-sizing: border-box;
}
</style>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import moment from "moment";

const togle = ref(false);

const dialog2 = ref(false);
const store = useAppStore();
const parts = ref([]);
const part = ref(null);
const currentYear = moment().format("YYYY");
const years = ref(Array.from({ length: 21 }, (_, i) => currentYear - 10 + i));
const search = ref("");
const reports = ref([]);
const dialog = ref(false);
const selected = ref(null);
const dialogData = reactive({
  title: "Inspection Approval",
  subtitle: "Preview the inspection before approval",
  icon: "mdi-drawing",
  key: "new",
});

const iterator = ref([
  {
    inspectionData: "kneading",
    insObj: "kneadingIns",
    max: "kneadingMax",
    view: false,
  },
  {
    inspectionData: "extruding",
    insObj: "extrudingIns",
    max: "extrudingMax",
    view: false,
  },
  {
    inspectionData: "press",
    insObj: "pressIns",
    max: "pressMax",
    view: false,
  },
  {
    inspectionData: "outgoing",
    insObj: "outgoinIns",
    max: "outgoingMax",
    view: false,
  },
]);

const saForm = reactive({
  saNote: "",
  id: 0,
});

watch(part, (e) => {
  console.log(e);
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

const openDialog = (item) => {
  selected.value = item;
  dialog.value = true;

  let kneadingnArr = item.kneading.map((element) => {
    return element.sampleQ;
  });
  selected.value["kneadingMax"] = Math.max(...kneadingnArr);

  let extrudingnArr = item.extruding.map((element) => {
    return element.sampleQ;
  });
  selected.value["extrudingMax"] = Math.max(...extrudingnArr);

  if (item.pressEnable == 1) {
    let pressnArr = item.press.map((element) => {
      return element.sampleQ;
    });
    selected.value["pressMax"] = Math.max(...pressnArr);
    iterator.value[2].view = true;
  } else {
    iterator.value[2].view = false;
  }

  if (item.outGoingEnabled == 1) {
    let outgoingnArr = item.outgoing.map((element) => {
      return element.sampleQ;
    });
    selected.value["outgoingMax"] = Math.max(...outgoingnArr);
    iterator.value[3].view = true;
  } else {
    iterator.value[3].view = false;
  }
  iterator.value[0].view = true;
  iterator.value[1].view = true;
};

const refresh = async () => {
  dialog.value = false;
  dialog2.value = false;
  parts.value = await store.ajax({}, "/parts", "post");
  reports.value = await store.ajax({}, "/inspection", "post");
  reports.value = reports.value.filter((e) => {
    const { kneadingIns, extrudingIns, pressIns, outgoingIns, partData } = e;
    const { pressEnable, outGoingEnabled } = partData;

    const isKneadingDone = kneadingIns !== null;
    const isExtrudingDone = extrudingIns !== null;
    const isPressDone = pressEnable === "1" ? pressIns !== null : true;
    const isOutgoingDone =
      outGoingEnabled === "1" ? outgoingIns !== null : true;

    return isKneadingDone && isExtrudingDone && isPressDone && isOutgoingDone;
  });
  reports.value = await Promise.all(
    reports.value.map((e) => {
      e.saNotes = {};
      if (e.saNote != null) {
        e.saNote = JSON.parse(e.saNote);
      }
      return e;
    })
  );
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
      await store.ajax(saForm, "/inspection/aprove", "post");
      refresh();
    }
  } catch (error) {}
};
</script>
