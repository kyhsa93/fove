import { JSX } from 'react'

export default function ContactPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-2 py-12 sm:px-4 sm:py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 px-2 py-6 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:px-8 sm:py-8">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500/80">Contact</span>
          <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
          <p className="text-base leading-relaxed text-slate-600">
            Fove is a personal side project run by one developer. Feedback and bug reports go to the project's public issue tracker on GitHub.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Where to Write</h2>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 px-2 py-4 text-slate-700 sm:px-6 sm:py-6">
              <p className="text-sm">GitHub Issues</p>
              <a
                href="https://github.com/kyhsa93/fove/issues"
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold text-rose-600 hover:underline"
              >
                github.com/kyhsa93/fove/issues
              </a>
              <p className="mt-2 text-xs text-slate-500">
                Issues are public. Do not include your birth date, birth time, or other personal details.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">How to Reach Out</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Include as many details as possible when suggesting improvements or new features.</li>
              <li>For bug reports, describe the steps to reproduce and share your browser and version.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Response Time</h2>
            <p>
              Issues are read when the developer has time; there is no guaranteed response time.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
