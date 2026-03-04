import { type Category, type Job } from "../types";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

const categoryBadgeClasses: Record<Category, string> = {
  "Software Engineer": "bg-sky-100 text-sky-800",
  "Data Engineer": "bg-cyan-100 text-cyan-800",
  "Designer (UX)": "bg-amber-100 text-amber-800",
  "Product Manager": "bg-lime-100 text-lime-800",
  "Data Scientist": "bg-violet-100 text-violet-800",
  Business: "bg-rose-100 text-rose-800",
  "System Engineer": "bg-emerald-100 text-emerald-800",
  "Cybersecurity Engineer": "bg-orange-100 text-orange-800",
};

export default function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <article className="animate-fade-up rounded-2xl border border-border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          categoryBadgeClasses[job.category]
        }`}
      >
        {job.category}
      </span>
      <h2 className="mt-3 text-xl font-bold leading-tight text-text">{job.title}</h2>
      <p className="mt-2 text-sm text-muted">{job.division}</p>
      <p className="mt-3 text-sm font-medium text-slate-700">
        {job.level} | {job.period} | {job.location}
      </p>
      <p className="line-clamp-2 mt-3 text-sm leading-relaxed text-slate-700">
        {job.description}
      </p>
      <button
        type="button"
        className="mt-4 rounded-lg border border-accent px-3 py-1.5 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
        onClick={() => onViewDetails(job)}
      >
        View Details
      </button>
    </article>
  );
}
