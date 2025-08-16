// script.js

(function() {
  const content = document.querySelector('header .content');
  const blurOverlay = document.querySelector('header .overlay');
  const nav = document.querySelector('nav');
  let windowHeight = window.innerHeight;
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    const halfScroll = scrollY * 0.5;
    const blurOpacity = Math.min(1, scrollY * 2 / windowHeight);
    const contentOpacity = Math.max(0, 1.4 - scrollY / 400);

    content.style.transform = `translateY(${halfScroll}px)`;
    content.style.opacity = contentOpacity;

    blurOverlay.style.opacity = blurOpacity;

    nav.style.position = scrollY > windowHeight ? 'fixed' : 'absolute';
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  const onResize = () => {
    windowHeight = window.innerHeight;
  };

  function init() {
    // Sync overlay with header background
    blurOverlay.style.backgroundImage =
      getComputedStyle(document.querySelector('header')).backgroundImage;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Respect users' motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      content.style.transition = 'none';
      blurOverlay.style.transition = 'none';
      return;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
