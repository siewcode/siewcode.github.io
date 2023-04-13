export default function VideoCard(videoId, videoTitle, size='md') {

  let cardSize = 'video-card-md'
  if (size === 'sm' || size === 'lg') {
    cardSize = `video-card-${size}`
  }

  return `  
    <div class="video-card ${cardSize} shadow">
      <img 
        class="video-thumbnail" 
        data-video-id="${videoId}"
        src="https://i.ytimg.com/vi/${videoId}/mqdefault.jpg" 
        alt="${videoTitle}"
      />
      <footer class="video-caption">
        ${videoTitle}
      </footer>
    </div>
  `
}