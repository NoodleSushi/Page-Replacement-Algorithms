<script setup lang="ts">

import { ref } from 'vue'
import PageReplFIFO from './PageRefAlgoOption.vue'
import PageReplLRU from './PageReplLRU.vue'
import PageReplLFU from './PageReplLFU.vue'
import PageReplOptimal from './PageReplOptimal.vue'

</script>

<template>

  <div class="title-container">
    <h1 class="title">Page Replacement Algorithms</h1>
  </div>

  <!-- First In First Out (FIFO) -->
  <PageReplFIFO />  
  
  <!-- Least Recently Used (LRU) -->
  <PageReplLRU />

  <!-- Least Frequently Used (LFU) -->
  <PageReplLFU />
  
  <!-- Optimal -->
  <PageReplOptimal />

</template>

<style scoped>
  


</style>