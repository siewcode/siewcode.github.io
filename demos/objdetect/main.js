import * as ui from './js/ui.js'
import { setupWebcam } from "./js/camera.js"
import { loadModel, classifyVideo } from "./js/mobnetssd.js"

// Global state (this is accessible from console)
window.appState = {
  animId: null,
  detectOn: false
}

// Wrapper to run mobilenetssd
async function runDetect(model, maxBoxes=5) {

  const cancelAnimationFrame =
    window.cancelAnimationFrame || 
    window.mozCancelAnimationFrame;

  if (!window.appState.animId) {
    window.appState.detectOn = true
    ui.setDetectButton('active')
    // No detection running so start one
    // Handle webGL occupying main loop issue
    setTimeout(() => {
      window.appState.animId = classifyVideo(
        model, ui.canvasEl, ui.videoEl, maxBoxes
      )
    }, 500)
    
    // classifyVideo(model, ui.canvasEl, ui.videoEl, 5)
  } else {
    window.appState.detectOn = false
    // Stop current detection
    cancelAnimationFrame(window.appState.animId)
    // Handle webGL occupying main loop issue
    setTimeout(() => {
      window.appState.animId = null
      ui.clearCanvas()
      ui.setDetectButton('inactive')
    }, 500)
  }
}

// Init
async function init() {

  // Check camera access. Skip app if failed
  try {
    // Don't autoplay webstream false
    await setupWebcam(ui.videoEl, false)
  } catch (err) {
    console.log(err)
    alert('Camera setup failed. App stopped')
    return
  }
  
  // Load model. Skip app if failed
  ui.setLoadingScreen('show')
  let model
  try {
    model = await loadModel()
  } catch (err) {
    console.log(err)
    alert('Error loading model. App stopped')
    ui.setLoadingScreen('hide')
    return
  }

  // Setup UI event listeners
  ui.setupEventListeners()

  // Add additional event listeners
  ui.detectBtn.addEventListener('click', () => runDetect(model))

  // Model loaded
  ui.setLoadingScreen('hide')

  // Start webcam feed. After setupWebcam, play() is available
  ui.videoEl.play()
}

window.addEventListener('load', init)