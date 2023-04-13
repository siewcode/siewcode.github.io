export default function App() {
  return `
    <div id="app" class="app">
      <header class="shadow-md">
        <div class="top-nav-bar">
          <nav class="back-btn not-visible" id="back-btn">
            <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none"/><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/>
            </svg>
            <span>Back</span>
          </nav>
          <span class="top-nav-bar-title" id="top-nav-bar-title"></span>
        </div>
      </header>

      <main>
        <section id="home-view" class="views display-none"></section>
        <section id="more-view" class="views display-none"></section>
      </main>
    </div>

    <!-- Modals -->
    <div id="splashscreen" class="modal splashscreen display-none"></div>
    <div id="watch-modal" class="modal watch-modal display-none"></div>
  `
}