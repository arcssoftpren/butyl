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
      <v-divider class="mb-5"></v-divider>
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
              class="pb-0 pt-0"
              :cols="field.cols"
              v-for="(field, index) in structure"
              :key="index"
            >
              <div v-if="field.type == 'text' || field.type == 'number'">
                <v-text-field
                  :disabled="
                    (index == 'unit' && form.logicType == 1) ||
                    (index == 'unit' && form.logicType == 8)
                  "
                  v-model="form[index]"
                  class="mt-2 mb-0"
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  :label="field.label"
                  :type="field.type"
                />
              </div>
              <div v-else>
                <v-select
                  v-if="index == 'logicType'"
                  :item-props="itemProps"
                  label="Logic Type"
                  class="mt-2 mb-0"
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  :items="logics"
                  v-model="logicType"
                >
                </v-select>
                <v-select
                  v-else
                  :item-props="itemPropsMethods"
                  label="Methode"
                  class="mt-2 mb-0"
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  v-model="method"
                  :items="methods"
                >
                </v-select>
              </div>
            </v-col>
            <v-col cols="12">
              <v-divider>Standard Value</v-divider>
            </v-col>
            <v-col cols="8">
              <div v-if="logicType.id == 1">
                <v-text-field
                  readonly
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="text"
                  label="Standard"
                  v-model="form.standard[0]"
                >
                  <template #append-inner>{{ form.unit }}</template>
                </v-text-field>
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{ (form.view.standard = `${form.standard[0]}`) }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 2">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Minimal Value"
                      v-model="form.standard[0]"
                    >
                      <template #append-inner>
                        {{ form.unit }}
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Maximal Value"
                      v-model="form.standard[1]"
                    >
                      <template #append-inner>
                        {{ form.unit }}
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-divider>Standard Preview in Document</v-divider>

                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `${form.standard[0]} ~ ${form.standard[1]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 3">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="number"
                  label="Larget Than:"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `> ${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 4">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="number"
                  label="Less Than"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `< ${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 5">
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Target"
                      v-model="form.standard[0]"
                    />
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Upper (+)"
                      v-model="form.standard[1]"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      type="number"
                      label="Lower (-)"
                      v-model="form.standard[2]"
                    />
                  </v-col>
                </v-row>
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `${form.standard[0]}, +${form.standard[1]}; -${form.standard[2]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 6">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="number"
                  label="Larger Than and Equal:"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `≥ ${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 7">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="number"
                  label="Less Than and Equal:"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `≤ ${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 8">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="text"
                  label="Match text:"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
              <div v-if="logicType.id == 9">
                <v-text-field
                  variant="outlined"
                  rounded="pill"
                  density="compact"
                  type="number"
                  label="Match Exact Number:"
                  v-model="form.standard[0]"
                />
                <v-divider>Standard Preview in Document</v-divider>
                <v-sheet
                  height="20vh"
                  class="w-100 text-center d-flex justify-center align-center"
                >
                  <v-card>
                    <template #text>
                      {{
                        (form.view.standard = `${form.standard[0]} ${form.unit}`)
                      }}
                    </template>
                  </v-card>
                </v-sheet>
              </div>
            </v-col>
            <v-col cols="4">
              <v-card title="Logic Explaination" density="compact">
                <template #text>
                  <div>
                    {{ logicType.description }}
                  </div>
                  <v-divider class="mb-2"></v-divider>
                  <h1 class="text-h6">Standard Example:</h1>
                  <div v-if="logicType.id == 1">
                    <div>
                      It can be any value, such as text or numbers, and is
                      commonly used in visual inspection methods.
                    </div>
                    <v-divider class="mb-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-btn-toggle mandatory model-value="1" density="compact">
                        <v-btn value="1" color="success">OK</v-btn>
                        <v-btn value="2" color="error">NG</v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>
                  <div v-if="logicType.id == 2">
                    <div>length: 250mm ~ 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            class="mt-2"
                            label="Min"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="250"
                            readonly=""
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            class="mt-2"
                            label="Max"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="255"
                        readonly
                      />
                    </div>
                  </div>

                  <div v-if="logicType.id == 3">
                    <div>length: > 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Larger Than"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="300"
                        readonly=""
                      />
                    </div>
                  </div>
                  <div v-if="logicType.id == 4">
                    <div>length: < 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Less Than"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="295"
                        readonly=""
                      />
                    </div>
                  </div>

                  <div v-if="logicType.id == 5">
                    <div>length: 300, +50 -10</div>
                    <div>
                      <v-row>
                        <v-col cols="4">
                          <v-text-field
                            class="mt-2"
                            label="Target"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            class="mt-2"
                            label="Upper (+)"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="50"
                            readonly=""
                          />
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            class="mt-2"
                            label="Lower (-)"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="10"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="295"
                        readonly
                      />
                    </div>
                  </div>

                  <div v-if="logicType.id == 6">
                    <div>length: ≥ 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Larget Than Equal"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="330"
                        readonly=""
                      />
                    </div>
                  </div>

                  <div v-if="logicType.id == 7">
                    <div>length: ≤ 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Larget Than Equal"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Length"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="285"
                        readonly=""
                      />
                    </div>
                  </div>
                  <div v-if="logicType.id == 8">
                    <div>Color: Black</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Exact Match Text"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="Black"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Color"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="Black"
                        readonly=""
                      />
                    </div>
                  </div>
                  <div v-if="logicType.id == 9">
                    <div>Length: 300mm</div>
                    <div>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            class="mt-2"
                            label="Exact Match Number"
                            :type="logicType.inputType"
                            variant="outlined"
                            rounded="pill"
                            density="compact"
                            hide-details
                            hide-spin-buttons=""
                            model-value="300"
                            readonly=""
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <h1 class="text-h6">Inspection Input Example:</h1>
                    <div>
                      <v-text-field
                        class="mt-2"
                        label="Color"
                        :type="logicType.inputType"
                        variant="outlined"
                        rounded="pill"
                        density="compact"
                        hide-details
                        hide-spin-buttons=""
                        model-value="300"
                        readonly=""
                      />
                    </div>
                  </div>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="mb-2"></v-divider>
      <v-btn
        variant="outlined"
        rounded="pill"
        :disabled="!isInvalid"
        block
        dark
        @click="submit"
        >Add</v-btn
      >
    </template>
  </v-card>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const emit = defineEmits(["newItem"]);
const props = defineProps(["closeMe"]);
const store = useAppStore();
const form = reactive({
  itemLabel: "",
  methode: 1,
  itemLabelJapanese: "",
  logicType: 1,
  standard: ["OK"],
  sampleQ: 0,
  unit: "",
  view: {
    standard: "",
    type: "OK/NG Option",
    method: {
      romaji: "Digital Scale/SG Bottle",
      japanese: "電子天秤/比重瓶",
    },
  },
});
const logics = ref([]);
const methods = ref([]);
const method = ref({
  id: 1,
  romaji: "Digital Scale/SG Bottle",
  japanese: "電子天秤/比重瓶",
});
const logicType = ref({
  id: 1,
  description:
    "Options that provide OK/NG buttons for determining the inspection result.",
  label: "OK/NG Option",
  inputType: "buttonToggle",
});

const structure = {
  itemLabel: {
    label: "Inspection Item",
    type: "text",
    cols: "3",
  },
  logicType: {
    label: "Logic Type",
    type: "select",
    cols: "3",
  },
  sampleQ: {
    label: "Sample Quantity (n)",
    type: "text",
    cols: "3",
  },
  unit: {
    label: "Unit (m,mm,cm,kg etc)",
    type: "text",
    cols: "3",
  },
  itemLabelJapanese: {
    label: "Inspection Item Japanese",
    type: "text",
    cols: "6",
  },
  methode: {
    label: "Measurement Tool",
    type: "select",
    cols: "6",
  },
};

watch(logicType, (e) => {
  form.logicType = e.id;
  if (e.id == 1) {
    form.standard = ["OK"];
  } else {
    form.standard = [];
  }
  form.unit = "";
  form.view.type = e.label;
});

watch(method, (e) => {
  form.methode = e.id;
  form.view.method = {
    romaji: e.romaji,
    japanese: e.japanese,
  };
});

const itemProps = (item) => {
  return {
    title: item.label,
    subtitle: item.description,
  };
};

const itemPropsMethods = (item) => {
  return {
    title: item.romaji,
    subtitle: item.japanese,
  };
};

const refresh = async () => {
  logics.value = await store.ajax({}, "/inspection/logics", "post");
  methods.value = await store.ajax({}, "/inspection/methods", "post");
  store.preload = false;
};

onBeforeMount(() => {
  refresh();
});

const isInvalid = computed(() => {
  const obj = form;

  if (!obj.itemLabel || obj.itemLabel.trim() === "") return false;

  if (!Array.isArray(obj.standard) || obj.standard.length === 0) return false;

  if (obj.standard.some((s) => s.trim() === "")) return false;

  const sampleQ = Number(obj.sampleQ);
  if (isNaN(sampleQ) || sampleQ <= 0) return false;

  return true;
});

const submit = () => {
  if (logicType.value == 1) {
    form.standard = [0];
  }
  emit("newItem", { ...form });
};
</script>
