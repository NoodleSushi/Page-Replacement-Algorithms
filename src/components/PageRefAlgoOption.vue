<template>
  <div>
    <br><br>
  <div class="input-container">


      <div class="input-numbers">
          <input type="text" v-model="pages" placeholder="Input pages here">
      </div>

      <div class="input-frames">
          <input type="number" v-model="totalFrames" placeholder="Input num of frames">
      </div>

      <!-- <button @click="generate">
        Generate
      </button> -->


  </div>
    <br>
    <h2>FIFO</h2>
    <br>
    <table>
     
      <tr>
        <th v-for="n in formatInput" :key="n">Page: {{ n }}</th>
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
import { PageReplFIFO } from "../PageRepl"

// console.log(totalFrames, "totalFrames")

// INPUT HERE:
const fifo = new PageReplFIFO([], '');
const execFIFO = fifo.execute()
const { pageRefs, framesContent, framesStates, framesCount, faultsCount, hitsCount, faultsPercentage, hitsPercentage } = execFIFO


export default {
    // 5,6,1,6,7
  data() {
    return { //coming from BasePageRepl.ts
      // pagesInput: [],
      // framesInput: '',
      framesStates:  framesStates,
      // pages: pageRefs,
      pages: '',
      index: pageRefs.length, 
      totalFrames: framesCount
    };
  },
  computed: {
    formatInput() {
      return this.pages.split(',').map(el=>el.trim())
    },
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

    .input-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      /* justify-content: space-between; */
      /* align-content: space-between; */
    }
</style>