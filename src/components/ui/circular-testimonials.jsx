"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;

  if (width <= minWidth) return minGap;
  if (width >= maxWidth) {
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  }

  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";

  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedQuote, setExpandedQuote] = useState(false);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (testimonialsLength === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    if (testimonialsLength === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    if (!autoplay || testimonialsLength === 0) return undefined;

    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    }, 5000);

    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    setExpandedQuote(false);
  }, [activeIndex]);

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const quoteWords = (activeTestimonial?.quote || "").split(" ").filter(Boolean);
  const maxPreviewWords = 26;
  const isLongQuote = quoteWords.length > maxPreviewWords;
  const visibleWords = expandedQuote || !isLongQuote ? quoteWords : quoteWords.slice(0, maxPreviewWords);

  if (!testimonialsLength) return null;

  return (
    <div className="w-full max-w-5xl px-2 sm:px-4 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div className="relative h-[20rem] w-full [perspective:1000px] sm:h-[24rem]" ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <img
              key={`${testimonial.src}-${index}`}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute h-full w-full rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 object-contain p-2 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:from-slate-900 dark:to-slate-800"
              data-index={index}
              style={getImageStyle(index)}
            />
          ))}
        </div>

        <div className="flex flex-col justify-between gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]"
            >
              <a
                href={activeTestimonial.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2"
              >
                <h3 className="mb-1 break-words font-bold leading-tight transition-colors group-hover:text-blue-600" style={{ color: colorName, fontSize: fontSizeName }}>
                  {activeTestimonial.name}
                </h3>
                <ArrowUpRight size={18} className="opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: colorName }} />
              </a>
              <p className="mb-8" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>
                {activeTestimonial.designation}
              </p>

              <motion.p className="leading-7" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                {visibleWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
                {!expandedQuote && isLongQuote && (
                  <button
                    type="button"
                    onClick={() => setExpandedQuote(true)}
                    className="ml-1 inline text-xs font-semibold text-blue-600 hover:underline"
                  >
                    .....more
                  </button>
                )}
              </motion.p>

              <a
                href={activeTestimonial.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Open project <ArrowUpRight size={14} />
              </a>

              {expandedQuote && isLongQuote && (
                <button
                  type="button"
                  onClick={() => setExpandedQuote(false)}
                  className="mt-3 block text-xs font-semibold text-blue-600 hover:underline"
                >
                  Show less
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-5 md:pt-0">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border-none transition-colors"
              onClick={handlePrev}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={20} color={colorArrowFg} />
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border-none transition-colors"
              onClick={handleNext}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={20} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircularTestimonials;
