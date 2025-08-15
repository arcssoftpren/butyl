<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          :item-props="itemProps"
          class="mt-2"
          label="Select Part"
          item-title="partNumber"
          item-value="partNumber"
          :items="parts"
          variant="outlined"
          rounded="pill"
          density="compact"
          hide-details
          v-model="partId"
        />
      </v-col>
      <v-col cols="12">
        <v-card v-if="headerView" title="Part Detail">
          <template #text>
            <div class="h-100 w-100">
              <v-row>
                <v-col cols="3">
                  <v-card density="compact" title="Part Drawing">
                    <template #text>
                      <v-img
                        height="200"
                        :src="partDrawing == null ? defImage : partDrawing"
                      ></v-img>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="3">
                  <v-card density="compact" title="Actual Image">
                    <template #text>
                      <v-img
                        height="200"
                        :src="actImage == null ? defImage : actImage"
                      ></v-img>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <template #text>
                      <v-table>
                        <thead>
                          <tr>
                            <th colspan="3" class="font-weight-bold">
                              {{ inspection.partNumber }}
                            </th>
                          </tr>
                          <tr>
                            <th>Customer</th>

                            <th colspan="2">
                              :{{ inspection.partData.customer }}
                            </th>
                          </tr>
                          <tr>
                            <th>Product Name</th>
                            <th colspan="2">
                              :{{ inspection.partData.partName }}
                            </th>
                          </tr>
                          <tr>
                            <th>Dimensions</th>
                            <th>
                              :{{
                                parseFloat(
                                  inspection.partData.thickness
                                ).toFixed(0)
                              }}
                              x
                              {{
                                parseFloat(inspection.partData.width).toFixed(0)
                              }}
                              x
                              {{
                                parseFloat(inspection.partData.length).toFixed(
                                  0
                                )
                              }}
                            </th>
                            <th>
                              SG:
                              {{
                                parseFloat(inspection.partData.sg).toFixed(1)
                              }}
                            </th>
                          </tr>
                        </thead>
                      </v-table>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card title="Inspection Header">
                    <template #text>
                      <v-table class="mytable">
                        <thead>
                          <tr>
                            <th
                              class="text-center"
                              v-show="
                                inspection.partData.headers.includes(index)
                              "
                              v-for="(item, index) in inspection.headerData"
                              :key="index"
                            >
                              {{ headerLabel[index] }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              class="text-center"
                              v-show="
                                inspection.partData.headers.includes(index)
                              "
                              v-for="(item, index) in inspection.headerData"
                              :key="index"
                            >
                              <v-text-field
                                :type="index == 'prodQty' ? 'number' : 'text'"
                                v-model="inspection.headerData[index]"
                                v-if="index != 'deliveryDate'"
                                variant="outlined"
                                rounded="pill"
                                density="compact"
                                hide-details=""
                                hide-spin-buttons=""
                                :error-messages="
                                  inspection.headerValidate[index].$errors.map(
                                    (e) => e.$message
                                  )
                                "
                              />
                              <v-text-field
                                v-else
                                :error-messages="
                                  inspection.headerValidate.deliveryDate.$errors.map(
                                    (e) => e.$message
                                  )
                                "
                                v-model="inspection.headerData.deliveryDate"
                                type="date"
                                variant="outlined"
                                rounded="pill"
                                density="compact"
                                hide-details=""
                                hide-spin-buttons=""
                              />
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <v-divider class="my-2"></v-divider>
                      <v-btn
                        :disabled="
                          !inspection.partData?.kneadingItems ||
                          !inspection.partData?.extrudingItems
                        "
                        @click="handleInitInspection"
                        text="Initiate"
                        variant="outlined"
                        rounded="pill"
                        block
                      ></v-btn>
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import defImage from "@/assets/defaultDesign.png";

const store = useAppStore();
const parts = ref([]);
const partId = ref(null);
const part = ref({});
const headerView = ref(false);
const inspection = ref(new Inspection());
const actImage = ref(null);
const partDrawing = ref(null);
const props = defineProps(["closeMe"]);

const headerLabel = {
  prodQty: "Production Qty",
  deliveryDate: "Delivery Date",
  kneadingLot: "Kneading Lot",
  extrudingLot: "Extruding Lot",
  orderNumber: "Order Number",
  poNumber: "PO Number (SPI-)",
};

function itemProps(item) {
  return {
    title: item.partNumber,
    subtitle: item.partName,
  };
}

async function refresh() {
  try {
    parts.value = await store.ajax({}, "/parts", "post");
    store.preload = false;
  } catch (error) {
    console.log(error);
  }
}

watch(partId, async (e) => {
  if (e != null) {
    let find = parts.value.find((f) => f.partNumber == e);
    part.value = { ...toRaw(find) };
    await inspection.value.registerPart(part.value);

    store.ajax({ partNumber: e }, "/parts/getdrawing", "post").then((img) => {
      actImage.value = img.act;
      partDrawing.value = img.drw;
      store.preload = false;
    });

    nextTick().then((e) => {
      headerView.value = true;
    });
  } else {
    headerView.value = false;
  }
});

async function handleInitInspection() {
  const part = inspection.value.partData;

  if (!part || typeof part !== "object") {
    console.warn("❌ partData belum siap");
    return;
  }

  if (
    !Array.isArray(part.kneadingItems) ||
    !Array.isArray(part.extrudingItems)
  ) {
    console.warn("❌ partData belum lengkap (kneadingItems / extrudingItems)");
    return;
  }

  try {
    const send = await inspection.value.initInspectionData();
    await store.ajax(send, "/inspection/init", "post");
    props.closeMe();
  } catch (error) {
    console.log(error);
  }
}

onBeforeMount(() => {
  refresh();
});
</script>
