import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import worldCupLogo from '../../assets/wordcuplogo.png';
import { useLanguage } from '../../hooks/useLanguage';

const links = [
  ['/', 'nav.matches'],
  ['/groups', 'nav.groups'],
  ['/knockout', 'nav.knockout'],
  ['/schedule', 'nav.schedule'],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, toggleLanguage } = useLanguage();
  const linkClass = ({ isActive }) => `nav-link relative flex items-center px-3 text-sm font-semibold transition-colors ${isActive ? 'active text-white' : 'text-white/65 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#030914]/92 backdrop-blur-xl">
      <nav className="section-shell flex h-18 items-center justify-between" aria-label={t('nav.main')}>
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={worldCupLogo}
            alt="FIFA World Cup 2026"
            className="h-12 w-auto max-w-32 object-contain sm:h-14 sm:max-w-40"
          />
        </NavLink>

        <div className="hidden h-full items-center gap-3 lg:flex">
          {links.map(([to, labelKey]) => (
            <NavLink key={labelKey} to={to} end={to === '/'} className={linkClass}>{t(labelKey)}</NavLink>
          ))}
          <button type="button" onClick={toggleLanguage} className="ms-2 flex h-10 min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 text-xs font-bold text-white/75 transition hover:border-neon/35 hover:text-neon" aria-label={t('language.switchTo')}>
            <Languages size={16} />
            <span>{t('language.switchTo')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" onClick={toggleLanguage} className="grid h-11 min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 bg-white/5 px-2 text-xs font-black text-neon" aria-label={t('language.switchTo')}>
            {t('language.switchTo')}
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5" onClick={() => setOpen(!open)} aria-label={t('nav.toggle')}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.06] bg-[#030914] lg:hidden">
            <div className="section-shell flex flex-col py-3">
              {links.map(([to, labelKey], index) => (
                <NavLink key={`${labelKey}-${index}`} to={to} end={to === '/'} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-neon/10 text-neon' : 'text-text-secondary'}`} onClick={() => setOpen(false)}>
                  {t(labelKey)}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
