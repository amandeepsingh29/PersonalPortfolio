import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '/#about' },
    { label: 'Journey', href: '/journey' },
    { label: 'Blog', href: '/#blogs' },
    { label: 'Reads', href: '/#reads' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? isDark ? 'bg-[#0f0f14]/90 backdrop-blur-md shadow-sm shadow-black/20' : 'bg-[#F5F1E8]/90 backdrop-blur-md shadow-sm'
      : 'bg-transparent'
      }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AS<span className="text-red-600">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className={`theme-toggle-btn ml-2 ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-200/60'} rounded-full transition-colors`}
            aria-label="Toggle dark mode"
          >
            <Sun size={18} className="icon-sun" />
            <Moon size={18} className="icon-moon" />
          </button>

          <a
            href="https://github.com/amandeepsingh29"
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-2 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${isDark
              ? 'text-gray-900 bg-white hover:bg-red-500 hover:text-white'
              : 'text-white bg-gray-900 hover:bg-red-600'
              }`}
          >
            GitHub
          </a>
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDark ? 'text-yellow-400' : 'text-gray-600'}`}
            aria-label="Toggle dark mode"
          >
            <Sun size={18} className="icon-sun" />
            <Moon size={18} className="icon-moon" />
          </button>
          <button
            className={`p-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className={`md:hidden border-t px-6 py-4 space-y-1 ${isDark ? 'bg-[#0f0f14] border-gray-800' : 'bg-[#F5F1E8] border-gray-200'}`}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 text-sm rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
