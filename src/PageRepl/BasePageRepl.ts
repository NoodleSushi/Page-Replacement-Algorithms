/*
Sample Return:
PageReplFIFO([1, 2, 3, 2, 1], 3).execute() returns: 
{
  algoName: 'First In First Out (FIFO)',
  framesCount: 5,
  pageRefs: [1, 2, 3, 2, 1],
  framesStates: [
    {
      idx: 0,
      frameIdx: 0,
      page: 1,
      framesContent: [
        { frameIdx: 0, page: 1, state: 'fault' },
        { frameIdx: 1, page: null, state: 'empty' },
        { frameIdx: 2, page: null, state: 'empty' },
      ],
      isHit: false,
    },
    {
      idx: 1,
      frameIdx: 1,
      page: 2,
      framesContent: [
        { frameIdx: 0, page: 1, state: 'unchanged' },
        { frameIdx: 1, page: 2, state: 'fault' },
        { frameIdx: 2, page: null, state: 'empty' },
      ],
      isHit: false,
    },
    {
      idx: 2,
      frameIdx: 2,
      page: 3,
      framesContent: [
        { frameIdx: 0, page: 1, state: 'unchanged' },
        { frameIdx: 1, page: 2, state: 'unchanged' },
        { frameIdx: 2, page: 3, state: 'fault' },
      ],
      isHit: false,
    },
    {
      idx: 3,
      frameIdx: 1,
      page: 2,
      framesContent: [
        { frameIdx: 0, page: 1, state: 'unchanged' },
        { frameIdx: 1, page: 2, state: 'hit' },
        { frameIdx: 2, page: 3, state: 'unchanged' },
      ],
      isHit: true,
    },
    {
      idx: 4,
      frameIdx: 0,
      page: 1,
      framesContent: [
        { frameIdx: 0, page: 1, state: 'hit' },
        { frameIdx: 1, page: 2, state: 'unchanged' },
        { frameIdx: 2, page: 3, state: 'unchanged' },
      ],
      isHit: true,
    }
  ],
  faultsCount: 3,
  faultsPercentage: '60.00%',
  hitsCount: 2,
  hitsPercentage: '40.00%',
}
*/

export interface PageReplResults {
  algoName: string;
  framesCount: number;
  pageRefs: number[];
  framesStates: FramesState[];
  faultsCount: number;
  faultsPercentage: string;
  hitsCount: number;
  hitsPercentage: string;
}

export interface FramesState {
  idx: number;
  frameIdx: number;
  page: number;
  framesContent: FrameContent[];
  isHit: boolean;
}

export interface FrameContent {
  frameIdx: number;
  page: number | null;
  state: "fault" | "hit" | "empty" | "unchanged";
}

export default abstract class BasePageRepl {
  private _pageRefs: number[];
  private _framesCount: number;
  private _frameIdxHistory: number[] = [];

  constructor(refSequence: number[], framesCount: number) {
    this._pageRefs = refSequence;
    this._framesCount = framesCount;
  }

  public get pageRefs(): number[] {
    return [...this._pageRefs];
  }

  public get framesCount(): number {
    return this._framesCount;
  }

  public get frameIdxHistory(): number[] {
    return [...this._frameIdxHistory];
  }

  public abstract get algoName(): string;

  public execute(): PageReplResults {
    const framesStates: FramesState[] = [];
    let faultsCount: number = 0;
    let hitsCount: number = 0;

    if (this.ready)
      this.ready();

    for (let idx = 0; idx < this.pageRefs.length; idx++) {
      const page: number = this.pageRefs[idx];
      const framesContent: FrameContent[] = framesStates.length > 0
        ? framesStates[framesStates.length - 1].framesContent.map((frame, frameIdx) => ({
            ...frame,
            frameIdx,
            state: frame.page == null ? "empty" : "unchanged",
          }))
        : Array(this.framesCount).fill(null).map((_, frameIdx) => ({
            frameIdx,
            page: null,
            state: "empty",
          }));
      const hitIdx: number = framesContent.findIndex((frame) => frame.page === page);
      const isHit: boolean = (hitIdx != -1);
      let frameIdx: number = -1;

      if (isHit) {
        hitsCount++;
        framesContent[hitIdx].state = "hit";
        frameIdx = hitIdx;
      } else {
        faultsCount++;
        const nullIdx = framesContent.findIndex((frame) => frame.page == null);
        if (nullIdx != -1) {
          frameIdx = nullIdx;
        } else {
          const faultFrameIdx = this.manageFault({ idx, frameIdx, page, framesContent, isHit });
          if (faultFrameIdx < 0 || faultFrameIdx >= framesContent.length) {
            throw new Error("Invalid fault frame index");
          }
          frameIdx = faultFrameIdx;
          this._frameIdxHistory.splice(this._frameIdxHistory.indexOf(faultFrameIdx), 1);
        }
        framesContent[frameIdx].page = page;
        framesContent[frameIdx].state = "fault";
        this._frameIdxHistory.push(frameIdx);
      }
      const newFramesState: FramesState = { idx, frameIdx, page, framesContent, isHit };
      framesStates.push(newFramesState);
      if (this.postProcess)
        this.postProcess(newFramesState);
    }

    return {
      algoName: this.algoName,
      framesCount: this._framesCount,
      pageRefs: [...this._pageRefs],
      framesStates,
      faultsCount,
      faultsPercentage: `${((faultsCount / this._pageRefs.length) * 100).toFixed(2)}%`,
      hitsCount,
      hitsPercentage: `${((hitsCount / this._pageRefs.length) * 100).toFixed(2)}%`,
    };
  }

  protected ready?(): void;

  protected postProcess?(newFramesState: Readonly<FramesState>): void;

  protected abstract manageFault(currentFramesState: Readonly<FramesState>): number;
}
