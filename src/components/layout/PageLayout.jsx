import { motion } from 'framer-motion';

export function PageLayout({ eyebrow, title, description, children }) {
  return (
    <main className="section-shell pt-12 sm:pt-16">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-gold">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl leading-7 text-text-secondary">{description}</p>}
      </motion.header>
      {children}
    </main>
  );
}
