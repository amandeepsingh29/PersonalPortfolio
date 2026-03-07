import React, { useEffect, useState } from "react"
import { ProjectsColumn } from "@/components/ui/projects-gallery"
import { useTheme } from '../ThemeContext';

export default function ProjectsSection() {
    const { isDark } = useTheme();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch top 12 repos to split across 3 columns
                const response = await fetch('https://api.github.com/users/amandeepsingh29/repos?sort=updated&per_page=12');
                if (response.ok) {
                    const data = await response.json();

                    const formattedProjects = data.map((repo, idx) => ({
                        title: repo.name,
                        description: repo.description || "No description provided. Code speaks for itself.",
                        image: `https://images.unsplash.com/photo-${[
                            "1518770660439-4636190af475",
                            "1551434678-e076c223a692",
                            "1519389950473-47ba0277781c",
                            "1498050108023-c5249f4df085",
                            "1504639725590-34d0984388bd",
                            "1451187580459-43490279c0fa"
                        ][idx % 6]}?auto=format&fit=crop&w=600&q=80`,
                        tech: repo.language ? [repo.language] : ["Code"],
                        url: repo.html_url
                    }));

                    setProjects(formattedProjects);
                }
            } catch (error) {
                console.error("Error fetching repos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Split projects into 3 parts for the columns
    const col1 = projects.filter((_, i) => i % 3 === 0);
    const col2 = projects.filter((_, i) => i % 3 === 1);
    const col3 = projects.filter((_, i) => i % 3 === 2);

    return (
        <section className={`py-20 flex justify-center w-full px-6 overflow-hidden ${isDark ? 'bg-[#0f0f14]' : 'bg-[#F5F1E8]'}`}>
            {/* 3 columns side by side like a showcase wall */}
            <div className="flex flex-col items-center">
                <h2 className={`text-4xl md:text-5xl font-black mb-12 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    My <span className="text-red-600">Projects</span>
                </h2>

                {loading ? (
                    <div className="h-[800px] flex items-center justify-center">
                        <p className={`animate-pulse ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Fetching repositories...</p>
                    </div>
                ) : (
                    <div className="flex gap-6 justify-center w-full max-w-7xl h-[800px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                        <ProjectsColumn className="hidden md:flex flex-col" projects={col1} duration={35} />
                        <ProjectsColumn className="flex flex-col mt-10" projects={col2} duration={30} />
                        <ProjectsColumn className="hidden lg:flex flex-col mt-20" projects={col3} duration={40} />
                    </div>
                )}
            </div>
        </section>
    )
}
