import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import SpotifyWidget from './SpotifyWidget';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, isDev, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '/#about' },
    { label: 'Journey', href: '/journey' },
    { label: 'Blog', href: '/#blogs' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Reads', href: '/#reads' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? isDev
        ? 'bg-[#050b0b]/85 backdrop-blur-md shadow-sm shadow-emerald-900/30 border-b border-emerald-500/20'
        : isDark
          ? 'bg-[#0f0f14]/90 backdrop-blur-md shadow-sm shadow-black/20'
          : 'bg-[#F5F1E8]/90 backdrop-blur-md shadow-sm'
      : 'bg-transparent'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 overflow-hidden">
          <Link to="/" className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AS<span className="text-red-600">.</span>
          </Link>
          {isDev && (
            <span className="hidden md:inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-emerald-300">
              DEV MODE
            </span>
          )}
          <SpotifyWidget />
        </div>

        {/* Desktop Header Contents Container */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">

          <nav className="flex items-center gap-1 whitespace-nowrap">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${isDark
                  ? isDev
                    ? 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ml-2 ${isDark ? (isDev ? 'text-emerald-300 hover:bg-emerald-500/10' : 'text-yellow-400 hover:bg-white/10') : 'text-gray-600 hover:bg-gray-200/60'} rounded-full transition-colors`}
              aria-label="Cycle theme"
            >
              <Sun size={18} className="icon-sun" />
              <Moon size={18} className="icon-moon" />
              <Code2 size={18} className="icon-dev" />
            </button>

            <a
              href="https://github.com/amandeepsingh29"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${isDark
                ? isDev
                  ? 'text-[#05110d] bg-emerald-300 hover:bg-emerald-400 hover:text-[#02110b]'
                  : 'text-gray-900 bg-white hover:bg-red-500 hover:text-white'
                : 'text-white bg-gray-900 hover:bg-red-600'
                }`}
            >
              GitHub
            </a>
          </nav>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDark ? (isDev ? 'text-emerald-300' : 'text-yellow-400') : 'text-gray-600'}`}
            aria-label="Cycle theme"
          >
            <Sun size={18} className="icon-sun" />
            <Moon size={18} className="icon-moon" />
            <Code2 size={18} className="icon-dev" />
          </button>
          <button
            className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu
              size={22}
              className={`absolute transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${mobileOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`}
            />
            <X
              size={22}
              className={`absolute transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${mobileOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${mobileOpen ? 'bg-black/20 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none delay-100'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Nav Circular Popup Box */}
      <div
        className={`lg:hidden fixed top-20 right-3 left-3 sm:right-6 sm:left-auto z-50 w-auto sm:w-56 p-2 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] origin-top-right transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${mobileOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-6 pointer-events-none'
          } ${isDark ? (isDev ? 'bg-[#05110d]/95 backdrop-blur-2xl border border-emerald-500/20' : 'bg-[#1a1a24]/95 backdrop-blur-2xl border border-gray-800') : 'bg-white/95 backdrop-blur-2xl border border-gray-200'}`}
      >
        <div className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 text-center text-sm font-semibold rounded-full transition-all duration-300 ${isDark
                ? isDev
                  ? 'text-emerald-100/70 hover:text-emerald-100 hover:bg-emerald-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              style={{
                transitionDelay: mobileOpen ? `${index * 50}ms` : '0ms',
                transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
                opacity: mobileOpen ? 1 : 0,
              }}
            >
              {item.label}
            </Link>
          ))}

          <a
            href="https://github.com/amandeepsingh29"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className={`mt-4 block px-4 py-3.5 text-center text-sm font-bold rounded-full transition-all ${isDark
              ? isDev
                ? 'text-[#05110d] bg-emerald-300 hover:bg-emerald-400 hover:text-[#02110b] shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'text-gray-900 bg-white hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              : 'text-white bg-gray-900 hover:bg-red-600 shadow-[0_0_20px_rgba(0,0,0,0.1)]'
              }`}
            style={{
              transitionDelay: mobileOpen ? `${navItems.length * 50}ms` : '0ms',
              transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
