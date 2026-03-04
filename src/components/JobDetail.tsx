import { useEffect } from "react";
import { type Job } from "../types";

interface JobDetailProps {
  job: Job;
  onClose: () => void;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="text-base font-semibold text-text">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">Not specified</p>
      )}
    </section>
  );
}

export default function JobDetail({ job, onClose }: JobDetailProps) {
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/70 p-4 md:items-center">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {job.category}
            </p>
            <h3 className="mt-1 text-2xl font-bold leading-tight text-text">
              {job.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-2">
          <div>
            <dt className="font-semibold text-muted">Role</dt>
            <dd className="text-slate-800">{job.role || "Not specified"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Internship Level</dt>
            <dd className="text-slate-800">{job.level || "Not specified"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Internship Period</dt>
            <dd className="text-slate-800">{job.period || "Not specified"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Division</dt>
            <dd className="text-slate-800">{job.division || "Not specified"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Location</dt>
            <dd className="text-slate-800">{job.location || "Not specified"}</dd>
          </div>
        </dl>

        <section className="mt-6">
          <h4 className="text-base font-semibold text-text">Project Description</h4>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {job.description || "Not specified"}
          </p>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <BulletList title="Learning Outcomes" items={job.learningOutcomes} />
          <BulletList title="Prerequisites" items={job.prerequisites} />
        </div>
      </div>
    </div>
  );
}
