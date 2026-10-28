/**
 * Testing rank progression.
 *
 * Ranks are ordered from lowest to highest. A tester starts at `bronze 3` and
 * moves up every 100 points. Fifteen completed bug reports (1,500 points) reach
 * the maximum rank, `diamond 1`, so the final step is 200 points.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import {
  RANK_THRESHOLDS,
  TESTING_RANKS,
} from "../constants/constants.js";

export type TestingRank = (typeof TESTING_RANKS)[number];

export const INITIAL_TESTING_RANK: TestingRank = TESTING_RANKS[0];

/**
 * Returns the rank for a point total. Negative, null and non-finite values fall
 * back to the initial rank instead of producing an invalid index.
 */
export function rankForPoints(points: number | null | undefined): TestingRank {
  if (points === null || points === undefined || !Number.isFinite(points)) {
    return INITIAL_TESTING_RANK;
  }

  const safePoints = Math.max(0, points);
  let index = 0;

  for (let i = 0; i < RANK_THRESHOLDS.length; i += 1) {
    if (safePoints >= RANK_THRESHOLDS[i]) {
      index = i;
    } else {
      break;
    }
  }

  return TESTING_RANKS[index];
}
