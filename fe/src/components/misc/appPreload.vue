<template>
  <v-dialog
    v-model="store.preload"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    transition="dialog-transition"
  >
    <v-card>
      <div class="w-100 h-100 d-flex flex-column justify-center align-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="400"
          width="20"
        >
          <v-img src="../../assets/softfren.png" width="175"></v-img>
        </v-progress-circular>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
</script>
