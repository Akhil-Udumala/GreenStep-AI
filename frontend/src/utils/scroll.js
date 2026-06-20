/**
 * Smooth scroll utility for GreenStep AI.
 *
 * Provides a custom easeInOutQuad animation that scrolls the viewport
 * to a target element more gracefully than the native `behavior: 'smooth'`,
 * which has inconsistent cross-browser durations.
 *
 * @module scroll
 */

/**
 * Smoothly scrolls the viewport to a target DOM element over a given duration.
 *
 * @param {Element|null} element - The DOM element to scroll into view.
 * @param {number} [duration=1200] - Animation duration in milliseconds.
 * @param {number} [topOffset=48] - Pixels of space to leave above the element.
 */
export const slowSmoothScrollTo = (element, duration = 1200, topOffset = 48) => {
  if (!element) return;

  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - topOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  /** @param {number} t elapsed  @param {number} b start  @param {number} c change  @param {number} d duration */
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    window.scrollTo(0, easeInOutQuad(elapsed, startPosition, distance, duration));
    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      window.scrollTo(0, targetPosition);
    }
  };

  requestAnimationFrame(animate);
};
