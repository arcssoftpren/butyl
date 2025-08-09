<template>
  <v-stepper alt-labels editable="" v-model="step">
    <v-stepper-header>
      <v-stepper-item value="1">PART IDENTITY & DESIGN</v-stepper-item>
      <v-stepper-item value="2">KNEADING ITEMS</v-stepper-item>
      <v-stepper-item value="3">EXTRUDING ITEMS</v-stepper-item>
      <v-stepper-item value="4">EXTRUDING APPEARANCE</v-stepper-item>
      <v-stepper-item v-if="formData.pressOn" value="5">
        PRESS ITEMS
      </v-stepper-item>
      <v-stepper-item
        v-if="formData.outgoingOn"
        :value="formData.pressOn ? '6' : '5'"
      >
        OUTGOING ITEMS
      </v-stepper-item>
      <v-stepper-item :value="getSumVal()"> SUMMARY </v-stepper-item>
    </v-stepper-header>
    <v-stepper-window>
      <v-stepper-window-item value="1">
        <v-file-input
          v-model="formData.partDrawing"
          class="d-none"
          type="file"
          variant="outlined"
          rounded="pill"
          density="compact"
          ref="partDrawing"
        />
        <v-file-input
          v-model="formData.actImage"
          class="d-none"
          variant="outlined"
          rounded="pill"
          density="compact"
          ref="actImage"
        />
        <v-row>
          <v-col cols="4">
            <v-card height="447" title="Part Identity">
              <template #text>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-on:update:model-value="next(1)"
                      v-model="formData.partType"
                      :items="types"
                      item-title="typeNumber"
                      item-value="id"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      label="WIP Type"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      @keyup="next(1)"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      label="Customer"
                      v-model="formData.customer"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      @keyup="next(1)"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      label="Part Number"
                      v-model="formData.partNumber"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      @keyup="next(1)"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      label="Part Name"
                      v-model="formData.partName"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox-btn
                      :disabled="formData.partType == null"
                      v-for="(item, index) in addIns"
                      :key="index"
                      :label="item"
                      v-model="formData[index]"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-card>
          </v-col>
          <v-col cols="8">
            <v-card title="Dimensions & Drawings">
              <template #text>
                <v-row>
                  <v-col cols="6">
                    <v-card title="Part Drawing" class="h-100">
                      <template #append>
                        <v-btn
                          @click="partDrawing.click()"
                          size="small"
                          prepend-icon="mdi-folder-open"
                        >
                          browse
                        </v-btn>
                      </template>
                      <template #text>
                        <v-img
                          height="225"
                          :src="
                            partDrawingUrl == null ? defDrawing : partDrawingUrl
                          "
                        ></v-img>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card title="Part Actual Image" class="h-100">
                      <template #append>
                        <v-btn
                          size="small"
                          prepend-icon="mdi-folder-open"
                          @click="actImage.click()"
                        >
                          browse
                        </v-btn>
                      </template>
                      <template #text>
                        <v-img
                          height="225"
                          :src="actImageUrl == null ? defDrawing : actImageUrl"
                        ></v-img>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col
                        cols="3"
                        v-for="(item, index) in formData"
                        :key="index"
                        v-show="
                          ['width', 'thickness', 'length', 'sg'].includes(index)
                        "
                      >
                        <v-text-field
                          @keyup="next(1)"
                          type="number"
                          variant="outlined"
                          rounded="pill"
                          density="compact"
                          v-model="formData[index]"
                        >
                          <template #append-inner>
                            <span v-if="index != 'sg'">mm</span>
                          </template>
                          <template #label>
                            <div class="text-capitalize">{{ index }}</div>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-btn
              :disabled="!buttonValid"
              @click="step++"
              variant="outlined"
              rounded="pill"
              block
            >
              Next
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-window-item>
      <v-stepper-window-item value="2">
        <v-row>
          <v-col cols="12">
            <v-card title="Kneading Inspection Items">
              <template #text>
                <v-toolbar color="transparent" rounded="xl">
                  <template #title>
                    <v-autocomplete
                      v-model="newItem"
                      :items="insItem"
                      :item-title="
                        (item) => `${item.inspectionLable} (${item.label})`
                      "
                      item-value="insId"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      hide-details
                    >
                    </v-autocomplete>
                  </template>
                  <template #append>
                    <v-btn
                      @click="addItem('kneadingItems')"
                      size="small"
                      flat
                      icon="mdi-plus"
                      rounded="pill"
                      block
                    />
                  </template>
                </v-toolbar>
                <v-table fixed-header="" height="350">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Inspection Item</th>
                      <th class="text-center">Standard</th>
                      <th
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        Unit
                      </th>
                      <th
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        Tool/Method
                      </th>
                      <th
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        n=
                      </th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in formData.kneadingItems"
                      :key="index"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center text-no-wrap">{{ item.label }}</td>
                      <td
                        class="text-center"
                        v-if="formData.kneadingType == 'a'"
                      >
                        See the kneading report
                      </td>
                      <td class="text-center" v-else>
                        <v-row>
                          <v-col
                            :cols="12 / item.standard.length"
                            v-for="(std, ind) in item.standard"
                            :key="ind"
                          >
                            <!-- Case: logic.id == 1, 8, 16 (Plain text input) -->
                            <v-text-field
                              v-if="[1, 8, 16].includes(item.logic.id)"
                              @keyup="next(2)"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <div v-if="item.logic.id == 17">
                              <v-text-field
                                @keyup="next(2)"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #prepend-inner v-if="ind == 1"
                                  >±</template
                                >
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 2 (Number range with ~) -->
                            <div v-if="item.logic.id == 2">
                              <v-text-field
                                @keyup="next(2)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">~</template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 3 (>) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 3"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>></template>
                            </v-text-field>

                            <!-- Case: logic.id == 4 (<) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 4"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append><</template>
                            </v-text-field>

                            <!-- Case: logic.id == 5 (±) -->
                            <div v-if="item.logic.id == 5">
                              <v-text-field
                                @keyup="next(2)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">,</template>
                                <template #append v-if="ind == 1">,</template>
                                <template #prepend-inner v-if="ind != 0">
                                  {{ ind == 1 ? "+" : "-" }}
                                </template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 6 (≥) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 6"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≥</template>
                            </v-text-field>

                            <!-- Case: logic.id == 7 (≤) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 7"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≤</template>
                            </v-text-field>

                            <!-- Case: logic.id == 9 (=) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 9"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <!-- Case: logic.id == 10 (≠) -->
                            <v-text-field
                              @keyup="next(2)"
                              v-if="item.logic.id == 10"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≠</template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                      <td
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        <v-text-field
                          width="65"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          hide-details=""
                          v-model="formData.kneadingItems[index].unit"
                        />
                      </td>
                      <td
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        {{ item.method.romaji }}
                      </td>
                      <td
                        class="text-center"
                        v-if="formData.kneadingType == 'b'"
                      >
                        <v-text-field
                          @keyup="next(2)"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          type="number"
                          hide-details=""
                          hide-spin-buttons=""
                          v-model="item.sampleQ"
                          width="50"
                        >
                        </v-text-field>
                      </td>

                      <td class="text-center">
                        <v-btn-group
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                        >
                          <v-btn
                            :disabled="index == 0"
                            @click="moveKeyUp('kneadingItems', index)"
                            color="success"
                          >
                            <v-icon>mdi-arrow-up</v-icon>
                          </v-btn>
                          <v-btn
                            color="error"
                            @click="
                              () => {
                                formData.kneadingItems.splice(index, 1);
                                if (formData.kneadingType == 'b') {
                                  next(2);
                                }
                              }
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn
                            :disabled="
                              index == formData.kneadingItems.length - 1
                            "
                            @click="moveKeyDown('kneadingItems', index)"
                            color="primary"
                          >
                            <v-icon>mdi-arrow-down</v-icon>
                          </v-btn>
                        </v-btn-group>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-btn @click="step--" variant="outlined" rounded="pill" block
              >Previous</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="!buttonValid2"
              @click="step++"
              variant="outlined"
              rounded="pill"
              block
            >
              NEXT
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-window-item>
      <v-stepper-window-item value="3">
        <v-row>
          <v-col cols="12">
            <v-card title="Extruding Inspection Items">
              <template #text>
                <v-toolbar color="transparent" rounded="xl">
                  <template #title>
                    <v-autocomplete
                      v-model="newItem"
                      :item-title="
                        (item) => `${item.inspectionLable} (${item.label})`
                      "
                      :items="insItem"
                      item-value="insId"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      hide-details=""
                      class="me-5"
                    />
                  </template>
                  <template #append>
                    <v-btn
                      @click="addItem('extrudingItems')"
                      size="small"
                      flat
                      icon="mdi-plus"
                      rounded="pill"
                      block
                    />
                  </template>
                </v-toolbar>
                <v-table fixed-header="" height="350">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Inspection Item</th>
                      <th class="text-center">Standard</th>
                      <th class="text-center">Unit</th>
                      <th class="text-center">Tool/Method</th>
                      <th class="text-center">n=</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in formData.extrudingItems"
                      :key="index"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center text-no-wrap">{{ item.label }}</td>
                      <td class="text-center">
                        <v-row>
                          <v-col
                            :cols="12 / item.standard.length"
                            v-for="(std, ind) in item.standard"
                            :key="ind"
                          >
                            <!-- Case: logic.id == 1, 8, 16 (Plain text input) -->
                            <v-text-field
                              v-if="[1, 8, 16].includes(item.logic.id)"
                              @keyup="next(3)"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <div v-if="item.logic.id == 17">
                              <v-text-field
                                @keyup="next(3)"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #prepend-inner v-if="ind == 1"
                                  >±</template
                                >
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 2 (Number range with ~) -->
                            <div v-if="item.logic.id == 2">
                              <v-text-field
                                @keyup="next(3)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">~</template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 3 (>) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 3"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>></template>
                            </v-text-field>

                            <!-- Case: logic.id == 4 (<) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 4"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append><</template>
                            </v-text-field>

                            <!-- Case: logic.id == 5 (±) -->
                            <div v-if="item.logic.id == 5">
                              <v-text-field
                                @keyup="next(3)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">,</template>
                                <template #append v-if="ind == 1">,</template>
                                <template #prepend-inner v-if="ind != 0">
                                  {{ ind == 1 ? "+" : "-" }}
                                </template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 6 (≥) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 6"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≥</template>
                            </v-text-field>

                            <!-- Case: logic.id == 7 (≤) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 7"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≤</template>
                            </v-text-field>

                            <!-- Case: logic.id == 9 (=) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 9"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <!-- Case: logic.id == 10 (≠) -->
                            <v-text-field
                              @keyup="next(3)"
                              v-if="item.logic.id == 10"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≠</template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                      <td class="text-center">
                        <v-text-field
                          width="65"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          hide-details=""
                          v-model="formData.extrudingItems[index].unit"
                        />
                      </td>
                      <td class="text-center">
                        {{ item.method.romaji }}
                      </td>
                      <td class="text-center">
                        <v-text-field
                          @keyup="next(3)"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          type="number"
                          hide-details=""
                          hide-spin-buttons=""
                          v-model="item.sampleQ"
                          width="50"
                        >
                        </v-text-field>
                      </td>

                      <td class="text-center">
                        <v-btn-group
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                        >
                          <v-btn
                            :disabled="index == 0"
                            @click="moveKeyUp('extrudingItems', index)"
                            color="success"
                          >
                            <v-icon>mdi-arrow-up</v-icon>
                          </v-btn>
                          <v-btn
                            color="error"
                            @click="
                              () => {
                                formData.extrudingItems.splice(index, 1);
                                next(3);
                              }
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn
                            :disabled="
                              index == formData.extrudingItems.length - 1
                            "
                            @click="moveKeyDown('extrudingItems', index)"
                            color="primary"
                          >
                            <v-icon>mdi-arrow-down</v-icon>
                          </v-btn>
                        </v-btn-group>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-btn @click="step--" variant="outlined" rounded="pill" block
              >Previous</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="!buttonValid3"
              @click="step++"
              variant="outlined"
              rounded="pill"
              block
            >
              NEXT
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-window-item>
      <v-stepper-window-item value="4">
        <div v-if="formData.extrudingType == 'a'">
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="mt-2"
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details=""
                label="Release Paper color"
                v-model="formData.extAppStd.color"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                disabled
                class="mt-2"
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details=""
                label="Butyl tape release condition"
                model-value="Butyl tape can be peeled off from Release paper"
              />
            </v-col>
          </v-row>
        </div>
        <div v-if="formData.extrudingType == 'b'">
          <v-row>
            <v-col cols="6" offset="6">
              <v-text-field
                class="mt-2"
                hide-details=""
                variant="outlined"
                rounded="pill"
                density="compact"
                label="Sheet Layout"
                v-model="formData.extAppStd.sheetLayout"
                type="number"
              >
                <template #append-inner> pcs/sheet </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-divider>Upper Surface</v-divider>

              <v-row>
                <v-col
                  cols="6"
                  v-for="(item, index) in store.extBlabel"
                  :key="index"
                >
                  <v-checkbox-btn
                    :label="item"
                    v-model="formData.extAppStd.upper"
                    :value="index"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-divider>Bottom Surface </v-divider>
              <v-row>
                <v-col
                  cols="6"
                  v-for="(item, index) in store.extBlabel"
                  :key="index"
                >
                  <v-checkbox-btn
                    v-if="
                      index == 'releasePaperYellow' ||
                      index == 'releasePaperWhite'
                    "
                    :label="item"
                    v-model="formData.extAppStd.bottom"
                    :value="index"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>

        <div v-if="formData.extrudingType == 'c'">
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="mt-2"
                hide-details=""
                variant="outlined"
                rounded="pill"
                density="compact"
                label="Sheet Layout"
                v-model="formData.extAppStd.sheetLayout"
                type="number"
              >
                <template #append-inner> pcs/sheet </template>
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                class="mt-2"
                hide-details=""
                variant="outlined"
                rounded="pill"
                density="compact"
                label="Hole Count"
                v-model="formData.extAppStd.holeCount"
                type="number"
              >
                <template #append-inner> pcs/sheet </template>
              </v-text-field>
            </v-col>
            <v-col
              cols="3"
              v-for="(item, index) in ['A', 'B', 'C', 'D']"
              :key="index"
            >
              <v-text-field
                class="mt-2"
                hide-details=""
                variant="outlined"
                rounded="pill"
                density="compact"
                :label="`Hole ${item}`"
                v-model="formData.extAppStd[`hole${item}`]"
                type="number"
              >
                <template #append-inner> mm </template>
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-divider>Upper Surface</v-divider>

              <v-row>
                <v-col
                  cols="6"
                  v-for="(item, index) in store.extBlabel"
                  :key="index"
                >
                  <v-checkbox-btn
                    :label="item"
                    v-model="formData.extAppStd.upper"
                    :value="index"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-divider>Bottom Surface </v-divider>
              <v-row>
                <v-col
                  cols="6"
                  v-for="(item, index) in store.extBlabel"
                  :key="index"
                >
                  <v-checkbox-btn
                    v-if="
                      index == 'releasePaperYellow' ||
                      index == 'releasePaperWhite'
                    "
                    :label="item"
                    v-model="formData.extAppStd.bottom"
                    :value="index"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6">
            <v-btn variant="outlined" rounded="pill" block @click="step--"
              >Previous</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="step++"
              :disabled="isExtApp"
              variant="outlined"
              rounded="pill"
              block
              >next</v-btn
            >
          </v-col>
        </v-row>
      </v-stepper-window-item>
      <v-stepper-window-item v-if="formData.pressOn" value="5">
        <v-row>
          <v-col cols="12">
            <v-card title="Press Inspection Items">
              <template #text>
                <v-toolbar color="transparent" rounded="xl">
                  <template #title>
                    <v-autocomplete
                      v-model="newItem"
                      :item-title="
                        (item) => `${item.inspectionLable} (${item.label})`
                      "
                      :items="insItem"
                      item-value="insId"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      hide-details=""
                      class="me-5"
                    />
                  </template>
                  <template #append>
                    <v-btn
                      @click="addItem('pressItems')"
                      size="small"
                      flat
                      icon="mdi-plus"
                      rounded="pill"
                      block
                    />
                  </template>
                </v-toolbar>
                <v-table fixed-header="" height="350">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Inspection Item</th>
                      <th class="text-center">Standard</th>
                      <th class="text-center">Unit</th>
                      <th class="text-center">Tool/Method</th>
                      <th class="text-center">n=</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in formData.pressItems"
                      :key="index"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center text-no-wrap">{{ item.label }}</td>
                      <td class="text-center">
                        <v-row>
                          <v-col
                            :cols="12 / item.standard.length"
                            v-for="(std, ind) in item.standard"
                            :key="ind"
                          >
                            <!-- Case: logic.id == 1, 8, 16 (Plain text input) -->
                            <v-text-field
                              v-if="[1, 8, 16].includes(item.logic.id)"
                              @keyup="next(4)"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <div v-if="item.logic.id == 17">
                              <v-text-field
                                @keyup="next(4)"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #prepend-inner v-if="ind == 1"
                                  >±</template
                                >
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 2 (Number range with ~) -->
                            <div v-if="item.logic.id == 2">
                              <v-text-field
                                @keyup="next(4)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">~</template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 3 (>) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 3"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>></template>
                            </v-text-field>

                            <!-- Case: logic.id == 4 (<) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 4"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append><</template>
                            </v-text-field>

                            <!-- Case: logic.id == 5 (±) -->
                            <div v-if="item.logic.id == 5">
                              <v-text-field
                                @keyup="next(4)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">,</template>
                                <template #append v-if="ind == 1">,</template>
                                <template #prepend-inner v-if="ind != 0">
                                  {{ ind == 1 ? "+" : "-" }}
                                </template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 6 (≥) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 6"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≥</template>
                            </v-text-field>

                            <!-- Case: logic.id == 7 (≤) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 7"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≤</template>
                            </v-text-field>

                            <!-- Case: logic.id == 9 (=) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 9"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <!-- Case: logic.id == 10 (≠) -->
                            <v-text-field
                              @keyup="next(4)"
                              v-if="item.logic.id == 10"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≠</template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                      <td class="text-center">
                        <v-text-field
                          width="65"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          hide-details=""
                          v-model="formData.pressItems[index].unit"
                        />
                      </td>
                      <td class="text-center">
                        {{ item.method.romaji }}
                      </td>
                      <td class="text-center">
                        <v-text-field
                          @keyup="next(4)"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          type="number"
                          hide-details=""
                          hide-spin-buttons=""
                          v-model="item.sampleQ"
                          width="50"
                        >
                        </v-text-field>
                      </td>

                      <td class="text-center">
                        <v-btn-group
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                        >
                          <v-btn
                            :disabled="index == 0"
                            @click="moveKeyUp('pressItems', index)"
                            color="success"
                          >
                            <v-icon>mdi-arrow-up</v-icon>
                          </v-btn>
                          <v-btn
                            color="error"
                            @click="
                              () => {
                                formData.pressItems.splice(index, 1);
                                next(4);
                              }
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn
                            :disabled="index == formData.pressItems.length - 1"
                            @click="moveKeyDown('pressItems', index)"
                            color="primary"
                          >
                            <v-icon>mdi-arrow-down</v-icon>
                          </v-btn>
                        </v-btn-group>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-btn @click="step--" variant="outlined" rounded="pill" block
              >Previous</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="!buttonValid4"
              @click="step++"
              variant="outlined"
              rounded="pill"
              block
            >
              NEXT
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-window-item>
      <v-stepper-window-item
        v-if="formData.outgoingOn"
        :value="formData.pressOn ? '6' : '5'"
      >
        <v-row>
          <v-col cols="12">
            <v-card title="Out Inspection Items">
              <template #text>
                <v-toolbar color="transparent" rounded="xl">
                  <template #title>
                    <v-autocomplete
                      v-model="newItem"
                      :item-title="
                        (item) => `${item.inspectionLable} (${item.label})`
                      "
                      :items="insItem"
                      item-value="insId"
                      variant="outlined"
                      rounded="pill"
                      density="compact"
                      hide-details=""
                      class="me-5"
                    />
                  </template>
                  <template #append>
                    <v-btn
                      @click="addItem('outgoingItems')"
                      size="small"
                      flat
                      icon="mdi-plus"
                      rounded="pill"
                      block
                    />
                  </template>
                </v-toolbar>
                <v-table fixed-header="" height="350">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Inspection Item</th>
                      <th class="text-center">Standard</th>
                      <th class="text-center">Unit</th>
                      <th class="text-center">Tool/Method</th>
                      <th class="text-center">n=</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in formData.outgoingItems"
                      :key="index"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center text-no-wrap">{{ item.label }}</td>
                      <td class="text-center" style="width: 300px">
                        <v-row>
                          <v-col
                            :cols="12 / item.standard.length"
                            v-for="(std, ind) in item.standard"
                            :key="ind"
                          >
                            <!-- Case: logic.id == 1, 8, 16 (Plain text input) -->
                            <v-text-field
                              v-if="[1, 8, 16].includes(item.logic.id)"
                              @keyup="next(5)"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <div v-if="item.logic.id == 17">
                              <v-text-field
                                @keyup="next(5)"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #prepend-inner v-if="ind == 1"
                                  >±</template
                                >
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 2 (Number range with ~) -->
                            <div v-if="item.logic.id == 2">
                              <v-text-field
                                @keyup="next(5)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">~</template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 3 (>) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 3"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>></template>
                            </v-text-field>

                            <!-- Case: logic.id == 4 (<) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 4"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append><</template>
                            </v-text-field>

                            <!-- Case: logic.id == 5 (±) -->
                            <div v-if="item.logic.id == 5">
                              <v-text-field
                                @keyup="next(5)"
                                hide-spin-buttons=""
                                type="number"
                                variant="outlined"
                                rounded="lg"
                                density="compact"
                                hide-details=""
                                v-model="item.standard[ind]"
                              >
                                <template #append v-if="ind == 0">,</template>
                                <template #append v-if="ind == 1">,</template>
                                <template #prepend-inner v-if="ind != 0">
                                  {{ ind == 1 ? "+" : "-" }}
                                </template>
                              </v-text-field>
                            </div>

                            <!-- Case: logic.id == 6 (≥) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 6"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≥</template>
                            </v-text-field>

                            <!-- Case: logic.id == 7 (≤) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 7"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≤</template>
                            </v-text-field>

                            <!-- Case: logic.id == 9 (=) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 9"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            />

                            <!-- Case: logic.id == 10 (≠) -->
                            <v-text-field
                              @keyup="next(5)"
                              v-if="item.logic.id == 10"
                              hide-spin-buttons=""
                              type="number"
                              variant="outlined"
                              rounded="lg"
                              density="compact"
                              hide-details=""
                              v-model="item.standard[ind]"
                            >
                              <template #append>≠</template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                      <td class="text-center">
                        <v-text-field
                          width="65"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          hide-details=""
                          v-model="formData.outgoingItems[index].unit"
                        />
                      </td>
                      <td class="text-center">
                        {{ item.method.romaji }}
                      </td>
                      <td class="text-center">
                        <v-text-field
                          @keyup="next(5)"
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                          type="number"
                          hide-details=""
                          hide-spin-buttons=""
                          v-model="item.sampleQ"
                          width="50"
                        >
                        </v-text-field>
                      </td>

                      <td class="text-center">
                        <v-btn-group
                          variant="outlined"
                          rounded="lg"
                          density="compact"
                        >
                          <v-btn
                            :disabled="index == 0"
                            @click="moveKeyUp('outgoingItems', index)"
                            color="success"
                          >
                            <v-icon>mdi-arrow-up</v-icon>
                          </v-btn>
                          <v-btn
                            color="error"
                            @click="
                              () => {
                                formData.outgoingItems.splice(index, 1);

                                formData.outgoingOn =
                                  formData.outgoingItems.length > 0;
                                if (formData.outgoingOn) {
                                  next(5);
                                } else {
                                  step = 0;
                                }
                              }
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn
                            :disabled="
                              index == formData.outgoingItems.length - 1
                            "
                            @click="moveKeyDown('outgoingItems', index)"
                            color="primary"
                          >
                            <v-icon>mdi-arrow-down</v-icon>
                          </v-btn>
                        </v-btn-group>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-btn @click="step--" variant="outlined" rounded="pill" block
              >Previous</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="!buttonValid5"
              @click="step++"
              variant="outlined"
              rounded="pill"
              block
            >
              NEXT
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-window-item>

      <v-stepper-window-item :value="getSumVal()">
        <v-row>
          <v-col cols="12">
            <div style="height: 400px; overflow-y: scroll">
              <v-row>
                <v-col cols="12">
                  <table class="w-100">
                    <tbody>
                      <tr class="bg-grey">
                        <td colspan="6">IDENTITY AND DESIGN</td>
                      </tr>
                      <tr>
                        <td class="text-start text-uppercase">WIP Type</td>
                        <td colspan="5">
                          {{
                            types.find((t) => t.id == formData.partType)
                              .typeNumber
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th>Customer</th>
                        <td>{{ formData.customer }}</td>
                        <th>Product Number</th>
                        <td colspan="3">{{ formData.partNumber }}</td>
                      </tr>
                      <tr>
                        <th>Product Name</th>
                        <td>{{ formData.partName }}</td>
                        <th>Size</th>
                        <td>
                          {{ formData.thickness }} x {{ formData.width }} x
                          {{ formData.length }} mm
                        </td>
                        <td>SG</td>
                        <td>{{ formData.sg }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
                <v-col cols="12">
                  <table class="w-100">
                    <tbody>
                      <tr class="bg-grey">
                        <td colspan="6">KNEADING ITEMS</td>
                      </tr>
                      <tr
                        v-for="(item, index) in formData.kneadingItems"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.label }}</td>
                        <td v-if="formData.kneadingType == 'b'">
                          {{
                            store.checkLogic(
                              item.logic.id,
                              item.standard,
                              "",
                              true
                            )
                          }}
                          {{ item.unit }}
                        </td>
                        <td v-else>See the kneading report</td>
                        <td>{{ item.method.romaji }}</td>
                        <td>n={{ item.sampleQ }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
                <v-col cols="12">
                  <table class="w-100">
                    <tbody>
                      <tr class="bg-grey">
                        <td colspan="6">EXTRUDING ITEMS</td>
                      </tr>
                      <tr v-if="formData.extrudingType == 'a'">
                        <td>1</td>
                        <td colspan="4">
                          <div style="height: 300px" class="py-5">
                            <v-row>
                              <v-row>
                                <v-col cols="6">
                                  Part Drawing
                                  <v-img
                                    height="250"
                                    :src="
                                      partDrawingUrl == null
                                        ? defDrawing
                                        : partDrawingUrl
                                    "
                                  />
                                </v-col>
                                <v-col cols="6">
                                  Part Actual Image
                                  <v-img
                                    height="250"
                                    :src="
                                      actImageUrl == null
                                        ? defDrawing
                                        : actImageUrl
                                    "
                                  />
                                </v-col>
                              </v-row>
                            </v-row>
                          </div>
                          <div class="text-start">
                            Standard: <br />
                            ① Release Paper Color:
                            {{ formData.extAppStd.color }}
                            <br />
                            ② Butyl tape can be peeled off from Release paper
                          </div>
                        </td>
                      </tr>
                      <tr v-else>
                        <td>1</td>
                        <td colspan="4">
                          <div style="height: 300px" class="py-5">
                            <v-row>
                              <v-row>
                                <v-col cols="6">
                                  Part Drawing
                                  <v-img
                                    height="250"
                                    :src="
                                      partDrawingUrl == null
                                        ? defDrawing
                                        : partDrawingUrl
                                    "
                                  />
                                </v-col>
                                <v-col cols="6">
                                  Part Actual Image
                                  <v-img
                                    height="250"
                                    :src="
                                      actImageUrl == null
                                        ? defDrawing
                                        : actImageUrl
                                    "
                                  />
                                </v-col>
                              </v-row>
                            </v-row>
                          </div>
                          <div>
                            <table class="w-100">
                              <thead>
                                <tr class="bg-grey">
                                  <td colspan="6">Appearance Standard</td>
                                </tr>
                                <tr>
                                  <td>Sheet Layout</td>
                                  <td colspan="3">
                                    {{ formData.extAppStd.sheetLayout }}
                                    pcs/sheet
                                  </td>
                                </tr>
                                <tr>
                                  <td>Item</td>
                                  <td>Upper Surface</td>
                                  <td colspan="2">Bottom Surface</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Release Paper</td>
                                  <td>
                                    {{
                                      store.extBlabel[formData.extAppStd.upper]
                                    }}
                                  </td>
                                  <td>
                                    {{
                                      store.extBlabel[formData.extAppStd.bottom]
                                    }}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Hole Count</td>
                                  <td v-if="formData.extrudingType == 'c'">
                                    {{ formData.extAppStd.holeCount }} hole(s)
                                  </td>
                                  <td v-else>-</td>
                                  <td>-</td>
                                </tr>
                                <tr
                                  v-for="(item, index) in ['A', 'B', 'C', 'D']"
                                  :key="index"
                                >
                                  <td>{{ `Hole ${item}` }}</td>
                                  <td v-if="formData.extrudingType == 'c'">
                                    {{ formData.extAppStd[`hole${item}`] }} mm
                                  </td>
                                  <td v-else>-</td>
                                  <td>-</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-for="(item, index) in formData.extrudingItems"
                        :key="index"
                      >
                        <td>{{ index + 2 }}</td>
                        <td>{{ item.label }}</td>
                        <td>
                          {{
                            store.checkLogic(
                              item.logic.id,
                              item.standard,
                              "",
                              true
                            )
                          }}
                          {{ item.unit }}
                        </td>
                        <td>{{ item.method.romaji }}</td>
                        <td>n={{ item.sampleQ }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
                <v-col cols="12" v-if="formData.pressOn">
                  <table class="w-100">
                    <tbody>
                      <tr class="bg-grey">
                        <td colspan="6">PRESS ITEMS</td>
                      </tr>
                      <tr
                        v-for="(item, index) in formData.pressItems"
                        :key="index"
                      >
                        <td>{{ index + 2 }}</td>
                        <td>{{ item.label }}</td>
                        <td>
                          {{
                            store.checkLogic(
                              item.logic.id,
                              item.standard,
                              "",
                              true
                            )
                          }}
                          {{ item.unit }}
                        </td>
                        <td>{{ item.method.romaji }}</td>
                        <td>n={{ item.sampleQ }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
                <v-col cols="12" v-if="formData.outgoingOn">
                  <table class="w-100">
                    <tbody>
                      <tr class="bg-grey">
                        <td colspan="6">OUTGOING ITEMS</td>
                      </tr>
                      <tr
                        v-for="(item, index) in formData.outgoingItems"
                        :key="index"
                      >
                        <td>{{ index + 2 }}</td>
                        <td>{{ item.label }}</td>
                        <td>
                          {{
                            store.checkLogic(
                              item.logic.id,
                              item.standard,
                              "",
                              true
                            )
                          }}
                          {{ item.unit }}
                        </td>
                        <td>{{ item.method.romaji }}</td>
                        <td>n={{ item.sampleQ }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-btn @click="submit" variant="outlined" rounded="pill" block
              >Create Part</v-btn
            >
          </v-col>
        </v-row>
      </v-stepper-window-item>
    </v-stepper-window>
  </v-stepper>
</template>
<style scoped>
table {
  border-collapse: collapse;
  border: 1px, solid !important;
}
td,
th {
  height: 50px;
  font-weight: unset;
  text-align: start;
  border-collapse: collapse;
  border: 1px, solid !important;
  padding: 5px;
}
td {
  font-weight: bold;
  text-align: center;
  border: black, 1px, solid !important;
}
</style>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, minValue, required } from "@vuelidate/validators";
import defDrawing from "@/assets/defaultDesign.png";

const step = ref(0);
const props = defineProps(["closeMe"]);
const store = useAppStore();
const addIns = {
  heaterCheck: "Extruding Dies Temp. Check",
  pressOn: "Press Inspections",
  outgoingOn: "Outgoing Inspections",
};
const types = ref([]);
const insItem = ref([]);
const methods = ref([]);
const logics = ref([]);
const newItem = ref(null);
const partDrawing = ref(null);
const actImage = ref(null);
const arrayLength = {
  1: 1,
  2: 2, // Number Range [min, max]
  3: 1, // Larger Than (>)
  4: 1, // Less Than (<)
  5: 3, // Upper and Lower Limit [target, +x, -x]
  6: 1, // Greater Than or Equal (≥)
  7: 1, // Less Than or Equal (≤)
  8: 1, // Match Text (case-insensitive)
  9: 1, // Match Number (exact)
  10: 1, // Not Equal
  16: 1,
  17: 2,
};
const formData = reactive({
  customer: "",
  partType: null,
  partName: "",
  partNumber: "",
  thickness: 0,
  width: 0,
  length: 0,
  sg: 0,
  headers: ["prodQty", "kneadingLot", "extrudingLot", "poNumber"],
  kneadingType: "a",
  kneadingItems: [],
  heaterCheck: false,
  extrudingType: "a",
  extrudingItems: [],
  pressOn: false,
  pressItems: [],
  outgoingOn: false,
  outgoingItems: [],
  partDrawing: null,
  actImage: null,
  extAppStd: {
    upper: "",
    bottom: "",
    sheetLayout: 0,
    color: "",
    holeCount: 0,
    holeA: 0,
    holeB: 0,
    holeC: 0,
    holeD: 0,
  },
});

const partDrawingUrl = ref(null);
const actImageUrl = ref(null);

watch(
  () => formData.partDrawing,
  async (e) => {
    if (e == null) {
      partDrawingUrl.value = defDrawing.value;
    } else {
      partDrawingUrl.value = await store.fileToDataURL(e);
    }
  }
);
watch(
  () => formData.actImage,
  async (e) => {
    if (e == null) {
      actImageUrl.value = defDrawing.value;
    } else {
      actImageUrl.value = await store.fileToDataURL(e);
    }
  }
);
const structure = {};

let buttonValid = ref(false);
let buttonValid2 = ref(false);
let buttonValid3 = ref(false);
let buttonValid4 = ref(false);

const rules1 = {
  customer: {
    required: helpers.withMessage("This field is required", required),
  },
  partType: {
    required: helpers.withMessage("This field is required", required),
  },
  partName: {
    required: helpers.withMessage("This field is required", required),
  },
  partNumber: {
    required: helpers.withMessage("This field is required", required),
  },
  thickness: {
    required: helpers.withMessage("This field is required", required),
    minValue: helpers.withMessage(
      "Plese fill value greater than 0",
      minValue(1)
    ),
  },
  width: {
    required: helpers.withMessage("This field is required", required),
    minValue: helpers.withMessage(
      "Plese fill value greater than 0",
      minValue(1)
    ),
  },
  length: {
    required: helpers.withMessage("This field is required", required),
    minValue: helpers.withMessage(
      "Plese fill value greater than 0",
      minValue(1)
    ),
  },
  sg: {
    required: helpers.withMessage("This field is required", required),
    minValue: helpers.withMessage(
      "Plese fill value greater than 0",
      minValue(1)
    ),
  },
};
const validate1 = useVuelidate(rules1, formData);

watch(
  () => formData.partType,
  (e) => {
    if (e != null) {
      const type = types.value.find((t) => t.id == e);
      formData.kneadingType = type.kneadingType;
      formData.extrudingType = type.extrudingType;
      formData.kneadingItems = [];
      formData.extrudingItems = [];
      formData.headers =
        type.headerType == "a"
          ? [
              "prodQty",
              "kneadingLot",
              "extrudingLot",
              "deliveryDate",
              "poNumber",
            ]
          : [
              "prodQty",
              "kneadingLot",
              "extrudingLot",
              "orderNumber",
              "poNumber",
            ];
      const extItem = JSON.parse(type.extrudingItems);
      const kneItem = JSON.parse(type.kneadingItems);

      extItem.forEach((element) => {
        const item = insItem.value.find((ins) => ins.insId == element);
        let logicItem = logics.value.find((l) => l.id == item.logic);
        let data = {
          id: element,
          label: item.inspectionLable,
          logic: logicItem,
          method: methods.value.find((m) => m.id == item.method),
          sampleQ: 5,
          standard: Array(arrayLength[item.logic]).fill(""),
          input: [],
          unit: "",
        };
        formData.extrudingItems.push(data);
      });

      kneItem.forEach((element) => {
        const item = insItem.value.find((ins) => ins.insId == element);
        let logicItem = logics.value.find((l) => l.id == item.logic);
        let data = {
          id: element,
          label: item.inspectionLable,
          logic: logicItem,
          method: methods.value.find((m) => m.id == item.method),
          sampleQ: 5,
          standard: Array(arrayLength[item.logic]).fill(""),
          input: [],
          unit: "",
        };
        formData.kneadingItems.push(data);
      });
      if (formData.pressOn) {
        formData.pressItems = [];
        const type = types.value.find((t) => t.id == formData.partType);
        const preItem = JSON.parse(type.pressItems);
        preItem.forEach((element) => {
          const item = insItem.value.find((ins) => ins.insId == element);
          let logicItem = logics.value.find((l) => l.id == item.logic);
          let data = {
            id: element,
            label: item.inspectionLable,
            logic: logicItem,
            method: methods.value.find((m) => m.id == item.method),
            sampleQ: 5,
            standard: Array(arrayLength[item.logic]).fill(""),
            input: [],
            unit: "",
          };
          formData.pressItems.push(data);
        });
      }

      if (formData.outgoingOn) {
        const type = types.value.find((t) => t.id == formData.partType);
        const preItem = JSON.parse(type.outgoingItems);
        preItem.forEach((element) => {
          const item = insItem.value.find((ins) => ins.insId == element);
          let logicItem = logics.value.find((l) => l.id == item.logic);
          let data = {
            id: element,
            label: item.inspectionLable,
            logic: logicItem,
            method: methods.value.find((m) => m.id == item.method),
            sampleQ: 5,
            standard: Array(arrayLength[item.logic]).fill(""),
            input: [],
            unit: "",
          };
          formData.outgoingItems.push(data);
        });
      }
    }
  }
);

watch(
  () => formData.pressOn,
  (e) => {
    if (e) {
      const type = types.value.find((t) => t.id == formData.partType);
      const preItem = JSON.parse(type.pressItems);
      preItem.forEach((element) => {
        const item = insItem.value.find((ins) => ins.insId == element);
        let logicItem = logics.value.find((l) => l.id == item.logic);
        let data = {
          id: element,
          label: item.inspectionLable,
          logic: logicItem,
          method: methods.value.find((m) => m.id == item.method),
          sampleQ: 5,
          standard: Array(arrayLength[item.logic]).fill(""),
          input: [],
          unit: "",
        };
        formData.pressItems.push(data);
      });
    } else {
      formData.pressItems = [];
    }
  }
);

watch(
  () => formData.outgoingOn,
  (e) => {
    if (e) {
      const type = types.value.find((t) => t.id == formData.partType);
      const preItem = JSON.parse(type.outgoingItems);
      preItem.forEach((element) => {
        const item = insItem.value.find((ins) => ins.insId == element);
        let logicItem = logics.value.find((l) => l.id == item.logic);
        let data = {
          id: element,
          label: item.inspectionLable,
          logic: logicItem,
          method: methods.value.find((m) => m.id == item.method),
          sampleQ: 5,
          standard: Array(arrayLength[item.logic]).fill(""),
          input: [],
          unit: "",
        };
        formData.outgoingItems.push(data);
      });
    } else {
      formData.outgoingItems = [];
    }
  }
);

function moveKeyUp(arr, index) {
  if (index <= 0 || index >= formData[arr].length) {
    return;
  }
  const newArr = [...formData[arr]];
  [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
  formData[arr] = newArr;
}
function moveKeyDown(arr, index) {
  if (index < 0 || index >= formData[arr].length - 1) {
    return;
  }
  const newArr = [...formData[arr]];
  [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
  formData[arr] = newArr;
}

const next = async (current) => {
  switch (current) {
    case 1:
      buttonValid.value = await validate1.value.$validate();
      break;
    case 2:
      const data1 = formData.kneadingItems;
      let arr1 = [];
      data1.forEach((d) => {
        let standardValid = !d.standard.includes("");
        let sampleValid = d.sampleQ > 0;
        arr1.push(sampleValid && standardValid);
      });
      buttonValid2.value = !arr1.includes(false);
      break;
    case 3:
      const data2 = formData.extrudingItems;
      let arr2 = [];
      data2.forEach((d) => {
        let standardValid = !d.standard.includes("");
        let sampleValid = d.sampleQ > 0;
        arr2.push(sampleValid && standardValid);
      });
      buttonValid3.value = !arr2.includes(false);
      break;
    case 4:
      const data3 = formData.pressItems;
      let arr3 = [];
      data3.forEach((d) => {
        let standardValid = !d.standard.includes("");
        let sampleValid = d.sampleQ > 0;
        arr3.push(sampleValid && standardValid);
      });
      buttonValid4.value = !arr3.includes(false);
      break;
    case 5:
      const data4 = formData.outgoingItems;
      let arr4 = [];
      data4.forEach((d) => {
        let standardValid = !d.standard.includes("");
        let sampleValid = d.sampleQ > 0;
        arr4.push(sampleValid && standardValid);
      });
      buttonValid5.value = !arr4.includes(false);
      break;
  }
};

const buttonValid5 = ref(false);

const getSumVal = () => {
  let number;
  let numberObj = ["7", "5", "6", "6"];
  const conditions = [
    formData.pressOn && formData.outgoingOn,
    !formData.pressOn && !formData.outgoingOn,
    formData.pressOn && !formData.outgoingOn,
    !formData.pressOn && formData.outgoingOn,
  ];

  conditions.forEach((element, index) => {
    if (element) {
      number = numberObj[index];
    }
  });
  return number;
};

const addItem = (arr) => {
  const insId = newItem.value;
  const item = insItem.value.find((e) => e.insId == insId);
  if (item) {
    let logicItem = logics.value.find((l) => l.id == item.logic);
    let data = {
      id: insId,
      label: item.inspectionLable,
      logic: logicItem,
      method: methods.value.find((m) => m.id == item.method),
      sampleQ: 5,
      standard: Array(arrayLength[item.logic]).fill(""),
      input: [],
      unit: "",
    };
    formData[arr].push(data);

    next(1);
    if (formData.kneadingType == "b") {
      next(2);
    }
    next(3);
    next(4);
    next(5);
  }
};

const refresh = async () => {
  types.value = await store.ajax({}, "/parts/gettypes", "post");
  insItem.value = await store.ajax({}, "/inspection/items", "post");
  methods.value = await store.ajax({}, "/inspection/methods", "post");
  logics.value = await store.ajax({}, "/inspection/logics", "post");
  store.preload = false;
};

const isExtApp = computed(() => {
  const type = formData.extrudingType;

  switch (type) {
    case "a":
      return formData.extAppStd.color === "";
    case "b":
      return (
        formData.extAppStd.sheetLayout <= 0 ||
        formData.extAppStd.upper == "" ||
        formData.extAppStd.bottom == ""
      );
    case "c":
      return (
        formData.extAppStd.sheetLayout <= 0 ||
        formData.extAppStd.upper == "" ||
        formData.extAppStd.bottom == "" ||
        formData.extAppStd.holeCount == "" ||
        formData.extAppStd.holeA == "" ||
        formData.extAppStd.holeB == "" ||
        formData.extAppStd.holeC == "" ||
        formData.extAppStd.holeD == ""
      );
    default:
      return true; // default disable jika tipe tidak dikenali
  }
});

watch(step, (e) => {
  switch (e) {
    case 1:
      const kneadingType = formData.kneadingType;
      if (kneadingType == "a") {
        buttonValid2.value = true;
      } else {
        next(2);
      }
      break;
    case 2:
      next(3);
      break;
    case 3:
      next(4);
      break;
    case 4:
      next(5);
      break;
  }
});

onMounted(async () => {
  refresh();
});

const submit = async () => {
  const fd = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value == null) return;

    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else if (Array.isArray(value) || typeof value === "object") {
      fd.append(key, JSON.stringify(value));
    } else if (typeof value === "boolean") {
      fd.append(key, value ? 1 : 0);
    } else {
      fd.append(key, value);
    }
  });

  try {
    await store.ajax(fd, "/parts/add", "post", true);
    props.closeMe();
  } catch (error) {
    console.log(error);
    store.preload = false;
  }
};
</script>
