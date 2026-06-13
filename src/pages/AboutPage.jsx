import { Cloud, Database, Flag, Globe2, Radio, ShieldCheck } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { useLanguage } from '../hooks/useLanguage';

const icons = [Database, Globe2, Cloud, Radio, Flag, ShieldCheck];

export default function AboutPage() {
  const { t } = useLanguage();
  const cards = t('about.cards');

  return (
    <PageLayout eyebrow={t('about.eyebrow')} title={t('about.title')} description={t('about.description')}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, copy], index) => {
          const Icon = icons[index];
          return (
            <article key={title} className="glass glass-hover rounded-3xl p-6">
              <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold"><Icon size={21} /></span>
              <h2 className="font-heading text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{copy}</p>
            </article>
          );
        })}
      </div>
      <section className="glass mt-8 rounded-3xl p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-gold">{t('about.dataPath')}</p>
        <h2 className="font-heading mt-3 text-2xl font-bold">{t('about.localLive')}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-text-secondary">{t('about.dataCopy')}</p>
        <p className="mt-4 text-sm font-medium text-gold">{t('about.dataNote')}</p>
      </section>
    </PageLayout>
  );
}
