import type { Link } from '@holi/core/screens/posts/types'

const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/

export const isYoutubeUrl = (url: string): boolean => {
  return YOUTUBE_REGEX.test(url)
}

export const getYoutubeVideoId = (url: string): string | null => {
  const match = url.match(YOUTUBE_REGEX)
  return match ? match[1] : null
}

export const enhanceYoutubeLinkPreview = (link: Link): Link => {
  if (!isYoutubeUrl(link.requestedUrl)) {
    return link
  }

  const videoId = getYoutubeVideoId(link.requestedUrl)
  if (!videoId) {
    return link
  }

  // Use YouTube's thumbnail API to get high quality thumbnails
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return {
    ...link,
    type: 'video',
    siteName: 'YouTube',
    origin: 'youtube.com',
    image: thumbnailUrl,
    // If the backend didn't provide a good title/description, use the video ID as fallback
    title: link.title || `YouTube Video (${videoId})`,
    description: link.description || 'Watch on YouTube',
  }
}
