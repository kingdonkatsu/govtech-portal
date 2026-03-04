import { type Category, type JobFilters } from "../types";

interface FilterBarProps {
  categories: readonly Category[];
  categoryCounts: Record<string, number>;
  filters: JobFilters;
  levels: string[];
  periods: string[];
  locations: string[];
  onFiltersChange: (next: JobFilters) => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-48 flex-col gap-1 text-sm">
      <span className="font-semibold text-muted">{label}</span>
      <select
        className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-text shadow-sm focus:border-accent focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="All">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FilterBar({
  categories,
  categoryCounts,
  filters,
  levels,
  periods,
  locations,
  onFiltersChange,
}: FilterBarProps) {
  return (
    <section className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              filters.category === "All"
                ? "border-accent bg-accent text-white"
                : "border-border bg-white text-text hover:border-accent/40"
            }`}
            onClick={() => onFiltersChange({ ...filters, category: "All" })}
          >
            All ({Object.values(categoryCounts).reduce((sum, n) => sum + n, 0)})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                filters.category === category
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-text hover:border-accent/40"
              }`}
              onClick={() => onFiltersChange({ ...filters, category })}
            >
              {category} ({categoryCounts[category] ?? 0})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <SelectField
            label="Internship Level"
            value={filters.level}
            options={levels}
            onChange={(level) => onFiltersChange({ ...filters, level })}
          />
          <SelectField
            label="Internship Period"
            value={filters.period}
            options={periods}
            onChange={(period) => onFiltersChange({ ...filters, period })}
          />
          <SelectField
            label="Work Location"
            value={filters.location}
            options={locations}
            onChange={(location) => onFiltersChange({ ...filters, location })}
          />
          <label className="flex min-w-64 flex-1 flex-col gap-1 text-sm">
            <span className="font-semibold text-muted">Keyword Search</span>
            <input
              type="text"
              value={filters.search}
              placeholder="Search title, description, prerequisites..."
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-text shadow-sm focus:border-accent focus:outline-none"
              onChange={(event) =>
                onFiltersChange({ ...filters, search: event.target.value })
              }
            />
          </label>
        </div>
      </div>
    </section>
  );
}
