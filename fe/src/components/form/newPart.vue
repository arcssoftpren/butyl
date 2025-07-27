<template>
  <div>
    <v-row>
      <v-col cols="8" id="part_id">
        <v-card>
          <template #title>Part Identity</template>
          <template #text>
            <v-row>
              <v-col cols="12">
                <v-divider class="mt-2"></v-divider>
              </v-col>
              <v-col
                class="pt-0"
                v-for="(field, index) in structure"
                :key="index"
                :cols="field.col"
              >
                <v-text-field
                  v-if="field.type != 'select'"
                  v-model="formData[index]"
                  :error-messages="
                    validate[index].$errors.map((e) => e.$message)
                  "
                  class="mt-2"
                  density="compact"
                  rounded="pill"
                  variant="outlined"
                  :label="field.label"
                  :hint="field.hint"
                  hide-spin-buttons
                  :hide-details="field.type != 'text'"
                  :type="field.type"
                >
                  <template #append-inner>
                    <div
                      v-if="
                        index == 'length' ||
                        index == 'width' ||
                        index == 'thickness'
                      "
                    >
                      mm
                    </div>
                  </template>
                </v-text-field>
                <v-autocomplete
                  v-model="formData[index]"
                  :error-messages="
                    validate[index].$errors.map((e) => e.$message)
                  "
                  item-title="typeNumber"
                  item-value="id"
                  class="mt-2"
                  density="compact"
                  rounded="pill"
                  variant="outlined"
                  :items="types"
                  :label="field.label"
                  :hint="field.hint"
                  hide-spin-buttons
                  :hide-details="field.type != 'text'"
                  :type="field.type"
                  v-else
                ></v-autocomplete>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="300" title="Drawing File">
          <template #text>
            <v-img
              height="150"
              v-if="formData.drawingFile != null"
              :src="previewURL"
            />
            <v-img height="150" v-else src="../../assets/engineer.png" />
          </template>
          <template #actions>
            <div class="ma-0 mb-2 pa-2 w-100">
              <v-file-input
                accept="image/*"
                :error-messages="
                  validate.drawingFile.$errors.map((e) => e.$message)
                "
                v-model="formData.drawingFile"
                rounded="pill"
                variant="outlined"
                label="Drawing File"
                density="compact"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
              />
            </div>
          </template>
        </v-card>
      </v-col>
      <v-col id="heading_type" cols="12">
        <v-card>
          <template #title> Heading and Kneading Type </template>
          <template #text>
            <v-row class="mt-2">
              <v-col cols="4">
                <v-card class="w-100" title="Header Type" density="compact">
                  <v-card-text>
                    <v-divider class="my-2"></v-divider>
                    <v-img
                      height="150"
                      :src="formData.headerType == 'a' ? headerA : headerB"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="w-100" title="Kneading Type" density="compact">
                  <v-card-text>
                    <v-divider class="my-2"></v-divider>
                    <v-img
                      height="150"
                      :src="
                        formData.kneadingType == 'a' ? kneadingA : kneadingB
                      "
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  class="w-100"
                  title="Extruding Standard Appearance Type"
                  density="compact"
                >
                  <v-card-text>
                    <v-divider class="my-2"></v-divider>
                    <v-img
                      v-if="formData.extrudingType == 'a'"
                      height="150"
                      :src="extA"
                    />
                    <v-img
                      v-if="formData.extrudingType == 'b'"
                      height="150"
                      :src="extB"
                    />

                    <v-img
                      v-if="formData.extrudingType == 'c'"
                      height="150"
                      :src="extC"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <VRow>
                  <v-col cols="12">
                    <v-divider class="my-5"></v-divider>
                    <h1 class="text-h5 w-100 text-center">
                      Extruding Appearance Standard
                    </h1>
                    <v-divider class="my-5"></v-divider>
                  </v-col>
                  <v-col cols="6" v-if="formData.extrudingType == 'a'">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      label="Release Paper color"
                      density="compact"
                      v-model="formData.appearanceStandard.a.paperColor"
                    >
                      <template #prepend-inner>1. </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" v-if="formData.extrudingType == 'a'">
                    <v-text-field
                      variant="outlined"
                      rounded="pill"
                      label="Butyl tape"
                      density="compact"
                      model-value="Butyl tape can be peeled off from Release paper"
                      disabled
                    >
                      <template #prepend-inner>2. </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="formData.extrudingType == 'b'">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          name="name"
                          label="Sheet layout/ シートレイアウト"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.b.sheetLayout"
                        >
                          <template #append-inner>Pcs/sheet</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-divider>Upper Surface</v-divider>
                        <div class="my-2">Please select one.</div>
                        <v-row>
                          <v-col
                            v-for="(item, index) in extBlabel"
                            :key="index"
                            cols="6"
                          >
                            <v-checkbox
                              density="compact"
                              hide-details=""
                              :label="item"
                              v-model="formData.appearanceStandard.b.upper"
                              :value="index"
                          /></v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-divider>Bottom Surface</v-divider>
                        <div class="my-2">Please select one.</div>
                        <v-row>
                          <v-col
                            v-for="(item, index) in extBlabel"
                            :key="index"
                            cols="6"
                          >
                            <v-checkbox
                              :label="item"
                              v-model="formData.appearanceStandard.b.bottom"
                              :value="index"
                              density="compact"
                              hide-details=""
                          /></v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" v-if="formData.extrudingType == 'c'">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          name="name"
                          label="Sheet layout/ シートレイアウト"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.sheetLayout"
                        >
                          <template #append-inner>Pcs/sheet</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          name="name"
                          label="Hole Count"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.holeCount"
                        >
                          <template #append-inner> holes</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          name="name"
                          label="Hole A"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.a"
                        >
                          <template #append-inner>mm</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          name="name"
                          label="Hole B"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.b"
                        >
                          <template #append-inner>mm</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          name="name"
                          label="Hole C"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.c"
                        >
                          <template #append-inner>mm</template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          name="name"
                          label="Hole D"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData.appearanceStandard.c.d"
                        >
                          <template #append-inner>mm</template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="6">
                        <v-divider>Upper Surface</v-divider>
                        <div class="my-2">Please select one.</div>
                        <v-row>
                          <v-col
                            v-for="(item, index) in extBlabel"
                            :key="index"
                            cols="6"
                          >
                            <v-checkbox
                              density="compact"
                              hide-details=""
                              :label="item"
                              v-model="formData.appearanceStandard.c.upper"
                              :value="index"
                          /></v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-divider>Bottom Surface</v-divider>
                        <div class="my-2">Please select one.</div>
                        <v-row>
                          <v-col
                            v-for="(item, index) in extBlabel"
                            :key="index"
                            cols="6"
                          >
                            <v-checkbox
                              :label="item"
                              v-model="formData.appearanceStandard.c.bottom"
                              :value="index"
                              density="compact"
                              hide-details=""
                          /></v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </VRow>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
      <v-col id="kneading_ins_item" cols="12">
        <v-card title="Inspection Items">
          <v-table class="mb-2" density="compact">
            <template #top>
              <v-toolbar
                :color="validate.kneadingItems.$error ? 'error' : ''"
                rounded="pill"
                density="compact"
              >
                <template #title
                  >Kneading Item List
                  <small v-if="validate.kneadingItems.$error">
                    [{{ validate.kneadingItems.minLength.$message }}]
                  </small>
                </template>
                <template #append>
                  <v-btn
                    v-if="formData.kneadingType == 'b'"
                    @click="openDialogKneading('new')"
                    variant="outlined"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    text="Add item"
                  />
                  <v-btn
                    v-else
                    @click="openDialogKneading('new_b')"
                    variant="outlined"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    text="Add item"
                  />
                </template>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Inspection Item</th>
                <th class="text-center">Type</th>
                <th class="text-center">Standard</th>
                <th class="text-center">Measurement tool</th>
                <th class="text-center">Sample Qty (N)</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody v-if="formData.kneadingType == 'b'">
              <tr v-if="formData.kneadingItems.length == 0">
                <td colspan="5" style="color: red">No Data</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in formData.kneadingItems"
                :key="index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center">{{ item.view.type }}</td>
                <td class="text-center">{{ item.view.standard }}</td>
                <td class="text-center">{{ item.sampleQ }}</td>
                <td class="text-center">{{ item.view.method.romaji }}</td>
                <td class="text-center pa-2">
                  <v-btn-group density="compact" variant="outlined">
                    <v-btn
                      @click="openDialogKneading('edit', item, index)"
                      icon="mdi-pencil"
                      color="primary"
                    ></v-btn>
                    <v-btn
                      @click="openDialogKneading('delete', item, index)"
                      icon="mdi-delete"
                      color="error"
                    ></v-btn>
                  </v-btn-group>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-if="formData.kneadingItems.length == 0">
                <td colspan="5" style="color: red">No Data</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in formData.kneadingItems"
                :key="index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center" colspan="3">See the kneading report</td>
                <td class="text-center">{{ item.sampleQ }}</td>

                <td class="text-center pa-2">
                  <v-btn-group density="compact" variant="outlined">
                    <v-btn
                      @click="openDialogKneading('edit_b', item, index)"
                      icon="mdi-pencil"
                      color="primary"
                    ></v-btn>
                    <v-btn
                      @click="openDialogKneading('delete', item, index)"
                      icon="mdi-delete"
                      color="error"
                    ></v-btn>
                  </v-btn-group>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-table class="mb-2" density="compact">
            <template #top>
              <v-toolbar
                :color="validate.extrudingItems.$error ? 'error' : ''"
                rounded="pill"
                density="compact"
              >
                <template #title>
                  Extruding Item List
                  <small v-if="validate.extrudingItems.$error">
                    [{{ validate.extrudingItems.minLength.$message }}]
                  </small>
                </template>
                <template #append>
                  <v-btn
                    @click="openDialog('new')"
                    variant="outlined"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    text="Add item"
                  />
                </template>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Inspection Item</th>
                <th class="text-center">Type</th>
                <th class="text-center">Standard</th>
                <th class="text-center">Sample Qty (N)</th>
                <th class="text-center">Measurement tool</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="formData.extrudingItems.length == 0">
                <td colspan="5" style="color: red">No Data</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in formData.extrudingItems"
                :key="index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center">{{ item.view.type }}</td>
                <td class="text-center">{{ item.view.standard }}</td>
                <td class="text-center">{{ item.sampleQ }}</td>
                <td class="text-center">{{ item.view.method.romaji }}</td>
                <td class="text-center pa-2">
                  <v-btn-group density="compact" variant="outlined">
                    <v-btn
                      @click="openDialog('edit', item, index)"
                      icon="mdi-pencil"
                      color="primary"
                    ></v-btn>
                    <v-btn
                      @click="openDialog('delete', item, index)"
                      icon="mdi-delete"
                      color="error"
                    ></v-btn>
                  </v-btn-group>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-table class="mb-2" density="compact" v-if="formData.pressEnable">
            <template #top>
              <v-toolbar
                :color="validate.pressItems.$error ? 'error' : ''"
                rounded="pill"
                density="compact"
              >
                <template #title>
                  Press Item List
                  <small v-if="validate.pressItems.$error">
                    [{{ validate.pressItems.required.$message }}]
                  </small>
                </template>
                <template #append>
                  <v-btn
                    @click="openDialog_press('new')"
                    variant="outlined"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    text="Add item"
                  />
                </template>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Inspection Item</th>
                <th class="text-center">Type</th>
                <th class="text-center">Standard</th>
                <th class="text-center">Sample Qty (N)</th>
                <th class="text-center">Measurement tool</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="formData.pressItems.length == 0">
                <td colspan="5" style="color: red">No Data</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in formData.pressItems"
                :key="index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center">{{ item.view.type }}</td>
                <td class="text-center">{{ item.view.standard }}</td>
                <td class="text-center">{{ item.sampleQ }}</td>
                <td class="text-center">{{ item.view.method.romaji }}</td>
                <td class="text-center pa-2">
                  <v-btn-group density="compact" variant="outlined">
                    <v-btn
                      @click="openDialog_press('edit', item, index)"
                      icon="mdi-pencil"
                      color="primary"
                    ></v-btn>
                    <v-btn
                      @click="openDialog_press('delete', item, index)"
                      icon="mdi-delete"
                      color="error"
                    ></v-btn>
                  </v-btn-group>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-table v-if="formData.outGoingEnabled" density="compact">
            <template #top>
              <v-toolbar
                :color="validate.outGoingItems.$error ? 'error' : ''"
                rounded="pill"
                density="compact"
                title="Outgoing Item List"
              >
                <template #title>
                  Outgoing Item List
                  <small v-if="validate.outGoingItems.$error">
                    [{{ validate.outGoingItems.required.$message }}]
                  </small>
                </template>
                <template #append>
                  <v-btn
                    @click="openDialog_outgoing('new')"
                    variant="outlined"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    text="Add item"
                  />
                </template>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Inspection Item</th>
                <th class="text-center">Type</th>
                <th class="text-center">Standard</th>
                <th class="text-center">Sample Qty (N)</th>
                <th class="text-center">Measurement tool</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="formData.outGoingItems.length == 0">
                <td colspan="5" style="color: red">No Data</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in formData.outGoingItems"
                :key="index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.itemLabel }}</td>
                <td class="text-center">{{ item.view.type }}</td>
                <td class="text-center">{{ item.view.standard }}</td>
                <td class="text-center">{{ item.sampleQ }}</td>
                <td class="text-center">{{ item.view.method.romaji }}</td>
                <td class="text-center pa-2">
                  <v-btn-group density="compact" variant="outlined">
                    <v-btn
                      @click="openDialog_outgoing('edit', item, index)"
                      icon="mdi-pencil"
                      color="primary"
                    ></v-btn>
                    <v-btn
                      @click="openDialog_outgoing('delete', item, index)"
                      icon="mdi-delete"
                      color="error"
                    ></v-btn>
                  </v-btn-group>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-btn @click="addPart" rounded="pill" variant="outlined" block dark>
      Create Part
    </v-btn>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="90%"
      transition="dialog-transition"
    >
      <newInsItem
        v-if="dialogKey == 'new'"
        v-on:new-item="addExtrudingItem"
        :close-me="closeDialog"
      />
      <editInstItem
        v-if="dialogKey == 'edit'"
        v-on:edit-item="editExtrudingItem"
        :selected-data="selectedItem"
        :close-me="closeDialog"
      />
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      scrollable
      persistent
      :overlay="false"
      max-width="90%"
      transition="dialog-transition"
    >
      <newInsItem
        v-if="dialogKey == 'new'"
        v-on:new-item="addKneadingItem"
        :close-me="closeDialog"
      />
      <editInstItem
        v-if="dialogKey == 'edit'"
        v-on:edit-item="editKneadingItem"
        :selected-data="selectedItem"
        :close-me="closeDialog"
      />
      <kneadingAform
        v-on:new-item="addKneadingItem"
        :close-me="closeDialog"
        v-if="dialogKey == 'new_b'"
      />

      <kneadingAform
        :selected-data="selectedItem"
        v-on:new-item="editKneadingItem"
        :close-me="closeDialog"
        v-if="dialogKey == 'edit_b'"
      />
    </v-dialog>
    <v-dialog
      v-model="dialog3"
      scrollable
      persistent
      :overlay="false"
      max-width="90%"
      transition="dialog-transition"
    >
      <newInsItem
        v-if="dialogKey == 'new'"
        v-on:new-item="addOutGoingItem"
        :close-me="closeDialog"
      />
      <editInstItem
        v-if="dialogKey == 'edit'"
        v-on:edit-item="editOutGoingItem"
        :selected-data="selectedItem"
        :close-me="closeDialog"
      />
    </v-dialog>
    <v-dialog
      v-model="dialog4"
      scrollable
      persistent
      :overlay="false"
      max-width="90%"
      transition="dialog-transition"
    >
      <newInsItem
        v-if="dialogKey == 'new'"
        v-on:new-item="addPressItem"
        :close-me="closeDialog"
      />
      <editInstItem
        v-if="dialogKey == 'edit'"
        v-on:edit-item="editPressItem"
        :selected-data="selectedItem"
        :close-me="closeDialog"
      />
    </v-dialog>
  </div>
