export function FeaturedHomesSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10 animate-pulse">
        <div className="mb-2 h-4 w-20 rounded bg-slate-200" />
        <div className="mb-3 h-10 w-72 rounded bg-slate-200" />
        <div className="h-5 w-full max-w-xl rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-60 animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
