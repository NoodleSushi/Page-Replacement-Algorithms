# Types

## BasePageRepl
This is the base class of and applies to all page replacement algorithms available.

```ts
abstract class BasePageRepl {
  constructor(refSequence: number[], framesCount: number)
  
  public get pageRefs(): number[]
  public get framesCount(): number
  public abstract get algoName(): string
  public execute(): PageReplResults
}
```
The following Subclasses are available:
- `PageReplFIFO`
- `PageReplLRU`
- `PageReplLFU`
- `PageReplOptimal`
## PageReplResults
This is the object type returned by `BasePageRepl`'s `execute()`
```ts
interface PageReplResults {
  algoName: string;
  framesCount: number;
  pageRefs: number[];
  framesStates: FramesState[];
  faultsCount: number;
  faultsPercentage: string;
  hitsCount: number;
  hitsPercentage: string;
}

interface FramesState {
  idx: number;
  frameIdx: number;
  page: number;
  framesContent: FrameContent[];
  isHit: boolean;
}

interface FrameContent {
  frameIdx: number;
  page: number | null;
  state: "fault" | "hit" | "empty" | "unchanged";
}
```


# Sample Usage

## From PageReplList
```ts
import { PageReplList } from "./PageRepl";

const chosenPageRepl = PageReplList[0];
const name    = chosenPageRepl.name;
const results = chosenPageRepl.class(..., ...).execute();
```

## Directly From a Subclass
```ts
import { PageReplFIFO } from "./PageRepl";
const chosenPageRepl = new PageReplFIFO(..., ...);
const name    = chosenPageRepl.algoName;
const results = chosenPageRepl.execute();
```

# Example
## Code
```ts
import { PageReplFIFO } from "./PageRepl";
console.log(new PageReplFIFO([1, 2, 3, 2, 1], 3).execute());
```
## Results
```js
{
  algoName: 'First In First Out (FIFO)',
  framesCount: 3,
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
```