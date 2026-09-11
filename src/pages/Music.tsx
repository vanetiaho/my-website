import { useState } from 'react'
import { motion } from 'framer-motion'
import { music } from '@/config/site'
import Vinyl from '@/components/Vinyl/Vinyl'
import { toSpotifyEmbedUrl } from '@/lib/spotify'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

export default function Music() {
  const [spinning, setSpinning] = useState(false)
  const embedUrl = toSpotifyEmbedUrl(music.featuredSpotifyUrl)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:px-8">
      <p className="section-label mb-3">
        <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
        now.playing
      </p>
      <h1 className="mb-10 text-3xl font-bold sm:text-4xl">
        Sounds from the <span className="text-gradient-sunset">cockpit</span>
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Vinyl
            spinning={spinning}
            onToggle={() => setSpinning(true)}
            href={music.featuredSpotifyUrl}
          />
          <p className="mt-4 text-center text-sm text-neutral-500">
            Click the record to open it on Spotify, or listen right here below.
          </p>

          {embedUrl ? (
            <iframe
              className="mt-8 w-full rounded-2xl"
              src={embedUrl}
              width="100%"
              height="352"
              style={{ borderRadius: 16, border: 0 }}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify player"
            />
          ) : (
            <div className="glass-panel mt-8 rounded-2xl p-6 text-sm text-neutral-500">
              Add a Spotify track, album, or playlist share link to{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sunset-amber">
                music.featuredSpotifyUrl
              </code>{' '}
              in <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">src/config/site.ts</code>{' '}
              to embed the real player here.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="section-label mb-4">
            <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
            favorites
          </h2>
          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-3 lg:overflow-visible lg:px-0">
            {music.favorites.map((track, i) => (
              <a
                key={i}
                href={track.spotifyUrl || music.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive glass-panel flex min-w-[220px] snap-start items-center gap-4 rounded-xl p-4 transition-transform hover:-translate-y-0.5 lg:min-w-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sunset-gradient font-mono text-sm font-bold text-base-950">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-200">{track.title}</p>
                  <p className="truncate text-xs text-neutral-500">{track.artist}</p>
                </div>
              </a>
            ))}
          </div>

          <a
            href={music.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-sm text-neutral-200 hover:border-sunset-amber/60 hover:text-sunset-gold"
          >
            Follow on Spotify ↗
          </a>
        </motion.div>
      </div>
    </div>
  )
}