</template>
<script setup>
import headerA from "@/assets/header_a.png";
import headerB from "@/assets/header_b.png";
import extA from "@/assets/extrudingA.png";
import extB from "@/assets/extrudingB.png";
import extC from "@/assets/extrudingC.png";
import kneadingA from "@/assets/kneading_a.png";
import kneadingB from "@/assets/kneading_b.png";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minValue } from "@vuelidate/validators";
import { requiredArrayIf, requiredIf } from "@/assets/customValidator";
import { useAppStore } from "@/stores/app";

const props = defineProps(["closeMe"]);
const extBlabel = {
  releasePaperYellow: "Release Paper Yellow 離型紙 黄",
  releasePaperWhite: "Release Paper White 離型紙 白",
  filmNoShiwa: "Film (No Shiwa) フィルムシワなし",
  filmShiwa: "Film (Shiwa) フィルムシワあり",
  arumi: "Aluminum foil アルミ付き",
};

const store = useAppStore();
const dialog = ref(false);
const dialog2 = ref(false);
const dialog3 = ref(false);
const dialog4 = ref(false);
const dialogKey = ref("");
const previewURL = ref(null);
const types = ref([]);

const formData = reactive({
  appearanceStandard: {
    a: {
      paperColor: "",
    },
    b: {
      upper: "",
      bottom: "",
      sheetLayout: "",
    },
    c: {
      upper: "",
      bottom: "",
      sheetLayout: "",
      holeCount: 0,
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    },
  },
  wpType: "",
  pcsPerSheet: 0,
  rpColor: "",
  customer: "",
  partName: "",
  partNumber: "",
  headerType: "a",
  kneadingType: "a",
  extrudingType: "a",
  kneadingItems: [],
  extrudingItems: [],
  pressEnable: false,
  pressItems: [],
  outGoingEnabled: false,
  outGoingItems: [],
  thickness: 0,
  width: 0,
  length: 0,
  sg: 0,
  heaterOn: false,
  drawingFile: null,
});

