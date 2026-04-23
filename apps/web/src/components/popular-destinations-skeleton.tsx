export function PopularDestinationsSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10">
        <p className="mb-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
        <h2 className="h-8 w-48 animate-pulse rounded bg-slate-200 sm:h-9" />
        <p className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 animate-pulse"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 h-2 w-16 rounded bg-slate-200" />
                <div className="h-6 w-32 rounded bg-slate-200" />
              </div>
              <div className="h-7 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="grow space-y-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
            </div>
            <div className="mt-4 pt-0 h-4 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
