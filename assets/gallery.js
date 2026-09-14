(function () {
  function go() {
    var cur = 0;
    var imgs = Array.prototype.slice.call(document.querySelectorAll(".photos img"));
    if (!imgs.length) return;
    var open = false;
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<button id="lbClose" aria-label="Close">&times;</button>' +
      '<button class="lb-nav" id="lbPrev" aria-label="Previous photo">&#8249;</button>' +
      '<button class="lb-nav" id="lbNext" aria-label="Next photo">&#8250;</button>' +
      '<img alt="">' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var box = lb.querySelector("img");
    var count = lb.querySelector(".lb-count");

    function update() {
      var src = imgs[cur].getAttribute("src") || imgs[cur].getAttribute("data-lb");
      box.src = src;
      box.alt = imgs[cur].alt || "Chris Miller paver project";
      count.textContent = "Photo " + (cur + 1) + " of " + imgs.length;
    }
    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      update();
    }
    function openAt(i) {
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      open = true;
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      open = false;
      document.body.style.overflow = "";
    }
    imgs.forEach(function (img, i) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () { openAt(i); });
    });
    lb.querySelector("#lbClose").addEventListener("click", close);
    lb.querySelector("#lbPrev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    lb.querySelector("#lbNext").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
})();