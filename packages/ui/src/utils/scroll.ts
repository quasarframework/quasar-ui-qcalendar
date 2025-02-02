/* global window document requestAnimationFrame */

type ScrollTarget = Window | HTMLElement

export function scrollTo(el: ScrollTarget, position: number): void {
  if (el instanceof Window) {
    el.scrollTo({ top: position, behavior: 'instant' })
  } else {
    el.scrollTop = position
  }
}

export function scrollToHorizontal(scrollTarget: ScrollTarget, offset: number): void {
  if (scrollTarget instanceof Window) {
    // Handle window scrolling
    window.scrollTo({
      left: offset,
      top: window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0,
      behavior: 'instant', // Optional: Use 'smooth' for smooth scrolling
    })
  } else {
    // Handle element scrolling
    scrollTarget.scrollLeft = offset
  }
}

export function getVerticalScrollPosition(scrollTarget: ScrollTarget): number {
  return scrollTarget instanceof Window ? scrollTarget.scrollY : scrollTarget.scrollTop
}

export function getHorizontalScrollPosition(scrollTarget: ScrollTarget): number {
  if (scrollTarget instanceof Window) {
    // Handle window scrolling
    return window.pageXOffset || window.scrollX || document.documentElement.scrollLeft || 0
  } else {
    // Handle element scrolling
    return (scrollTarget as HTMLElement).scrollLeft
  }
}

export function animVerticalScrollTo(
  el: ScrollTarget,
  to: number,
  duration = 500,
  startTime: number = performance.now(),
  startPos: number = getVerticalScrollPosition(el),
): void {
  // Early exit if duration is <= 0 or already at the target position
  if (duration <= 0 || startPos === to) {
    scrollTo(el, to)
    return
  }

  requestAnimationFrame((nowTime) => {
    const timeElapsed = nowTime - startTime
    const progress = Math.min(timeElapsed / duration, 1) // Progress between 0 and 1

    // Easing function for smooth animation (easeInOutQuad)
    const ease = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    // Calculate new position
    const newPos = startPos + (to - startPos) * ease(progress)

    // Scroll to the new position
    scrollTo(el, newPos)

    // Continue animation if not yet complete
    if (progress < 1) {
      animVerticalScrollTo(el, to, duration, startTime, startPos)
    }
  })
}

export function animHorizontalScrollTo(
  element: HTMLElement, // The container element to scroll
  targetScrollLeft: number, // The target horizontal scroll position
  duration = 500, // Duration of the animation in milliseconds
): void {
  const startScrollLeft = element.scrollLeft // Current scroll position
  const distance = targetScrollLeft - startScrollLeft // Distance to scroll
  let startTime: number | null = null

  // Animation function using requestAnimationFrame
  function animateScroll(currentTime: number): void {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1) // Progress between 0 and 1

    // Ease-in-out function for smooth scrolling
    const ease = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    // Update the scroll position
    element.scrollLeft = startScrollLeft + distance * ease(progress)

    // Continue the animation until the duration is complete
    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll)
    }
  }

  // Start the animation
  requestAnimationFrame(animateScroll)
}
