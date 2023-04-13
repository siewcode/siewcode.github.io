import { fetchJson } from '../utils.js'
import VideoCarousel from "./VideoCarousel.js"

export default async function Home() {
  const DATADIR = 'data'

  // // Fetch metadata for videos and carousels
  const videoList = await fetchJson(`${DATADIR}/videos.json`)
  const carouselMeta = await fetchJson(`${DATADIR}/carousels.json`)

  function filterCarouselVideos(videoList, tag) {
    return videoList.filter( video => {
      // Get only video with matching main tag and onCrsl flag
      return ((video.tags[0] === tag) && video.onCrsl)
    })
  }

  function CarouselSections() {
    let carouselSections = ''
    for (let c of carouselMeta) {
      const vidsToShow = filterCarouselVideos(videoList, c.category)
      const carouselSection = `
        <section class="carousel-section">
          <h1
            class="carousel-section-title more-view-link"
            data-category="${c.category}"
          >
            ${c.carouselTitle} <span>&gt</span>
          </h1>
            ${VideoCarousel(vidsToShow)}
        </section>
      `
      carouselSections += carouselSection
    }
    return carouselSections
  }

  return `${CarouselSections()}`
}