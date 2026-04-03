import React, { useEffect, useMemo, useState } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getDevAccent, useDevActiveSection } from '../hooks/useDevActiveSection';

const baseCommands = [
  { id: 'about', label: 'Open About', run: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'blogs', label: 'Open Blog', run: () => document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'projects', label: 'Open Projects', run: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'reads', label: 'Open Reads', run: () => document.getElementById('reads')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'contact', label: 'Open Contact', run: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'top', label: 'Scroll To Top', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { id: 'github', label: 'Open GitHub', run: () => window.open('https://github.com/amandeepsingh29', '_blank', 'noopener,noreferrer') },
];

export default function DevCommandPalette() {
  const { isDev } = useTheme();
  const activeSection = useDevActiveSection(isDev);
  const accent = getDevAccent(activeSection);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isDev) return undefined;

    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDev]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return baseCommands;
    return baseCommands.filter((cmd) => cmd.label.toLowerCase().includes(value) || cmd.id.includes(value));
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
      }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].run();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeIndex]);

  if (!isDev || !open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 p-4 pt-24 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-xl rounded-2xl border bg-[#06120f]/95"
        style={{
          borderColor: `rgba(${accent.rgb},0.32)`,
          boxShadow: `0 0 40px rgba(${accent.rgb},0.2)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: `rgba(${accent.rgb},0.24)` }}>
          <Search size={16} style={{ color: `rgba(${accent.rgb},0.86)` }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Run command..."
            className="w-full bg-transparent text-sm text-emerald-100 outline-none"
            style={{
              caretColor: `rgb(${accent.rgb})`,
            }}
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ color: `rgba(${accent.rgb},0.76)` }}>No commands found.</p>
          )}
          {filtered.map((cmd, idx) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => {
                cmd.run();
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors"
              style={{
                color: idx === activeIndex ? `rgba(${accent.rgb},0.98)` : `rgba(${accent.rgb},0.85)`,
                backgroundColor: idx === activeIndex ? `rgba(${accent.rgb},0.2)` : 'transparent',
              }}
            >
              <span>{cmd.label}</span>
              {idx === activeIndex && <CornerDownLeft size={14} style={{ color: `rgba(${accent.rgb},0.95)` }} />}
            </button>
          ))}
        </div>

        <div className="border-t px-4 py-2 text-[11px]" style={{ borderColor: `rgba(${accent.rgb},0.24)`, color: `rgba(${accent.rgb},0.68)` }}>
          tip: press Cmd/Ctrl + K to toggle | active: {activeSection}
        </div>
      </div>
    </div>
  );
}
