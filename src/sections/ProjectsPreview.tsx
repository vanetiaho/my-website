import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { pinnedProjects } from '@/config/site'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

export default function ProjectsPreview() {
  const featured = pinnedProjects.slice(0, 3)

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="section-label mb-3">
            <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
            featured.work
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pinned <span className="text-gradient-sunset">projects</span>
          </h2>
        </div>
        <Link
          to="/projects"
          className="interactive hidden font-mono text-sm text-neutral-400 hover:text-sunset-gold sm:block"
        >
          View all ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <motion.a
            key={project.repo}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive group glass-panel relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="absolute inset-0 -z-10 bg-sunset-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
            <h3 className="mb-2 font-display text-lg font-semibold">{project.title}</h3>
            <p className="mb-4 text-sm text-neutral-400">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-sunset-amber"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>

      <Link
        to="/projects"
        className="interactive mt-8 block text-center font-mono text-sm text-neutral-400 hover:text-sunset-gold sm:hidden"
      >
        View all projects ↗
      </Link>
    </section>
  )
}
