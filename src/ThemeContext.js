import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getNextThemeMode = (mode) => {
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'dev';
  return 'light';
};

const getOverlayColor = (mode) => {
  if (mode === 'light') return '#F5F1E8';
  if (mode === 'dev') return '#050b0b';
  return '#0f0f14';
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('portfolio-theme-mode');
    return saved === 'dark' || saved === 'dev' || saved === 'light' ? saved : 'light';
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef(null);
  const toggleOrigin = useRef({ x: 0, y: 0 });
  const isDark = themeMode !== 'light';
  const isDev = themeMode === 'dev';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('portfolio-theme-mode', themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback((e) => {
    if (isAnimating) return;

    const nextMode = getNextThemeMode(themeMode);

    // Get click origin for the circle reveal
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    toggleOrigin.current = { x, y };

    // Calculate the max radius needed to cover the entire screen
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

    setIsAnimating(true);

    // Create overlay
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.setProperty('--cx', `${x}px`);
      overlay.style.setProperty('--cy', `${y}px`);
      overlay.style.setProperty('--max-r', `${maxRadius}px`);
      overlay.style.background = getOverlayColor(nextMode);
      overlay.classList.add('theme-woosh-active');

      // Flip theme at the midpoint
      setTimeout(() => {
        setThemeMode(nextMode);
      }, 350);

      // Remove overlay after animation
      setTimeout(() => {
        overlay.classList.remove('theme-woosh-active');
        setIsAnimating(false);
      }, 700);
    }
  }, [themeMode, isAnimating]);

  return (
    <ThemeContext.Provider value={{ isDark, isDev, themeMode, toggleTheme, isAnimating }}>
      {/* Woosh overlay */}
      <div ref={overlayRef} className="theme-woosh-overlay" />
      {children}
    </ThemeContext.Provider>
  );
};
