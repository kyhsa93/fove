import { JSX } from 'react'

export default function ContactPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500/80">Contact</span>
          <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
          <p className="text-base leading-relaxed text-slate-600">
            Share feedback, report bugs, or start a collaboration. We read every message and respond as quickly as possible.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Primary Contact</h2>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-6 text-slate-700">
              <p className="text-sm">Email</p>
              <a
                href="mailto:hello@dotimage.app"
                className="text-lg font-semibold text-rose-600 hover:underline"
              >
                hello@dotimage.app
              </a>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">How to Reach Out</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Include as many details as possible when suggesting improvements or new features.</li>
              <li>For bug reports, describe the steps to reproduce and share your browser and version.</li>
              <li>Collaboration inquiries move faster if you add information about your company or team.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Response Time</h2>
            <p>
              We aim to reply within 48 business hours. If a response takes longer, we will follow up via email with the latest status.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
