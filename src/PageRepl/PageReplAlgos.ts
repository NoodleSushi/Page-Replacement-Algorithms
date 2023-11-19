import BasePageRepl, { FramesState } from "./BasePageRepl";

export class PageReplFIFO extends BasePageRepl {
  constructor(refSequence: number[], framesCount: number) {
    super(refSequence, framesCount);
  }

  public get algoName(): string { return "First In First Out (FIFO)"; }
  
  protected manageFault(_: Readonly<FramesState>): number {
    return this.frameIdxHistory[0];
  }
}


export class PageReplLRU extends BasePageRepl {
  constructor(refSequence: number[], framesCount: number) {
    super(refSequence, framesCount);
  }

  public get algoName(): string { return "Least Recently Used (LRU)"; }
  
  protected manageFault(currentFramesState: Readonly<FramesState>): number {
    const { idx } = currentFramesState;
    const pageRefs = this.pageRefs.slice(0, idx).reverse();
    const origFramesContent = currentFramesState.framesContent
      .map((frame) => frame.page)
      .filter((page) => page != null) as number[];
    const framesContent = origFramesContent.slice();

    for (const pageRef of pageRefs) {
      if (framesContent.length == 1)
        break;
      const pageRefIdx = framesContent.indexOf(pageRef);
      if (pageRefIdx != -1) {
        framesContent.splice(pageRefIdx, 1);
      }
    }
    return origFramesContent.indexOf(framesContent[0]);
  }
}

// TODO: fix last reference case on fault
export class PageReplOptimal extends BasePageRepl {
  constructor(refSequence: number[], framesCount: number) {
    super(refSequence, framesCount);
  }

  public get algoName(): string { return "Optimal"; }
  
  protected manageFault(currentFramesState: Readonly<FramesState>): number {
    const { idx } = currentFramesState;
    const origFramesContent = currentFramesState.framesContent
      .map((frame) => frame.page)
      .filter((page) => page != null) as number[];
    const framesContent = origFramesContent.slice();
    const pageRefs = this.pageRefs.slice(idx + 1);

    for (const pageRef of pageRefs) {
      if (framesContent.length == 1)
        break;
      const pageRefIdx = framesContent.indexOf(pageRef);
      if (pageRefIdx != -1) {
        framesContent.splice(pageRefIdx, 1);
      }
    }
    return origFramesContent.indexOf(framesContent[0]);
  }
}
