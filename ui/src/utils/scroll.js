export function scrollTo (scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, offset)
    return
  }
  scrollTarget.scrollTop = offset
}

export function scrollToHorizontal (scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(offset, window.pageYOffset || window.scrollY || document.body.scrollTop || 0)
    return
  }
  scrollTarget.scrollLeft = offset
}

export function getVerticalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0
    : scrollTarget.scrollTop
}

export function getHorizontalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
    : scrollTarget.scrollLeft
}

export function animVerticalScrollTo (el, to, duration = 0 /* , prevTime */) {
  const prevTime = arguments[ 3 ] === void 0 ? performance.now() : arguments[ 3 ]
  const pos = getVerticalScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      scrollTo(el, to)
    }
    return
  }

  requestAnimationFrame(nowTime => {
    const frameTime = nowTime - prevTime
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime
    scrollTo(el, newPos)
    if (newPos !== to) {
      animVerticalScrollTo(el, to, duration - frameTime, nowTime)
    }
  })
}

export function animHorizontalScrollTo (el, to, duration = 0 /* , prevTime */) {
  const prevTime = arguments[ 3 ] === void 0 ? performance.now() : arguments[ 3 ]
  const pos = getHorizontalScrollPosition(el)

  if (duration <= 0) {
    if (pos !== to) {
      scrollToHorizontal(el, to)
    }
    return
  }

  requestAnimationFrame(nowTime => {
    const frameTime = nowTime - prevTime
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime
    setHorizontalScroll(el, newPos)
    if (newPos !== to) {
      animHorizontalScrollTo(el, to, duration - frameTime, nowTime)
    }
  })
}
