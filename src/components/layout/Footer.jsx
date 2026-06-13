import { Trophy } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-white/[.06] bg-black/20">
      <div className="section-shell flex flex-col items-center justify-between gap-5 py-9 text-center text-xs text-text-muted sm:flex-row sm:text-start">
        <div className="flex items-center gap-3">
          <Trophy className="text-gold" size={20} />
          <span>{t('footer.title')}<br />{t('footer.copy')}</span>
        </div>
        <p>{t('footer.data')}<br />{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
