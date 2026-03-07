"use client"

import React from "react"
import { motion } from "motion/react"

export const ProjectsColumn = (props) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{ translateY: "-50%" }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2).fill(0)].map((_, index) => (
                    <React.Fragment key={index}>
                        {props.projects.map(({ title, description, image, tech, url }, i) => (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={i}
                                className="block p-8 rounded-3xl border shadow-lg max-w-xs w-full bg-white/5 border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:border-red-500/50 cursor-pointer group"
                            >
                                <img
                                    src={image}
                                    alt={title}
                                    className="rounded-xl mb-4 w-full h-40 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                />

                                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-red-500 transition-colors">{title}</div>

                                <p className="opacity-70 text-sm mt-2 text-gray-700 dark:text-gray-300">
                                    {description}
                                </p>

                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {tech.map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-2 py-1 border rounded-md border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 group-hover:border-red-500/30 transition-colors"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </a>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    )
}
