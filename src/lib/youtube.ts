export interface YoutubeVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  published: string
}

const CHANNEL_ID = 'UC4rltdhd9DYMKL6dCB3RLgQ'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

function decodeHtml(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

export async function getLatestVideos(count = 3): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 }, // 1시간 캐시
    })
    if (!res.ok) return []

    const xml = await res.text()
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? []

    return entries.slice(0, count).map(entry => {
      const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? ''
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? ''
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? ''

      return {
        id,
        title: decodeHtml(title),
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        published: published.slice(0, 10),
      }
    })
  } catch {
    return []
  }
}
