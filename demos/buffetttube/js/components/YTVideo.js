export default function YTVideo(videoId) {
  // The default 560/315 = 16/9 aspect ratio
  return `
  <iframe 
    src="https://www.youtube.com/embed/${videoId}?modestbranding=1&autoplay=1&iv_load_policy=3&rel=0" 
    frameborder="0" 
    allowfullscreen
  >
  </iframe>
  `
}