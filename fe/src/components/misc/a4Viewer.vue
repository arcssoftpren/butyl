<template>
  <div class="w-100 h-100">
    <div class="w-100 text-end">PT. Softpren Industries Indonesia</div>

    <table class="w-100">
      <thead>
        <tr>
          <th colspan="19" class="text-h4">PART INSPECTION REPORT</th>
        </tr>
      </thead>
      <tbody style="font-size: 10pt">
        <tr>
          <td colspan="3" class="text-no-wrap">
            Customer <br />
            客先
          </td>
          <td class="text-no-wrap">{{ selected.partData.customer }}</td>
          <td colspan="2" class="text-no-wrap">
            Product number <br />
            品番
          </td>
          <td colspan="9" class="text-no-wrap">
            {{ selected.partData.partNumber }}
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-no-wrap">
            Product name <br />
            品名
          </td>
          <td class="text-no-wrap">{{ selected.partData.partName }}</td>
          <td colspan="2" class="text-no-wrap">
            Size <br />
            寸法
          </td>
          <td colspan="7">
            {{ selected.partData.thickness }} x {{ selected.partData.width }} x
            {{ selected.partData.length }} mm
          </td>
          <td>SG</td>
          <td>{{ selected.partData.sg }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-no-wrap">
            Produced QTY <br />
            生産数
          </td>
          <td>{{ selected.prodQty }}</td>
          <td
            class="text-no-wrap"
            colspan="2"
            v-if="selected.partData.headerType == 'a'"
          >
            Delivery date <br />
            納期
          </td>
          <td
            class="text-no-wrap"
            colspan="9"
            v-if="selected.partData.headerType == 'a'"
          >
            {{ moment(selected.deliveryDate).format("DD/MM/YYYY") }}
          </td>
          <td
            class="text-no-wrap"
            colspan="2"
            v-if="selected.partData.headerType == 'b'"
          >
            Order No <br />
            注文番号
          </td>
          <td
            class="text-no-wrap"
            colspan="9"
            v-if="selected.partData.headerType == 'b'"
          >
            {{ selected.orderNumber }}
          </td>
        </tr>

        <tr>
          <td class="text-no-wrap" colspan="3">
            Kneading Lot No. <br />
            混練ロット番号
          </td>
          <td class="text-no-wrap">{{ selected.kneadingLot }}</td>
          <td class="text-no-wrap" colspan="2">
            Extruding Lot No. <br />
            押出ロット番号
          </td>
          <td class="text-no-wrap" colspan="9">{{ selected.extrudingLot }}</td>
        </tr>
        <tr>
          <td colspan="19"></td>
        </tr>
        <!-- kneading -->
        <tr>
          <td
            class="text-center"
            style="writing-mode: sideways-lr"
            :rowspan="selected.kneading.length + 2"
          >
            Kneading
          </td>
          <td rowspan="2" class="text-center">No.</td>

          <td rowspan="2" class="text-center text-no-wrap">
            Inspection items <br />
            検査項目
          </td>
          <td rowspan="2" colspan="3" class="text-center">
            Standard <br />
            規格
          </td>
          <td rowspan="2" class="text-center text-no-wrap">
            Measurement tool <br />
            測定具
          </td>
          <td rowspan="2" class="text-center">
            Inspection number <br />
            検査数
          </td>
          <td colspan="7" class="text-no-wrap">Inspection result 測定結果</td>
        </tr>
        <tr>
          <td class="text-center" style="width: 55px">1</td>
          <td class="text-center" style="width: 55px">2</td>
          <td class="text-center" style="width: 55px">3</td>
          <td class="text-center" style="width: 55px">4</td>
          <td class="text-center" style="width: 55px">5</td>
          <td colspan="2" class="text-no-wrap">Judgement result</td>
        </tr>
        <tr v-for="(item, index) in selected.kneading" :key="index">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">
            {{ item.itemLabel }} <br />{{ item.itemLabelJapanese }}
          </td>
          <td class="text-center" colspan="3">
            {{ item.view.standard }}
          </td>
          <td class="text-center text-no-wrap">
            {{ item.view.method.romaji }} <br />
            {{ item.view.method.japanese }}
          </td>
          <td class="text-center">n={{ item.sampleQ }}</td>
          <td
            colspan="7"
            v-if="index == 0 || selected.kneadingType == 'b'"
            rowspan="2"
            style="border-bottom: none"
          >
            <div class="text-center w-100 d-flex justify-center align-center">
              <span
                class="text-h4"
                v-if="selected.kneadingIns.judgement == 'OK'"
                style="border: 2px solid; border-radius: 50%; padding: 5px"
              >
                OK
              </span>
              <span class="text-h4" v-else>OK</span>
              <span class="text-h4">/</span
              ><span
                class="text-h4"
                v-if="selected.kneadingIns.judgement == 'NG'"
                style="border: 2px solid; border-radius: 50%; padding: 5px"
              >
                OK
              </span>
              <span class="text-h4" velse>NG</span>
            </div>
          </td>
        </tr>
        <!-- kneading ends -->
      </tbody>
    </table>
  </div>
</template>
<style scoped>
table {
  border: 1px solid;
  border-collapse: collapse;
}

table,
td,
th {
  border: 1px solid;
  border-collapse: collapse;
}

td {
  padding: 5px;
}

table.noborder {
  border: none !important;
}

table.noborder tbody td {
  border: none !important;
}
</style>
<script setup>
import moment from "moment";

const props = defineProps(["selected"]);
</script>
