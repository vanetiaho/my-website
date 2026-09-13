import { motion } from 'framer-motion'
import { profile, skills } from '@/config/site'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <motion.p
        className="section-label mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
        about.me
      </motion.p>
      <motion.h2
        className="mb-10 text-3xl font-bold sm:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Flying steady since <span className="text-gradient-sunset">day one</span>
      </motion.h2>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
        <motion.div
          className="flex justify-center lg:col-span-2"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-72 w-72 rounded-full object-cover ring-4 ring-sunset-amber/30 sm:h-80 sm:w-80"
          />
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="mb-3 font-mono text-sm text-neutral-500">📍 {profile.location}</p>
          <p className="whitespace-pre-line text-neutral-400">{profile.bio}</p>

          <div className="glass-panel mt-8 rounded-2xl p-6">
            <h3 className="mb-4 font-mono text-sm uppercase tracking-wide text-sunset-amber">
              What I work with
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  className="rounded-full bg-white/5 px-3.5 py-1.5 text-sm text-neutral-200"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
