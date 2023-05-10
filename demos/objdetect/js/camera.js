async function setupWebcam(videoEl, autoplay) {
  // iOS safari requires https to enable webcam
  // Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
  // Working solution https://codepen.io/s5b/project/editor/ZmqneL
  // These must be here or there will be no webcam feed   
  videoEl.setAttribute('autoplay', '');
  videoEl.setAttribute('muted', '');
  videoEl.setAttribute('playsinline', '')

  const constraints = {
    audio: false,
    video: {
      // 'environment'/'user' for back/front camera
      facingMode: 'environment'
    }
  }

  const webcamStream = await navigator.mediaDevices.getUserMedia(constraints)
  
  if (webcamStream) {
    if ('srcObject' in videoEl) {
      videoEl.srcObject = webcamStream
    } else {
      videoEl.src = URL.createObjectURL(webcamStream)
    }

    if (autoplay) {
      videoEl.play()
    }
  } else {
    throw new Error('Failed to get webcamStream')
  }
}

function takeSnapshot(videoEl, canvasEl) {
  // webcam captures 640x480 intrinsically
  // const w = videoEl.videoWidth
  // const h = videoEl.videoHeight

  // Use actual video element width height instead webcam intrinsic
  const w = videoEl.getBoundingClientRect().width
  const h = videoEl.getBoundingClientRect().height

  // Set canvas height to videoEl w, h
  canvasEl.width = w
  canvasEl.height = h

  const ctx = canvasEl.getContext('2d')
  // Clear canvas
  ctx.fillRect(0, 0, w, h)
  // Draw webcam capture. Will draw what's shown in video element
  // and reproduce in canvas with w x h
  ctx.drawImage(videoEl, 0, 0, w, h)
}

export {
  takeSnapshot,
  setupWebcam
}