watch(
  () => formData.wpType,
  (e) => {
    console.log(e);
    if (e != null) {
      let theType = types.value.find((f) => f.id == e);

      ["pressOn", "outGoingOn", "heaterOn"].forEach((key) => {
        theType[key] =
          theType[key] == true || theType[key] === 1 ? true : false;
      });

      formData.heaterOn = theType.heaterOn;
      formData.outGoingEnabled = theType.outGoingOn;
      formData.pressEnable = theType.pressOn;

      formData.extrudingType = theType.extrudingType;
      formData.kneadingType = theType.kneadingType;
      formData.headerType = theType.headerType;
    }
  }
);

watch(
  computed(() => formData.drawingFile),
  async (file) => {
    if (file) {
      previewURL.value = await store.fileToDataURL(file);
    } else {
      previewURL.value = null;
    }
  }
);

const selectedItem = ref({});
const selectedIndex = ref(null);

const closeDialog = () => {
  dialog.value = false;
  dialog2.value = false;
  dialog3.value = false;
  dialog4.value = false;
  dialogKey.value = null;
};

watch(
  computed(() => formData.kneadingType),
  () => {
    formData.kneadingItems = [];
  }
);

// extruding functions (dialog)

const openDialog = (key, item, index) => {
  dialogKey.value = key;
  if (item) {
    if (key == "delete") {
      formData.extrudingItems.splice(index, 1);
    } else {
      selectedIndex.value = index;
      selectedItem.value = item;
      dialog.value = true;
    }
  } else {
    dialog.value = true;
  }
};
const addExtrudingItem = (item) => {
  formData.extrudingItems.push(item);
  dialog.value = false;
};
const editExtrudingItem = (item) => {
  formData.extrudingItems[selectedIndex.value] = item;
  dialog.value = false;
};

