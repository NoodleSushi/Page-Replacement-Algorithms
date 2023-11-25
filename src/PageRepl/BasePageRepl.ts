type OptionalKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]>
      ? never
      : K
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

type PickOptional<T> = Pick<T, OptionalKeys<T>>;

// const samp = { 
//   a: "random",
//   b: 234
// }

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
  frequencyStates?: FrequencyState[];
}

export type OptionalFramesStateProps = PickOptional<FramesState>;

export interface FrameContent {
  frameIdx: number;
  page: number | null;
  state: "fault" | "hit" | "empty" | "unchanged";
}

export interface FrequencyState {
  page: number;
  freq: number;
  isUpdated: boolean;
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
      let optionalFramesStateProps: OptionalFramesStateProps = {};
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
          const faultResult = this.manageFault({ idx, frameIdx, page, framesContent, isHit });
          let faultFrameIdx: number;
          if (Array.isArray(faultResult)) {
            faultFrameIdx = faultResult[0];
            optionalFramesStateProps = {
              ...optionalFramesStateProps,
              ...faultResult[1],
            }
          } else {
            faultFrameIdx = faultResult;
          }
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
      let newFramesState: FramesState = { idx, frameIdx, page, framesContent, isHit, ...optionalFramesStateProps };
      if (this.postProcess) {
        const addFramesState = this.postProcess(newFramesState);
        if (addFramesState) {
          newFramesState = { ...newFramesState, ...addFramesState };
        }
      }
      framesStates.push(newFramesState);
    }

    // console.log(framesContent, "asdf")

    return {
      algoName: this.algoName,
      framesCount: this._framesCount,
      pageRefs: [...this._pageRefs],
      framesStates,
      faultsCount,
      faultsPercentage: `${(Math.round((faultsCount / this._pageRefs.length) * 100 * 100) / 100).toFixed(2)}%`,
      hitsCount,
      hitsPercentage: `${(Math.round((hitsCount / this._pageRefs.length) * 100 * 100) / 100).toFixed(2)}%`,
    };
  }

  protected ready?(): void;

  protected postProcess?(newFramesState: Readonly<FramesState>): OptionalFramesStateProps | void;

  protected abstract manageFault(currentFramesState: Readonly<FramesState>): number | [number, OptionalFramesStateProps];
}
