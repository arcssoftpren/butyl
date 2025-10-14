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
          <td class="text-center">
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
              color="primary"
              density="compact"
              variant="outlined"
              rounded="pill"
              block
              @click="openDialog('open', item)"
              >Review</v-btn
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
          <th class="text-center">Qty.</th>
          <th class="text-center">Header</th>
          <th class="text-center">Action</th>
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
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            variant="outlined"
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
          <div class="pa-5" v-if="dialogData.key == 'open'">
            <div v-for="(item1, index1) in dataArr" :key="index1">
              <div v-if="item1 != 'appearance'">
                <v-card
                  v-if="selected[`${item1}Data`].insItem.length > 0"
                  class="my-2"
                >
                  <v-card-title class="bg-primary">
                    <div class="text-uppercase">
                      {{ item1 }} Inspection Data
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <div class="text-h5 my-2">Inspection Data</div>
                    <table class="mytable">
                      <thead>
                        <tr>
                          <th rowspan="2">Inspection Items</th>
                          <th rowspan="2">Standard</th>
                          <th
                            :colspan="
                              selected[`${item1}Data`].insItem[0].steps.length
                            "
                          >
                            Inspection Result
                          </th>
                          <th rowspan="2">Inspector</th>
                          <th rowspan="2">Judgement</th>
                        </tr>
                        <tr>
                          <th
                            v-for="(item2, index2) in selected[`${item1}Data`]
                              .insItem[0].steps"
                            :key="index2"
                          >
                            {{ item2.key }}
                          </th>
                        </tr>
                      </thead>
                      <tbody v-if="item1 == 'kneading'">
                        <tr
                          class="text-center"
                          v-for="(item, index) in selected[`${item1}Data`]
                            .insItem"
                          :key="index"
                        >
                          <td>{{ item.label }}</td>
                          <td v-if="selected.partData.kneadingType == 'b'">
                            {{
                              store.checkLogic(
                                item.logic.id,
                                item.standard,
                                "",
                                true
                              )
                            }}
                          </td>

                          <td class="text-center" v-else>
                            See the kneading result
                          </td>
                          <td
                            v-if="selected.partData.kneadingType == 'b'"
                            class="text-center"
                            v-for="(item3, index3) in item.steps"
                            :key="index3"
                          >
                            <div
                              :class="
                                item3.items[index].judgement == 1
                                  ? 'text-success'
                                  : 'text-error'
                              "
                            >
                              {{ item3.items[index].input }}
                            </div>
                          </td>
                          <td
                            v-if="
                              selected.partData.kneadingType == 'a' &&
                              index == 0
                            "
                            :rowspan="selected[`${item1}Data`].insItem.length"
                            :colspan="item.steps.length"
                          >
                            <table class="w-100 mytable">
                              <tbody>
                                <tr class="text-center">
                                  <td
                                    colspan="2"
                                    :class="
                                      selected[`${item1}Data`].judgement == 'OK'
                                        ? 'bg-success'
                                        : 'bg-error'
                                    "
                                  >
                                    Kneading Result:{{
                                      selected[`${item1}Data`].judgement == "OK"
                                        ? selected[`${item1}Data`].judgement
                                        : "NG"
                                    }}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Quality PIC</td>
                                  <td>
                                    {{ selected.kneadingData.kneadingQlt.pic }}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Approval Date</td>
                                  <td>
                                    {{
                                      moment(
                                        selected.kneadingData.kneadingQlt.date
                                      ).format("DD/MM/YYYY")
                                    }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td
                            class="text-center"
                            v-if="index == 0"
                            :rowspan="selected.kneadingData.insItem.length"
                          >
                            {{ selected[`${item1}Data`].inspector.userName }}
                          </td>

                          <td
                            :class="
                              selected[`${item1}Data`].judgement == 'OK' ||
                              selected[`${item1}Data`].judgement == '1'
                                ? 'text-h4 bg-success'
                                : 'text-h4 bg-error'
                            "
                            v-if="index == 0"
                            :rowspan="selected.kneadingData.insItem.length"
                          >
                            <div>
                              {{
                                selected[`${item1}Data`].judgement == "OK" ||
                                selected[`${item1}Data`].judgement == "1"
                                  ? "OK"
                                  : "NG"
                              }}
                            </div>
                          </td>
                        </tr>
                      </tbody>

                      <tbody v-else>
                        <tr
                          class="text-center"
                          v-for="(item, index) in selected[`${item1}Data`]
                            .insItem"
                          :key="index"
                        >
                          <td>{{ item.label }}</td>
                          <td>
                            {{
                              store.checkLogic(
                                item.logic.id,
                                item.standard,
                                "",
                                true
                              )
                            }}
                            {{ item.unit }}
                          </td>

                          <td
                            :class="
                              item3.items[index].isCheck
                                ? 'text-center'
                                : 'text-center bg-grey-lighten-3'
                            "
                            v-for="(item3, index3) in item.steps"
                            :key="index3"
                          >
                            <div
                              :class="
                                item3.items[index].judgement == 1
                                  ? 'text-success'
                                  : 'text-error'
                              "
                            >
                              {{ item3.items[index].input }}
                            </div>
                          </td>
                          <td
                            class="text-center"
                            v-if="index == 0"
                            :rowspan="selected[`${item1}Data`].insItem.length"
                          >
                            {{ selected[`${item1}Data`].inspector.userName }}
                          </td>
                          <td
                            :class="
                              selected[`${item1}Data`].judgement == '1'
                                ? 'text-h4 bg-success'
                                : 'text-h4 bg-error'
                            "
                            v-if="index == 0"
                            :rowspan="selected[`${item1}Data`].insItem.length"
                          >
                            <div>
                              {{
                                selected[`${item1}Data`].judgement == "1"
                                  ? "OK"
                                  : "NG"
                              }}
                            </div>
                          </td>
                        </tr>
                        <tr
                          v-if="
                            item1 == 'outgoing' &&
                            selected.partData.roomCheck == 1
                          "
                        >
                          <td class="text-center">Room Temperature</td>
                          <td class="text-center">23 &plusmn; 2 °C</td>
                          <td
                            colspan="5"
                            :class="
                              selected.outgoingData.roomData.judgement
                                ? 'text-center'
                                : 'text-error text-center'
                            "
                          >
                            {{ selected.outgoingData.roomData.input }} °C
                          </td>
                          <td class="text-center">
                            {{ selected[`${item1}Data`].inspector.userName }}
                          </td>
                          <td
                            :class="
                              selected.outgoingData.roomData.judgement
                                ? 'bg-success text-center'
                                : 'text-center bg-error'
                            "
                          >
                            {{
                              selected.outgoingData.roomData.judgement
                                ? "OK"
                                : "NG"
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <v-divider class="my-2"></v-divider>

                    <div v-if="selected.rejectionData.data[item1].length > 0">
                      <div class="text-h5">Correction Data</div>
                      <div
                        v-if="
                          item1 == 'kneading' &&
                          selected.partData.kneadingType == 'a'
                        "
                      >
                        <table class="mytable mt-2">
                          <thead>
                            <tr>
                              <th>Correction Note</th>
                              <th>Taken Action</th>
                              <th>Review PIC</th>
                              <th>Review Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              class="text-center"
                              v-for="(item, index) in selected.rejectionData
                                .data.kneading"
                              :key="index"
                            >
                              <td>
                                {{ item.note }}
                              </td>
                              <td v-if="item.action == 2" class="bg-success">
                                Repaired
                              </td>
                              <td v-else class="bg-warning">
                                Special Acceptance
                              </td>
                              <td>
                                {{ item.inspector }}
                              </td>
                              <td>
                                {{
                                  moment(item.reviewDate).format("DD/MM/YYYY")
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-else>
                        <table class="mytable">
                          <thead>
                            <tr>
                              <th>Inspection Item</th>
                              <th>Sample Number</th>
                              <th>Standard</th>
                              <th>Inspection Result</th>
                              <th>Action</th>
                              <th>Correction Note</th>
                              <th>PIC</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              class="text-center"
                              v-for="(rejitem, rejindex) in selected
                                .rejectionData.data[item1]"
                              :key="rejindex"
                            >
                              <td>{{ rejitem.label }}</td>
                              <td>{{ rejitem.key }}</td>
                              <td>
                                {{
                                  store.checkLogic(
                                    rejitem.logic.id,
                                    rejitem.standard,
                                    "",
                                    true
                                  )
                                }}
                                {{ rejitem.unit }}
                              </td>
                              <td>
                                {{ rejitem.input }}
                              </td>
                              <td class="bg-success" v-if="rejitem.action == 2">
                                Repaired
                              </td>
                              <td class="bg-warning" v-else>
                                Special Acceptance
                              </td>
                              <td>
                                {{ rejitem.note }}
                              </td>
                              <td>
                                {{ rejitem.inspector }}
                              </td>
                              <td>
                                {{
                                  moment(rejitem.reviewDate).format(
                                    "DD/MM/YYYY"
                                  )
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <div v-else>
                <v-card>
                  <v-card-title class="bg-primary">
                    Appearance Inspection data
                  </v-card-title>
                  <v-card-text>
                    <div
                      class="w-100 pa-2"
                      v-if="selected.partData.heaterCheck == 1"
                    >
                      <table class="mytable">
                        <thead>
                          <tr>
                            <th>Item Check</th>
                            <th>Standard</th>
                            <th>Result</th>
                            <th>Judgement</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="text-center">
                            <td>Heater Temp</td>
                            <td>
                              Check temperature at beginning of production
                            </td>
                            <td>
                              {{
                                selected.appearanceData.data.heaterTemp.input !=
                                ""
                                  ? selected.appearanceData.data.heaterTemp
                                      .input + "°C"
                                  : "Not Checked"
                              }}
                            </td>
                            <td
                              v-if="
                                selected.appearanceData.data.heaterTemp
                                  .judgement
                              "
                            >
                              OK
                            </td>
                            <td class="bg-error" v-else>NG</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      v-if="selected.partData.extrudingType == 'a'"
                      class="w-100 pa-2"
                    >
                      <v-row>
                        <!-- <v-col cols="2">
                          <div class="text-center w-100 text-h5">Drawing</div>
                          <v-img
                            :src="
                              selectedPics.drw ? selectedPics.drw : defDrawing
                            "
                          ></v-img>
                        </v-col>
                        <v-col cols="2">
                          <div class="text-center w-100 text-h5">
                            Actual Image
                          </div>
                          <v-img
                            :src="
                              selectedPics.act ? selectedPics.act : defDrawing
                            "
                          ></v-img>
                        </v-col> -->
                        <v-col cols="12">
                          <table class="mytable">
                            <thead>
                              <tr>
                                <td colspan="4">
                                  <v-row>
                                    <v-col cols="6">
                                      Part Drawing
                                      <v-img
                                        height="150"
                                        :src="
                                          selectedPics.drw
                                            ? selectedPics.drw
                                            : defDrawing
                                        "
                                      ></v-img>
                                    </v-col>
                                    <v-col cols="6">
                                      Actual Image
                                      <v-img
                                        height="150"
                                        :src="
                                          selectedPics.act
                                            ? selectedPics.act
                                            : defDrawing
                                        "
                                      ></v-img>
                                    </v-col>
                                  </v-row>
                                </td>
                              </tr>
                            </thead>
                            <thead>
                              <tr>
                                <th>Item Inspection</th>
                                <th>Standard</th>
                                <th>Inspection Result</th>
                                <th>Judgement</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr class="text-center">
                                <td>Release Paper Color</td>
                                <td>
                                  {{ selected.appearanceData.standard.color }}
                                </td>
                                <td
                                  v-if="
                                    selected.appearanceData.data.color.judgement
                                  "
                                >
                                  {{ selected.appearanceData.data.color.input }}
                                </td>
                                <td v-else>Not Confirmed</td>
                                <td
                                  rowspan="2"
                                  :class="
                                    selected.appearanceData.data.color.judgement
                                      ? 'bg-success'
                                      : 'bg-error'
                                  "
                                >
                                  <div
                                    v-if="
                                      selected.appearanceData.data.color
                                        .judgement == 1
                                    "
                                  >
                                    OK
                                  </div>
                                  <div v-else>NG</div>
                                </td>
                              </tr>

                              <tr class="text-center">
                                <td>Butyl Tape</td>
                                <td>
                                  Butyl tape can be peeled off from Release
                                  paper
                                </td>
                                <td>
                                  {{
                                    selected.appearanceData.data.peel.input ==
                                    "1"
                                      ? "OK"
                                      : "NG"
                                  }}
                                </td>
                              </tr>
                              <tr class="bg-grey-lighten-2 text-center">
                                <td colspan="2">Inspector</td>
                                <td colspan="2">
                                  {{
                                    selected.appearanceData.inspector.userName
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div
                            v-if="
                              selected.rejectionData.data.appearance.length > 0
                            "
                          >
                            <div class="text-h5">Correction Data</div>

                            <table class="mytable mt-2">
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Correction Note</th>
                                  <th>Taken Action</th>
                                  <th>Review PIC</th>
                                  <th>Review Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  class="text-center"
                                  v-for="(item, index) in selected.rejectionData
                                    .data.appearance"
                                  :key="index"
                                >
                                  <td>
                                    {{ store.extLabel[item.appKey] }}
                                  </td>
                                  <td>
                                    {{ item.note }}
                                  </td>
                                  <td
                                    v-if="item.action == 2"
                                    class="bg-success"
                                  >
                                    Repaired
                                  </td>
                                  <td v-else class="bg-warning">
                                    Special Acceptance
                                  </td>
                                  <td>
                                    {{ item.inspector }}
                                  </td>
                                  <td>
                                    {{
                                      moment(item.reviewDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div
                      v-if="selected.partData.extrudingType != 'a'"
                      class="w-100 pa-2"
                    >
                      <table class="mytable">
                        <thead>
                          <tr>
                            <td colspan="4">
                              <v-row>
                                <v-col cols="6">
                                  Part Drawing
                                  <v-img
                                    height="150"
                                    :src="
                                      selectedPics.drw
                                        ? selectedPics.drw
                                        : defDrawing
                                    "
                                  ></v-img>
                                </v-col>
                                <v-col cols="6">
                                  Actual Image
                                  <v-img
                                    height="150"
                                    :src="
                                      selectedPics.act
                                        ? selectedPics.act
                                        : defDrawing
                                    "
                                  ></v-img>
                                </v-col>
                              </v-row>
                            </td>
                          </tr>
                          <tr class="text-center">
                            <th>Inspection Item</th>
                            <th>Standard</th>
                            <th>Inspection Result</th>
                            <th>Judgement</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="text-center">
                            <td>Upper Surface</td>
                            <td>
                              {{
                                store.extBlabel[
                                  selected.appearanceData.standard.upper
                                ]
                              }}
                            </td>
                            <td>
                              {{
                                store.extBlabel[
                                  selected.appearanceData.data.upper.input
                                ]
                              }}
                            </td>
                            <td
                              v-if="
                                selected.appearanceData.data.upper.judgement
                              "
                              class="bg-success"
                            >
                              OK
                            </td>
                            <td class="bg-error" v-else>NG</td>
                          </tr>
                          <tr class="text-center">
                            <td>Bottom Surface</td>
                            <td>
                              {{
                                store.extBlabel[
                                  selected.appearanceData.standard.bottom
                                ]
                              }}
                            </td>
                            <td>
                              {{
                                store.extBlabel[
                                  selected.appearanceData.data.bottom.input
                                ]
                              }}
                            </td>
                            <td
                              v-if="
                                selected.appearanceData.data.bottom.judgement
                              "
                              class="bg-success"
                            >
                              OK
                            </td>
                            <td class="bg-error" v-else>NG</td>
                          </tr>
                          <tr class="text-center">
                            <td>Sheet Layout</td>
                            <td>
                              {{ selected.appearanceData.standard.sheetLayout }}
                              Pcs/sheet
                            </td>
                            <td>
                              {{
                                selected.appearanceData.data.sheetLayout.input
                              }}
                              pcs/sheet
                            </td>
                            <td
                              v-if="
                                selected.appearanceData.data.sheetLayout
                                  .judgement
                              "
                              class="bg-success"
                            >
                              OK
                            </td>
                            <td class="bg-error" v-else>NG</td>
                          </tr>

                          <tr class="bg-grey-lighten-2 text-center">
                            <td colspan="2">Inspector</td>
                            <td colspan="2">
                              {{ selected.appearanceData.inspector.userName }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <v-divider class="my-2"></v-divider>
                      <div
                        v-if="selected.rejectionData.data.appearance.length > 0"
                      >
                        <div class="text-h5">Correction Data</div>

                        <table class="mytable mt-2">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Correction Note</th>
                              <th>Taken Action</th>
                              <th>Review PIC</th>
                              <th>Review Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              class="text-center"
                              v-for="(item, index) in selected.rejectionData
                                .data.appearance"
                              :key="index"
                            >
                              <td>
                                {{ store.extLabel[item.appKey] }}
                              </td>
                              <td>
                                {{ item.note }}
                              </td>
                              <td v-if="item.action == 2" class="bg-success">
                                Repaired
                              </td>
                              <td v-else class="bg-warning">
                                Special Acceptance
                              </td>
                              <td>
                                {{ item.inspector }}
                              </td>
                              <td>
                                {{
                                  moment(item.reviewDate).format("DD/MM/YYYY")
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </div>

          <div
            v-if="dialogData.key == 'edit'"
            class="d-flex w-100 h-100 align-center flex-column pt-5"
          >
            <editHeader
              :header-data="selected.headerData"
              :ins-id="selected.insId"
              @refresh="refresh"
            ></editHeader>
          </div>

          <div v-if="dialogData.key == 'open'">
            <v-divider class="my-2"></v-divider>
            <v-btn @click="approve" variant="outlined" rounded="pill" block
              >Approve</v-btn
            >
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import moment from "moment";
import defDrawing from "@/assets/defaultDesign.png";

const store = useAppStore();
const dialog = ref(false);
const selected = ref({});
const selectedPics = reactive({
  act: "",
  drw: "",
});
const inspections = ref([]);
const formData = reactive({});
const search = ref("");
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

const dataArr = ["kneading", "appearance", "extruding", "press", "outgoing"];

const openDialog = async (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "edit":
      dialogData.title = "Edit Inspection Header";
      dialogData.subtitle = "Please fill all required data.";
      selected.value = item;
      dialog.value = true;
      break;
    case "open":
      dialogData.title = "INSPECTION REVIEW";
      dialogData.subtitle =
        "Please review the inspection data before approval.";
      store
        .ajax({ insId: item.insId }, "/inspection/getinspectiondata", "post")
        .then((res) => {
          item = res[0];

          let data = {
            ...item.insData,
            headerData: item.headerData,
            insId: item.insId,
            judgement: item.judgement,
            partNumber: item.partNumber,
            inspectionStep: item.inspectionStep,
          };

          store
            .ajax({ partNumber: item.partNumber }, "/parts/getdrawing", "post")
            .then((e) => {
              selectedPics.act = e.act;
              selectedPics.drw = e.drw;
              store.preload = false;
            });

          let ins = new Inspection();
          ins.registerData(data);
          selected.value = ins;

          dialog.value = true;
        });
      break;
    case "delete":
      selected.value = item;
      dialog.value = true;
      return;
  }
};

watch(dialog, (e) => {
  if (!e) refresh();
});

const refresh = async () => {
  dialog.value = false;
  inspections.value = await store.ajax({ func: "OK" }, "/inspection", "post");

  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});

async function approve() {
  selected.value.approval.date = moment().format("YYYY-MM-DD");
  selected.value.approval.picData = {
    userName: store.userData.userName,
    userId: store.userData.userId,
  };
  const json = selected.value.toJSON();
  await store.ajax(json, "/inspection/save", "post");
  refresh();
}
</script>
