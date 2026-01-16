import { getLetterkennyConfig, type SpiceLevel } from "./config.js";

export type Intent =
  | "greeting"
  | "thanks"
  | "complaint"
  | "praise"
  | "question"
  | "statement";

export function toLetterkenny(
  input: string,
  options: { spice?: SpiceLevel } = {},
): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "Say somethin' there, bud.";
  }

  const config = getLetterkennyConfig(options.spice);
  const intent = detectIntent(trimmed);
  const sentences = splitSentences(trimmed);

  const transformed = sentences.flatMap((sentence, index) => {
    const isFirst = index === 0;
    if (intent === "greeting" && isFirst) {
      return transformGreetingSentence(sentence, config);
    }
    return [transformSentence(sentence, config)];
  });

  const rejoined = transformed.join(" ");
  const finalSentences = splitSentences(rejoined);
  const withParticle = injectDiscourseParticle(finalSentences, intent, config);

  return withParticle.join(" ").replace(/\s+/g, " ").trim();
}

export function detectIntent(input: string): Intent {
  const normalized = input.trim().toLowerCase();

  if (/^(hi|hello|hey)\b/.test(normalized)) {
    return "greeting";
  }
  if (/\bthank(s| you)?\b/.test(normalized)) {
    return "thanks";
  }
  if (/\b(don't want|do not want|hate|annoyed|frustrated)\b/.test(normalized)) {
    return "complaint";
  }
  if (/\b(great job|well done|good work)\b/.test(normalized)) {
    return "praise";
  }
  if (/\?\s*$/.test(normalized)) {
    return "question";
  }
  return "statement";
}

function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]?/g);
  if (!matches) {
    return [];
  }
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function transformGreetingSentence(
  sentence: string,
  config: ReturnType<typeof getLetterkennyConfig>,
): string[] {
  const parts = sentence.split(",");
  const greetingTarget = parts[0] ?? "";
  const rest = parts.slice(1).join(",").trim();

  const match = greetingTarget.match(/^(hi|hello|hey)\b\s*(.*)$/i);
  if (!match) {
    return [transformSentence(sentence, config)];
  }

  const openerBase = config.greetingOpeners[0];
  if (!openerBase) {
    return [transformSentence(sentence, config)];
  }
  const addressee = (match[2] ?? "").trim();
  const opener = addressee ? `${openerBase}, ${addressee}` : openerBase;
  const openerSentence = addPunctuationIfMissing(opener, "?");

  if (!rest) {
    return [openerSentence];
  }

  const remainder = capitalizeSentence(transformSentence(rest, config));
  return [openerSentence, remainder];
}

function transformSentence(
  sentence: string,
  config: ReturnType<typeof getLetterkennyConfig>,
): string {
  let transformed = sentence.trim();
  transformed = applyRules(transformed, config.templateRules);
  transformed = applyRules(transformed, config.contractionRules);
  transformed = applyRules(transformed, config.intensifierRules);
  transformed = applyRules(transformed, config.phrasingRules);

  transformed = transformed.replace(
    /^(I am|I'm)\s+real\s+/i,
    "Real ",
  );
  transformed = transformed.replace(/^I\s+don't\s+/i, "Don't ");

  return capitalizeSentence(transformed);
}

function applyRules(sentence: string, rules: { pattern: RegExp; replacement: string }[]): string {
  return rules.reduce((current, rule) => {
    return current.replace(rule.pattern, (match) =>
      caseMatchReplacement(match, rule.replacement),
    );
  }, sentence);
}

function caseMatchReplacement(match: string, replacement: string): string {
  if (!match) {
    return replacement;
  }
  if (match.toUpperCase() === match) {
    return replacement.toUpperCase();
  }
  if (match[0] === match[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function injectDiscourseParticle(
  sentences: string[],
  intent: Intent,
  config: ReturnType<typeof getLetterkennyConfig>,
): string[] {
  if (sentences.length === 0) {
    return sentences;
  }

  const lastIndex = sentences.length - 1;
  const lastSentence = sentences[lastIndex];

  if (containsParticle(lastSentence, config)) {
    return sentences;
  }

  const lastIsQuestion = /\?\s*$/.test(lastSentence);
  const particle =
    (intent === "question" && lastIsQuestion
      ? config.intentParticleMap.question
      : config.intentParticleMap[intent]) ??
    config.discourseParticles[0];

  sentences[lastIndex] = appendParticle(lastSentence, particle);
  return sentences;
}

function appendParticle(sentence: string, particle: string): string {
  const trimmed = sentence.trim();
  const base = trimmed.replace(/[.!?]\s*$/, "");
  return `${base}, ${particle}`;
}

function containsParticle(
  sentence: string,
  config: ReturnType<typeof getLetterkennyConfig>,
): boolean {
  return config.discourseParticles.some((particle) => {
    const needle = particle.replace(/[.!?]/g, "");
    return new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i").test(sentence);
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addPunctuationIfMissing(sentence: string, punctuation: string): string {
  if (/[.!?]\s*$/.test(sentence)) {
    return sentence;
  }
  return `${sentence}${punctuation}`;
}

export function parseSpiceDirective(
  input: string,
): { text: string; spice: SpiceLevel } {
  const trimmed = input.trim();
  const match = trimmed.match(/^(--|!)(extra|spicy|thick|max)\s+/i);
  if (!match) {
    return { text: trimmed, spice: "thick" };
  }

  const token = match[2]?.toLowerCase();
  const spice =
    token === "max"
      ? "max"
      : token === "extra" || token === "spicy"
        ? "extra"
        : "thick";
  const rest = trimmed.slice(match[0].length);
  return { text: rest.trim(), spice };
}

function capitalizeSentence(sentence: string): string {
  if (!sentence) {
    return sentence;
  }
  return sentence[0].toUpperCase() + sentence.slice(1);
}
