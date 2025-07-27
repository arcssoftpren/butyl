<template>
  <v-card v-if="typeA">
    <template #text>
      <div class="text-h6">
        Kneading type A is detected please confirm the inspection result from
        kneading report reference.
      </div>
      <v-divider class="my-2">RESULT</v-divider>
      <v-btn-toggle
        rounded="pill"
        variant="outlined"
        v-model="typeAJudgement"
        mandatory
        class="w-100 mt-5"
      >
        <v-btn value="OK" class="w-50" color="success">OK</v-btn>
        <v-btn value="NG" class="w-50" color="error">NG</v-btn>
      </v-btn-toggle>
    </template>
  </v-card>
  <v-card v-else>
    nArr={{ nArr }}
    <v-stepper v-model="currentStep">
      <template #default="{ prev, next }">
        <v-stepper-header>
          <template v-for="(item, index) in nArr" :key="`N${item}`">
            <v-stepper-item :value="`N${item}`"> </v-stepper-item>
          </template>
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item
            v-for="(i, ind) in nArr"
            :key="ind"
            :value="`N${i}`"
          >
            <v-card color="grey-lighten-1">
              <v-stepper v-model="step2">
                <v-stepper-header v-show="false">
                  <template
                    v-for="(question, index) in instData[`N${i}`]"
                    :key="index"
                  >
                    <v-stepper-item :value="`${index + 1}`"> </v-stepper-item>
                  </template>
                </v-stepper-header>
                <v-stepper-window>
                  <v-stepper-window-item
                    v-for="(question, index) in instData[`N${i}`]"
                    :key="index"
                    :value="`${index + 1}`"
                  >
                    {{ question }}
                  </v-stepper-window-item>
                </v-stepper-window>

                <v-stepper-actions
                  @click:next="step2++"
                  @click:prev="step2--"
                ></v-stepper-actions>
              </v-stepper>
            </v-card>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions
          @click:next="currentStep++"
          @click:prev="currentStep--"
        ></v-stepper-actions>
      </template>
    </v-stepper>
  </v-card>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";

const emit = defineEmits(["kneadingAdd"]);
const props = defineProps(["selectedData"]);
const { kneading, partData } = props.selectedData;
const store = useAppStore();
const typeB = partData.kneadingType == "b";
const typeA = partData.kneadingType == "a";

const typeAJudgement = ref("");

const formData = reactive({
  inspectionDate: moment().format("YYYY-MM-DD"),
  inspector: store.userData.userName,
  result: [],
  judgement: "",
});

const instData = ref([]);
const nArr = ref([]);
const currentStep = ref(null);
const step2 = ref(1);

watch(typeAJudgement, async (a) => {
  formData.judgement = a;
  emit("kneadingAdd", { ...formData });
});

onBeforeMount(() => {
  let qArr = kneading.map((k) => parseInt(k.sampleQ, 10));

  const max = Math.max(...qArr);
  const filledArr = Array(max).fill(0);
  let n = 1;

  instData.value = {}; // pastikan ini object, bukan array
  nArr.value = []; // clear array dulu, biar nggak dobel

  filledArr.forEach(() => {
    const key = `N${n}`;
    nArr.value.push(n); // string seperti "N1"
    instData.value[key] = kneading.filter((f) => parseInt(f.sampleQ) >= n);
    n++;
  });

  currentStep.value = nArr.value[0]; // set awalnya N1
});
</script>