// Kneading functions (dialog2)

const openDialogKneading = (key, item, index) => {
  dialogKey.value = key;
  if (item) {
    if (key == "delete") {
      formData.kneadingItems.splice(index, 1);
    } else {
      selectedIndex.value = index;
      selectedItem.value = item;
      dialog2.value = true;
    }
  } else {
    dialog2.value = true;
  }
};
const addKneadingItem = (item) => {
  formData.kneadingItems.push(item);
  dialog2.value = false;
};
const editKneadingItem = (item) => {
  formData.kneadingItems[selectedIndex.value] = item;
  dialog2.value = false;
};

// Outgoing functions (dialog 3)

const openDialog_outgoing = (key, item, index) => {
  dialogKey.value = key;
  if (item) {
    if (key == "delete") {
      formData.outGoingItems.splice(index, 1);
    } else {
      selectedIndex.value = index;
      selectedItem.value = item;
      dialog3.value = true;
    }
  } else {
    dialog3.value = true;
  }
};
const addOutGoingItem = (item) => {
  formData.outGoingItems.push(item);
  dialog3.value = false;
};
const editOutGoingItem = (item) => {
  formData.outGoingItems[selectedIndex.value] = item;
  dialog3.value = false;
};

// Press functions (dialog 4)
const openDialog_press = (key, item, index) => {
  dialogKey.value = key;
  if (item) {
    if (key == "delete") {
      formData.pressItems.splice(index, 1);
    } else {
      selectedIndex.value = index;
      selectedItem.value = item;
      dialog4.value = true;
    }
  } else {
    dialog4.value = true;
  }
};
const addPressItem = (item) => {
  formData.pressItems.push(item);
  dialog4.value = false;
};
const editPressItem = (item) => {
  formData.pressItems[selectedIndex.value] = item;
  dialog4.value = false;
};

