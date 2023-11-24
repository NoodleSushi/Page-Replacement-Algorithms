<template>
        <div class="row">
            <div class="col">
                <div class="dropdown-wrapper">
                    <div class="dropdown-selected-option">

                    </div>
                </div>

                <div class="PRAlgos-options-wrapper">
                    <div 
                        class="options" 
                        v-for="(option, index) in options" 
                        :key="index"
                    >
                        {{ }}
                    </div>
                </div>
                <!-- <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown Button
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">First In First Out (FIFO)</a></li>
                        <li><a class="dropdown-item" href="#">Least Recently Used (LRU)</a></li>
                        <li><a class="dropdown-item" href="#">Least Frequently Used (LFU)</a></li>
                        <li><a class="dropdown-item" href="#">Optimal</a></li>
                    </ul>
                </div>   -->

            </div>

            <div class="col">
                <input type="number" class="form-control" placeholder="Enter num of pages" aria-label="Last name">
            </div>

            <div class="col">
                
                 <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Enter the num of frames
                    </button>
                    <ul class="dropdown-menu">
                        <!-- <li><a class="dropdown-item" href="#">1</a></li>
                        <li><a class="dropdown-item" href="#">2</a></li> -->
                        <li><a class="dropdown-item" href="#">3</a></li>
                        <li><a class="dropdown-item" href="#">4</a></li>
                        <li><a class="dropdown-item" href="#">5</a></li>
                        <li><a class="dropdown-item" href="#">6</a></li>
                        <li><a class="dropdown-item" href="#">7</a></li>
                    </ul>
                </div>  

            </div>
        </div>

       <button type="button" class="generateBtn">Generate</button>

</template>

<style scoped>
    .dropdown-wrapper {
        padding: 16px;
        cursor: pointer; 
        max-width: 200px; 
        margin: 0 auto;
        background-color: gray;
    }

    .generateBtn{
        background-color: gold;
        width: 50%;
        align-items: center;
    }
</style>

<script lang="ts">
import { defineComponent, defineProps } from 'vue'

const props = defineProps({
    options: {
        type: Array,
        required: true
    }
})

export default defineComponent({
    setup() {
        
    },
})
</script>
