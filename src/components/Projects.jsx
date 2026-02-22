import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';
import { Github, ExternalLink, Star, GitFork, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import './TrainEngine.css';

const TrainCar = ({ repo, isDark, getLanguageColor }) => {
    return (
        <div
            className={`group relative flex flex-col justify-between p-5 md:p-6 rounded-[2rem] transition-all duration-300 h-full min-h-[220px] max-h-[260px] ${isDark
                ? 'bg-[#1a1a24] border-2 border-gray-800 hover:border-red-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                : 'bg-white border-2 border-gray-200 hover:border-red-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
                }`}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/5 text-gray-400 group-hover:text-white' : 'bg-gray-50 text-gray-500 group-hover:text-gray-900'} transition-colors`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <div className="flex gap-3">
                        {repo.homepage && (
                            <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className={`hover:text-red-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                <ExternalLink size={20} />
                            </a>
                        )}
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={`hover:text-red-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 truncate group-hover:text-red-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {repo.name}
                </h3>
                <p className={`text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {repo.description || 'No description provided for this repository. Code speaks for itself.'}
                </p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-xs font-mono-space font-medium">
                    {repo.language && (
                        <span className={`px-2.5 py-1 rounded-md ${getLanguageColor(repo.language)}`}>
                            {repo.language}
                        </span>
                    )}
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Star size={14} />
                        <span>{repo.stargazers_count}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <GitFork size={14} />
                        <span>{repo.forks_count}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const { isDark } = useTheme();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Independent states for each track
    const [train1Position, setTrain1Position] = useState(0);
    const [train2Position, setTrain2Position] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProjects = async () => {
            try {
                // Fetch top 8 repos so we have 4 for each track
                const response = await fetch('https://api.github.com/users/amandeepsingh29/repos?sort=updated&per_page=8');
                if (response.ok) {
                    const data = await response.json();
                    setRepos(data);
                }
            } catch (error) {
                console.error("Error fetching repos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getLanguageColor = (lang) => {
        const colors = {
            JavaScript: 'bg-yellow-400 text-yellow-900',
            TypeScript: 'bg-blue-400 text-blue-900',
            Python: 'bg-green-400 text-green-900',
            HTML: 'bg-orange-400 text-orange-900',
            CSS: 'bg-pink-400 text-pink-900',
            Java: 'bg-red-400 text-red-900',
            null: 'bg-gray-400 text-gray-900'
        };
        return colors[lang] || 'bg-indigo-400 text-indigo-900';
    };

    // Split data into two tracks
    const track1 = repos.slice(0, Math.ceil(repos.length / 2));
    const track2 = repos.slice(Math.ceil(repos.length / 2));

    const moveTrain1 = (direction) => {
        if (direction === 'forward' && train1Position <= track1.length) {
            setTrain1Position(prev => prev + 1);
        } else if (direction === 'backward' && train1Position > 0) {
            setTrain1Position(prev => prev - 1);
        }
    };

    const moveTrain2 = (direction) => {
        if (direction === 'forward' && train2Position <= track2.length) {
            setTrain2Position(prev => prev + 1);
        } else if (direction === 'backward' && train2Position > 0) {
            setTrain2Position(prev => prev - 1);
        }
    };

    return (
        <div className={`min-h-screen pt-32 pb-32 transition-colors duration-300 overflow-hidden ${isDark ? 'bg-[#0f0f14]' : 'bg-[#F5F1E8]'}`}>
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header section */}
                <div className="text-center mb-16 reveal revealed">
                    <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        My <span className="text-red-600">Projects</span>
                    </h1>
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Hop on! Explore my codebase through the project yard. Let's get these trains moving.
                    </p>
                </div>

                {/* Train Game Container */}
                <div className={`relative w-full rounded-[3rem] p-6 md:p-10 border-4 shadow-2xl transition-all ${isDark ? 'bg-[#12121a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                    {loading ? (
                        // Loading State
                        <div className="text-center py-20">
                            <h2 className={`text-2xl font-bold animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Routing tracks...</h2>
                        </div>
                    ) : repos.length > 0 ? (
                        <div className="space-y-16 pb-8">

                            {/* TRACK 1 */}
                            <div className="relative">
                                {/* Track 1 Controls */}
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <span className={`font-mono-space tracking-widest font-black text-sm ${isDark ? 'text-red-500' : 'text-red-600'}`}>TRACK 1</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => moveTrain1('backward')}
                                            disabled={train1Position === 0}
                                            className={`p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-gray-800 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-900 hover:bg-red-500 hover:text-white'} hover:scale-110 active:scale-95`}
                                        >
                                            <ArrowLeft size={18} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => moveTrain1('forward')}
                                            disabled={train1Position > track1.length - 1}
                                            className={`p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-gray-800 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-900 hover:bg-red-500 hover:text-white'} hover:scale-110 active:scale-95`}
                                        >
                                            <ArrowRight size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                {/* Track 1 Physical Rail */}
                                <div className={`absolute top-[60%] left-0 w-full h-4 -translate-y-1/2 rounded-full border-y-[2px] ${isDark ? 'border-gray-800/80 bg-gray-900/60' : 'border-gray-300 bg-gray-200'}`}>
                                    <div className="absolute inset-0 flex space-x-12 -translate-y-[2px]">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className={`h-4 w-2 ${isDark ? 'bg-gray-800' : 'bg-gray-400'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Track 1 Moving Container */}
                                <div className="overflow-visible relative select-none">
                                    <div
                                        className="flex gap-6 transition-transform duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] items-center"
                                        style={{
                                            width: 'max-content',
                                            marginLeft: '50%',
                                            transform: train1Position === 0
                                                ? 'translateX(-116px)'
                                                : `translateX(calc(-256px - (var(--car-width) / 2) - ((var(--car-width) + 24px) * ${train1Position - 1})))`
                                        }}
                                    >
                                        {/* Engine Compartment */}
                                        <div className="shrink-0 z-20 px-4 -scale-x-100 scale-y-[0.85] md:scale-y-100 origin-center transition-transform" style={{
                                            marginBottom: '60px',
                                            '--dark-red': isDark ? '#7f1d1d' : '#dc2626',
                                            '--light-red': isDark ? '#b91c1c' : '#f87171'
                                        }}>
                                            <div className="css-train"></div>
                                        </div>

                                        {/* Repo Cars */}
                                        {track1.map((repo) => (
                                            <div key={repo.id} className="shrink-0 w-[var(--car-width)] z-10 pb-4">
                                                <TrainCar repo={repo} isDark={isDark} getLanguageColor={getLanguageColor} />
                                            </div>
                                        ))}

                                        {/* End Compartment Placeholder */}
                                        <div className={`shrink-0 w-[var(--car-width)] max-w-sm h-[240px] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center p-4 z-10 pb-4 transition-colors ${isDark ? 'border-gray-700 bg-gray-900/20 text-gray-500' : 'border-gray-300 bg-gray-100/50 text-gray-400'
                                            }`}>
                                            <Plus size={32} className={`mb-4 opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <p className="font-mono-space text-sm font-bold tracking-wider uppercase leading-snug">
                                                Next compartment<br />adding soon...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TRACK 2 */}
                            <div className="relative">
                                {/* Track 2 Controls */}
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <span className={`font-mono-space tracking-widest font-black text-sm ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>TRACK 2</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => moveTrain2('backward')}
                                            disabled={train2Position === 0}
                                            className={`p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-gray-800 text-white hover:bg-emerald-600' : 'bg-gray-200 text-gray-900 hover:bg-emerald-500 hover:text-white'} hover:scale-110 active:scale-95`}
                                        >
                                            <ArrowLeft size={18} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => moveTrain2('forward')}
                                            disabled={train2Position > track2.length - 1}
                                            className={`p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-gray-800 text-white hover:bg-emerald-600' : 'bg-gray-200 text-gray-900 hover:bg-emerald-500 hover:text-white'} hover:scale-110 active:scale-95`}
                                        >
                                            <ArrowRight size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                {/* Track 2 Physical Rail */}
                                <div className={`absolute top-[60%] left-0 w-full h-4 -translate-y-1/2 rounded-full border-y-[2px] ${isDark ? 'border-gray-800/80 bg-gray-900/60' : 'border-gray-300 bg-gray-200'}`}>
                                    <div className="absolute inset-0 flex space-x-12 -translate-y-[2px]">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className={`h-4 w-2 ${isDark ? 'bg-gray-800' : 'bg-gray-400'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Track 2 Moving Container */}
                                <div className="overflow-visible relative select-none">
                                    <div
                                        className="flex gap-6 transition-transform duration-[900ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] items-center"
                                        style={{
                                            width: 'max-content',
                                            marginLeft: '50%',
                                            transform: train2Position === 0
                                                ? 'translateX(-116px)'
                                                : `translateX(calc(-256px - (var(--car-width) / 2) - ((var(--car-width) + 24px) * ${train2Position - 1})))`
                                        }}
                                    >
                                        {/* Engine Compartment */}
                                        <div className="shrink-0 z-20 px-4 -scale-x-100 scale-y-[0.85] md:scale-y-100 origin-center transition-transform" style={{
                                            marginBottom: '60px',
                                            '--dark-red': isDark ? '#064e3b' : '#059669',
                                            '--light-red': isDark ? '#047857' : '#34d399'
                                        }}>
                                            <div className="css-train"></div>
                                        </div>

                                        {/* Repo Cars */}
                                        {track2.map((repo) => (
                                            <div key={repo.id} className="shrink-0 w-[var(--car-width)] z-10 pb-4">
                                                <TrainCar repo={repo} isDark={isDark} getLanguageColor={getLanguageColor} />
                                            </div>
                                        ))}

                                        {/* End Compartment Placeholder */}
                                        <div className={`shrink-0 w-[var(--car-width)] max-w-sm h-[240px] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center p-4 z-10 pb-4 transition-colors ${isDark ? 'border-gray-700 bg-gray-900/20 text-gray-500' : 'border-gray-300 bg-gray-100/50 text-gray-400'
                                            }`}>
                                            <Plus size={32} className={`mb-4 opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            <p className="font-mono-space text-sm font-bold tracking-wider uppercase leading-snug">
                                                Next compartment<br />adding soon...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No public repositories found on this GitHub account.</p>
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <a
                        href="https://github.com/amandeepsingh29"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 ${isDark
                            ? 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'
                            : 'bg-gray-900 text-white hover:bg-red-600'
                            }`}
                    >
                        <Github size={20} />
                        View Full GitHub Profile
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Projects;
