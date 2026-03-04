export const CATEGORIES = [
  "Software Engineer",
  "Data Engineer",
  "Designer (UX)",
  "Product Manager",
  "Data Scientist",
  "Business",
  "System Engineer",
  "Cybersecurity Engineer",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Job {
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

export interface JobFilters {
  category: Category | "All";
  level: string;
  period: string;
  location: string;
  search: string;
}
