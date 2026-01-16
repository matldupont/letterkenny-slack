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
  templateRules: ReplacementRule[];
};

export type SpiceLevel = "thick" | "extra" | "max";

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
  templateRules: [],
};

const extraConfig: Pick<
  LetterkennyConfig,
  "discourseParticles" | "intensifierRules" | "phrasingRules" | "contractionRules" | "templateRules"
> = {
  discourseParticles: [
    "ferda.",
    "how'r ya now.",
    "let's go.",
    "all right then.",
    "that's the ticket.",
    "give'r.",
    "there it is.",
    "oh, for sure.",
    "and that's that.",
  ],
  intensifierRules: [
    { pattern: /\bawesome\b/gi, replacement: "deadly" },
    { pattern: /\bperfect\b/gi, replacement: "mint" },
    { pattern: /\bterrible\b/gi, replacement: "brutal" },
    { pattern: /\bfunny\b/gi, replacement: "a hoot" },
    { pattern: /\bweird\b/gi, replacement: "a bit odd" },
  ],
  phrasingRules: [
    { pattern: /\bplease\b/gi, replacement: "pretty please" },
    { pattern: /\bnow\b/gi, replacement: "right now" },
    { pattern: /\bgoing\b/gi, replacement: "goin'" },
    { pattern: /\bdoing\b/gi, replacement: "doin'" },
    { pattern: /\bgetting\b/gi, replacement: "gettin'" },
    { pattern: /\blet's\b/gi, replacement: "let's get after it" },
    { pattern: /\bokay\b/gi, replacement: "yeah okay" },
    { pattern: /\bok\b/gi, replacement: "yeah okay" },
    { pattern: /\bno problem\b/gi, replacement: "no worries" },
  ],
  contractionRules: [
    { pattern: /\byou are\b/gi, replacement: "you're" },
    { pattern: /\bwe have\b/gi, replacement: "we've" },
    { pattern: /\bthey have\b/gi, replacement: "they've" },
  ],
  templateRules: [],
};

const maxConfig: Pick<
  LetterkennyConfig,
  "discourseParticles" | "intensifierRules" | "phrasingRules" | "contractionRules" | "templateRules"
> = {
  discourseParticles: [
    "ferda.",
    "pitter patter.",
    "give'r.",
    "nooo doubt.",
    "right on.",
  ],
  intensifierRules: [
    { pattern: /\bvery\b/gi, replacement: "real friggin" },
    { pattern: /\breally\b/gi, replacement: "real friggin" },
    { pattern: /\bextremely\b/gi, replacement: "right proper" },
  ],
  phrasingRules: [
    { pattern: /\bdo you want to\b/gi, replacement: "ya wanna" },
    { pattern: /\bwant to\b/gi, replacement: "wanna" },
    { pattern: /\bgoing to\b/gi, replacement: "gonna" },
    { pattern: /\bgot to\b/gi, replacement: "gotta" },
    { pattern: /\bkind of\b/gi, replacement: "kinda" },
    { pattern: /\bsort of\b/gi, replacement: "sorta" },
  ],
  contractionRules: [
    { pattern: /\bI have\b/gi, replacement: "I've" },
    { pattern: /\bI will\b/gi, replacement: "I'll" },
    { pattern: /\bwe will\b/gi, replacement: "we'll" },
  ],
  templateRules: [
    { pattern: /\bI am tired\b/gi, replacement: "I'm right beat" },
    { pattern: /\bI'm tired\b/gi, replacement: "I'm right beat" },
    { pattern: /\bI am (.+) today\b/gi, replacement: "I'm right $1 today" },
    { pattern: /\bI can't focus on (.+)\b/gi, replacement: "Can't focus on $1 to save my life" },
    { pattern: /\bI can't focus\b/gi, replacement: "Can't focus to save my life" },
    { pattern: /\bI don't want to (.+)\b/gi, replacement: "Don't wanna $1, not even a bit" },
    { pattern: /\bThis is (annoying|frustrating)\b/gi, replacement: "This is a whole pile of $1" },
    { pattern: /\bThis is (good|great)\b/gi, replacement: "This is real good" },
    { pattern: /\bCan you (.+)\b/gi, replacement: "Any chance you can $1" },
    { pattern: /\bCould you (.+)\b/gi, replacement: "Any chance you could $1" },
    { pattern: /\bPlease (.+)\b/gi, replacement: "Any chance you can $1" },
    { pattern: /\bWe need to (.+)\b/gi, replacement: "We gotta $1" },
    { pattern: /\bLet's (.+)\b/gi, replacement: "Let's get after it and $1" },
    { pattern: /\bGood job\b/gi, replacement: "That’s real good work" },
    { pattern: /\bI need (.+)\b/gi, replacement: "I gotta get $1" },
    { pattern: /\bWe need (.+)\b/gi, replacement: "We gotta get $1" },
    { pattern: /\bI am (.+)\b/gi, replacement: "I'm right $1" },
    { pattern: /\bThis is (.+)\b/gi, replacement: "This is right $1" },
    { pattern: /\bI am not (.+)\b/gi, replacement: "I ain't $1, not today" },
    { pattern: /\bThis is bad\b/gi, replacement: "This is real bad" },
    { pattern: /\bWe should (.+)\b/gi, replacement: "We oughta $1" },
  ],
};

const spiceIntentParticleMap: Record<SpiceLevel, Record<string, string>> = {
  thick: thickConfig.intentParticleMap,
  extra: {
    greeting: "how'r ya now.",
    thanks: "oh, for sure.",
    complaint: "there, bud.",
    praise: "that's the ticket.",
    question: "eh?",
    statement: "ya know.",
  },
  max: {
    greeting: "how'r ya now.",
    thanks: "oh, for sure.",
    complaint: "right on.",
    praise: "give'r.",
    question: "eh?",
    statement: "pitter patter.",
  },
};

export function getLetterkennyConfig(spice: SpiceLevel = "thick"): LetterkennyConfig {
  if (spice === "thick") {
    return thickConfig;
  }

  const layers = spice === "max" ? [extraConfig, maxConfig] : [extraConfig];

  const merged = layers.reduce<LetterkennyConfig>(
    (config, layer) => ({
      ...config,
      discourseParticles: [...config.discourseParticles, ...layer.discourseParticles],
      intensifierRules: [...config.intensifierRules, ...layer.intensifierRules],
      phrasingRules: [...config.phrasingRules, ...layer.phrasingRules],
      contractionRules: [...config.contractionRules, ...layer.contractionRules],
      templateRules: [...config.templateRules, ...layer.templateRules],
    }),
    { ...thickConfig },
  );

  return {
    ...merged,
    intentParticleMap: spiceIntentParticleMap[spice] ?? thickConfig.intentParticleMap,
  };
}
