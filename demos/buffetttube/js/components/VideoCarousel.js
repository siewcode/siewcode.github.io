import VideoCard from "./VideoCard.js"

export default function VideoCarousel (videoList) {

  function CarouselItems() {
    let carouselItems = ''
    for (let videoMeta of videoList) {
      const carouselItem = `
        <div class="scroll-carousel-item-container">
          ${VideoCard(videoMeta.id, videoMeta.title, 'md')}
        </div>
      `
      carouselItems += carouselItem
    }
    return carouselItems
  }
  
  return `
    <div class="scroll-carousel">
      ${CarouselItems()}
    </div>
  `
}