export interface MediaEmbed {
  type: 'vimeo' | 'youtube' | 'soundcloud'
  id: string
  url: string
}

export function detectMediaType(url: string): MediaEmbed | null {
  // Vimeo
  const vimeoMatch = url.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { type: 'vimeo', id: vimeoMatch[1], url }
  }

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/)
  if (ytMatch) {
    return { type: 'youtube', id: ytMatch[1], url }
  }

  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return { type: 'soundcloud', id: '', url }
  }

  return null
}

export function getEmbedUrl(media: MediaEmbed): string {
  switch (media.type) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${media.id}?background=0&autopause=0&dnt=1`
    case 'youtube':
      return `https://www.youtube.com/embed/${media.id}?rel=0`
    case 'soundcloud':
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(media.url)}&color=%232789c2&auto_play=false&show_comments=false`
    default:
      return media.url
  }
}

export function getVimeoBackgroundUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`
}
