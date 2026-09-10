import { motion } from 'framer-motion'
import { profile, fallbackSkills } from '@/config/site'
import { useGithubRepos } from '@/hooks/useGithubRepos'
import { languagesFromRepos } from '@/lib/github'

export default function About() {
  const { repos, status } = useGithubRepos()
  const languages = status === 'ready' ? languagesFromRepos(repos) : []
  const skills = languages.length > 0 ? languages : fallbackSkills

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
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl p-6 lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="mb-4 font-mono text-sm uppercase tracking-wide text-sunset-amber">
            {languages.length > 0 ? 'What I code in, per GitHub' : 'What I work with'}
          </h3>
          {status === 'loading' ? (
            <div className="flex h-16 items-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
            </div>
          ) : (
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
          )}
        </motion.div>
      </div>
    </section>
  )
}
