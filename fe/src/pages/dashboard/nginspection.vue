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
          <td class="text-center">
            <v-checkbox-btn
              :value="item.insId"
              inline=""
              v-model="batchDelete"
            ></v-checkbox-btn>
          </td>
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
          <td class="text-center text-capitalize">
            {{ item.rejectStep }}
          </td>
          <td class="text-center">
            <v-btn-group density="compact" variant="outlined" rounded="pill">
              <v-btn @click="openDialog('open', item)">Check</v-btn>
              <v-btn @click="initRollback(item)">Roll Back</v-btn>
            </v-btn-group>
          </td>
        </tr>
      </template>
      <template #headers>
        <tr>
          <th class="text-center">
            <v-btn
              icon
              flat
              size="small"
              @click="
                selectAll = !selectAll;
                selectAllForDelete();
              "
            >
              <v-icon v-if="!selectAll">mdi-check-all</v-icon>
              <v-icon v-else>mdi-checkbox-blank-off</v-icon>
            </v-btn>
          </th>
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
          <th class="text-center">NG Step</th>
          <th class="text-center">Review</th>
        </tr>
      </template>
      <template #footer.prepend>
        <v-btn
          color="error"
          prepend-icon="mdi-delete"
          v-if="batchDelete.length > 0"
          rounded="pill"
          @click="deleteBatchDialog = true"
          >Delete Checked</v-btn
        >
        <v-spacer></v-spacer>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      fullscreen=""
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>Rejection List</template>
        <template #subtitle
          >Please select a rejection to take action on it</template
        >
        <template #text>
          <div class="h-100">
            <div v-if="dialogData.key == 'open'">
              <ngPreview
                :close-me="refresh"
                @submit-data="emited"
                :all-data="selected"
              ></ngPreview>
              <!-- 
              :items="rejectionData.value.data"
                 -->
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteBatchDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #title>Delete Inspections</template>
        <template #text>
          Are you sure you want to delete the selected inspections?
        </template>
        <template #actions>
          <v-btn
            color="error"
            rounded="pill"
            @click="
              deleteBatchItems();
              deleteBatchDialog = false;
            "
          >
            Yes, Delete
          </v-btn>
          <v-btn rounded="pill" @click="deleteBatchDialog = false">
            Cancel
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import Inspection from "@/assets/inspectionHelper";
import { useAppStore } from "@/stores/app";
import moment from "moment";

const store = useAppStore();
const search = ref();
const dialog = ref(false);
const selected = ref(null);
const inspections = ref([]);
const dialogData = reactive({
  key: "",
  title: "",
  subtitle: "",
});

const batchDelete = ref([]);
const deleteBatchDialog = ref(false);
const selectAll = ref(false);
const selectAllForDelete = () => {
  if (selectAll.value == false) {
    batchDelete.value = [];
    return;
  }
  batchDelete.value = inspections.value.map((i) => i.insId);
};
const deleteBatchItems = async () => {
  await store.asyncdeleteBatchItems(batchDelete.value);
  batchDelete.value = [];
  await refresh();
};

const openDialog = async (key, item) => {
  dialogData.key = key;
  switch (key) {
    case "new":
      dialogData.title = "Initiate new inspection";
      dialogData.subtitle = "Please fill all required data.";
      break;
    case "open":
      // let data = {
      //   ...instData,
      //   headerData: item.headerData,
      //   insId: item.insId,
      //   judgement: item.judgement,
      //   partNumber: item.partNumber,
      //   inspectionStep: item.inspectionStep,
      //   rejectStep: item.rejectStep,
      // };

      selected.value = item;

      const step = item.inspectionStep.step;
      break;
    case "delete":
      selected.value = item;
      return;
  }
  dialog.value = true;
};

watch(dialog, (e) => {
  if (!e) {
    refresh();
  }
});

const refresh = async () => {
  dialog.value = false;
  inspections.value = await store.ajax({ func: "NG" }, "/inspection", "post");

  // inspections.value.forEach((value, index) => {
  //   let reject = Object.entries(value.insData.rejectionData.data).filter(
  //     ([key, v]) => v.length > 0
  //   );
  //   value.rejectStep = reject[reject.length - 1][0];
  // });
  store.preload = false;
};

const emited = async (data) => {
  let newData = JSON.parse(JSON.stringify(toRaw(selected.value)));
  newData.rejectionData.data = data.data;
  let allDone = [];
  Object.entries(data.data).forEach(([key, value]) => {
    let myData = data.data[key];
    if (myData.length > 0) {
      let valid = myData.every((d) => d.action != "1" && d.note != "");
      allDone.push(valid);
    }
  });
  let inspection = new Inspection();
  inspection.registerData(newData);
  let json = inspection.toJSON();

  allDone = allDone.every((done) => done);

  if (allDone) {
    json.judgement = 3;
  }

  nextTick().then(async () => {
    await store.ajax(json, "/inspection/save", "post");
    refresh();
  });
};

onBeforeMount(() => {
  refresh();
});

const rollbackReject = async (item) => {
  try {
    await store.ajax(
      { insId: item.insId, step: item.rejectStep },
      "/rejection/rollback",
      "put",
    );
    store.swal.fire({
      icon: "success",
      title: "Success",
      text: "Rejection rolled back successfully.",
    });
    await refresh();
  } catch (error) {
    console.error(error);
  }
};

const initRollback = (item) => {
  store.swal
    .fire({
      title: "Are you sure?",
      text: "You are about to roll back the rejection. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, roll back",
      cancelButtonText: "Cancel",
      position: "center",
      timer: 0,
      showConfirmButton: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        rollbackReject(item);
      }
    });
};
</script>
