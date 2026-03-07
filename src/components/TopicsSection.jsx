import React from 'react';
import { topics } from '../mockData';
import { ArrowUpRight, Sparkles, Lock } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';

const icons = ['🚀', '🏗️', '☁️', '🧠'];

const TopicsSection = () => {
  const { isDark } = useTheme();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="topics" className="max-w-6xl mx-auto px-6 py-20">
      <div ref={ref} className={`reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="mb-10">
          <p className="font-mono-space text-[11px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3">[ EXPLORE ]</p>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Topics I'm diving into</h2>
          <div className="line-draw h-[2px] mt-3 bg-red-600"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic, index) => (
            <div key={index} className="stagger-child relative" style={staggerDelay(index)}>
              {topic.todo ? (
                <div className={`rounded-2xl p-6 border border-dashed flex flex-col items-center text-center min-h-[180px] justify-center ${isDark ? 'bg-white/5 border-gray-700' : 'bg-white/60 border-gray-300'}`}>
                  <Lock size={20} className={isDark ? 'text-gray-600 mb-3' : 'text-gray-300 mb-3'} />
                  <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{topic.title}</h3>
                  <span className={`text-[11px] font-mono-space px-3 py-1 rounded-full font-medium ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>in progress</span>
                </div>
              ) : (
                <a
                  href={topic.url}
                  className={`group rounded-2xl p-6 flex flex-col min-h-[180px] justify-between card-lift ${isDark ? 'bg-[#1a1a24] border border-gray-800 hover:border-red-900' : 'bg-white border border-gray-100 hover:border-red-100'}`}
                >
                  <span className="text-3xl mb-4">{icons[index] || '📌'}</span>
                  <div>
                    <h3 className={`text-base font-bold group-hover:text-red-600 transition-colors mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {topic.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-xs group-hover:text-red-500 transition-colors ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      Explore <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
