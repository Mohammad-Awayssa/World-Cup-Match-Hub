import { Cloud, Database, Flag, Globe2, Radio, ShieldCheck } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const cards = [
  [Database, 'Static-first reliability', 'All 104 matches, 12 groups, and 16 venues ship with the app, so the MVP works without a backend or API key.'],
  [Globe2, 'Timezone aware', 'Native browser date formatting turns every UTC kickoff into the supporter’s local time automatically.'],
  [Cloud, 'API-ready architecture', 'Components read from a service contract and React context. A live adapter can replace local JSON without rewriting the interface.'],
  [Radio, 'Future live mode', 'The prepared configuration supports polling, caching, request deduplication, and static fallback when live data is enabled.'],
  [Flag, 'Flags by FlagCDN', 'Country flags are delivered by flagcdn.com, with an accessible placeholder shield for undecided knockout teams.'],
  [ShieldCheck, 'Fan-made project', 'This is an independent schedule experience and is not affiliated with or endorsed by FIFA.'],
];

export default function AboutPage() {
  return (
    <PageLayout eyebrow="Behind the hub" title="Built for the global matchday" description="A fast, shareable tournament companion designed to make the expanded 2026 World Cup schedule feel simple, personal, and electric.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([Icon,title,copy]) => (
          <article key={title} className="glass glass-hover rounded-3xl p-6">
            <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold"><Icon size={21} /></span>
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{copy}</p>
          </article>
        ))}
      </div>
      <section className="glass mt-8 rounded-3xl p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-gold">Data path</p>
        <h2 className="font-heading mt-3 text-2xl font-bold">Local today. Live tomorrow.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-text-secondary">The public match service currently resolves to a local adapter. When reliable tournament feeds are ready, the feature flag can select an HTTP adapter while preserving the same methods for matches, groups, teams, and venues.</p>
        <p className="mt-4 text-sm font-medium text-gold">Schedule data is stored locally and can be updated manually.</p>
      </section>
    </PageLayout>
  );
}
