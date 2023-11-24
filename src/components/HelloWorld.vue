<script setup lang="ts">
import { ref } from 'vue'
import PageRefAlgoOption from './PageRefAlgoOption.vue'

defineProps<{ msg: string }>()

const PageRefAlgos = ref(["First In First Out (FIFO)", "Least Recently Used (LRU)", "Least Frequently Used (LFU)", "Optimal"])

const count = ref(0)
</script>

<template>

  <h1>Page Replacement Algorithms</h1>

  <PageRefAlgoOption :options="PageRefAlgos" />  
  

</template>

<style scoped>
  .read-the-docs {
    color: #888;
  }

  h1 {
    position: relative;
  }
</style>
