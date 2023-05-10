/**
 * MobileNet SSD (Single Shot Detection)
 * 
 * About
 * - SSD detects object in single passthrough instead of using moving window
 * - Uses Mobilenet to recognize object. And then SSD to localize it.
 * - ssd_mobilenet_v2 can detect 80 classes
 * 
 * Params
 * - Expects a single batch of 1024x768 RGB image i.e tensor of 
 * [1, 768, 1024 3]. Uses height x width standard
 * - Output bounding boxes [y1, x1, y2, x2]
 */

// Classes labels
const CLASSES = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "unused",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "unused",
  "backpack",
  "umbrella",
  "unused",
  "unused",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "unused",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "unused",
  "dining table",
  "unused",
  "unused",
  "toilet",
  "unused",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "unused",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];

async function loadModel() {
  const MODELURL = "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1"
  await tf.ready()
  const model = await tf.loadGraphModel(MODELURL, {fromTFHub: true})
  return model
}

// Classify single static image
async function classifyImage(model, canvasEl, imageEl, maxBoxes=5) {
  // fromPixels can read a canvas, an image and even video element
  const imgTensor = tf.browser.fromPixels(imageEl)
  
  // Will accept image of any size
  const t1 = tf.expandDims(imgTensor, 0)
  // console.log(`Shape: ${t1.shape}, rank: ${t1.rank}, dtype: ${t1.dtype}`)

  // Use Mobilenet SSD to detect and localise objects
  const results = await model.executeAsync(t1)

  // Draw boxes and labels around detected objects
  await drawBoundingBoxes(canvasEl, imageEl, results, maxBoxes, false)

  // Cleanup
  tf.dispose([
    imgTensor,
     t1,
    results
  ])
}

// Classify a video image
// To make it run continously, tie to requestAnimationFrame
async function classifyVideo(model, canvasEl, videoEl, maxBoxes=5) {
  // fromPixels can also extract from video stream
  const imgTensor = tf.browser.fromPixels(videoEl)
  const t1 = tf.expandDims(imgTensor, 0)
  const results = await model.executeAsync(t1)
  // Set isVideo to true to extract clientHeight vs height
  await drawBoundingBoxes(canvasEl, videoEl, results, maxBoxes, true)

  // Cleanup
  tf.dispose([
    imgTensor,
    t1,
    results
  ])

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  if (window.appState.detectOn) {
    // Only add to loop if detect is on
    // Don't assign window.appState.animId again
    requestAnimationFrame(() => {
      classifyVideo(model, canvasEl, videoEl, maxBoxes)
    })
  }
}

// Helpers
async function drawBoundingBoxes(canvasEl, imageEl, results, maxBoxes, isVideo) {
  /**
   * results - Output from mobilenet ssd predictions
   * 
   * results[0] - n x 90
   * - [1, n, 90] means there were n objects detected with probability for 
   * each 90 classes (80 actual, 10 not used)
   * 
   * results[1] - n x 4
   * - [1, n, 4] provide bounding boxes for each detection
   */
  
  // STEP 1 - Get Top Predicted Class for Each Detection
  // Get top prediction for every detection [1, n, 1]
  // topk defaults to 1. Returns idx and prob of class
  const topDetections = tf.topk(results[0])
  const topProb = topDetections.values.squeeze()
  const boundingBoxes = results[1].squeeze()

  // Convert results to JS array in parallel
  const [allTopIndices, scores, bounds] = await Promise.all([
    topDetections.indices.data(),
    topProb.array(),
    boundingBoxes.array()
  ])
  
  // STEP 2 - Remove Overlapping Boxes
  // Apply Non Maximum Suppression to remove boxes that are too closed
  // NMS automatically grab highest scoring box and remove similar boxes
  // with IoU over designated level
  const PROBTHRESHOLD = 0.4  // Detection confidence
  const IOUTHRESHOLD = 0.5  // Box overlap

  // Use tf built-in method to run NMS
  const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
    boundingBoxes,  // shape [numBoxes, 4]
    topProb,  // shape [numBoxes]
    maxBoxes,  // stop making boxes when this number is hit
    IOUTHRESHOLD,  // allowed overlap value 0 to 1
    PROBTHRESHOLD,  // Min prob score allowed
    1  // 0 is normal NMS, 1 is max Soft-NMS for overlapping support
  )
  // Return JS array of indexes of boxes that survive NMS
  const finalBoxIndices = await nmsDetections.selectedIndices.data()

  // Clean up tensors
  tf.dispose([
    topDetections.indices,
    topDetections.values,
    boundingBoxes,
    topProb,  
    nmsDetections.selectedIndices,
    nmsDetections.selectedScores
  ])

  // STEP 3 - Draw Bounding Boxes on Canvas
  // Set canvas dims
  let imageWidth, imageHeight
  if (isVideo) {
    // If using snap from webcam, use clientWidth
    imageWidth = imageEl.clientWidth
    imageHeight = imageEl.clientHeight
  } else {
    imageWidth = imageEl.width
    imageHeight = imageEl.height
  }
  canvasEl.width = imageWidth
  canvasEl.height = imageHeight
  const ctx = canvasEl.getContext('2d')

  // Clear before redrawing
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)  
  
  // Draw bounding boxes and text overlay
  finalBoxIndices.forEach( idx => {
    let LINEWIDTH = 2
    let TEXTSIZE = 12
    let TEXTPAD = 2
    if (imageWidth > 768) {
      // Deal with desktop screen
      LINEWIDTH = 4
      TEXTSIZE= 16
      TEXTPAD = 4
    }

    // Class and confidence score
    const detectedIndex = allTopIndices[idx]
    const detectedClass = CLASSES[detectedIndex]
    const detectedScore = scores[idx]
    const dBox = bounds[idx]
  
    // No negative values for start positions
    const startY = dBox[0] > 0 ? dBox[0] * imageHeight : 0
    const startX = dBox[1] > 0 ? dBox[1] * imageWidth : 0
    const height = (dBox[2] - dBox[0]) * imageHeight
    const width = (dBox[3] - dBox[1]) * imageWidth

    // Draw bounding boxes canvas
    ctx.strokeStyle = '#0F0'
    ctx.lineWidth = LINEWIDTH
    // Draw under existing content
    ctx.globalCompositeOperation='destination-over'
    ctx.strokeRect(startX, startY, width, height)
    
    // Draw label background
    ctx.fillStyle = '#0B0'
    ctx.font = `${TEXTSIZE}px sans-serif`
    ctx.textBaseline = 'top'
    // Draw over existing content
    ctx.globalCompositeOperation='source-over'
    const textHeight = TEXTSIZE
    const textPad = TEXTPAD
    const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`
    const textWidth = ctx.measureText(label).width
    ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad)

    // Draw text last to ensure its on top
    ctx.fillStyle = '#000000'
    ctx.fillText(label, startX, startY)
  })

}

export {
  loadModel,
  classifyImage,
  classifyVideo
}