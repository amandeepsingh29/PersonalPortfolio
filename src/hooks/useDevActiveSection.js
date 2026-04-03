import { useEffect, useState } from 'react';

export const DEV_SECTIONS = ['about', 'blogs', 'projects', 'reads', 'contact'];

export const DEV_SECTION_ACCENTS = {
  about: { rgb: '16,185,129', label: 'about' },
  blogs: { rgb: '56,189,248', label: 'blog' },
  projects: { rgb: '168,85,247', label: 'projects' },
  reads: { rgb: '250,204,21', label: 'reads' },
  contact: { rgb: '244,63,94', label: 'contact' },
};

export function getDevAccent(sectionId) {
  return DEV_SECTION_ACCENTS[sectionId] || DEV_SECTION_ACCENTS.about;
}

export function useDevActiveSection(enabled) {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    if (!enabled) return undefined;

    const updateActiveFromScroll = () => {
      let nearest = DEV_SECTIONS[0];
      let nearestDistance = Number.POSITIVE_INFINITY;
      const targetLine = window.innerHeight * 0.28;

      DEV_SECTIONS.forEach((sectionId) => {
        const node = document.getElementById(sectionId);
        if (!node) return;
        const distance = Math.abs(node.getBoundingClientRect().top - targetLine);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = sectionId;
        }
      });

      setActiveSection(nearest);
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);

    return () => {
      window.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
    };
  }, [enabled]);

  return activeSection;
}
