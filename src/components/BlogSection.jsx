import React, { useState } from 'react';
import { blogPosts } from '../mockData';
import { ArrowUpRight, Pen, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const BlogSection = () => {
  const { isDark } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1, 7);

  return (
    <section id="blogs" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono-space text-[11px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3">[ BLOG ]</p>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>What I've been writing</h2>
        </div>
        <button onClick={() => setShowAll(true)} className={`hidden sm:flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}>
          All Blogs <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured post — large card */}
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group rounded-2xl p-8 flex flex-col justify-between min-h-[280px] hover:scale-[1.01] transition-transform duration-300 ${isDark ? 'bg-red-600/10 border border-red-900/30' : 'bg-gray-900'}`}
        >
          <div className="flex items-center gap-2">
            <Pen size={14} className="text-red-400" />
            <span className="text-xs text-gray-500 font-mono">{featured.date}</span>
          </div>
          <div>
            <h3 className={`text-2xl font-bold leading-snug mb-3 group-hover:text-red-400 transition-colors ${isDark ? 'text-white' : 'text-white'}`}>
              {featured.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-white transition-colors">
              Read more <ArrowUpRight size={14} />
            </span>
          </div>
        </a>

        {/* Rest — compact list card */}
        <div className={`rounded-2xl shadow-sm divide-y ${isDark ? 'bg-[#1a1a24] border border-gray-800 divide-gray-800' : 'bg-white border border-gray-100 divide-gray-50'}`}>
          {rest.map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 px-6 py-4 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200 ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F5F1E8]'}`}
            >
              <span className={`text-[11px] font-mono whitespace-nowrap min-w-[80px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {post.date}
              </span>
              <span className={`text-sm font-medium flex-1 truncate ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {post.title}
              </span>
              <ArrowUpRight size={14} className={`flex-shrink-0 transition-colors ${isDark ? 'text-gray-700 group-hover:text-red-400' : 'text-gray-300 group-hover:text-red-600'}`} />
            </a>
          ))}
        </div>
      </div>

      {/* All Blogs Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAll(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] ${isDark ? 'bg-[#1a1a24] border border-gray-800' : 'bg-white'}`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-[#1a1a24] border-gray-800' : 'bg-white border-gray-100'}`}>
              <h3 className={`font-mono-space text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>[ ALL BLOGS ]</h3>
              <button
                onClick={() => setShowAll(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Blog list */}
            <div className={`overflow-y-auto max-h-[calc(80vh-60px)] divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {blogPosts.map((post, i) => (
                <a
                  key={i}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 px-6 py-4 transition-colors duration-200 ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F5F1E8]'}`}
                >
                  <span className={`text-[11px] font-mono whitespace-nowrap min-w-[100px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {post.date}
                  </span>
                  <span className={`text-sm font-medium flex-1 ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {post.title}
                  </span>
                  <ArrowUpRight size={14} className={`flex-shrink-0 transition-colors ${isDark ? 'text-gray-700 group-hover:text-red-400' : 'text-gray-300 group-hover:text-red-600'}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
