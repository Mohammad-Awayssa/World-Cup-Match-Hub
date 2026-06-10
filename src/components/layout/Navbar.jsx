import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import worldCupLogo from '../../assets/wordcuplogo.png';

const links = [
  ['/', 'Matches', true],
  ['/groups', 'Groups', true],
  ['/knockout', 'Knockout', true],
  ['/schedule', 'Schedule', true],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => `nav-link relative flex items-center px-3 text-sm font-semibold transition-colors ${isActive ? 'active text-white' : 'text-white/65 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#030914]/92 backdrop-blur-xl">
      <nav className="section-shell flex h-18 items-center justify-between" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={worldCupLogo}
            alt="FIFA World Cup 2026"
            className="h-12 w-auto max-w-32 object-contain sm:h-14 sm:max-w-40"
          />
        </NavLink>

        <div className="hidden h-full gap-5 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={label} to={to} end={to === '/'} className={linkClass}>{label}</NavLink>
          ))}
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.06] bg-[#030914] md:hidden">
            <div className="section-shell flex flex-col py-3">
              {links.map(([to, label], index) => (
                <NavLink key={`${label}-${index}`} to={to} end={to === '/'} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-neon/10 text-neon' : 'text-text-secondary'}`} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
