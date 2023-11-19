import { PageReplFIFO, PageReplLFU, PageReplLRU, PageReplOptimal } from "./PageReplAlgos";
import { PageReplResults, FramesState, FrameContent } from "./BasePageRepl";
import BasePageRepl from "./BasePageRepl";

export const PageReplList = ([PageReplFIFO, PageReplLRU, PageReplLFU, PageReplOptimal])
  .map((algo) => ({ name: algo.name, class: algo }));

export { PageReplFIFO, PageReplLFU, PageReplLRU, PageReplOptimal };
export type { BasePageRepl, PageReplResults, FramesState, FrameContent };