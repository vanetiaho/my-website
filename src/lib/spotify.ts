/** Converts any open.spotify.com share URL into its embeddable player URL. */
export function toSpotifyEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('open.spotify.com')) return null
    const path = parsed.pathname.replace(/^\/+/, '')
    return `https://open.spotify.com/embed/${path}?utm_source=generator&theme=0`
  } catch {
    return null
  }
}

const SPOTIFY_URI_TYPES = ['track', 'album', 'playlist', 'episode', 'show', 'artist']

/** Converts any open.spotify.com share URL into a `spotify:type:id` URI, the
 *  form the Spotify iFrame Playback API needs to drive a controller. Handles
 *  locale-prefixed paths like /intl-en/track/... too. */
export function toSpotifyUri(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('open.spotify.com')) return null
    const segments = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/')
    const typeIndex = segments.findIndex((s) => SPOTIFY_URI_TYPES.includes(s))
    const id = typeIndex >= 0 ? segments[typeIndex + 1] : undefined
    if (typeIndex < 0 || !id) return null
    return `spotify:${segments[typeIndex]}:${id}`
  } catch {
    return null
  }
}
