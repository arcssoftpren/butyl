<template>
  <v-table class="mytable">
    <thead>
      <tr>
        <th rowspan="2" class="text-center">Inspection Item</th>
        <th rowspan="2" class="text-center">Standard</th>
        <th rowspan="2" class="text-center">Measurement tool</th>
        <th rowspan="2" class="text-center">n</th>
        <th :colspan="insData.kneadingData.length" class="text-center">
          Inspection result
        </th>
      </tr>
      <tr>
        <td v-for="(item, index) in insData.extrudingData" :key="index">
          {{ item.key }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-if="insData.partData.heaterCheck">
        <td class="text-center">Dies temperature</td>
        <td class="text-center">
          Check temperature at beginning of production
        </td>
        <td class="text-center">Non-contact Thermometer</td>
        <td class="text-center">n=1</td>
        <td :colspan="insData.kneadingData.length" class="text-center">
          Inspection result
        </td>
      </tr>
      <tr>
        <td colspan="2"></td>
        <td :colspan="insData.kneadingData.length + 2" class="text-center"></td>
      </tr>
      <tr v-for="(item, index) in insData.partData.extrudingItems" :key="index">
        <td class="text-center">
          {{ item.label }}
        </td>
        <td class="text-center text-no-wrap">
          {{ store.checkLogic(item.logic.id, item.standard, "", true) }}
          {{ item.unit }}
        </td>
        <td class="text-center">
          {{ item.method.romaji }}
        </td>
        <td class="text-center">n={{ item.sampleQ }}</td>
        <td
          v-show="xitm.items[index].check"
          :colspan="item.sampleQ == 1 ? '5' : 0"
          v-for="(xitm, xind) in insData.extrudingData"
          :key="xind"
        >
          <div class="w-100 h-100 d-flex align-center justify-center">
            <v-text-field
              :disabled="isDisable(xind, index)"
              v-if="
                xitm.items[index].check &&
                item.logic.inputType != 'buttonToggle'
              "
              :error="!verifyLogic(xind, index)"
              variant="outlined"
              rounded="pill"
              density="compact"
              hide-details=""
              width="90"
              v-model="instData_.extrudingData[xind].items[index].input"
            />
            <v-btn-toggle
              @click="verifyLogic(xind, index)"
              :disabled="isDisable(xind, index)"
              style="width: 100%"
              v-if="item.logic.inputType == 'buttonToggle'"
              variant="outlined"
              rounded="pill"
              density="compact"
              mandatory
              v-model="instData_.extrudingData[xind].items[index].input"
            >
              <v-btn style="width: 50%" color="success" value="OK">OK</v-btn>
              <v-btn value="NG" style="width: 50%" color="pink">NG</v-btn>
            </v-btn-toggle>
          </div>
        </td>
        <td></td>
      </tr>
    </tbody>
  </v-table>
</template>
<style scoped>
.mytable td,
.mytable th,
.mytable table,
.mytable tr {
  border: black, 1px, solid !important;
}
</style>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["insData"]);
const instData_ = ref(props.insData);
const store = useAppStore();
const formData = reactive({});
const structure = {};
const rules = {};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.validate();
    if (valid) {
    } else {
    }
  } catch (error) {}
};
const judgementArr = ref([]);

function isDisable(Xind, Yindex) {
  const nData = instData_.value.extrudingData[Xind].items;
  if (Xind == 0 && Yindex == 0) {
    return false;
  } else {
    if (Xind == 0) {
      const check = nData[Yindex - 1].check;
      if (check) {
        return nData[Yindex - 1].input == "";
      } else {
        return false;
      }
    } else {
      if (Yindex == 0) {
        let nDataBefore = instData_.value.extrudingData[Xind - 1];
        let lastInd = nDataBefore.items.length - 1;
        let lastData = nDataBefore.items[lastInd];
        if (lastData.check) {
          return lastData.input == "";
        }
      } else {
        const check = nData[Yindex - 1].check;
        if (check) {
          return nData[Yindex - 1].input == "";
        } else {
          let nDataBefore = instData_.value.extrudingData[Xind - 1];
          let lastInd = nDataBefore.items.length - 1;
          let lastData = nDataBefore.items[lastInd];
          if (lastData.check) {
            return lastData.input == "";
          }
        }
      }
    }
  }
}

function verifyLogic(xind, index) {
  const nData = instData_.value.extrudingData[xind].items;
  const myData = nData[index];
  const input = myData.input;
  const standard = myData.standard;
  const logic = myData.logic.id;

  let valid = store.checkLogic(logic, standard, input);
  instData_.value.extrudingData[xind].items[index].judgement = valid
    ? "OK"
    : "NG";
  const newJudgementArr = [];
  instData_.value.extrudingData.forEach((element) => {
    element.items.forEach((e) => {
      if (e.check) {
        newJudgementArr.push(e.judgement);
      }
    });
  });
  judgementArr.value = newJudgementArr;
  const ngN = nData.find((e) => e.judgement == "NG" && e.input != "");

  console.log(ngN);
  return valid;
}
</script>
