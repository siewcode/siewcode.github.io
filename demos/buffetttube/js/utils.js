async function fetchJson(path) {
  const resp = await fetch(path)
  const json_data = await resp.json()
  return json_data
}

function addEventListenerToId(id, eventType, func) {
  const el = document.getElementById(id)
  el.addEventListener(eventType, func)
}

function addEventListenerToClass(className, eventType, func) {
  const allEl = document.getElementsByClassName(className)
  Array.from(allEl).forEach(el => el.addEventListener(eventType, func))
}

function addClassToId(elementId, className) {
  const el = document.getElementById(elementId)
  el.classList.add(className)
}

function removeClassFromId(elementId, className) {
  const el = document.getElementById(elementId)
  el.classList.remove(className)
}

function addClassToAllClass(elClass, className) {
  const allEl = document.getElementsByClassName(elClass)
  // Need to convert HTMLCollection to array first
  Array.from(allEl).forEach( el => el.classList.add(className))
}

function removeClassFromAllClass(elClass, className) {
  const allEl = document.getElementsByClassName(elClass)
  Array.from(allEl).forEach( el => el.classList.remove(className))
}

function addScrollEndListener(func) {
  // Triggers func when user scroll to bottom
  // Use this to implement infinite scroll

  function handleScrollEnd() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // you're at the bottom of the page
      func()
    }
  }
  window.addEventListener('scroll', handleScrollEnd)
}

export {
  fetchJson,
  addEventListenerToId,
  addEventListenerToClass,
  addClassToId,
  removeClassFromId,
  addClassToAllClass,
  removeClassFromAllClass,
  addScrollEndListener
}