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
