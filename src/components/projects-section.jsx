import React, { useMemo } from "react";
import { useTheme } from "../ThemeContext";
import { ArrowUpRight } from "lucide-react";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { useSiteContent } from "../SiteContentContext";

function getProjectPlaceholder(name, idx) {
  const safeName = encodeURIComponent(name || `Project ${idx + 1}`);
  return `https://ui-avatars.com/api/?name=${safeName}&background=111827&color=ffffff&size=1024&bold=true&format=png`;
}

export default function ProjectsSection() {
  const { isDark } = useTheme();
  const { content } = useSiteContent();
  const projectConfig = content.projects;

  const projectTitle = projectConfig?.title || "What I've been building";
  const projectRepoUrl = projectConfig?.repoUrl || "https://github.com/amandeepsingh29";
  const legacyProjectImages = useMemo(
    () => (projectConfig?.images || []).map((url) => (url || "").trim()).filter(Boolean),
    [projectConfig]
  );
  const projects = useMemo(() => projectConfig?.items || [], [projectConfig]);

  const testimonials = useMemo(
    () =>
      projects.map((project, idx) => ({
        quote: project.description,
        name: project.name,
        designation: `${project.lang}${project.stars > 0 ? ` • ★${project.stars}` : ""}`,
        url: project.url || projectRepoUrl,
        src:
          (project.image || "").trim() ||
          (legacyProjectImages[idx] || "") ||
          getProjectPlaceholder(project.name, idx),
      })),
    [legacyProjectImages, projectRepoUrl, projects]
  );

  if (!testimonials.length) return null;

  return (
    <section id="projects" className={`relative overflow-hidden py-24 ${isDark ? "bg-[#0f0f14]" : "bg-[#F5F1E8]"}`}>
      <div className="mx-auto mb-14 flex max-w-6xl items-end justify-between px-6">
        <div>
          <p className="mb-3 font-mono-space text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">[ PROJECTS ]</p>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {projectTitle}
          </h2>
        </div>

        <a
          href={projectRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden items-center gap-1.5 text-sm transition-colors sm:flex ${
            isDark ? "text-gray-500 hover:text-red-400" : "text-gray-500 hover:text-red-600"
          }`}
        >
          All repos <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
        <CircularTestimonials
          testimonials={testimonials}
          autoplay={true}
          colors={{
            name: isDark ? "#f8fafc" : "#0f172a",
            designation: isDark ? "#9ca3af" : "#6b7280",
            testimony: isDark ? "#e5e7eb" : "#374151",
            arrowBackground: isDark ? "#1f2937" : "#111827",
            arrowForeground: "#f8fafc",
            arrowHoverBackground: isDark ? "#ef4444" : "#2563eb",
          }}
          fontSizes={{
            name: "clamp(1.4rem, 1.2rem + 0.8vw, 2rem)",
            designation: "clamp(0.88rem, 0.8rem + 0.2vw, 1rem)",
            quote: "clamp(1rem, 0.95rem + 0.4vw, 1.2rem)",
          }}
        />
      </div>
    </section>
  );
}
