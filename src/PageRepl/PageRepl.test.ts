import { expect, test } from "vitest";
import { PageReplFIFO, PageReplLRU, PageReplLFU, PageReplOptimal } from "./PageReplAlgos";

test("PageReplFIFO test", () => {
  expect(
    new PageReplFIFO([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 1, 2, 0], 3)
      .execute()
      .framesStates
      .map(x => x.framesContent.map(y => y.page))
  ).toStrictEqual([
    [7, null, null],
    [7, 0, null],
    [7, 0, 1],
    [2, 0, 1],
    [2, 0, 1],
    [2, 3, 1],
    [2, 3, 0],
    [4, 3, 0],
    [4, 2, 0],
    [4, 2, 3],
    [0, 2, 3],
    [0, 2, 3],
    [0, 1, 3],
    [0, 1, 2],
    [0, 1, 2],
  ])
});

test("PageReplLRU test", () => {
  expect(
    new PageReplLRU([3, 2, 1, 3, 4, 1, 6, 2, 4, 3, 4, 2, 1, 4, 5, 2, 1, 3, 4], 3)
      .execute()
      .framesStates
      .map(x => x.framesContent.map(y => y.page))
  ).toStrictEqual([
    [3, null, null],
    [3, 2, null],
    [3, 2, 1],
    [3, 2, 1],
    [3, 4, 1],
    [3, 4, 1],
    [6, 4, 1],
    [6, 2, 1],
    [6, 2, 4],
    [3, 2, 4],
    [3, 2, 4],
    [3, 2, 4],
    [1, 2, 4],
    [1, 2, 4],
    [1, 5, 4],
    [2, 5, 4],
    [2, 5, 1],
    [2, 3, 1],
    [4, 3, 1],
  ])
});

test("PageReplLFU test", () => {
  expect(
    new PageReplLFU([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2], 3)
      .execute()
      .framesStates
      .map(x => x.framesContent.map(y => y.page))
  ).toStrictEqual([
    [7, null, null],
    [7, 0, null],
    [7, 0, 1],
    [2, 0, 1],
    [2, 0, 1],
    [2, 0, 3],
    [2, 0, 3],
    [4, 0, 3],
    [4, 0, 2],
    [3, 0, 2],
    [3, 0, 2],
    [3, 0, 2],
    [3, 0, 2],
    [3, 0, 1],
    [3, 0, 2],
  ])
});

test("PageReplOptimal test", () => {
  expect(
    new PageReplOptimal([3, 2, 1, 3, 4, 1, 6, 2, 4, 3, 4, 2, 1, 4, 5, 2, 1, 3, 4], 3)
      .execute()
      .framesStates
      .map(x => x.framesContent.map(y => y.page))
  ).toStrictEqual([
    [3, null, null],
    [3, 2, null],
    [3, 2, 1],
    [3, 2, 1],
    [4, 2, 1],
    [4, 2, 1],
    [4, 2, 6],
    [4, 2, 6],
    [4, 2, 6],
    [4, 2, 3],
    [4, 2, 3],
    [4, 2, 3],
    [4, 2, 1],
    [4, 2, 1],
    [5, 2, 1],
    [5, 2, 1],
    [5, 2, 1],
    [5, 3, 1],
    [5, 3, 4],
  ])
});

test("PageReplOptimal test II", () => {
  expect(
    new PageReplOptimal([7, 0, 1, 2, 0, 3, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7], 3)
      .execute()
      .framesStates
      .map(x => x.framesContent.map(y => y.page))
  ).toStrictEqual([
    [7, null, null],
    [7, 0, null],
    [7, 0, 1],
    [2, 0, 1],
    [2, 0, 1],
    [2, 0, 3],
    [2, 4, 3],
    [2, 4, 3],
    [2, 4, 3],
    [2, 0, 3],
    [2, 0, 3],
    [2, 0, 3],
    [2, 0, 1],
    [2, 0, 1],
    [2, 0, 1],
    [2, 0, 1],
    [7, 0, 1],
  ])
});