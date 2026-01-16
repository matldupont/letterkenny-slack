export type ReplacementRule = {
  pattern: RegExp;
  replacement: string;
};

export type LetterkennyConfig = {
  discourseParticles: string[];
  intentParticleMap: Record<string, string>;
  greetingOpeners: string[];
  intensifierRules: ReplacementRule[];
  phrasingRules: ReplacementRule[];
  contractionRules: ReplacementRule[];
  greetingRules: ReplacementRule[];
};

export const letterkennyConfig: LetterkennyConfig = {
  discourseParticles: ["eh!", "eh?", "bud.", "good buddy.", "pal."],
  intentParticleMap: {
    greeting: "eh!",
    thanks: "good buddy.",
    complaint: "eh!",
    praise: "good buddy.",
    question: "eh?",
    statement: "bud.",
  },
  greetingOpeners: ["How're ya now"],
  intensifierRules: [
    { pattern: /\b(very|really|super)\b/gi, replacement: "real" },
    { pattern: /\ba lot\b/gi, replacement: "a whole pile" },
  ],
  phrasingRules: [
    { pattern: /\ba great job\b/gi, replacement: "real good" },
    { pattern: /\bgreat job\b/gi, replacement: "real good" },
    { pattern: /\bwell done\b/gi, replacement: "real good" },
    { pattern: /\bstart the standup\b/gi, replacement: "get this standup goin'" },
  ],
  contractionRules: [
    { pattern: /\bdo not want to\b/gi, replacement: "don't wanna" },
    { pattern: /\bdon't want to\b/gi, replacement: "don't wanna" },
    { pattern: /\bdoes not\b/gi, replacement: "doesn't" },
    { pattern: /\bdo not\b/gi, replacement: "don't" },
    { pattern: /\bI am\b/gi, replacement: "I'm" },
    { pattern: /\bwe are\b/gi, replacement: "we're" },
    { pattern: /\bthey are\b/gi, replacement: "they're" },
    { pattern: /\bthat is\b/gi, replacement: "that's" },
    { pattern: /\bwhat is\b/gi, replacement: "what's" },
    { pattern: /\blet us\b/gi, replacement: "let's" },
    { pattern: /\bwant to\b/gi, replacement: "wanna" },
    { pattern: /\bgoing to\b/gi, replacement: "gonna" },
    { pattern: /\bcannot\b/gi, replacement: "can't" },
    { pattern: /\bcan not\b/gi, replacement: "can't" },
  ],
  greetingRules: [
    { pattern: /\bhi\b/gi, replacement: "How're ya now" },
    { pattern: /\bhello\b/gi, replacement: "How're ya now" },
    { pattern: /\bhey\b/gi, replacement: "How're ya now" },
  ],
};
