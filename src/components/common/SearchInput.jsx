import { Search, X } from 'lucide-react';

export function SearchInput({ value, onChange }) {
  return (
    <label className="relative block flex-1">
      <span className="sr-only">Search teams or cities</span>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={19} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search team or city..."
        className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-sm text-white placeholder:text-text-muted focus:border-neon/50 focus:outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-text-muted hover:text-white">
          <X size={17} />
        </button>
      )}
    </label>
  );
}
