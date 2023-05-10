const canvasEl = document.getElementById('canvas')
const videoEl = document.getElementById('video')
const detectBtn = document.getElementById('detectBtn')
const loadingScreen = document.getElementById('loading-screen')

function setLoadingScreen(state) {
  if (state == 'show') {
    loadingScreen.classList.add('show')
  } else if (state == 'hide') {
    loadingScreen.classList.remove('show')
  }}

function setDetectButton(state) {
  if (state == 'active') {
    detectBtn.querySelector('span').innerText = 'Detecting'
    detectBtn.classList.add('active')
  } else if (state == 'inactive') {
    detectBtn.querySelector('span').innerText = 'Detect'
    detectBtn.classList.remove('active')
  }
}

function clearCanvas() {
  const ctx = canvasEl.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function setupEventListeners() {
  // Nothing
  return
}

export {
  canvasEl, videoEl, detectBtn, loadingScreen,
  clearCanvas, setLoadingScreen, setDetectButton,
  setupEventListeners
}