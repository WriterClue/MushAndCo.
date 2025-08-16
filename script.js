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

    const getStep = () => {
      const first = track.querySelector('.item');
      if(!first) return track.clientWidth * 0.9;
      const w = first.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || 0);
      return w + gap;
    };

    const updateButtons = () => {
      const max = track.scrollWidth - track.clientWidth - 1;
      btnL.disabled = track.scrollLeft <= 0;
      btnR.disabled = track.scrollLeft >= max;
    };

    const scrollByStep = dir => {
      track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
      setTimeout(updateButtons, 400);
    };

    btnL.addEventListener('click', () => scrollByStep(-1));
    btnR.addEventListener('click', () => scrollByStep(1));
    track.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    /* Drag to scroll (desktop) */
    let down=false, startX=0, startLeft=0;
    track.addEventListener('pointerdown', e => {
      down=true; startX=e.clientX; startLeft=track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', e => {
      if(!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    const stop=()=>down=false;
    track.addEventListener('pointerup', stop);
    track.addEventListener('pointercancel', stop);

    updateButtons();
  });
})();