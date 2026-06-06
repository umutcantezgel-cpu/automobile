import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center py-32 px-4 md:px-8">
      <section className="w-full max-w-2xl text-center flex flex-col items-center">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-4 flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-red-600" /> 404 · Seite nicht gefunden <span className="w-8 h-[1px] bg-red-600" />
        </p>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
          Diese Seite existiert nicht.
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-neutral-500 mb-12 max-w-lg">
          Die angeforderte Seite wurde nicht gefunden oder ist nicht mehr verfügbar.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-[15px] font-bold text-white transition-all shadow-sm hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            Zur Startseite
          </Link>

          <Link
            href="/fahrzeuge"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-200 px-8 py-4 text-[15px] font-bold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
          >
            Fahrzeuge entdecken
          </Link>
        </div>
      </section>
    </main>
  );
}
