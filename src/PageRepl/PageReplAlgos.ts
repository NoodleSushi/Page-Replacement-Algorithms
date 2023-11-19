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


export class PageReplLFU extends BasePageRepl {
  private pageFreqMap: Map<number, number>;

  constructor(refSequence: number[], framesCount: number) {
    super(refSequence, framesCount);
    this.pageFreqMap = new Map<number, number>();
  }

  public get algoName(): string { return "Least Frequently Used (LFU)"; }

  protected ready(): void {
    this.pageFreqMap = new Map<number, number>();
  }
  
  protected manageFault(currentFramesState: Readonly<FramesState>): number {
    const origFramesContent: number[] = currentFramesState.framesContent
      .map((frame) => frame.page)
      .filter((page) => page !== null) as number[];
    
    const leastUsedPages: number[] = []
    let leastUsedPageFreq: number = Infinity;

    for (const page of origFramesContent) {
      const pageFreq = this.pageFreqMap.get(page)!;
      if (pageFreq < leastUsedPageFreq) {
        leastUsedPageFreq = pageFreq;
        leastUsedPages.length = 0;
        leastUsedPages.push(page);
      } else if (pageFreq == leastUsedPageFreq) {
        leastUsedPages.push(page);
      }
    }

    if (leastUsedPages.length == 1) {
      this.pageFreqMap.set(leastUsedPages[0], 0)
      return origFramesContent.indexOf(leastUsedPages[0]);
    }

    for (const frameIdx of this.frameIdxHistory) {
      const page = origFramesContent[frameIdx];
      if (leastUsedPages.includes(page)) {
        this.pageFreqMap.set(page, 0)
        return frameIdx;
      }
    }

    throw new Error("This should never happen");
  }

  protected postProcess(newFramesState: Readonly<FramesState>): void {
    const { page } = newFramesState;
    if (this.pageFreqMap.has(page)) {
      this.pageFreqMap.set(page, this.pageFreqMap.get(page)! + 1);
    } else {
      this.pageFreqMap.set(page, 1);
    }
  }
}


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

    if (framesContent.length == 1) {
      return origFramesContent.indexOf(framesContent[0]);
    }

    for (const frameIdx of this.frameIdxHistory) {
      const page = origFramesContent[frameIdx];
      if (framesContent.includes(page)) {
        return frameIdx;
      }
    }

    throw new Error("This should never happen");
  }
}
