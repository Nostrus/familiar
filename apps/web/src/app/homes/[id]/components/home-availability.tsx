import { Calendar } from 'lucide-react';

type HomeAvailabilityRange = {
  id: number;
  startDate: string;
  endDate: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function HomeAvailability({ availability }: { availability: HomeAvailabilityRange[] }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
        <Calendar className="h-5 w-5 text-blue-500" />
        Available dates
      </h2>
      {availability.length === 0 ? (
        <p className="text-sm text-slate-500">No availability windows listed yet.</p>
      ) : (
        <ul className="space-y-3">
          {availability.map((range) => (
            <li
              key={range.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-slate-800">
                {formatDate(range.startDate)}
              </span>
              <span className="text-sm text-slate-400">→</span>
              <span className="text-sm font-medium text-slate-800">
                {formatDate(range.endDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
