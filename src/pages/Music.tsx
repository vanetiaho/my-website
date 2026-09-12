import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { motion } from 'framer-motion'
import { music } from '@/config/site'
import Vinyl from '@/components/Vinyl/Vinyl'
import { toSpotifyEmbedUrl, toSpotifyUri } from '@/lib/spotify'
import {
  loadSpotifyIframeApi,
  type SpotifyEmbedController,
} from '@/lib/spotifyIframeApi'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'
import { SpotifyIcon } from '@/components/icons/SocialIcons'

type PlayerSource = 'spotify' | 'local' | null

export default function Music() {
  const uri = toSpotifyUri(music.featuredSpotifyUrl)
  const embedUrl = toSpotifyEmbedUrl(music.featuredSpotifyUrl)

  // ---------------------------------------------------------
  // Refs
  // ---------------------------------------------------------

  // Spotify
  const containerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)

  // Local MP3
  const audioRef = useRef<HTMLAudioElement>(null)

  /*
   * IMPORTANT:
   * This ref always contains the current player source.
   *
   * We use a ref instead of relying only on React state because
   * Spotify and HTML audio can fire play/pause events almost
   * simultaneously when switching between them.
   */
  const playerSourceRef = useRef<PlayerSource>(
    uri ? 'spotify' : null
  )

  // ---------------------------------------------------------
  // State
  // ---------------------------------------------------------

  const [playerReady, setPlayerReady] = useState(false)
  const [apiFailed, setApiFailed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerSource, setPlayerSource] = useState<PlayerSource>(
    uri ? 'spotify' : null
  )

  // ---------------------------------------------------------
  // Helper: change active player
  // ---------------------------------------------------------

  const setActiveSource = (source: PlayerSource) => {
    playerSourceRef.current = source
    setPlayerSource(source)
  }

  // ---------------------------------------------------------
  // Spotify IFrame API
  // ---------------------------------------------------------

  useEffect(() => {
    if (!uri || !containerRef.current) return

    let cancelled = false

    loadSpotifyIframeApi()
      .then((IFrameAPI) => {
        if (cancelled || !containerRef.current) return

        IFrameAPI.createController(
          containerRef.current,
          {
            uri,
            width: '100%',
            height: 352,
          },
          (controller) => {
            if (cancelled) return

            controllerRef.current = controller
            setPlayerReady(true)

            controller.addListener(
              'playback_update',
              (event) => {
                const playing = !event.data.isPaused

                if (playing) {
                  /*
                   * Spotify started playing.
                   *
                   * Stop local audio first.
                   */
                  const audio = audioRef.current

                  if (audio && !audio.paused) {
                    audio.pause()
                  }

                  /*
                   * Set the source BEFORE updating isPlaying.
                   * This prevents the local pause event from
                   * accidentally stopping the vinyl.
                   */
                  setActiveSource('spotify')
                  setIsPlaying(true)

                  return
                }

                /*
                 * Spotify paused.
                 *
                 * Only stop the vinyl if Spotify is actually
                 * the active source.
                 *
                 * If we've already switched to a local track,
                 * ignore this Spotify pause event.
                 */
                if (playerSourceRef.current === 'spotify') {
                  setIsPlaying(false)
                }
              }
            )
          }
        )
      })
      .catch(() => {
        if (!cancelled) {
          setApiFailed(true)
          setPlayerReady(false)
        }
      })

    return () => {
      cancelled = true
      controllerRef.current = null
    }
  }, [uri])

  // ---------------------------------------------------------
  // Local MP3 events
  // ---------------------------------------------------------

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    const handlePlay = () => {
      /*
       * Local audio has started.
       *
       * Make local the active source BEFORE pausing Spotify.
       */
      setActiveSource('local')
      setIsPlaying(true)

      /*
       * Stop Spotify.
       *
       * Spotify may fire a playback_update event after this,
       * but that event will see that local is now active and
       * won't incorrectly stop the vinyl.
       */
      controllerRef.current?.pause()
    }

    const handlePause = () => {
      /*
       * Ignore this pause if Spotify has already become active.
       */
      if (playerSourceRef.current === 'local') {
        setIsPlaying(false)
      }
    }

    const handleEnded = () => {
      if (playerSourceRef.current === 'local') {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // ---------------------------------------------------------
  // Vinyl play / pause
  // ---------------------------------------------------------
  //
  // The vinyl controls whichever player is currently active.
  //
  // Spotify active:
  //   → control Spotify
  //
  // Local active:
  //   → control local MP3
  // ---------------------------------------------------------

  const handleVinylToggle = () => {
    // -------------------------------------------------------
    // Local favourite
    // -------------------------------------------------------

    if (
      playerSourceRef.current === 'local' &&
      audioRef.current
    ) {
      const audio = audioRef.current

      if (audio.paused) {
        /*
         * If the track already finished, restart it.
         */
        if (audio.ended) {
          audio.currentTime = 0
        }

        void audio.play()
      } else {
        audio.pause()
      }

      return
    }

    // -------------------------------------------------------
    // Spotify
    // -------------------------------------------------------

    if (
      playerSourceRef.current === 'spotify' &&
      controllerRef.current
    ) {
      controllerRef.current.togglePlay()
    }
  }

  // ---------------------------------------------------------
  // Favourite click
  // ---------------------------------------------------------

  const handleFavoriteClick = (
    event: MouseEvent<HTMLAnchorElement>,
    track: (typeof music.favorites)[number]
  ) => {
    /*
     * If there is no local MP3, let the anchor behave normally
     * and open the Spotify/profile URL.
     */
    if (!track.audioUrl) {
      return
    }

    event.preventDefault()

    const audio = audioRef.current

    if (!audio) return

    /*
     * IMPORTANT:
     * Make local the active source BEFORE pausing Spotify.
     *
     * This prevents Spotify's pause event from stopping the
     * vinyl after the local track has started.
     */
    setActiveSource('local')

    /*
     * Stop Spotify.
     */
    controllerRef.current?.pause()

    /*
     * Load the selected local MP3.
     */
    audio.src = track.audioUrl
    audio.currentTime = 0

    /*
     * Per-track volume.
     *
     * Example:
     *   volume: 1.0 → maximum
     *   volume: 0.55 → 55%
     */
    audio.volume = track.volume ?? 0.55

    /*
     * Start the selected favourite.
     */
    void audio.play().catch(() => {
      setIsPlaying(false)
    })
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:px-8">
      <p className="section-label mb-3">
        <span className="mr-1 inline-block align-[-6px] text-2xl">
          {PLANE_GLYPH}
        </span>
        now.playing
      </p>

      <h1 className="mb-10 text-3xl font-bold sm:text-4xl">
        Sounds from{' '}
        <span className="text-gradient-sunset">the cockpit</span>
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* -------------------------------------------------- */}
        {/* Vinyl */}
        {/* -------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Vinyl
            spinning={isPlaying}
            onToggle={handleVinylToggle}
            loading={
              !!uri &&
              !playerReady &&
              !apiFailed
            }
          />

          <p className="mt-4 text-center text-sm text-neutral-500">
            {playerSource === 'local'
              ? 'Click the record to play or pause, right here.'
              : uri
                ? 'Click the record to play or pause, right here.'
                : 'Add a Spotify link to play a track right here.'}
          </p>

          <a
            href={music.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-sm text-neutral-200 hover:border-sunset-amber/60 hover:text-sunset-gold"
          >
            Follow on <SpotifyIcon className="h-4 w-4" />
          </a>
        </motion.div>

        {/* -------------------------------------------------- */}
        {/* Player + Favorites */}
        {/* -------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          {/* ---------------------------------------------- */}
          {/* Spotify Embed */}
          {/* ---------------------------------------------- */}

          {uri && !apiFailed && (
            <div
              ref={containerRef}
              className="mb-10 w-full overflow-hidden rounded-2xl"
            />
          )}

          {/* ---------------------------------------------- */}
          {/* Spotify fallback iframe */}
          {/* ---------------------------------------------- */}

          {uri && apiFailed && embedUrl && (
            <iframe
              className="mb-10 w-full rounded-2xl"
              src={embedUrl}
              width="100%"
              height="352"
              style={{
                borderRadius: 16,
                border: 0,
              }}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify player"
            />
          )}

          {/* ---------------------------------------------- */}
          {/* No Spotify configured */}
          {/* ---------------------------------------------- */}

          {!uri && (
            <div className="glass-panel mb-10 rounded-2xl p-6 text-sm text-neutral-500">
              Add a Spotify track, album, or playlist share link to{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sunset-amber">
                music.featuredSpotifyUrl
              </code>{' '}
              in{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">
                src/config/site.ts
              </code>{' '}
              to play the real thing here.
            </div>
          )}

          {/* ---------------------------------------------- */}
          {/* Hidden local audio player */}
          {/* ---------------------------------------------- */}

          <audio
            ref={audioRef}
            preload="metadata"
            className="hidden"
          />

          {/* ---------------------------------------------- */}
          {/* Favorites */}
          {/* ---------------------------------------------- */}

          <h2 className="section-label mb-4">
            <span className="mt-10 mr-1 inline-block align-[-6px] text-2xl">
              {PLANE_GLYPH}
            </span>
            favorites
          </h2>

          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-3 lg:overflow-visible lg:px-0">
            {music.favorites.map((track, i) => {
              const hasLocalAudio = Boolean(track.audioUrl)

              return (
                <a
                  key={i}
                  href={
                    hasLocalAudio
                      ? '#'
                      : track.spotifyUrl || music.profileUrl
                  }
                  target={
                    hasLocalAudio
                      ? undefined
                      : '_blank'
                  }
                  rel={
                    hasLocalAudio
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  onClick={(event) =>
                    handleFavoriteClick(event, track)
                  }
                  className="interactive glass-panel flex min-w-[220px] snap-start items-center gap-4 rounded-xl p-4 transition-transform hover:-translate-y-0.5 lg:min-w-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sunset-gradient font-mono text-sm font-bold text-base-950">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-200">
                      {track.title}
                    </p>

                    <p className="truncate text-xs text-neutral-500">
                      {track.artist}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
