import React from 'react';
import { ArrowUpRight, BookMarked } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';
import { useSiteContent } from '../SiteContentContext';

const colorAccents = [
  'border-l-red-500',
  'border-l-amber-500',
  'border-l-emerald-500',
  'border-l-blue-500',
  'border-l-violet-500',
  'border-l-pink-500',
  'border-l-cyan-500',
];

const PapershelfSection = () => {
  const { isDark } = useTheme();
  const { content } = useSiteContent();
  const papers = content.papers || [];
  const [ref, isVisible] = useScrollReveal();

  if (papers.length === 0) return null;

  return (
    <section id="reads" className="max-w-6xl mx-auto px-6 py-20">
      <div ref={ref} className={`reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="mb-10">
          <p className="font-mono-space text-[11px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3">[ READS ]</p>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Papers & articles I enjoyed</h2>
          <div className="line-draw h-[2px] mt-3 bg-red-600"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper, index) => (
            <a
              key={index}
              href={paper.url}
              className={`stagger-child group rounded-xl p-5 border-l-4 ${colorAccents[index % colorAccents.length]} card-lift ${isDark ? 'bg-[#1a1a24] border border-gray-800' : 'bg-white border border-gray-100'}`}
              style={staggerDelay(index, 60)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <BookMarked size={14} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                    <span className={`text-[11px] font-mono-space uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>#{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className={`text-sm font-semibold leading-snug ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>
                    {paper.title}
                  </h3>
                </div>
                <ArrowUpRight size={14} className={`flex-shrink-0 mt-1 transition-all ${isDark ? 'text-gray-700 group-hover:text-red-400' : 'text-gray-300 group-hover:text-red-600'} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PapershelfSection;
