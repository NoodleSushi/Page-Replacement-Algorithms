interface PageReplResults {
  framesCount: number;
  pageRefs: number[];
  framesStates: framesState[];
  faultsCount: number;
  faultsPercentage: string;
  hitsCount: number;
  hitsPercentage: string;
}

interface framesState {
  time: number;
  frames: {
    page: number | null;
    state: 'fault' | 'hit' | 'empty';
  }[];
  isHit: boolean;
}

export default abstract class BasePageRepl {
  private _pageRefs: number[];
  private _framesCount: number;

  constructor(refSequence: number[], framesCount: number) { 
    this._pageRefs = refSequence;
    this._framesCount = framesCount;
  }

  public get pageRefs(): ReadonlyArray<number> {
    return this._pageRefs;
  }

  public get framesCount(): number {
    return this._framesCount;
  }

  public execute(): PageReplResults {

  }

  public abstract process()
}
