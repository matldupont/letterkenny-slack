import { letterkennyConfig } from "./config.js";

export type Intent =
  | "greeting"
  | "thanks"
  | "complaint"
  | "praise"
  | "question"
  | "statement";

export function toLetterkenny(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "Say somethin' there, bud.";
  }

  const intent = detectIntent(trimmed);
  const sentences = splitSentences(trimmed);

  const transformed = sentences.flatMap((sentence, index) => {
    const isFirst = index === 0;
    if (intent === "greeting" && isFirst) {
      return transformGreetingSentence(sentence);
    }
    return [transformSentence(sentence)];
  });

  const rejoined = transformed.join(" ");
  const finalSentences = splitSentences(rejoined);
  const withParticle = injectDiscourseParticle(finalSentences, intent);

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

function transformGreetingSentence(sentence: string): string[] {
  const parts = sentence.split(",");
  const greetingTarget = parts[0] ?? "";
  const rest = parts.slice(1).join(",").trim();

  const match = greetingTarget.match(/^(hi|hello|hey)\b\s*(.*)$/i);
  if (!match) {
    return [transformSentence(sentence)];
  }

  const openerBase = letterkennyConfig.greetingOpeners[0];
  if (!openerBase) {
    return [transformSentence(sentence)];
  }
  const addressee = (match[2] ?? "").trim();
  const opener = addressee ? `${openerBase}, ${addressee}` : openerBase;
  const openerSentence = addPunctuationIfMissing(opener, "?");

  if (!rest) {
    return [openerSentence];
  }

  const remainder = capitalizeSentence(transformSentence(rest));
  return [openerSentence, remainder];
}

function transformSentence(sentence: string): string {
  let transformed = sentence.trim();
  transformed = applyRules(transformed, letterkennyConfig.contractionRules);
  transformed = applyRules(transformed, letterkennyConfig.intensifierRules);
  transformed = applyRules(transformed, letterkennyConfig.phrasingRules);

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

function injectDiscourseParticle(sentences: string[], intent: Intent): string[] {
  if (sentences.length === 0) {
    return sentences;
  }

  const lastIndex = sentences.length - 1;
  const lastSentence = sentences[lastIndex];

  if (containsParticle(lastSentence)) {
    return sentences;
  }

  const lastIsQuestion = /\?\s*$/.test(lastSentence);
  const particle =
    (intent === "question" && lastIsQuestion
      ? letterkennyConfig.intentParticleMap.question
      : letterkennyConfig.intentParticleMap[intent]) ??
    letterkennyConfig.discourseParticles[0];

  sentences[lastIndex] = appendParticle(lastSentence, particle);
  return sentences;
}

function appendParticle(sentence: string, particle: string): string {
  const trimmed = sentence.trim();
  const base = trimmed.replace(/[.!?]\s*$/, "");
  return `${base}, ${particle}`;
}

function containsParticle(sentence: string): boolean {
  return letterkennyConfig.discourseParticles.some((particle) => {
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

function capitalizeSentence(sentence: string): string {
  if (!sentence) {
    return sentence;
  }
  return sentence[0].toUpperCase() + sentence.slice(1);
}
