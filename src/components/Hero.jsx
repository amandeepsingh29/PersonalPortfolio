import React, { useEffect, useRef, useState } from 'react';
import { Twitter, Linkedin, Instagram, Github, ArrowDown } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import TextScramble from './TextScramble';
import Typewriter from './Typewriter';

const Hero = () => {
  const { isDark, isDev } = useTheme();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [nameComplete, setNameComplete] = useState(false);
  const [lightImgError, setLightImgError] = useState(false);
  const [darkImgError, setDarkImgError] = useState(false);

  // Mouse position for interactive background blob
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    // Warm both theme images in browser cache for instant theme switching.
    ['/profile.jpg', '/profile2.jpg'].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Card spotlight — mouse-following radial gradient
  const handleSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  };

  // 3D tilt for profile card
  const handleTilt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03, 1.03, 1.03)`;
  };
  const handleTiltReset = (e) => {
    e.currentTarget.style.transform = '';
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const transformStyle = `translateY(${scrollY * 0.3}px) scale(${1 - scrollY * 0.0003})`;
      const opacityStyle = Math.max(0, 1 - scrollY * 0.002);

      if (titleRef.current) {
        titleRef.current.style.transform = transformStyle;
        titleRef.current.style.opacity = opacityStyle;
      }
      if (subtitleRef.current) {
        subtitleRef.current.style.transform = transformStyle;
        subtitleRef.current.style.opacity = opacityStyle;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const techStack = isDev
    ? ['git push origin main', 'docker compose up', 'npm run dev', 'pnpm lint --fix', 'kubectl get pods', 'redis-cli monitor', 'tail -f logs/app.log', 'ssh prod@cluster', 'gh pr create', 'terraform apply']
    : ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'Tailwind', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'];

  const devQuickActions = [
    { label: 'git checkout projects', target: 'projects' },
    { label: 'open --contact', target: 'contact' },
    { label: 'tail -f reads.log', target: 'reads' },
    { label: 'cd ~/about', target: 'about' },
  ];

  const jumpToSection = (target) => {
    const node = document.getElementById(target);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="about" ref={heroRef} className="max-w-6xl mx-auto px-6 pt-16 pb-8 overflow-hidden relative">

      {/* Interactive Flowing Background Blob */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{ opacity: isDark ? 0.35 : 0.15 }}
      >
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] transition-transform duration-[1500ms] ease-out mix-blend-screen"
          style={{
            background: isDev
              ? 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(5,11,11,0) 70%)'
              : isDark
                ? 'radial-gradient(circle, rgba(220,38,38,0.5) 0%, rgba(30,30,40,0) 70%)'
                : 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, rgba(255,255,255,0) 70%)',
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <div className="hero-gradient-orbs z-0 opacity-50">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Top intro */}
      <div className="text-center mb-12 relative z-10">
        <div className={`hero-animate inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 ${isDev ? 'dev-pill bg-emerald-500/10 border border-emerald-500/40 text-emerald-300' : isDark ? 'bg-red-900/30 border border-red-800/40 text-red-400' : 'bg-red-50 border border-red-100 text-red-600'}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${isDev ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
          {isDev ? 'SYSTEM READY // DEV MODE ACTIVE' : 'Open to Collaborate'}
        </div>

        <div ref={titleRef} className="parallax-hero will-change-transform">
          <h1 className={`hero-animate-delay-1 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-[0.9] ${isDark ? 'text-white' : 'text-gray-900'} ${isDev ? 'dev-glitch-title' : ''}`}>
            <TextScramble text="Amandeep" delay={300} speed={30} />
            <br />
            <span className="inline-block mt-1">
              {nameComplete ? (
                <>S<span className={isDev ? 'text-emerald-400' : 'text-red-600'}>i</span>ngh</>
              ) : (
                <TextScramble text="Singh" delay={600} speed={30} onComplete={() => setNameComplete(true)} />
              )}
              <span className={`inline-block w-3 h-3 rounded-full ml-2 mb-2 animate-pulse ${isDev ? 'bg-emerald-400' : 'bg-red-600'}`}></span>
            </span>
          </h1>
        </div>

        <div ref={subtitleRef} className="parallax-hero will-change-transform">
          <div className={`hero-animate-delay-2 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-light ${isDev ? 'text-emerald-100/80' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Typewriter text={isDev ? 'Building systems. Breaking limits. Shipping at terminal speed.' : 'Software engineer who loves building scalable systems.'} delay={1200} speed={40} />
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className={`hero-animate-delay-3 overflow-hidden py-4 mb-10 border-y ${isDark ? 'border-gray-800' : 'border-gray-300/50'}`}>
        <div className="marquee-track">
          {[...techStack, ...techStack].map((tech, i) => (
            <span key={i} className={`flex items-center gap-4 px-4 text-sm font-mono-space font-bold ${isDev ? 'tracking-normal normal-case' : 'uppercase tracking-widest'} whitespace-nowrap ${isDev ? 'text-emerald-200/70' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {tech}
              <span className={`${isDev ? 'text-emerald-400' : 'text-red-600'} text-xs`}>●</span>
            </span>
          ))}
        </div>
      </div>

      {isDev && (
        <div className="hero-animate-delay-3 mb-10">
          <div onMouseMove={handleSpotlight} className="card-spotlight dev-terminal-card rounded-2xl border border-emerald-500/30 bg-[#061711]/70 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                root@amandeep:~
              </div>
              <span className="text-[11px] text-emerald-200/60">session:portfolio-prod</span>
            </div>
            <div className="mt-4 space-y-2 font-mono-space text-xs text-emerald-100/85 md:text-sm">
              <p>$ npm run dev<span className="typing-caret">_</span></p>
              <p className="text-emerald-300/75">compiled successfully in 742ms</p>
              <p>$ git log --oneline -3</p>
              <p className="text-emerald-300/75">feat: add developer mode experience</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {devQuickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => jumpToSection(action.target)}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono-space text-[11px] text-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/20"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 hero-animate-delay-3">
        {/* Bio Card */}
        <div onMouseMove={handleSpotlight} className={`card-spotlight md:col-span-2 rounded-2xl p-8 card-lift ${isDark ? 'bg-[#1a1a24] border border-gray-800' : 'bg-white border border-gray-100'}`}>
          <h3 className={`font-mono-space text-[11px] font-bold uppercase tracking-[0.2em] mb-5 ${isDev ? 'text-emerald-400' : 'text-red-600'}`}>[ ABOUT ]</h3>
          <div className={`space-y-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>I'm passionate about building modern web applications and scalable systems. I work across the full stack — from crafting intuitive interfaces to designing robust backend architectures.</p>
            <p>I enjoy exploring new technologies, contributing to open-source, and sharing knowledge with the developer community.</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl overflow-hidden tilt-card" onMouseMove={handleTilt} onMouseLeave={handleTiltReset}>
          <div className={`w-full aspect-square relative ${isDark ? 'bg-[#1a1a24]' : 'bg-gray-800'}`}>
            <img
              src="/profile.jpg"
              alt="Amandeep Singh"
              className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'hidden' : 'block'}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={() => setLightImgError(true)}
            />
            <img
              src="/profile2.jpg"
              alt="Amandeep Singh dark"
              className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'block' : 'hidden'}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={() => setDarkImgError(true)}
            />
            <div className={`w-full h-full items-center justify-center absolute inset-0 ${(isDark ? darkImgError : lightImgError) ? 'flex' : 'hidden'} ${isDark ? 'bg-[#1a1a24]' : 'bg-gray-800'}`}>
              <span className={`text-6xl font-black tracking-tighter ${isDev ? 'text-emerald-400' : 'text-red-600'}`}>AS</span>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-14">
        <a href="#blogs" className={`group flex flex-col items-center transition-colors ${isDev ? 'text-emerald-300/60 hover:text-emerald-300' : isDark ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}>
          <span className="text-[10px] font-mono-space uppercase tracking-[0.3em] mb-3">Scroll</span>
          <ArrowDown size={14} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
