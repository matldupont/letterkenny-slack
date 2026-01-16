import assert from "node:assert/strict";
import { toLetterkenny } from "../src/letterkenny/transform.js";

const cases = [
  {
    input: "I don't want to go to work",
    expected: "Don't wanna go to work, eh!",
  },
  {
    input: "I'm really tired today",
    expected: "Real tired today, bud.",
  },
  {
    input: "Hi team, let's start the standup.",
    expected: "How're ya now, team? Let's get this standup goin', eh!",
  },
  {
    input: "You did a great job on that project",
    expected: "You did real good on that project, good buddy.",
  },
];

for (const testCase of cases) {
  const actual = toLetterkenny(testCase.input);
  assert.equal(
    actual,
    testCase.expected,
    `Expected "${testCase.input}" -> "${testCase.expected}", got "${actual}"`,
  );
}

console.log("Letterkenny examples passed.");
