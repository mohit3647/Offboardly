import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="text-2xl font-bold text-brand-700">Offboardly</div>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-8 pt-24 text-center">
        <div className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
          Stop losing institutional knowledge
        </div>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          When employees leave,
          <br />
          <span className="text-brand-600">their knowledge stays.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          Offboardly&apos;s AI interviewer captures the tribal knowledge, workflows,
          decision-making patterns, and institutional memory from departing employees
          — then makes it searchable and actionable for the teams they leave behind.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-brand-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-700"
          >
            Start Free Trial
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            See How It Works
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-brand-600">$47M</div>
            <div className="mt-1 text-sm text-gray-500">
              Average annual loss from inefficient knowledge transfer
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-brand-600">42%</div>
            <div className="mt-1 text-sm text-gray-500">
              Of critical knowledge walks out the door with departing employees
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-brand-600">6 mo+</div>
            <div className="mt-1 text-sm text-gray-500">
              Teams spend recovering from a single key departure
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-24 pb-24">
          <h2 className="mb-12 text-3xl font-bold">How Offboardly Works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Trigger",
                desc: "Employee gives notice. Offboardly kicks in automatically.",
              },
              {
                step: "2",
                title: "Interview",
                desc: "AI conducts guided knowledge capture sessions covering workflows, decisions, and relationships.",
              },
              {
                step: "3",
                title: "Synthesize",
                desc: "Raw interviews are transformed into structured, searchable knowledge entries.",
              },
              {
                step: "4",
                title: "Transfer",
                desc: "Teams query an AI assistant trained on the departing employee's knowledge.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border bg-white p-6 text-left shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-lg font-bold text-brand-700">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-8 py-8 text-center text-sm text-gray-500">
        Offboardly — Stop organizational amnesia.
      </footer>
    </div>
  );
}
