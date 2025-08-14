<template>
  <tbody class="processItem">
    <tr v-if="process == 'extruding' && heaterOn == 1">
      <td
        :rowspan="dataSet.insItem.length + 3"
        class="text-center processTitle"
      >
        {{ process }}
      </td>
      <td class="text-center">{{ lengthArr[process] - 1 }}</td>
      <td class="text-center">Dies temperature</td>
      <td class="text-center" colspan="4">
        Check temperature at beginning of production
      </td>
      <td class="text-center">Non-contact Thermometer</td>
      <td class="text-center">n=1</td>
      <td class="text-center" colspan="5">
        {{ appData.data.heaterTemp.input }} °C
      </td>
      <td
        style="font-size: 9pt"
        class="text-center font-weight-bold"
        colspan="2"
        v-if="appData.data.heaterTemp.judgement"
      >
        OK
      </td>
      <td
        style="font-size: 9pt"
        v-else
        class="text-center font-weight-bold"
        colspan="2"
      >
        NG
      </td>
    </tr>

    <tr v-if="process == 'extruding'">
      <td
        v-if="heaterOn == 0"
        :rowspan="dataSet.insItem.length + 2"
        class="text-center processTitle"
      >
        {{ process }}
      </td>
      <td class="text-center" rowspan="2">{{ lengthArr[process] }}</td>
      <td colspan="5" class="font-weight-bold">Appearance Standard</td>
      <td colspan="9" class="font-weight-bold">Result</td>
    </tr>
    <tr v-if="process == 'extruding'">
      <td colspan="5" height="300">
        <v-img
          height="200"
          :src="
            images.drw == '' || images.drw == undefined
              ? defDrawing
              : images.drw
          "
        ></v-img>
        Standard:
        <div class="w-100" v-if="extType == 'a'">
          ① Release Paper Color {{ appData.standard.color }} <br />
          ② Butyl tape can be peeled off from Release paper
        </div>

        <div class="w-100" v-if="extType != 'a'">
          Upper Surface: <br />
          ① {{ store.extBlabel[appData.standard.upper] }} <br />
          Bottom Surface: <br />
          ② {{ store.extBlabel[appData.standard.bottom] }}
        </div>
      </td>
      <td colspan="9">
        <v-row class="w-100">
          <v-col cols="5">
            <v-img
              height="200"
              :src="
                images.act == '' || images.act == undefined
                  ? defDrawing
                  : images.act
              "
            />
          </v-col>
          <v-col cols="7">
            <table class="w-100 mytable" v-if="extType == 'a'">
              <tbody>
                <tr>
                  <td colspan="3" class="text-center">Inspection Result</td>
                </tr>
                <tr>
                  <td>
                    <v-icon v-if="appData.data.color.judgement" size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2">
                    Release Paper Color {{ appData.standard.color }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-icon v-if="appData.data.peel.judgement" size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2">
                    Butyl tape can be peeled off from Release paper
                  </td>
                </tr>

                <tr class="bg-black">
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Judgement</td>
                  <td class="text-h5 text-center">
                    {{ appData.judgement == 0 ? "NG" : "OK" }}
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="w-100 mytable" v-if="extType != 'a'">
              <tbody>
                <tr>
                  <td class="text-center" colspan="3">Sheet Layout</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <v-icon
                      v-if="appData.data.sheetLayout.judgement"
                      size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2">
                    {{ appData.standard.sheetLayout }} pcs/sheet
                  </td>
                </tr>
                <tr>
                  <td class="text-center" colspan="3">
                    Upper Surface
                    {{ extType == "b" ? "(Select One)" : "(All Checked)" }}
                  </td>
                </tr>
                <tr
                  v-if="extType == 'c'"
                  v-for="(cb, cbindex) in appArr"
                  :key="cbindex"
                >
                  <td class="text-center">
                    <v-icon v-if="appData.data[cb].judgement" size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2" v-if="cb != 'upper'">
                    {{ store.extLabel[cb] }} {{ appData.standard[cb] }}
                    {{ cb == "holeCount" ? "hole(s)" : "mm" }}
                  </td>
                  <td colspan="2" v-else>
                    {{ store.extBlabel[appData.standard.upper] }}
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="(item, index) in store.extBlabel"
                  :key="index"
                >
                  <td class="text-center">
                    <v-icon
                      v-if="appData.data.upper.input == index"
                      size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2">{{ item }}</td>
                </tr>
                <tr>
                  <td class="text-center" colspan="3">
                    Bottom Surface (Select One)
                  </td>
                </tr>
                <tr
                  v-for="(cb2, cb2index) in [
                    'releasePaperYellow',
                    'releasePaperWhite',
                  ]"
                  :key="cb2index"
                >
                  <td class="text-center" style="width: 65px">
                    <v-icon v-if="appData.data.bottom.input == cb2" size="small"
                      >mdi-check</v-icon
                    >
                  </td>
                  <td colspan="2">{{ store.extBlabel[cb2] }}</td>
                </tr>

                <tr class="bg-black">
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Judgement</td>
                  <td class="text-h5 text-center">
                    {{ appData.judgement == 0 ? "NG" : "OK" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </v-col>
          <v-col
            class="text-error"
            cols="12"
            v-if="partType == 1 || partType == 2"
          >
            Note : Check release paper every change a new release paper
          </v-col>
        </v-row>
      </td>
    </tr>
    <tr v-for="(item, index) in dataSet.insItem" :key="index">
      <td
        v-if="index == 0 && process != 'extruding'"
        :rowspan="dataSet.insItem.length"
        class="text-center processTitle"
      >
        {{ process }}
      </td>
      <td class="text-center">{{ lengthArr[process] + index + 1 }}</td>

      <td class="text-center text-no-wrap">{{ item.label }}</td>
      <td
        class="text-center text-no-wrap"
        colspan="4"
        v-if="item.standard[0] != ''"
      >
        {{ store.checkLogic(item.logic.id, item.standard, "", true) }}
        {{ item.unit }}
      </td>
      <td colspan="4" class="text-center text-no-wrap" v-else>
        See the kneading report
      </td>
      <td class="text-center text-no-wrap">{{ item.method.romaji }}</td>
      <td class="text-center">n={{ item.sampleQ }}</td>
      <td
        v-if="item.standard[0] != ''"
        :class="
          dataItem.items[index].isCheck
            ? dataItem.items[index].judgement == 1
              ? 'text-center itemInput'
              : 'text-center itemInput text-error'
            : 'text-center bg-grey-lighten-2 itemInput'
        "
        v-for="(dataItem, dataIndex) in dataSet.data"
        :key="index"
      >
        {{ dataItem.items[index].input }}
      </td>
      <td
        style="padding-left: 0 !important; padding-right: 0 !important"
        v-if="item.standard[0] == '' && index == 0"
        colspan="7"
        :rowspan="dataSet.data.length"
      >
        <div class="w-100 h-100 d-flex align-center justify-center flex-column">
          <v-row class="w-100">
            <v-col
              cols="12"
              class="text-h2 text-center"
              v-if="dataSet.judgement == 'OK'"
            >
              OK
            </v-col>
            <v-col cols="12" class="text-h2 text-center" v-else> NG </v-col>
            <v-col cols="6">
              Quality PIC: <br />
              {{ dataSet.kneadingQlt.pic }}
            </v-col>
            <v-col cols="6">
              Approval Date: <br />
              {{ moment(dataSet.kneadingQlt.date).format("DD/MM/YYYY") }}
            </v-col>
            <v-col cols="12"
              >Please see the kneading report for more detail.</v-col
            >
          </v-row>
        </div>
      </td>
      <td v-if="item.standard[0] != ''" class="text-center" colspan="2">
        {{
          item.standard[0] != ""
            ? getJudgement(item.id, index)
              ? "OK"
              : "NG"
            : ""
        }}
      </td>
      <td
        class="bg-white text-center text-no-wrap"
        style="vertical-align: top"
        v-if="index == dataSet.insItem.length - 1"
      >
        <small>QC/PRODUCTION</small>
        <hr />
        <v-img class="my-2" height="40" :src="sign == null ? noImage : sign">
        </v-img>
        <small>{{ dataSet.inspector.userName }} </small>
      </td>
    </tr>
  </tbody>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import moment from "moment";
import defDrawing from "@/assets/defaultDesign.png";
import noImage from "@/assets/noImage.webp";

const props = defineProps([
  "partType",
  "dataSet",
  "process",
  "heaterOn",
  "lengthArr",
  "appData",
  "extType",
  "partNumber",
]);
const store = useAppStore();

const sign = ref(null);
const images = reactive({
  act: "",
  drw: "",
});

const appArr = ref(["upper", "holeCount", "holeA", "holeB", "holeC", "holeD"]);

const refresh = async () => {
  if (props.dataSet.insItem.length > 0)
    sign.value = await store.ajax(
      { userId: props.dataSet.inspector.userId },
      "/auth/getsignfile",
      "post"
    );
  if (props.process == "extruding") {
    const images_ = await store.ajax(
      { partNumber: props.partNumber },
      "/parts/getdrawing",
      "post"
    );

    images.act = images_.act;
    images.drw = images_.drw;
  }
  store.preload = false;
};

const getJudgement = (id, index) => {
  let r = [];
  const dataset = props.dataSet.data;
  dataset.forEach((element) => {
    if (element.items[index].isCheck) {
      r.push(element.items[index].judgement);
    }
  });
  return r.every((e) => e == 1);
};

onBeforeMount(() => {
  refresh();
});
</script>
