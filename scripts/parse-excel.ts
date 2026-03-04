import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

const CATEGORIES = [
  "Software Engineer",
  "Data Engineer",
  "Designer (UX)",
  "Product Manager",
  "Data Scientist",
  "Business",
  "System Engineer",
  "Cybersecurity Engineer",
] as const;

type Category = (typeof CATEGORIES)[number];

interface Job {
  id: string;
  category: Category;
  role: string;
  level: string;
  period: string;
  division: string;
  title: string;
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  location: string;
}

const INPUT_FILE = path.resolve(process.cwd(), "govtechinternshipprojects2026.xlsx");
const OUTPUT_FILE = path.resolve(process.cwd(), "public/data/jobs.json");

const categoryPrefix: Record<Category, string> = {
  "Software Engineer": "swe",
  "Data Engineer": "de",
  "Designer (UX)": "ux",
  "Product Manager": "pm",
  "Data Scientist": "ds",
  Business: "biz",
  "System Engineer": "se",
  "Cybersecurity Engineer": "cyber",
};

function keyify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeRow(rawRow: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [rawKey, rawValue] of Object.entries(rawRow)) {
    const key = String(rawKey).trim();
    if (!key) {
      continue;
    }
    normalized[keyify(key)] = String(rawValue ?? "").trim();
  }
  return normalized;
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const value = row[keyify(key)];
    if (value) {
      return value;
    }
  }
  return "";
}

function toList(value: string): string[] {
  if (!value.trim()) {
    return [];
  }

  const splitCandidates = value
    .replace(/\r\n/g, "\n")
    .split(/\n|;(?=\s*[A-Za-z0-9(•\-])/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return splitCandidates
    .map((item) =>
      item
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .replace(/^\(\d+\)\s*/, "")
        .trim(),
    )
    .filter(Boolean);
}

function parseWorkbook(inputPath: string): Job[] {
  const workbook = XLSX.readFile(inputPath);
  const counters = new Map<Category, number>();
  const jobs: Job[] = [];

  for (const category of CATEGORIES) {
    const worksheet = workbook.Sheets[category];
    if (!worksheet) {
      continue;
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      raw: false,
    });

    for (const rawRow of rows) {
      const row = normalizeRow(rawRow);
      const role = pick(row, ["Role"]);
      const level = pick(row, ["Internship Level"]);
      const period = pick(row, ["Internship Period"]);
      const division = pick(row, ["Division"]);
      const title = pick(row, ["Project Title"]);
      const description = pick(row, ["Project Description"]);
      const learningOutcomesRaw = pick(row, ["Learning Outcomes from Project"]);
      const prerequisitesRaw = pick(row, ["Prerequisites"]);
      const location = pick(row, ["Work Location", "Work Location (FormSG)"]);

      if (!role && !title && !description) {
        continue;
      }

      const index = (counters.get(category) ?? 0) + 1;
      counters.set(category, index);

      jobs.push({
        id: `${categoryPrefix[category]}-${String(index).padStart(3, "0")}`,
        category,
        role,
        level,
        period,
        division,
        title,
        description,
        learningOutcomes: toList(learningOutcomesRaw),
        prerequisites: toList(prerequisitesRaw),
        location,
      });
    }
  }

  return jobs;
}

function main(): void {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Input file not found: ${INPUT_FILE}`);
  }

  const jobs = parseWorkbook(INPUT_FILE);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jobs, null, 2));

  const categoryStats = CATEGORIES.map((category) => {
    const count = jobs.filter((job) => job.category === category).length;
    return `${category}: ${count}`;
  }).join(", ");

  console.log(`Wrote ${jobs.length} jobs to ${OUTPUT_FILE}`);
  console.log(categoryStats);
}

main();
