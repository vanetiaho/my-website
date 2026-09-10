import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile, socials } from '@/config/site'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: `https://github.com/${socials.github}` },
  { label: 'LinkedIn', href: `https://linkedin.com/in/${socials.linkedin}` },
  { label: 'Email', href: `mailto:${profile.email}` },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-16 pt-32 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">
            <span className="mr-1 inline-block align-[-3px] text-base">{PLANE_GLYPH}</span>
            contact.init()
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Let's build something <span className="text-gradient-sunset">great</span>
          </h1>
          <p className="mb-8 text-neutral-400">
            Have a project, a question, or just want to say hi? My inbox is always open.
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="interactive rounded-full border border-white/15 px-4 py-2 font-mono text-sm text-neutral-300 hover:border-sunset-amber/60 hover:text-sunset-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl p-6"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 text-3xl">{PLANE_GLYPH}</div>
              <h2 className="mb-1 text-xl font-semibold">Message sent!</h2>
              <p className="text-neutral-400">Your mail client should be open. Talk soon.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1 block font-mono text-xs text-neutral-400">
                  <span className="mr-1 inline-block align-[-2px] text-sm">{PLANE_GLYPH}</span>
                  name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="interactive w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-neutral-200 outline-none focus:border-sunset-amber/60"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block font-mono text-xs text-neutral-400">
                  <span className="mr-1 inline-block align-[-2px] text-sm">{PLANE_GLYPH}</span>
                  email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="interactive w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-neutral-200 outline-none focus:border-sunset-amber/60"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block font-mono text-xs text-neutral-400">
                  <span className="mr-1 inline-block align-[-2px] text-sm">{PLANE_GLYPH}</span>
                  message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  className="interactive w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-neutral-200 outline-none focus:border-sunset-amber/60"
                  placeholder="What's on your mind?"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-sunset-burnt">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="interactive w-full rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber px-6 py-3 font-mono text-sm font-medium text-base-950"
              >
                Send message {PLANE_GLYPH}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <footer className="mt-24 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center">
        <p className="font-mono text-xs text-neutral-500">
          {profile.name} {PLANE_GLYPH} {profile.callsign}
        </p>
        <p className="text-xs text-neutral-600">
          Built with a soft spot for golden hour. &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
