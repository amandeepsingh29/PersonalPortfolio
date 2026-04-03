import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../ThemeContext';
import { DEV_SECTIONS, getDevAccent, useDevActiveSection, useInterpolatedDevAccent } from '../hooks/useDevActiveSection';

const sections = DEV_SECTIONS.map((id) => ({ id, label: getDevAccent(id).label }));

function nextLatency(isActive) {
  const min = isActive ? 9 : 18;
  const max = isActive ? 26 : 45;
  return Math.round(min + Math.random() * (max - min));
}

export default function DevRouteBadges() {
  const { isDev } = useTheme();
  const activeSection = useDevActiveSection(isDev);
  const [latencyMap, setLatencyMap] = useState(() =>
    sections.reduce((acc, section) => {
      acc[section.id] = nextLatency(section.id === 'about');
      return acc;
    }, {})
  );

  useEffect(() => {
    if (!isDev) return undefined;

    const timer = setInterval(() => {
      setLatencyMap((prev) => {
        const next = { ...prev };
        sections.forEach((section) => {
          next[section.id] = nextLatency(section.id === activeSection);
        });
        return next;
      });
    }, 1300);

    return () => clearInterval(timer);
  }, [isDev, activeSection]);

  const rows = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        active: section.id === activeSection,
        latency: latencyMap[section.id] ?? 0,
        accent: getDevAccent(section.id),
      })),
    [activeSection, latencyMap]
  );

  const activeAccent = useInterpolatedDevAccent(activeSection, isDev, 340);

  if (!isDev) return null;

  return (
    <div className="fixed left-4 top-1/2 z-[79] hidden -translate-y-1/2 xl:flex">
      <div
        className="w-44 rounded-2xl border bg-[#04110d]/80 p-2 backdrop-blur-xl transition-[border-color,box-shadow] duration-300"
        style={{
          borderColor: `rgba(${activeAccent.rgb},0.3)`,
          boxShadow: `0 0 30px rgba(${activeAccent.rgb},0.16)`,
        }}
      >
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `rgba(${activeAccent.rgb},0.8)` }}>route status</div>
        <div className="space-y-1.5">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => document.getElementById(row.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full rounded-lg border px-2 py-1.5 text-left transition-colors"
              style={{
                borderColor: row.active ? `rgba(${row.accent.rgb},0.45)` : `rgba(${row.accent.rgb},0.2)`,
                backgroundColor: row.active ? `rgba(${row.accent.rgb},0.16)` : `rgba(${row.accent.rgb},0.06)`,
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-emerald-100">
                <span>{row.label}</span>
                <span style={{ color: row.active ? `rgba(${row.accent.rgb},0.95)` : `rgba(${row.accent.rgb},0.75)` }}>{row.active ? 'LIVE' : 'IDLE'}</span>
              </div>
              <div className="mt-0.5 text-[10px]" style={{ color: `rgba(${row.accent.rgb},0.78)` }}>latency {row.latency}ms</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
