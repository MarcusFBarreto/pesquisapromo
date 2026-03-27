export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--pp-cream)] px-6 py-8 sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="h-10 w-36 animate-pulse rounded-full bg-white" />
        <div className="rounded-[2rem] bg-white p-8">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[rgba(25,76,160,0.12)]" />
          <div className="mt-4 h-14 w-2/3 animate-pulse rounded-2xl bg-[rgba(22,32,51,0.08)]" />
          <div className="mt-4 h-24 w-full animate-pulse rounded-[1.5rem] bg-[rgba(22,32,51,0.06)]" />
        </div>
      </section>
    </main>
  );
}
