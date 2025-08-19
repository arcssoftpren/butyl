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

          <td class="text-center">
            <v-btn
              prepend-icon="mdi-pencil"
              @click="openDialog('edit', item)"
              variant="outlined"
              density="compact"
              rounded="pill"
            >
              edit
            </v-btn>
          </td>
          <td class="text-center">
            <v-btn
              density="compact"
              variant="outlined"
              rounded="pill"
              block
              @click="openDialog('open', item)"
              >Open</v-btn
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
          <th class="text-center">Header</th>
          <th class="text-center">Review</th>
        </tr>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      fullscreen
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            flat=""
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <div class="a4-wrapper">
            <div class="a4">
              <table
                ref="table"
                :style="`transform:scale(${scale});transform-origin: left top;`"
                class="mytable2 text-black bg-white"
              >
                <tbody id="header" class="processHeader">
                  <tr>
                    <td
                      style="border: none !important"
                      class="text-end"
                      colspan="16"
                    >
                      PT. Softpren Industries Indonesia
                    </td>
                  </tr>
                  <tr>
                    <td colspan="16" class="text-center text-h4">
                      PART INSPECTION REPORT
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">Customer</td>
                    <td class="text-center" colspan="5">
                      {{ selected.insData.partData.customer }}
                    </td>
                    <td colspan="2">Product number</td>
                    <td colspan="6" class="text-center">
                      {{ selected.insData.partData.partNumber }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">Product name</td>
                    <td class="text-center" colspan="5">
                      {{ selected.insData.partData.partName }}
                    </td>
                    <td colspan="2">Size</td>
                    <td class="text-center" colspan="4">
                      {{
                        parseFloat(selected.insData.partData.thickness).toFixed(
                          0
                        )
                      }}
                      X
                      {{
                        parseFloat(selected.insData.partData.width).toFixed(0)
                      }}
                      X
                      {{
                        parseFloat(selected.insData.partData.length).toFixed(0)
                      }}
                      mm
                    </td>
                    <td class="text-center">SG</td>
                    <td class="text-center">
                      {{ parseFloat(selected.insData.partData.sg).toFixed(1) }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">Produced QTY</td>
                    <td class="text-center" colspan="5">
                      {{ selected.prodQty }}
                    </td>
                    <td
                      colspan="2"
                      v-if="selected.headerData.deliveryDate != ''"
                    >
                      Delivery date
                    </td>

                    <td colspan="2" v-else>Order No</td>
                    <td
                      colspan="6"
                      class="text-center"
                      v-if="selected.headerData.deliveryDate != ''"
                    >
                      {{ selected.headerData.deliveryDate }}
                    </td>
                    <td colspan="6" class="text-center" v-else>
                      {{ selected.headerData.orderNumber }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">Kneading Lot No.</td>
                    <td class="text-center" colspan="5">
                      {{ selected.headerData.kneadingLot }}
                    </td>
                    <td colspan="2">Extruding Lot No.</td>
                    <td colspan="6" class="text-center">
                      {{ selected.headerData.extrudingLot }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="16"></td>
                  </tr>
                </tbody>
                <!-- Header end -->
                <tbody class="processItem">
                  <tr>
                    <td rowspan="2" colspan="2" class="text-center">No</td>
                    <td rowspan="2" class="text-center">Inspection Item</td>
                    <td class="text-center" rowspan="2" colspan="4">
                      Standard
                    </td>
                    <td class="text-center" rowspan="2">Measurement Tool</td>
                    <td class="text-center" rowspan="2">Inspection Number</td>
                    <td class="text-center" colspan="7">Inspection Result</td>
                  </tr>
                  <tr>
                    <td class="text-center">N1</td>
                    <td class="text-center">N2</td>
                    <td class="text-center">N3</td>
                    <td class="text-center">N4</td>
                    <td class="text-center">N5</td>
                    <td class="text-center" colspan="2">Judgement</td>
                  </tr>
                </tbody>
                <reportTable
                  :room-check="selected.insData.partData.roomCheck"
                  :part-type="selected.insData.partData.partType"
                  :ext-type="selected.insData.partData.extrudingType"
                  :app-data="selected.insData.appearanceData"
                  :length-arr="lengthArr"
                  :heater-on="selected.insData.partData.heaterCheck"
                  v-for="(process, pIndex) in processes"
                  :key="pIndex"
                  :data-set="selected.insData[`${process}Data`]"
                  :process="process"
                  v-show="selected.insData[`${process}Data`].insItem.length > 0"
                  :part-number="selected.insData.partData.partNumber"
                />
                <tr>
                  <td style="border: none !important" colspan="17"></td>
                </tr>
                <tr>
                  <td
                    style="border: none !important"
                    colspan="16"
                    rowspan="3"
                  ></td>
                  <td class="text-center">Approved By</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <v-img height="40" :src="approval.picData.sign"></v-img>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="font-size: 11pt">
                    {{ approval.picData.userName }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <v-btn @click="printFitToA4" variant="outlined" rounded="pill" block
            >Download</v-btn
          >
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import html2pdf from "html2pdf.js";
import moment from "moment";

const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const search = ref("");
const inspections = ref();
const printMe = ref();
const scale = ref(1);
const table = ref(null);
const processes = ["kneading", "extruding", "press", "outgoing"];
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});
const zoom = ref(1);
const lengthArr = ref({});
const approval = ref({});

const scaling = () => {
  const el = table.value;
  const a4Width = 756.2;
  const a4Height = 1085.2;
  const elWidth = el.scrollWidth;
  const elHeight = el.scrollHeight;

  const scaleX = a4Width / elWidth;
  const scaleY = a4Height / elHeight;
  scale.value = Math.min(scaleX, scaleY);
};

const openDialog = async (key, item) => {
  store
    .ajax(
      { userId: item.insData.approval.picData.userId },
      "/auth/getsignfile",
      "post"
    )
    .then((e) => {
      approval.value.picData.sign = e;
    });
  approval.value = item.insData.approval;
  const arr = ["kneadingData", "extrudingData", "pressData", "outgoingData"];
  arr.forEach((a, index) => {
    const target = item.insData[a].data;

    if (target.length > 0 && target.length < 5) {
      let clone = JSON.parse(JSON.stringify(target[0]));
      clone.items = clone.items.map((item) => {
        item.input = "";
        item.isCheck = false;
        return toRaw(item);
      });
      while (target.length < 5) {
        target.push(JSON.parse(JSON.stringify(clone)));
      }
    }

    let le = 0;
    switch (processes[index]) {
      case "kneading":
        le = 0;
        break;
      case "extruding":
        le =
          item.insData.kneadingData.insItem.length +
          parseInt(item.insData.partData.heaterCheck) +
          1;
        break;
      case "press":
        le =
          item.insData.kneadingData.insItem.length +
          item.insData.extrudingData.insItem.length +
          parseInt(item.insData.partData.heaterCheck) +
          1;
        break;
      case "outgoing":
        le =
          item.insData.pressData.insItem.length +
          item.insData.kneadingData.insItem.length +
          item.insData.extrudingData.insItem.length +
          parseInt(item.insData.partData.heaterCheck) +
          1;
        break;
    }

    lengthArr.value[processes[index]] = le;
  });

  selected.value = item;
  store.preload = false;
  dialog.value = true;
  setTimeout(() => {
    scaling();
  }, 100);

  console.log(item);
};

const refresh = async () => {
  dialog.value = false;
  inspections.value = await store.ajax({ func: "OK" }, "/inspection", "post");

  inspections.value = inspections.value.filter(
    (e) => e.insData.approval.date != ""
  );

  store.preload = false;
};

function printFitToA4() {
  const el = table.value;

  const fileName = `PIR Butyl ${selected.value.insData.partData.partNumber} ${selected.value.headerData.poNumber}`;
  const opt = {
    margin: [2, 2, 2, 2], // margin PDF (dalam inci, bisa array [atas, kiri, bawah, kanan])
    filename: fileName,
    pagebreak: { mode: ["avoid"] },
    image: { type: "jpeg", quality: 0.5 },
    html2canvas: { scale: 8, useCORS: true, windowHeight: el.scrollHeight },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  console.log(fileName);

  html2pdf()
    .set(opt)
    .from(el)
    .toPdf()
    .get("pdf")
    .then(function (pdf) {
      if (pdf.internal.getNumberOfPages() > 1) {
        pdf.deletePage(pdf.internal.getNumberOfPages());
      }
    })
    .save();
}

onBeforeMount(() => {
  refresh();
});
</script>
