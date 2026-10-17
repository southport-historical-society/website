/* SHS carousel: one large photo at a time, with prev/next arrows, dots,
   a "photo N of M" counter, and touch swipe.
   Expected markup:
     <div class="carousel">
       <div class="carousel-viewport"><div class="carousel-track">
         <div class="carousel-slide"><img ...></div> ...
       </div></div>
       <button class="carousel-prev" aria-label="Previous photo">&#8249;</button>
       <button class="carousel-next" aria-label="Next photo">&#8250;</button>
       <div class="carousel-dots"></div>
     </div>
   NOTE: older markup may carry data-visible="3" from the previous multi-across
   design. It is intentionally ignored; this carousel always shows one photo. */
(function () {
  function init(car) {
    var track = car.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var prev = car.querySelector(".carousel-prev");
    var next = car.querySelector(".carousel-next");
    var dotsWrap = car.querySelector(".carousel-dots");
    var viewport = car.querySelector(".carousel-viewport");
    if (!track || !slides.length || !prev || !next || !dotsWrap || !viewport) return;
    var idx = 0;
    var maxIdx = slides.length - 1;
    var dots = [];
    var count = document.createElement("div");
    count.className = "carousel-count";
    count.setAttribute("aria-live", "polite");
    dotsWrap.parentNode.insertBefore(count, dotsWrap.nextSibling);
    for (var i = 0; i <= maxIdx; i++) {
      (function (i) {
        var d = document.createElement("button");
        d.className = "carousel-dot";
        d.type = "button";
        d.setAttribute("aria-label", "Go to photo " + (i + 1));
        d.addEventListener("click", function () { go(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      })(i);
    }
    function go(i) {
      idx = Math.max(0, Math.min(maxIdx, i));
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dots.forEach(function (d, j) { d.classList.toggle("active", j === idx); });
      count.textContent = "Photo " + (idx + 1) + " of " + slides.length;
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
    go(0);
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carousel").forEach(init);
  });
})();
