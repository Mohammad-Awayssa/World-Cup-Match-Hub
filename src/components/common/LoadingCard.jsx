import { useLanguage } from '../../hooks/useLanguage';

export function LoadingCard() {
  const { t } = useLanguage();
  return <div className="glass h-64 animate-pulse rounded-3xl bg-white/5" aria-label={t('common.loadingMatch')} />;
}
