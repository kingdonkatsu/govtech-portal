import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import JobCard from "./components/JobCard";
import JobDetail from "./components/JobDetail";
import { CATEGORIES, type Job, type JobFilters } from "./types";

const INITIAL_FILTERS: JobFilters = {
  category: "All",
  level: "All",
  period: "All",
  location: "All",
  search: "",
};

function getUniqueSorted(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(INITIAL_FILTERS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    document.title = "GovTech Internship Projects 2026";
  }, []);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("/data/jobs.json");
        if (!response.ok) {
          throw new Error(`Failed to load data (${response.status})`);
        }
        const data = (await response.json()) as Job[];
        setJobs(data);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadJobs();
  }, []);

  const levels = useMemo(() => getUniqueSorted(jobs.map((job) => job.level)), [jobs]);
  const periods = useMemo(
    () => getUniqueSorted(jobs.map((job) => job.period)),
    [jobs],
  );
  const locations = useMemo(
    () => getUniqueSorted(jobs.map((job) => job.location)),
    [jobs],
  );

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce<Record<string, number>>((acc, category) => {
      acc[category] = jobs.filter((job) => job.category === category).length;
      return acc;
    }, {});
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = normalize(filters.search);
    return jobs.filter((job) => {
      if (filters.category !== "All" && job.category !== filters.category) {
        return false;
      }
      if (filters.level !== "All" && job.level !== filters.level) {
        return false;
      }
      if (filters.period !== "All" && job.period !== filters.period) {
        return false;
      }
      if (filters.location !== "All" && job.location !== filters.location) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [
        job.title,
        job.description,
        job.prerequisites.join(" "),
        job.role,
        job.division,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [jobs, filters]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="hero-pattern border-b border-border">
        <header className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:px-8 md:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            GovTech Careers
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            GovTech Internship Projects 2026
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
            Browse internship project listings across engineering, product, design,
            data, and business roles. Filter by role type, internship level,
            period, location, and keywords.
          </p>
          <p className="mt-4 text-sm font-semibold text-muted">
            Total listings loaded: {jobs.length}
          </p>
        </header>
      </div>

      <FilterBar
        categories={CATEGORIES}
        categoryCounts={categoryCounts}
        filters={filters}
        levels={levels}
        periods={periods}
        locations={locations}
        onFiltersChange={setFilters}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {loading ? (
          <p className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
            Loading listings...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load listings: {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <>
            <p className="mb-5 text-sm font-semibold text-muted">
              Showing {filteredJobs.length} of {jobs.length}
            </p>
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    style={{ animationDelay: `${Math.min(index * 18, 220)}ms` }}
                  >
                    <JobCard job={job} onViewDetails={setSelectedJob} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-card">
                <h2 className="text-lg font-semibold text-text">No Results Found</h2>
                <p className="mt-2 text-sm text-muted">
                  Try clearing one or more filters, or use a broader keyword.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-white"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        ) : null}
      </section>

      {selectedJob ? (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      ) : null}
    </main>
  );
}
