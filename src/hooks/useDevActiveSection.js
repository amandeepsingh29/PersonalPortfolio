import { useEffect, useRef, useState } from 'react';

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

function parseRgbString(rgb) {
  const [r = 16, g = 185, b = 129] = String(rgb)
    .split(',')
    .map((value) => Number(value.trim()));
  return [r, g, b];
}

export function useInterpolatedDevAccent(sectionId, enabled, durationMs = 280) {
  const [currentRgb, setCurrentRgb] = useState(() => parseRgbString(getDevAccent(sectionId).rgb));
  const currentRgbRef = useRef(currentRgb);

  useEffect(() => {
    currentRgbRef.current = currentRgb;
  }, [currentRgb]);

  useEffect(() => {
    if (!enabled) return undefined;

    const targetRgb = parseRgbString(getDevAccent(sectionId).rgb);
    const startRgb = currentRgbRef.current;
    const startAt = performance.now();
    let rafId;

    const tick = (now) => {
      const progress = Math.min(1, (now - startAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextRgb = startRgb.map((start, index) => Math.round(start + (targetRgb[index] - start) * eased));
      setCurrentRgb(nextRgb);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [sectionId, enabled, durationMs]);

  return {
    rgb: currentRgb.join(','),
    label: getDevAccent(sectionId).label,
  };
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
