<template>
  <v-card
    title="New Inspection Item"
    subtitle="Please provide required item bellow"
  >
    <template #append>
      <v-btn flat icon @click="closeMe">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <template #text>
      <v-row>
        <v-col
          :cols="field.cols"
          v-for="(field, index) in structure_b"
          :key="index"
        >
          <div v-if="field.type == 'text' || field.type == 'number'">
            <v-text-field
              :disabled="
                (index == 'unit' && form.logicType == 1) ||
                (index == 'unit' && form.logicType == 8)
              "
              v-model="kneading_b_item[index]"
              class="mt-2 mb-0"
              variant="outlined"
              rounded="pill"
              density="compact"
              :label="field.label"
              :type="field.type"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <v-btn
            :disabled="
              kneading_b_item.itemLabel == '' ||
              kneading_b_item.sampleQ == '' ||
              kneading_b_item.sampleQ < 1
            "
            @click="addKneadingItem()"
            variant="outlined"
            rounded="pill"
            block
            dark
            :text="props.selectedData ? 'edit' : 'add'"
          ></v-btn>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>
<script setup>
const emit = defineEmits(["newItem"]);
const props = defineProps(["closeMe", "selectedData"]);
const kneading_b_item = reactive({
  itemLabel: props.selectedData ? props.selectedData.itemLabel : "",
  sampleQ: props.selectedData ? props.selectedData.sampleQ : 0,
});

const structure_b = {
  itemLabel: {
    label: "Inspection Item",
    type: "text",
    cols: "6",
  },
  sampleQ: {
    label: "Sample Quantity (n)",
    type: "number",
    cols: "6",
  },
};

const addKneadingItem = () => {
  emit("newItem", { ...kneading_b_item });
};
</script>
