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

export type SpiceLevel = "thick" | "extra";

const thickConfig: LetterkennyConfig = {
  discourseParticles: [
    "eh!",
    "eh?",
    "bud.",
    "good buddy.",
    "pal.",
    "there, bud.",
    "ya know.",
    "big shoots.",
    "boys.",
    "girl.",
    "nooo doubt.",
    "get after it.",
    "pitter patter.",
    "you bet.",
  ],
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
    { pattern: /\bextremely\b/gi, replacement: "right proper" },
    { pattern: /\bso\s+(good|bad|tired|annoyed)\b/gi, replacement: "right proper $1" },
    { pattern: /\b(absolutely|totally|seriously)\b/gi, replacement: "friggin" },
    { pattern: /\bpretty\b/gi, replacement: "right" },
    { pattern: /\ba little\b/gi, replacement: "a smidge" },
    { pattern: /\bslightly\b/gi, replacement: "a smidge" },
    { pattern: /\ba lot\b/gi, replacement: "a whole pile" },
    { pattern: /\bquite\b/gi, replacement: "right" },
  ],
  phrasingRules: [
    { pattern: /\ba great job\b/gi, replacement: "real good" },
    { pattern: /\bgreat job\b/gi, replacement: "real good" },
    { pattern: /\bwell done\b/gi, replacement: "real good" },
    { pattern: /\bstart the standup\b/gi, replacement: "get this standup goin'" },
    { pattern: /\bcan not\b/gi, replacement: "can't" },
    { pattern: /\babout to\b/gi, replacement: "boutta" },
    { pattern: /\bout of\b/gi, replacement: "outta" },
    { pattern: /\blet me\b/gi, replacement: "lemme" },
    { pattern: /\bgive me\b/gi, replacement: "gimme" },
    { pattern: /\bkind of\b/gi, replacement: "kinda" },
    { pattern: /\bsort of\b/gi, replacement: "sorta" },
    { pattern: /\babout\b/gi, replacement: "aboot" },
    { pattern: /\bbecause\b/gi, replacement: "'cause" },
    { pattern: /\bjust\b/gi, replacement: "just plain" },
    { pattern: /\bpeople\b/gi, replacement: "folks" },
    { pattern: /\beveryone\b/gi, replacement: "everybody" },
    { pattern: /\bannoyed\b/gi, replacement: "pissed" },
    { pattern: /\bfrustrated\b/gi, replacement: "fed up" },
    { pattern: /\bupset\b/gi, replacement: "rattled" },
    { pattern: /\bconfused\b/gi, replacement: "turned around" },
    { pattern: /\bready\b/gi, replacement: "set" },
    { pattern: /\bhate\b/gi, replacement: "can't stand" },
    { pattern: /\bvery good\b/gi, replacement: "real good" },
    { pattern: /\bvery bad\b/gi, replacement: "real bad" },
    { pattern: /\btired\b/gi, replacement: "beat" },
    { pattern: /\bmad\b/gi, replacement: "right pissed" },
    { pattern: /\bnot going to\b/gi, replacement: "ain't gonna" },
    { pattern: /\bdo not\b/gi, replacement: "don't" },
    { pattern: /\bdoes not\b/gi, replacement: "doesn't" },
    { pattern: /\bis not\b/gi, replacement: "ain't" },
    { pattern: /\bare not\b/gi, replacement: "ain't" },
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
    { pattern: /\bgoing\b/gi, replacement: "goin'" },
    { pattern: /\bdoing\b/gi, replacement: "doin'" },
    { pattern: /\bgetting\b/gi, replacement: "gettin'" },
    { pattern: /\bcannot\b/gi, replacement: "can't" },
    { pattern: /\bcan not\b/gi, replacement: "can't" },
  ],
  greetingRules: [
    { pattern: /\bhi\b/gi, replacement: "How're ya now" },
    { pattern: /\bhello\b/gi, replacement: "How're ya now" },
    { pattern: /\bhey\b/gi, replacement: "How're ya now" },
  ],
};

const extraConfig: Pick<
  LetterkennyConfig,
  "discourseParticles" | "intensifierRules" | "phrasingRules" | "contractionRules"
> = {
  discourseParticles: ["ferda.", "how'r ya now.", "let's go.", "all right then."],
  intensifierRules: [
    { pattern: /\bawesome\b/gi, replacement: "deadly" },
    { pattern: /\bperfect\b/gi, replacement: "mint" },
    { pattern: /\bterrible\b/gi, replacement: "brutal" },
  ],
  phrasingRules: [
    { pattern: /\bplease\b/gi, replacement: "pretty please" },
    { pattern: /\bnow\b/gi, replacement: "right now" },
    { pattern: /\bgoing\b/gi, replacement: "goin'" },
    { pattern: /\bdoing\b/gi, replacement: "doin'" },
    { pattern: /\bgetting\b/gi, replacement: "gettin'" },
  ],
  contractionRules: [
    { pattern: /\byou are\b/gi, replacement: "you're" },
    { pattern: /\bwe have\b/gi, replacement: "we've" },
    { pattern: /\bthey have\b/gi, replacement: "they've" },
  ],
};

export function getLetterkennyConfig(spice: SpiceLevel = "thick"): LetterkennyConfig {
  if (spice !== "extra") {
    return thickConfig;
  }

  return {
    ...thickConfig,
    discourseParticles: [
      ...thickConfig.discourseParticles,
      ...extraConfig.discourseParticles,
    ],
    intensifierRules: [
      ...thickConfig.intensifierRules,
      ...extraConfig.intensifierRules,
    ],
    phrasingRules: [...thickConfig.phrasingRules, ...extraConfig.phrasingRules],
    contractionRules: [
      ...thickConfig.contractionRules,
      ...extraConfig.contractionRules,
    ],
  };
}
