import React, { useState, useEffect } from 'react';
import { Twitter, Linkedin, Github, Instagram, Heart } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const LiveClock = ({ isDark }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatted = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return (
    <span className={`font-mono-space text-xs tabular-nums ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
      IN,IST_{formatted}
    </span>
  );
};

const Footer = () => {
  const { isDark } = useTheme();

  const socials = [
    { icon: Twitter, href: 'https://twitter.com/amandeepxsingh' },
    { icon: Linkedin, href: 'https://linkedin.com/in/amandeepsinghx' },
    { icon: Github, href: 'https://github.com/amandeepsingh29' },
    { icon: Instagram, href: 'https://instagram.com/amandeepxsingh' },
  ];

  return (
    <footer className={`border-t ${isDark ? 'border-gray-800 bg-[#0f0f14]' : 'border-gray-200 bg-[#F5F1E8]'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AS<span className="text-red-600">.</span>
            </span>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Building things on the internet.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {['About', 'Blog', 'Reads', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`text-xs font-mono-space uppercase tracking-wider transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 magnetic-hover ${isDark ? 'bg-white/5 text-gray-500 hover:bg-red-600 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white'}`}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-xs font-mono-space ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} Amandeep Singh
          </p>
          <LiveClock isDark={isDark} />
          <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
