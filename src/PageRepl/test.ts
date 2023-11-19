import { PageReplFIFO, PageReplLRU, PageReplOptimal } from "./PageReplAlgos";

const results = new PageReplLRU([3, 2, 1, 3, 4, 1, 6, 2, 4, 3, 4, 2, 1, 4, 5, 2, 1, 3, 4], 3).execute();
console.log(results.framesStates.map(x => x.framesContent));