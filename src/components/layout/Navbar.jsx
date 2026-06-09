import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Trophy, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [['/','Home'],['/schedule','Schedule'],['/groups','Groups'],['/about','About']];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => `relative flex items-center px-3 text-sm font-semibold transition-colors ${isActive ? 'text-gold' : 'text-text-secondary hover:text-white'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-white/[.06] bg-bg-deep/75 backdrop-blur-2xl">
      <nav className="section-shell flex h-17 items-center justify-between" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-warm text-bg-deep shadow-[0_0_30px_rgba(255,215,0,.18)]"><Trophy size={21} /></span>
          <span className="font-heading leading-none"><strong className="block text-sm tracking-wide">WORLD CUP 2026</strong><small className="text-[10px] uppercase tracking-[.22em] text-text-muted">Match Hub</small></span>
        </NavLink>
        <div className="hidden h-full gap-3 md:flex">{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} className={linkClass}>{label}</NavLink>)}</div>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.06] bg-bg-deep md:hidden">
            <div className="section-shell flex flex-col py-3">{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-gold/10 text-gold' : 'text-text-secondary'}`} onClick={() => setOpen(false)}>{label}</NavLink>)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
