import App from './components/App.js'
import { navigateHome, showSplashScreen } from './navigation.js'

window.state = {
  firstHomeLoad: true
}

async function init() {
  document.getElementById('root').innerHTML = App()
  showSplashScreen(2)
  await navigateHome()
}

// load is fired when whole page has loaded including dependent resources
// such as stylesheets, scripts, iframes and images
// This does not wait for the content in frames to load
window.addEventListener('load', init)