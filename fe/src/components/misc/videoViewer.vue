<template>
  <v-container
    class="d-flex w-100 h-100 align-center justify-center my-5"
    fluid
  >
    <video
      v-if="video !== null"
      :src="video"
      controls
      style="max-height: 350px"
    ></video>
    <div class="w-100 text-center" v-else>
      <div class="text-h5">Sorry no video available yet.</div>
      <p>We will upload more videos soon.</p>
    </div>
  </v-container>
</template>
<script setup>
const props = defineProps(["item"]);

const video = ref(null);

const getVideo = () => {
  if (!props.item.video) {
    return;
  }
  video.value = new URL(
    `../../assets/tutorial/${props.item.video}`,
    import.meta.url
  ).href;
};

onMounted(() => {
  getVideo();
});
</script>
