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

// JS: Carousel with arrows + dots
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".second");
  const items = document.querySelectorAll(".item");
  const prevBtn = document.querySelector(".arrow.prev");
  const nextBtn = document.querySelector(".arrow.next");
  const dotsContainer = document.querySelector(".dots");
  const toBeAdded = document.querySelector(".to-be-added");

  let page = 0;
  const totalPages = 2; // page 0 = original cards, page 1 = "to be added"

  // Create dots dynamically
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll("span");

  function updateView() {
    if (page === 0) {
      // Show original cards
      toBeAdded.style.display = "none";
      items.forEach((item, i) => { if (i < 3) item.style.display = "flex"; });
      prevBtn.disabled = true;
      nextBtn.disabled = false;
    } else {
      // Show "to be added" card
      toBeAdded.style.display = "flex";
      items.forEach((item, i) => { if (i < 3) item.style.display = "none"; });
      prevBtn.disabled = false;
      nextBtn.disabled = true;
    }

    // Update dots
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === page);
    });
  }

  // Arrow navigation
  prevBtn.addEventListener("click", () => {
    if (page > 0) {
      page--;
      updateView();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (page < totalPages - 1) {
      page++;
      updateView();
    }
  });

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      page = i;
      updateView();
    });
  });
});