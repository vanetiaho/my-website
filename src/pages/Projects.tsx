import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/config/site'
import GithubCalendar from '@/components/GithubCalendar/GithubCalendar'

const ALL_TAGS = Array.from(new Set(projects.flatMap((p) => p.tags)))

export default function Projects() {
  const [filter, setFilter] = useState<string | null>(null)
  const visible = filter ? projects.filter((p) => p.tags.includes(filter)) : projects

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:px-8">
      <p className="section-label mb-3">// projects.list()</p>
      <h1 className="mb-10 text-3xl font-bold sm:text-4xl">
        Things I've <span className="text-gradient-sunset">built</span>
      </h1>

      <div className="mb-10">
        <p className="section-label mb-3">// github.activity</p>
        <GithubCalendar />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`interactive rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
            !filter
              ? 'bg-sunset-amber text-base-950'
              : 'bg-white/5 text-neutral-400 hover:text-white'
          }`}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`interactive rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
              filter === tag
                ? 'bg-sunset-amber text-base-950'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <motion.div
            key={project.id}
            className="glass-panel group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="absolute inset-0 -z-10 bg-sunset-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
            <h3 className="mb-2 font-display text-lg font-semibold">{project.title}</h3>
            <p className="mb-4 flex-1 text-sm text-neutral-400">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-sunset-amber"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 font-mono text-xs text-neutral-400">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive hover:text-sunset-gold"
                >
                  Source ↗
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive hover:text-sunset-gold"
                >
                  Live ↗
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
