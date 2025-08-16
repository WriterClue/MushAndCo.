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

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-fade");

  carousels.forEach(root => {
    const slides = Array.from(root.querySelectorAll(".slides .item"));
    const btnL = root.querySelector(".carousel-btn.left");
    const btnR = root.querySelector(".carousel-btn.right");

    if (!slides.length) return;

    let current = 0;
    let animating = false;
    const DURATION = 350;

    const show = (nextIndex) => {
      if (animating || nextIndex === current) return;
      animating = true;

      const total = slides.length;
      const next = ((nextIndex % total) + total) % total;

      slides[next].classList.add("is-active");

      setTimeout(() => {
        slides[current].classList.remove("is-active");
        current = next;
        animating = false;
      }, DURATION);
    };

    btnL.addEventListener("click", () => show(current - 1));
    btnR.addEventListener("click", () => show(current + 1));
  });
});