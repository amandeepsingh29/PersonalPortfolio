import React from 'react';
import { Linkedin, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Newsletter = () => {
  const { isDark } = useTheme();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-20">
      <div ref={ref} className={`reveal ${isVisible ? 'revealed' : ''}`}>
        <div className={`rounded-2xl p-8 md:p-10 card-lift ${isDark ? 'bg-[#1a1a24] border border-gray-800' : 'bg-white border border-gray-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="font-mono-space text-[11px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3">[ CONTACT ]</p>
              <h2 className={`text-xl md:text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Let's connect</h2>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                I'm always open to new conversations and opportunities.
              </p>
            </div>

            <div>
              <a
                href="https://linkedin.com/in/amandeepsinghx"
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap magnetic-hover ${isDark ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20' : 'bg-gray-900 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-gray-900/20'}`}
              >
                <Linkedin size={16} />
                Connect on LinkedIn
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
