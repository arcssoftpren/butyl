<style scoped>
.mytable td,
.mytable th,
.mytable table,
.mytable tr {
  border: black, 1px, solid !important;
  font-size: smaller;
}
</style>
<template>
  <v-table class="mytable">
    <thead>
      <tr>
        <th class="text-center">NO</th>
        <th class="text-center">Inspection Item</th>
        <th class="text-center">Standard</th>
        <th class="text-center">Measurement Tool</th>
        <th class="text-center">Inspection Number</th>
        <th
          v-show="mypos == Xindex"
          class="text-center"
          v-for="(Xitem, Xindex) in localTableData"
          :key="Xindex"
        >
          {{ Xitem.key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in localTableData[0].items" :key="index">
        <td class="text-center">{{ index + 1 }}</td>
        <td class="text-center">{{ item.label }}</td>
        <td class="text-center">
          {{ store.checkLogic(item.logic.id, item.standard, "", true) }}
        </td>
        <td class="text-center">
          {{ item.method.romaji }}
        </td>
        <td class="text-center">n={{ item.sampleQ }}</td>
        <td
          v-show="mypos == Xindex"
          :class="
            Xitem.items[index].judgement == 'OK'
              ? 'bg-success'
              : Xitem.items[index].judgement == 'NG'
              ? 'bg-error'
              : ''
          "
          v-for="(Xitem, Xindex) in localTableData"
          :key="Xindex"
        >
          <v-text-field
            @keyup="validateInput(Xindex, index)"
            :disabled="isDisable(Xindex, index)"
            v-if="
              Xitem.items[index].logic.inputType !== 'buttonToggle' &&
              Xitem.items[index].check
            "
            variant="outlined"
            rounded="pill"
            density="compact"
            v-model="Xitem.items[index].input"
            hide-details=""
          />

          <v-btn-toggle
            class="w-100"
            @click="validateInput(Xindex, index)"
            :disabled="isDisable(Xindex, index)"
            density="compact"
            v-if="
              Xitem.items[index].logic.inputType == 'buttonToggle' &&
              Xitem.items[index].check
            "
            mandatory
            v-model="Xitem.items[index].input"
          >
            <v-btn style="width: 50%" color="success" value="OK">OK</v-btn>
            <v-btn style="width: 50%" color="error" value="NG">NG</v-btn>
          </v-btn-toggle>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-row>
    <v-col cols="2">
      <v-btn
        :disabled="mypos == 0"
        @click="mypos--"
        class="mt-5"
        variant="outlined"
        rounded="pill"
        block
        >Previous</v-btn
      >
    </v-col>
    <v-col cols="8"></v-col>
    <v-col cols="2">
      <v-btn
        :disabled="mypos == localTableData.length - 1"
        @click="mypos++"
        class="mt-5"
        variant="outlined"
        rounded="pill"
        block
        >Next</v-btn
      >
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-btn
        @click="submit"
        :disabled="inputArr.length < 1"
        variant="outlined"
        rounded="pill"
        block
        :color="ngArr.length > 0 ? 'error' : 'primary'"
        :text="ngArr.length > 0 ? 'report NG' : 'Submit'"
      ></v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const props = defineProps(["tableData", "posData"]);

const localTableData = reactive([...toRaw(props.tableData)]);
let mypos = ref(props.posData.split("|")[0]);
const emit = defineEmits(["emitReport"]);
const store = useAppStore();
const ngArr = ref([]);
const inputArr = ref([]);
const max = props.tableData.length;

function isDisable(x, y) {
  let me = localTableData[x].items[y];
  let aaar = [];
  if (me.input != "") {
    let valid = store.checkLogic(me.logic.id, me.standard, me.input);
    me.judgement = valid ? "OK" : "NG";
    aaar.push({ x, y });
  } else {
    me.judgement = "";
  }
  if (x == 0 && y == 0) {
    return false;
  } else {
    if (x == 0) {
      let myBro = localTableData[x].items[y - 1];

      return (myBro.input == "" || myBro.judgement == "NG") && myBro.check;
    } else {
      if (y == 0) {
        let myBro = localTableData[x - 1].items;
        let l = myBro.length - 1;
        let myRealBro = localTableData[x - 1].items[l];
        return (
          (myRealBro.input == "" || myRealBro.judgement == "NG") &&
          myRealBro.check
        );
      } else {
        let myBro = localTableData[x].items[y - 1];

        return (myBro.input == "" || myBro.judgement == "NG") && myBro.check;
      }
    }
  }
}

onMounted(() => {
  let xData = localTableData;

  xData[0].items.forEach((e, y) => {
    xData.forEach((v, x) => {
      let input = xData[x].items[y].input;
      const inputExist = inputArr.value.some(
        (item) => item.x === x && item.y === y
      );
      if (!inputExist) {
        if (input != "") {
          inputArr.value.push({ x, y });
        }
      }
    });
  });
});

function validateInput(x, y) {
  let me = localTableData[x].items[y];

  let filteredIdx = localTableData[x].items
    .map((e, i) => ({ check: e.check, idx: i }))
    .filter((e) => e.check)
    .map((e) => e.idx);

  let lastIndex = y === filteredIdx.at(-1);

  const inputExist = inputArr.value.some(
    (item) => item.x === x && item.y === y
  );

  if (!inputExist) {
    if (me.input != "") {
      inputArr.value.push({ x, y });
    }
  } else {
    if (me.input == "") {
      console.log("kosong");
      inputArr.value = inputArr.value.filter(
        (item) => !(item.x === x && item.y === y)
      );
    }
  }

  if (me.input !== "") {
    let valid = store.checkLogic(me.logic.id, me.standard, me.input);
    me.judgement = valid ? "OK" : "NG";

    if (!valid) {
      const alreadyExist = ngArr.value.some(
        (item) => item.x === x && item.y === y
      );
      if (!alreadyExist) {
        ngArr.value.push({ x, y });
      }
    } else {
      ngArr.value = ngArr.value.filter(
        (item) => !(item.x === x && item.y === y)
      );

      if (lastIndex) {
        mypos.value++; // fungsinya akan dibutuhkan di sini
        if (mypos.value >= max) {
          submit();
        }
      }
    }
  } else {
    me.judgement = "";
    ngArr.value = ngArr.value.filter((item) => !(item.x === x && item.y === y));
  }
}

const submit = () => {
  store.preload = true;
  let data = {
    pos: mypos.value >= max ? 0 : mypos.value,
    ng: ngArr.value.length > 0,
    tableData: toRaw(localTableData),
  };
  console.log({ data, max });
  setTimeout(() => {
    emit("emitReport", { ...data });
  }, 500);
};
</script>
