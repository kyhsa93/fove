import { JSX } from 'react'

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-2 py-12 sm:px-4 sm:py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 px-2 py-6 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:px-8 sm:py-8">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500/80">Privacy</span>
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-base leading-relaxed text-slate-600">
            Fove collects only the minimum information required to run the service, and all data stays on your device. This policy explains what information we handle and how we protect it.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. Data Collection & Use</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Date of birth, birth time, and gender for fortune readings: used to calculate insights and show interpretations.</li>
              <li>MBTI questionnaire responses: used to deliver personality analysis and guide recommendations.</li>
              <li>Saved results and favorites: stored locally so you can revisit previous insights.</li>
            </ul>
            <p className="text-xs text-slate-500">All data stays in your browser’s local storage and is never uploaded to a server.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. Retention & Deletion</h2>
            <p>
              Fove does not require an account. Every piece of information is stored unencrypted in your browser’s local storage. Clearing your browser cache or choosing reset in the app instantly removes the data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. Third-Party Services</h2>
            <p>
              Fove uses Google AdSense to show ads and Google Analytics to measure traffic. Ads run in AdSense’s automatic placement mode, so Google decides where they appear on each page.
            </p>
            <p>
              Google and its partners may use cookies or similar identifiers to serve ads based on your visits to this and other sites. The AdSense script is only loaded after you accept the consent banner — if you decline, it is never requested, and no ads are shown. You can also opt out of personalized advertising in{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-900"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p>
              None of the information you enter into Fove — birth date, birth time, gender, or questionnaire answers — is passed to these services. It never leaves your browser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. Your Rights</h2>
            <p>
              You can view or delete your stored information at any time through your browser settings. For privacy-related questions, reach out via the Contact page—we aim to respond within seven days.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
