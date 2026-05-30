import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "../../ThemeContext";

export function BentoGridCarousel({ projects = [], speed = 60 }) {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(0);
  const x = useMotionValue(0);

  const getBentoClasses = (index) => {
    const bentoPatterns = [
      "col-span-1 row-span-2 h-full", // tall
      "col-span-1 row-span-1 h-full", // square
      "col-span-1 row-span-1 h-full", // square
      "col-span-2 row-span-1 h-full", // wide
      "col-span-1 row-span-1 h-full", // square
      "col-span-1 row-span-1 h-full", // square
      "col-span-2 row-span-2 h-full", // large
      "col-span-1 row-span-1 h-full", // square
      "col-span-1 row-span-1 h-full", // square
    ];
    return bentoPatterns[index % bentoPatterns.length];
  };

  useEffect(() => {
    if (!gridRef.current) return undefined;

    const updateGridWidth = () => {
      const width = gridRef.current?.getBoundingClientRect().width || 0;
      setGridWidth(width);
      x.set(0);
    };

    updateGridWidth();
    const observer = new ResizeObserver(updateGridWidth);
    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [projects, x]);

  useAnimationFrame((t, delta) => {
    if (isHovered || gridWidth === 0) return;

    const pixelsPerSecond = speed;
    const moveBy = (pixelsPerSecond * delta) / 1000;
    let nextX = x.get() - moveBy;

    if (nextX <= -gridWidth) {
      nextX += gridWidth;
    }

    x.set(nextX);
  });

  if (!projects || projects.length === 0) return null;

  // We render two identical grids side by side and translate by one grid width.
  const renderGrid = () => (
    <div className="grid grid-flow-col grid-rows-2 gap-4 h-[42vh] auto-cols-[72vw] sm:auto-cols-[32vh]">
      {projects.map((project, idx) => {
        const isLarge = getBentoClasses(idx).includes("row-span-2") && getBentoClasses(idx).includes("col-span-2");
        
        return (
          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            key={`${project.name}-${idx}`}
            className={`group relative overflow-hidden rounded-3xl border flex flex-col p-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
              isDark 
                ? "bg-[#111827] border-gray-800 hover:border-gray-700" 
                : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
            } ${getBentoClasses(idx)}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image - full height, no dimming overlay */}
            <div className="absolute inset-0 w-full h-full bg-gray-100 dark:bg-gray-900">
              <img 
                src={project.src} 
                alt={project.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            
            {/* Content - floating glass pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
              <div className={`flex flex-col justify-center px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg ${isDark ? 'bg-black/60 border border-white/10' : 'bg-white/80 border border-black/5'}`}>
                <h3 className={`font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'} ${isLarge ? 'text-xl' : 'text-base'}`}>
                  {project.name}
                </h3>
                {project.designation && (
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.designation}
                  </span>
                )}
              </div>
              
              <div className={`rounded-full backdrop-blur-md transition-all duration-300 ${isDark ? 'bg-black/60 border border-white/10 text-white' : 'bg-white/80 border border-black/5 text-gray-900'} hover:scale-110 ${isLarge ? 'p-2' : 'p-1.5'}`}>
                <ArrowUpRight className={isLarge ? "w-4 h-4" : "w-3.5 h-3.5"} />
              </div>
            </div>
          </motion.a>
        );
      })}
    </div>
  );

  return (
    <div 
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <div ref={gridRef}>{renderGrid()}</div>
        {renderGrid()}
      </motion.div>
    </div>
  );
}
