import React, { useMemo } from 'react';
import { useTheme } from '../ThemeContext';

export default function DevMatrixRain() {
  const { isDev } = useTheme();

  const columns = useMemo(() => {
    return Array.from({ length: 26 }).map((_, idx) => ({
      id: idx,
      left: `${(idx / 26) * 100}%`,
      delay: `${(idx % 9) * 0.35}s`,
      duration: `${8 + (idx % 7)}s`,
      opacity: 0.12 + (idx % 5) * 0.05,
    }));
  }, []);

  if (!isDev) return null;

  return (
    <div className="dev-matrix-overlay" aria-hidden="true">
      {columns.map((col) => (
        <span
          key={col.id}
          className="dev-matrix-column"
          style={{
            left: col.left,
            animationDelay: col.delay,
            animationDuration: col.duration,
            opacity: col.opacity,
          }}
        >
          01 10 11 00 10 01 11 00 01 10
        </span>
      ))}
    </div>
  );
}
