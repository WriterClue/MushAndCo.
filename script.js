// Based on the Scroller function
var $content = $('header .content'),
    $blur    = $('header .overlay'),
    wHeight  = $(window).height();

$(window).on('resize', function(){
  wHeight = $(window).height();
});

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback){ window.setTimeout(callback, 1000 / 60); };
})();

function Scroller() {
  this.latestKnownScrollY = 0;
  this.ticking = false;
}

Scroller.prototype = {
  init: function() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    $blur.css('background-image',$('header:first-of-type').css('background-image'));
  },
  onScroll: function() {
    this.latestKnownScrollY = window.scrollY;
    this.requestTick();
  },
  requestTick: function() {
    if( !this.ticking ) {
      window.requestAnimFrame(this.update.bind(this));
    }
    this.ticking = true;
  },
  update: function() {
    var currentScrollY = this.latestKnownScrollY;
    this.ticking = false;

    var slowScroll = currentScrollY / 2,
        blurScroll = currentScrollY * 2,
        opaScroll = 1.4 - currentScrollY / 400;

    if(currentScrollY > wHeight)
      $('nav').css('position','fixed');
    else
      $('nav').css('position','absolute');

    $content.css({
      'transform': 'translateY(' + slowScroll + 'px)',
      'opacity': opaScroll
    });

    $blur.css({ 'opacity': blurScroll / wHeight });
  }
};

var scroller = new Scroller();
scroller.init();

/*---- script arrows----*/

<script>
(function(){
  const carousels = document.querySelectorAll('.carousel-fade');

  carousels.forEach(root => {
    const track = root.querySelector('.slides');
    const slides = Array.from(root.querySelectorAll('.slides .item'));
    const btnL = root.querySelector('.carousel-btn.left');
    const btnR = root.querySelector('.carousel-btn.right');

    if (!track || slides.length === 0) return;

    let current = 0;
    let animating = false;
    const DURATION = 350; // must match CSS .35s

    // Ensure only first is active on start
    slides.forEach((s, i) => s.classList.toggle('is-active', i === 0));
    // Set initial height to active slide
    const setHeightToActive = () => {
      const active = slides[current];
      // Temporarily ensure it can be measured
      const h = active.offsetHeight;
      track.style.height = h + 'px';
    };
    setHeightToActive();

    // Show slide by index (infinite wrap)
    const show = (nextIndex) => {
      if (animating || nextIndex === current) return;
      animating = true;

      const total = slides.length;
      const next = ((nextIndex % total) + total) % total;
      const prevSlide = slides[current];
      const nextSlide = slides[next];

      // Prepare height animation
      const nextH = nextSlide.offsetHeight;
      track.style.height = track.offsetHeight + 'px'; // lock current height
      void track.offsetWidth; // force reflow
      track.style.height = nextH + 'px';

      // Crossfade: bring next on top, then remove prev
      nextSlide.classList.add('is-active');

      // After fade, clean up
      setTimeout(() => {
        prevSlide.classList.remove('is-active');
        current = next;
        animating = false;
      }, DURATION + 40);
    };

    // Buttons
    if (btnL) btnL.addEventListener('click', () => show(current - 1));
    if (btnR) btnR.addEventListener('click', () => show(current + 1));

    // Resize: keep height correct
    let resizeTO;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(() => setHeightToActive(), 100);
    });

    // Optional: swipe/drag support
    let down = false, startX = 0;
    track.addEventListener('pointerdown', e => {
      down = true; startX = e.clientX;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointerup', e => {
      if (!down) return;
      down = false;
      const dx = e.clientX - startX;
      const threshold = 40; // minimal swipe distance
      if (dx > threshold)      show(current - 1);
      else if (dx < -threshold) show(current + 1);
    });
    track.addEventListener('pointercancel', () => down = false);