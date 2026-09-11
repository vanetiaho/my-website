export type SpotifyPlaybackUpdate = {
  data: {
    isPaused: boolean
    isBuffering: boolean
    duration: number
    position: number
  }
}

export type SpotifyEmbedController = {
  play: () => void
  pause: () => void
  togglePlay: () => void
  loadUri: (uri: string) => void
  addListener: (event: 'ready' | 'playback_update', cb: (e: SpotifyPlaybackUpdate) => void) => void
  removeListener: (event: string, cb?: (e: SpotifyPlaybackUpdate) => void) => void
}

type SpotifyIFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void
  }
}

let apiPromise: Promise<SpotifyIFrameAPI> | null = null

/** Loads Spotify's official embed Playback API once per page load, so a
 *  standard track/playlist embed can be driven programmatically (play,
 *  pause, listen for playback state) instead of only linking out. Never
 *  touches auth/tokens — this is the same public, no-login embed anyone
 *  gets from a Spotify share link. */
export function loadSpotifyIframeApi(): Promise<SpotifyIFrameAPI> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onSpotifyIframeApiReady
    window.onSpotifyIframeApiReady = (api) => {
      previousReady?.(api)
      resolve(api)
    }

    if (!document.querySelector('script[data-spotify-iframe-api]')) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      script.dataset.spotifyIframeApi = 'true'
      script.onerror = () => reject(new Error('Failed to load the Spotify embed API'))
      document.body.appendChild(script)
    }

    window.setTimeout(() => reject(new Error('Spotify embed API timed out')), 8000)
  })

  return apiPromise
}
