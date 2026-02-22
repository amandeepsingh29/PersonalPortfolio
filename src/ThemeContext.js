import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef(null);
  const toggleOrigin = useRef({ x: 0, y: 0 });

  const toggleTheme = useCallback((e) => {
    if (isAnimating) return;

    // Get click origin for the circle reveal
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
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
      overlay.style.background = isDark ? '#F5F1E8' : '#0f0f14';
      overlay.classList.add('theme-woosh-active');

      // Flip theme at the midpoint
      setTimeout(() => {
        setIsDark((prev) => !prev);
      }, 350);

      // Remove overlay after animation
      setTimeout(() => {
        overlay.classList.remove('theme-woosh-active');
        setIsAnimating(false);
      }, 700);
    }
  }, [isDark, isAnimating]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isAnimating }}>
      {/* Woosh overlay */}
      <div ref={overlayRef} className="theme-woosh-overlay" />
      {children}
    </ThemeContext.Provider>
  );
};
