import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';

const bootLines = [
  '[boot] loading dev profile...',
  '[boot] mounting overlays...',
  '[boot] syncing telemetry...',
  '[boot] enabling command mesh...',
  '[boot] developer mode online.',
];

export default function DevBootSequence() {
  const { isDev } = useTheme();
  const [visible, setVisible] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const hideTimerRef = useRef(null);
  const lineTimerRef = useRef(null);

  useEffect(() => {
    if (!isDev) {
      setVisible(false);
      setLineIndex(0);
      return undefined;
    }

    setVisible(true);
    setLineIndex(0);

    lineTimerRef.current = setInterval(() => {
      setLineIndex((prev) => {
        if (prev >= bootLines.length - 1) {
          if (lineTimerRef.current) {
            clearInterval(lineTimerRef.current);
            lineTimerRef.current = null;
          }

          hideTimerRef.current = setTimeout(() => {
            setVisible(false);
          }, 850);

          return prev;
        }
        return prev + 1;
      });
    }, 170);

    return () => {
      if (lineTimerRef.current) {
        clearInterval(lineTimerRef.current);
        lineTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isDev]);

  if (!isDev || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[92] flex items-center justify-center bg-[#020606]/65 backdrop-blur-sm">
      <div className="w-[min(92vw,580px)] rounded-2xl border border-emerald-500/35 bg-[#04120d]/95 p-5 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
        <div className="mb-3 flex items-center gap-2 border-b border-emerald-500/20 pb-3 text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          dev://boot-sequence
        </div>

        <div className="space-y-1.5 font-mono-space text-xs text-emerald-100/85 md:text-sm">
          {bootLines.slice(0, lineIndex + 1).map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="text-emerald-300/70">init.progress={(Math.min(100, Math.round(((lineIndex + 1) / bootLines.length) * 100)))}%</p>
        </div>
      </div>
    </div>
  );
}
