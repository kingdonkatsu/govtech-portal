# GovTech Internship Projects 2026

Static React website for browsing internship listings parsed from `govtechinternshipprojects2026.xlsx`.

## Stack

- React + Vite + TypeScript (strict mode)
- Tailwind CSS
- Excel parser script using `xlsx` (SheetJS)

## Run

1. Install dependencies:

```bash
npm install
```

2. Generate data from Excel:

```bash
npm run parse:data
```

3. Start dev server:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```

## Data Output

- Source: `govtechinternshipprojects2026.xlsx`
- Generated: `public/data/jobs.json`
- Parser: `scripts/parse-excel.ts`

## Notes

- The parser normalizes sheet columns and handles `Work Location` vs `Work Location (FormSG)`.
- `Learning Outcomes` and `Prerequisites` are split into arrays by newline / semicolon delimiters.
