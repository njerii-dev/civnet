import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">
            🏛️
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
              Civnet
            </p>
            <p className="text-xs text-slate-400">
              Civic issue reporting made simple
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full border border-slate-700 text-slate-100 hover:bg-slate-800 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-400 shadow-lg shadow-blue-500/30 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 lg:pt-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live in your community — powered by Civnet
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Give your community
              <span className="block text-blue-400">a direct voice.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl">
              Civnet makes it easy for citizens to report local problems and for
              city officials to respond, update status, and keep everyone
              informed — all from a single, simple dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:bg-blue-400 transition-colors"
              >
                Get started as a citizen
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-colors"
              >
                City official sign in
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  For citizens
                </p>
                <p className="mt-2 font-medium text-slate-100">
                  Report issues in minutes from any device, then track progress
                  as they move from Submitted to Resolved.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  For city officials
                </p>
                <p className="mt-2 font-medium text-slate-100">
                  A focused admin dashboard to review reports, update status,
                  and leave clear responses for residents.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Always up to date
                </p>
                <p className="mt-2 font-medium text-slate-100">
                  Built on Next.js and deployed on Vercel, Civnet is fast,
                  reliable, and accessible from phone, tablet, or desktop.
                </p>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-3xl opacity-60" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Sample issue
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    Streetlight out on Oak Avenue
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ✅ Resolved
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                “The streetlight has been repaired and is now working as
                expected. Thank you for reporting this issue.”
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">Submitted</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    12 Feb
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">In progress</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    13 Feb
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                  <p className="text-slate-400">Resolved</p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    15 Feb
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}