const structure = {
  customer: {
    type: "text",
    label: "Customer/客先",
    col: "6",
    hint: "Please enter your product name",
  },
  wpType: {
    type: "select",
    label: "WP Type",
    col: "6",
    hint: "Please select your product wp type",
  },
  partName: {
    type: "text",
    label: "Product Name/品名",
    col: "6",
    hint: "Please enter your product name",
  },
  partNumber: {
    type: "text",
    label: "Product Number/品番",
    col: "6",
    hint: "Please enter your product number",
  },
  thickness: {
    type: "number",
    label: "Product Thickness",
    col: "3",
  },
  width: {
    type: "number",
    label: "Product Width",
    col: "3",
  },
  length: {
    type: "number",
    label: "Product Length",
    col: "3",
  },
  sg: {
    type: "number",
    label: "Specific Gravity (SG)",
    col: "3",
  },
};

const rules = {
  customer: {
    required: helpers.withMessage("Customer name is required.", required),
  },
  wpType: {
    required: helpers.withMessage("WP Type is required.", required),
  },
  partName: {
    required: helpers.withMessage("Part name is required.", required),
  },
  partNumber: {
    required: helpers.withMessage("Part number is required.", required),
  },
  kneadingItems: {
    minLength: helpers.withMessage(
      "At least one kneading item is required.",
      required
    ),
  },
  extrudingItems: {
    minLength: helpers.withMessage(
      "At least one extruding item is required.",
      required
    ),
  },
  pressItems: {
    required: requiredArrayIf(
      () => formData.pressEnable,
      "Press items are required when press is enabled."
    ),
  },
  outGoingItems: {
    required: requiredArrayIf(
      () => formData.outGoingEnabled,
      "Outgoing items are required when outgoing is enabled."
    ),
  },
  thickness: {
    minValue: helpers.withMessage(
      "Thickness must be greater than 0.",
      minValue(0.01)
    ),
  },
  width: {
    minValue: helpers.withMessage(
      "Width must be greater than 0.",
      minValue(0.01)
    ),
  },
  length: {
    minValue: helpers.withMessage(
      "Length must be greater than 0.",
      minValue(0.01)
    ),
  },
  sg: {
    minValue: helpers.withMessage(
      "Specific gravity must be greater than 0.",
      minValue(0.01)
    ),
  },
  drawingFile: {
    fileOrNull: helpers.withMessage(
      "Drawing file must be a valid file.",
      required
    ),
  },
};

const validate = useVuelidate(rules, formData);

const addPart = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        text: "Please provide all required data.",
        icon: "error",
      };
    store.preload = true;
    const fd = new FormData();
    formData.pressEnable = formData.pressEnable ? 1 : 0;
    formData.outGoingEnabled = formData.outGoingEnabled ? 1 : 0;
    formData.heaterOn = formData.heaterOn ? 1 : 0;

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
      } else if (Array.isArray(value) || typeof value === "object") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    await store.ajax(fd, "/parts/add", "post", true);
    store.preload = false;
    props.closeMe();
  } catch (error) {
    console.log(error);
    store.swal.fire(error);
    store.preload = false;
  }
};

onBeforeMount(async () => {
  types.value = await store.ajax({}, "/parts/gettypes", "post");
  store.preload = false;
});
</script>
