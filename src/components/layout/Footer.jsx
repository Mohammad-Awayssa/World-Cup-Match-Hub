import { Github, Linkedin, Trophy } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-white/[.06] bg-black/20">
      <div className="section-shell flex flex-col items-center justify-between gap-6 py-9 text-center text-xs text-text-muted sm:flex-row sm:text-start">
        <div className="flex items-start gap-3">
          <Trophy className="mt-0.5 shrink-0 text-gold" size={21} />
          <div>
            <strong className="font-heading block text-sm font-bold text-white">{t('footer.title')}</strong>
            <span className="mt-1 block">{t('footer.builtBy')}</span>
            <div className="mt-2 flex items-center justify-center gap-4 sm:justify-start">
              <a href="https://github.com/Mohammad-Awayssa" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-white/60 transition hover:text-neon">
                <Github size={14} /> GitHub
              </a>
              <a href="https://linkedin.com/in/mohammad-awayssa" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-white/60 transition hover:text-neon">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
        <p>{t('footer.data')}<br />{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
