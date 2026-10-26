import { readFile, writeFile } from "fs/promises";
import path from "path";

const bundledPath = path.join(process.cwd(), "data", "knowledge.md");
const overridePath = path.join(process.cwd(), "data", "knowledge.override.md");

export async function loadKnowledge(): Promise<string> {
  try {
    return await readFile(overridePath, "utf8");
  } catch {
    return readFile(bundledPath, "utf8");
  }
}

export async function getRelevantKnowledge(question: string): Promise<string> {
  const knowledge = await loadKnowledge();
  const sections = knowledge.split(/(?=^## )/m).filter(Boolean);
  const terms = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);
  const scored = sections.map((section, index) => {
    const text = section.toLowerCase();
    const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
    return { section, index, score };
  });
  const selected = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index)
    .map(({ section }) => section);
  const contact = sections.find((section) => /^## .*contact|^## .*location/i.test(section));
  if (contact && !selected.includes(contact)) selected.push(contact);
  return selected.join("\n").slice(0, 16_000) || knowledge.slice(0, 16_000);
}

export async function saveKnowledge(markdown: string): Promise<void> {
  const trimmed = markdown.trim();
  if (trimmed.length < 40 || trimmed.length > 80_000) {
    throw new Error("Knowledge base must be between 40 and 80,000 characters.");
  }
  await writeFile(overridePath, `${trimmed}\n`, "utf8");
}
