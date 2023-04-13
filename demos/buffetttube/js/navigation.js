import { 
  addClassToId, removeClassFromId, addClassToAllClass,
  addEventListenerToId, addEventListenerToClass
} from './utils.js'

import Home from './components/Home.js'
import More from './components/More.js'
import WatchModal from './components/WatchModal.js'
import Splashscreen from './components/Splashscreen.js'


/*
  Helpers
*/

function hideAllViews() {
  addClassToAllClass('views', 'display-none')
}

function showView(id) {
  removeClassFromId(id, 'display-none')
}

function hideBackButton() {
  addClassToId('back-btn', 'not-visible')
}

function showBackButton() {
  removeClassFromId('back-btn', 'not-visible')
}

function setTopNavBarTitle(text) {
  const title = document.getElementById('top-nav-bar-title')
  title.innerHTML = text
}

/**
 * View Creation
 */

async function loadHome() {
  const homeView = document.getElementById('home-view')
  homeView.innerHTML = await Home()

  // Add event listener to back button
  addEventListenerToId('back-btn', 'click', backBtnClick)

  // Add event listener to all carousel title
  addEventListenerToClass('more-view-link', 'click', moreViewClick)

  // Add open modal to every video card
  addEventListenerToClass('video-thumbnail', 'click', videoThumbnailClick)
}

async function loadMore(category) {
  const moreView = document.getElementById('more-view')
  moreView.innerHTML = await More(category)

  // Add open modal to every video card
  addEventListenerToClass('video-thumbnail', 'click', videoThumbnailClick)
}

function openWatchModal(videoId, title) {
  const modal = document.getElementById('watch-modal')
  modal.innerHTML = WatchModal(videoId, title)
  modal.classList.remove('display-none')

  // Add event listener to close button after WatchModal has been created
  addEventListenerToId('close-modal-btn', 'click', closeModalClick)
}

function closeWatchModal() {
  const modal = document.getElementById('watch-modal')
  modal.classList.add('display-none')
  // Clear content so iframe don't keep playing
  modal.innerHTML = ''
}

function showSplashScreen(seconds) {
  const splash = document.getElementById('splashscreen')
  splash.innerHTML = Splashscreen()
  splash.classList.remove('display-none')
  if (seconds > 0) {
    setTimeout(hideSplashScreen, seconds * 1000)
  }
}

function hideSplashScreen() {
  const splash = document.getElementById('splashscreen')
  splash.classList.add('display-none')
  splash.innerHTML = ''
}


/**
 * Events
 */

async function backBtnClick() {
  await navigateHome()
}

async function moreViewClick(event) {
  // event.target is the elem that triggered the event
  // event.currentTarget is the elem that has the event listener attached
  // Get data attr
  const category = event.currentTarget.dataset.category
  // Always fresh load
  await navigateMore(category)
}

function videoThumbnailClick(event) {
  const videoId = event.currentTarget.dataset.videoId
  const title = event.currentTarget.alt
  openWatchModal(videoId, title)
} 

function closeModalClick() {
  closeWatchModal()
}

/*
  Navigation
*/ 

async function navigateHome() {
  if (window.state.firstHomeLoad === true) {
    // Create home content if this is first time
    loadHome()
    window.state.firstHomeLoad = false
  }
  hideAllViews()
  hideBackButton()
  setTopNavBarTitle('BuffettTube')
  showView('home-view')
}

async function navigateMore(category) {
  // Always load More
  loadMore(category)
  hideAllViews()
  showBackButton()
  setTopNavBarTitle(category)
  showView('more-view')
}

export {
  navigateHome,
  navigateMore,
  openWatchModal,
  closeWatchModal,
  showSplashScreen,
  hideSplashScreen
}