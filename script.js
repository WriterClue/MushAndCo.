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

(function(){
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.container.second');
    const btnL  = wrapper.querySelector('.carousel-btn.left');
    const btnR  = wrapper.querySelector('.carousel-btn.right');
    const cards = track.querySelectorAll('.item');

    if (cards.length === 0) return;

    let currentIndex = 0;

    const getStep = () => {
      const w = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || 0);
      return w + gap;
    };

    const goTo = index => {
      currentIndex = (index + cards.length) % cards.length; // wrap around
      track.scrollTo({
        left: currentIndex * getStep(),
        behavior: 'smooth'
      });
    };

    btnL.addEventListener('click', () => goTo(currentIndex - 1));
    btnR.addEventListener('click', () => goTo(currentIndex + 1));

    // Drag to scroll still works, but syncs index
    let down=false, startX=0, startLeft=0;
    track.addEventListener('pointerdown', e => {
      down=true; startX=e.clientX; startLeft=track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', e => {
      if(!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    track.addEventListener('pointerup', () => {
      down=false;
      currentIndex = Math.round(track.scrollLeft / getStep());
      goTo(currentIndex); // snap to nearest card
    });
    track.addEventListener('pointercancel', () => down=false);

    // resize safety
    window.addEventListener('resize', () => goTo(currentIndex));