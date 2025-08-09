<template></template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
store.preload = false;
</script>
