/* SHS lightweight carousel: multi-across on desktop, 1-at-a-time swipe on phones.
   Expected markup:
     <div class="carousel" data-visible="3">
       <div class="carousel-viewport"><div class="carousel-track">
         <div class="carousel-slide"><img ...></div> ...
       </div></div>
       <button class="carousel-prev" aria-label="Previous photos">&#8249;</button>
       <button class="carousel-next" aria-label="Next photos">&#8250;</button>
       <div class="carousel-dots"></div>
     </div>
   data-visible sets desktop slides visible (default 3); phones always show 1. */
(function () {
  function visibleCount(el) {
    return window.innerWidth <= 700 ? 1 : parseInt(el.dataset.visible || "3", 10);
  }
  function init(car) {
    var track = car.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var prev = car.querySelector(".carousel-prev");
    var next = car.querySelector(".carousel-next");
    var dotsWrap = car.querySelector(".carousel-dots");
    var viewport = car.querySelector(".carousel-viewport");
    var idx = 0, vis = 3, maxIdx = 0, dots = [];
    function layout() {
      vis = visibleCount(car);
      maxIdx = Math.max(0, slides.length - vis);
      if (idx > maxIdx) idx = maxIdx;
      var w = 100 / vis;
      slides.forEach(function (s) { s.style.flex = "0 0 " + w + "%"; });
      dotsWrap.innerHTML = "";
      dots = [];
      for (var i = 0; i <= maxIdx; i++) {
        (function (i) {
          var d = document.createElement("button");
          d.className = "carousel-dot";
          d.type = "button";
          d.setAttribute("aria-label", "Go to slide " + (i + 1));
          d.addEventListener("click", function () { go(i); });
          dotsWrap.appendChild(d);
          dots.push(d);
        })(i);
      }
      go(idx);
    }
    function go(i) {
      idx = Math.max(0, Math.min(maxIdx, i));
      track.style.transform = "translateX(-" + idx * (100 / vis) + "%)";
      dots.forEach(function (d, j) { d.classList.toggle("active", j === idx); });
      prev.disabled = idx === 0;
      next.disabled = idx === maxIdx;
    }
    prev.addEventListener("click", function () { go(idx - 1); });
    next.addEventListener("click", function () { go(idx + 1); });
    var sx = null;
    viewport.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
    window.addEventListener("resize", layout);
    layout();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carousel").forEach(init);
  });
})();
