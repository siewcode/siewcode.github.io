/** Return MenuItem component */
function MenuItem(menu) {
  const {imgfile, alt, title, description, price} = menu

  return `
    <div class="scroll-carousel-item-container">
      <div class="menu-item">
        <div class="image-container">
          <img src="assets/images/${imgfile}" alt=${alt} />
        </div>
        <div class="text-container card">
          <h3>${title}</h3>
          <p>${description}</p>
          <small>$${price}</small>
        </div>
      </div>
    </div>
  `
}


/** Generate list of MenuItem and attach to carousel component */
function generateMenuItems(menu, carouselId) {
  const carousel = document.getElementById(carouselId)

  // Must initialize to empty string
  let html = ''
  menu.forEach(menuItem => {
    html += MenuItem(menuItem)
  })
  
  carousel.innerHTML = html
}


/** Main */
async function main() {
  const menuAllTime = await fetch('data/menu-all-time.json').then(resp => resp.json())
  const menu = await fetch('data/menu.json').then(resp => resp.json())

  // Populate menus
  generateMenuItems(menuAllTime, 'menu-all-time-carousel')
  generateMenuItems(menu, 'menu-carousel')
}

main()