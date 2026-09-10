import { motion } from 'framer-motion'
import { profile, skillCategories } from '@/config/site'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <motion.p
        className="section-label mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        // about.me
      </motion.p>
      <motion.h2
        className="mb-10 text-3xl font-bold sm:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Flying steady since <span className="text-gradient-sunset">day one</span>
      </motion.h2>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="whitespace-pre-line text-neutral-400">{profile.bio}</p>
          <p className="mt-4 font-mono text-sm text-neutral-500">
            📍 {profile.location}
          </p>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive mt-6 inline-block rounded-full border border-white/15 px-5 py-2.5 font-mono text-sm text-neutral-200 hover:border-sunset-amber/60 hover:text-sunset-gold"
            >
              View resume ↗
            </a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              className="glass-panel rounded-2xl p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <h3 className="mb-4 font-mono text-sm uppercase tracking-wide text-sunset-amber">
                {cat.category}
              </h3>
              <ul className="space-y-3">
                {cat.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="mb-1 flex justify-between text-sm text-neutral-300">
                      <span>{skill.name}</span>
                      <span className="text-neutral-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-sunset-amber to-sunset-gold"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
