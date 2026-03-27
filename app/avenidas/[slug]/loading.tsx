export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--pp-cream)] px-6 py-8 sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="h-10 w-36 animate-pulse rounded-full bg-white" />
        <div className="rounded-[2rem] bg-[var(--pp-blue)] p-8">
          <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
          <div className="mt-4 h-14 w-2/3 animate-pulse rounded-2xl bg-white/18" />
          <div className="mt-4 h-24 w-full animate-pulse rounded-[1.5rem] bg-white/12" />
        </div>
      </section>
    </main>
  );
}
