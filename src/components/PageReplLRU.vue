<template>
  <div>
    <br>
    <h2>LRU</h2>
    <br>
    <table>
     
      <tr>
        <th v-for="n in pages" :key="n">Page: {{ n }}</th>
      </tr>

      <tr>
        <th v-for="ndx in index" :key="ndx">{{ ndx }}</th>
      </tr>
      
      <tr v-for="frameNumber in totalFrames" :key="frameNumber">
        <td v-for="ref in framesStates" :key="ref.idx">
          <div :class="getClassForFrameContent(ref.framesContent, frameNumber - 1)">
            {{ getPageForFrameContent(ref.framesContent, frameNumber - 1) }}
          </div>
        </td>
      </tr>

    </table>
    <br><br>
    <div>
      Number of Faults: {{ numberOfFaults }}
      <br>
      Number of Hits: {{ numberOfHits }}
      <br>
      Faults Percentage: {{ faultsPercentage }}
      <br>
      Hits Percentage: {{ hitsPercentage }}
    </div>

  </div>
</template>

<script>
import { PageReplLRU } from "../PageRepl"

// INPUT HERE:
const lru = new PageReplLRU([3, 2, 1, 3, 4, 1, 6, 2, 4, 3, 4, 2, 1, 4, 5, 2, 1, 3, 4], 3);
const execLRU = lru.execute()
const { pageRefs, framesContent, framesStates, framesCount, faultsCount, hitsCount, faultsPercentage, hitsPercentage } = execLRU

export default {
    
  data() {
    return { //coming from BasePageRepl.ts
      framesStates:  framesStates,
      pages: pageRefs,
      index: pageRefs.length, 
      totalFrames: framesCount
    };
  },
  computed: {
    numberOfFaults() {
      return faultsCount;
    },
    numberOfHits() {
      return hitsCount;
    },
    faultsPercentage() {
      return faultsPercentage;
    },
    hitsPercentage() {
      return hitsPercentage;
    },
  },
  methods: {
    getClassForFrameContent(framesContent, frameNumber) {
      const content = framesContent[frameNumber];
      return content ? content.state : 'empty';
    },
    getPageForFrameContent(framesContent, frameNumber) {
      const content = framesContent[frameNumber];
      return content && content.page !== null ? content.page : '';
    }
  }
};
</script>

<style>
    .fault {
        background-color: red;
    }
    .hit {
        background-color: green;
    }
    .empty {
        background-color: white;
    }
    .unchanged {
        background-color: grey;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid black;
        text-align: center;
        padding: 8px;
    }
    h2 {
        text-align: center;
    }
</style>