import { JSX } from 'react'

export default function TermsOfServicePage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-2 py-12 sm:px-4 sm:py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 px-2 py-6 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:px-8 sm:py-8">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500/80">Terms</span>
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          <p className="text-base leading-relaxed text-slate-600">
            Thank you for using Fove. These terms outline the basic rules that help us provide a reliable, transparent experience for everyone.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. Service Description</h2>
            <p>
              Fove offers tools such as fortune readings, MBTI tests, and daily guidance. The insights are for informational purposes only, and decisions based on them remain the responsibility of the user.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. User Responsibilities</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the service in compliance with applicable laws and community norms.</li>
              <li>Do not submit false information or impersonate others.</li>
              <li>Avoid copying, redistributing, or tampering with the service’s source code or data.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. Changes & Availability</h2>
            <p>
              Features may change or be interrupted without prior notice to improve performance or security. Significant updates will be announced separately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. Limitation of Liability</h2>
            <p>
              Fove is a free service. We are not liable for data loss, interpretation errors, or other issues arising from use of the app, though we will work to restore the service quickly if problems occur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">5. Updates to the Terms</h2>
            <p>
              When these terms change, we will notify users at least seven days in advance. Continued use of Fove after the effective date means you agree to the updated terms.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
