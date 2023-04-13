import { fetchJson } from '../utils.js'
import VideoCard from "./VideoCard.js"

export default async function More(category) {
  const DATADIR = 'data'
  
  // Fetch metadata for videos
  const videoMeta = await fetchJson(`${DATADIR}/videos.json`)
  
  function filterVideosByTag(videoList, tag) {
    return videoList.filter( video => video.tags.includes(tag) )
  }

  function VideoCards(videoList) {  
    let videoCards = ''
    for (let videoMeta of videoList) {
      videoCards += VideoCard(videoMeta.id, videoMeta.title, 'md')
    }
    return videoCards
  }
        
  const vidsToShow = filterVideosByTag(videoMeta, category)
  return `
    <div class="video-grid">
      ${VideoCards(vidsToShow)}
    </div>
  `
}