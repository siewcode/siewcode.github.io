const demoCarousel = document.getElementById('demo-carousel')

/*
  Components
 */

function ProjectCard({title, desc, imgSrc, demoLink}) {
  return `
  <div class="project-card">
    <img src="${imgSrc}" />
    <div class="text-container">
      <main>
        <h3>${title}</h3>
        <p>${desc}</p>
      </main>
      <footer>
        <a href="${demoLink}">Go</a>
      </footer>
    </div>
  </div>
  `
}

/*
  Init
 */
function generateDemoCarouselItems(carouselEl, projects) {
  let carouselItems = ''
  projects.forEach(project => {
    const carouselItem = `
      <article class="scroll-carousel-item-container">
        ${ProjectCard(project)}
      </article>
    `
    carouselItems += carouselItem
  })
  carouselEl.innerHTML = carouselItems
}

async function init() {
  // Fetch list of carousel items
  const projects = await fetch('../projects.json').then(r => r.json())
  generateDemoCarouselItems(demoCarousel, projects)
}

window.addEventListener('load', init)