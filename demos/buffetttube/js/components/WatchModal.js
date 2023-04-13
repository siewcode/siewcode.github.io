import YTVideo from './YTVideo.js'

export default function WatchModal(videoId, title) {
  return `
    <header>
      <div id="close-modal-btn" class="close-btn">&times;</div>
    </header>
    <main>
      <div id="video-container" class="video-container">
        ${YTVideo(videoId, title)}
      </div>
    </main>
  `
}