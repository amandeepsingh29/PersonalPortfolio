import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const STORAGE_KEY = 'theme-coachmark-dismissed-v1';

export default function ThemeCoachmark() {
  const { isDark, isDev, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === 'true';
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const closeCoachmark = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const tryTheme = () => {
    toggleTheme();
    closeCoachmark();
  };

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-24 z-[88] w-[min(92vw,320px)]">
      <div
        className={`rounded-2xl border p-3 shadow-xl backdrop-blur-xl ${
          isDev
            ? 'border-emerald-400/30 bg-[#04110d]/90'
            : isDark
              ? 'border-gray-700/70 bg-[#171721]/90'
              : 'border-gray-200 bg-white/95'
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className={isDev ? 'text-emerald-300' : 'text-red-500'} />
            <span className={`text-xs font-bold uppercase tracking-[0.18em] ${isDev ? 'text-emerald-200' : isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Quick Tip
            </span>
          </div>
          <button
            type="button"
            onClick={closeCoachmark}
            className={`rounded-md p-1 transition-colors ${isDev ? 'text-emerald-300/70 hover:bg-emerald-500/10' : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
            aria-label="Dismiss tip"
          >
            <X size={14} />
          </button>
        </div>

        <p className={`mb-3 text-sm leading-relaxed ${isDev ? 'text-emerald-100/85' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Hey, try changing theme. You can switch between Light, Dark and Developer mode.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={tryTheme}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              isDev
                ? 'bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30'
                : isDark
                  ? 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'
                  : 'bg-gray-900 text-white hover:bg-red-600'
            }`}
          >
            Try Theme
          </button>
          <button
            type="button"
            onClick={closeCoachmark}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${isDev ? 'text-emerald-200/75 hover:bg-emerald-500/10' : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
