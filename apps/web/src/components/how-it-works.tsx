const steps = [
  {
    title: 'Create your listing',
    description:
      'Sign up and list your home with photos, availability, and the kind of swap you are looking for.',
  },
  {
    title: 'Find a match',
    description:
      'Browse verified members and send swap requests. Chat directly to agree on dates and details.',
  },
  {
    title: 'Swap and explore',
    description:
      'Move in like a local. No hotel bills, no check-in queues — just a real home in a real neighbourhood.',
  },
  {
    title: 'Home protection included',
    description:
      'Every swap is backed by our home protection policy — covering accidental damage so both parties can relax.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10">
        <p className="mb-2 text-sm font-medium tracking-widest text-primary uppercase">
          Simple by design
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Three steps stand between you and your next home away from home.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
