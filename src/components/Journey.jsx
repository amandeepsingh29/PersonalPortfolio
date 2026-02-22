import React, { useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';

const experienceData = [
    {
        id: 1,
        date: '2023 - Present',
        title: 'Senior Software Engineer',
        company: 'Tech Innovators',
        description: 'Leading the development of highly scalable microservices architecture. Improving system performance and driving new technical initiatives across teams.',
    },
    {
        id: 2,
        date: '2021 - 2023',
        title: 'Software Engineer',
        company: 'NextGen Systems',
        description: 'Developed and maintained core features of the flagship web application. Collaborated with cross-functional teams to deliver high-quality, responsive UIs using modern React.',
    },
    {
        id: 3,
        date: '2019 - 2021',
        title: 'Frontend Developer',
        company: 'Creative Digital',
        description: 'Built interactive and accessible web experiences from the ground up using React, JavaScript, and CSS. Mentored junior developers and enforced coding standards.',
    },
];

const educationData = [
    {
        id: 1,
        date: '2015 - 2019',
        title: 'B.S. in Computer Science',
        company: 'University of Technology',
        description: 'Graduated with Honors. Specialized in data structures, algorithms, distributed systems, and full-stack web application development.',
    },
    {
        id: 2,
        date: '2013 - 2015',
        title: 'High School Diploma',
        company: 'Science Academy',
        description: 'Focus on Mathematics and Physics. Led the robotics club and participated in national programming competitions.',
    }
];

const Journey = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        // Scroll to top when the page loads
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen pt-32 pb-32 transition-colors duration-300 ${isDark ? 'bg-[#0f0f14]' : 'bg-[#F5F1E8]'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${isDark ? 'bg-red-900/20 text-red-500' : 'bg-red-50 text-red-600'}`}>
                        <MapPin size={28} className="animate-pulse" />
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        My <span className="text-red-600">Journey</span>
                    </h1>
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        A timeline of my professional experiences, educational background, and the milestones that have defined my path so far.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-32">
                    {/* Experience Trail */}
                    <div className="relative">
                        <h2 className={`text-3xl font-black mb-12 flex items-center gap-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <div className={`p-3 rounded-2xl shadow-sm ${isDark ? 'bg-white/5 text-red-500' : 'bg-[#F5F1E8] text-red-600'}`}>
                                <Briefcase size={28} />
                            </div>
                            Experience
                        </h2>
                        <Timeline items={experienceData} isDark={isDark} />
                    </div>

                    {/* Education Trail */}
                    <div className="relative">
                        <h2 className={`text-3xl font-black mb-12 flex items-center gap-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <div className={`p-3 rounded-2xl shadow-sm ${isDark ? 'bg-white/5 text-red-500' : 'bg-[#F5F1E8] text-red-600'}`}>
                                <GraduationCap size={28} />
                            </div>
                            Education
                        </h2>
                        <Timeline items={educationData} isDark={isDark} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Timeline = ({ items, isDark }) => {
    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line: Centered on desktop, left aligned on mobile */}
            <div className={`absolute top-0 bottom-0 w-[2px] md:left-1/2 left-[20px] md:-ml-[1px] ${isDark ? 'bg-gradient-to-b from-red-600/80 via-gray-800 to-transparent' : 'bg-gradient-to-b from-red-600/80 via-gray-300 to-transparent'}`} />

            <div className="space-y-12 md:space-y-24 mt-8">
                {items.map((item, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={item.id} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center group">

                            {/* Outline Dot */}
                            <div className={`absolute w-4 h-4 rounded-full border-[3px] z-10 transition-transform duration-500 group-hover:scale-150 md:left-1/2 left-[20px] md:-ml-[8px] -ml-[7px] mt-[26px] md:mt-0 ${isDark ? 'border-red-600 bg-[#0f0f14]' : 'border-red-600 bg-[#F5F1E8]'}`} />

                            {/* Content Side */}
                            <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${isLeft ? 'md:text-right' : 'md:text-left md:order-last'}`}>
                                <JourneyCard item={item} isDark={isDark} isLeft={isLeft} />
                            </div>

                            {/* Date Side - Hidden on Mobile */}
                            <div className={`hidden md:flex w-[45%] ${isLeft ? 'justify-start' : 'justify-end md:order-first'}`}>
                                <span className={`font-mono-space text-lg font-bold tracking-[0.2em] transform transition-transform duration-500 group-hover:-translate-y-1 ${isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-700'}`}>
                                    {item.date}
                                </span>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const JourneyCard = ({ item, isDark, isLeft }) => {
    return (
        <div className={`relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 ${isDark ? 'bg-[#1a1a24] border border-gray-800 hover:border-red-900/50 hover:shadow-[0_10px_40px_rgba(220,38,38,0.08)]' : 'bg-white border border-gray-100 hover:border-red-200/60 hover:shadow-[0_10px_40px_rgba(220,38,38,0.12)]'}`}>

            {/* Mobile-only visible date */}
            <div className={`md:hidden font-mono-space text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="w-4 h-[1px] bg-red-600/50 block"></span>
                {item.date}
            </div>

            <div className={`flex flex-col ${isLeft ? 'md:items-end text-left md:text-right' : 'md:items-start text-left'}`}>
                <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <h4 className="text-sm font-mono-space font-bold uppercase tracking-widest text-red-600 mb-5">{item.company}</h4>
                <p className={`leading-relaxed text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                </p>
            </div>
        </div>
    );
};

export default Journey;
