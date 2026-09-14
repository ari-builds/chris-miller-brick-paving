(function () {
  var go = function () {
    var phone = "(603) 635-7325";
    var tel = "+16036357325";

    function esc(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    /* ---- header ---- */
    var announce = document.createElement("div");
    announce.className = "announce";
    announce.innerHTML =
      '<div class="inner">' +
      '<a href="contact.html">Free Estimates</a><b>&middot;</b>' +
      '<span>Fully Insured</span><b>&middot;</b>' +
      '<span>5-Year Paver Installation Warranty</span>' +
      "</div>";

    var header = document.createElement("header");
    header.className = "top";
    var here = document.body.getAttribute("data-page") || "home";
    function on(rel) { return here === rel ? ' class="on"' : ""; }
    header.innerHTML =
      '<div class="inner top-inner">' +
      '<a class="brand" href="index.html" aria-label="Chris Miller, Brick Paver Installer - home">' +
      '<span class="brand-mark">CM</span>' +
      '<span class="brand-name">Chris Miller<span>Brick Paver Installer</span></span>' +
      "</a>" +
      '<div class="top-ph">' +
      '<span class="pwhy">Serving New England</span>' +
      '<a href="tel:' + tel + '">' + phone + "</a>" +
      '<a class="btn btn-call" href="contact.html">Free estimate</a>' +
      "</div>" +
      '<a class="btn btn-cta mobile-est" href="contact.html">Free estimate</a>' +
      '<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu">' +
      "<span></span><span></span><span></span>" +
      "</button>" +
      "</div>";

    var ctaBar = document.createElement("div");
    ctaBar.className = "cta-bar";
    ctaBar.id = "ctaBar";
    ctaBar.innerHTML =
      '<a href="tel:' + tel + '">Call Chris for a free estimate &nbsp;<b>' + phone + "</b> <span aria-hidden='true'>&#8594;</span></a>";

    var menu = document.createElement("div");
    menu.className = "menu";
    menu.id = "menu";
    menu.setAttribute("aria-hidden", "true");
    menu.innerHTML =
      '<div class="menu-inner">' +
      '<div class="menu-top">' +
      '<a class="brand" href="index.html" aria-label="home">' +
      '<span class="brand-mark">CM</span>' +
      '<span class="brand-name">Chris Miller<span>Brick Paver Installer</span></span>' +
      "</a>" +
      '<button class="menu-x" aria-label="Close menu">&times;</button>' +
      "</div>" +
      '<nav class="menu-groups">' +
      '<div class="mgroup"><h4>Get started</h4>' +
      "<a href='index.html'" + on("home") + ">Home</a>" +
      "<a href='about.html'" + on("about") + ">About Chris</a>" +
      "<a href='contact.html'" + on("contact") + ">Contact &amp; estimates</a>" +
      "</div>" +
      '<div class="mgroup"><h4>Services</h4>' +
      "<a href='services.html'" + on("services") + ">All services</a>" +
      "<a href='services.html#driveways'>Brick driveways</a>" +
      "<a href='services.html#walkways'>Walkways</a>" +
      "<a href='services.html#patios'>Patios</a>" +
      "<a href='services.html#pools'>Pool decks</a>" +
      "<a href='services.html#walls'>Rock &amp; block retaining walls</a>" +
      "</div>" +
      '<div class="mgroup"><h4>Our work</h4>' +
      "<a href='gallery.html'" + on("gallery") + ">Photo gallery</a>" +
      "<a href='gallery-driveways.html'>Driveways</a>" +
      "<a href='gallery-pools.html'>Pool areas</a>" +
      "<a href='gallery-patios.html'>Patios</a>" +
      "<a href='gallery-walkways.html'>Walkways</a>" +
      "<a href='gallery-walls.html'>Rock &amp; block walls</a>" +
      "</div>" +
      '<div class="mgroup"><h4>Shop</h4>' +
      "<a href='btu-bricks.html'" + on("btu") + ">BTU Bricks by Wood Waste</a>" +
      "</div>" +
      "</nav>" +
      '<div class="menu-cta">' +
      '<a class="btn btn-call" style="width:100%;text-align:center" href="tel:' + tel + '">Call ' + phone + "</a>" +
      '<p class="menu-note">Pelham, NH &middot; Free estimates on every paver project.</p>' +
      "</div>" +
      "</div>";

    /* ---- footer ---- */
    var footer = document.createElement("footer");
    footer.innerHTML =
      '<div class="inner">' +
      '<div class="foot-grid">' +
      '<div class="foot-brand">' +
      '<span class="brand-name">Chris Miller<span>Brick Paver Installer</span></span>' +
      '<p>Specializing in brick paver installation for the New England area since 2010. Quality workmanship, attention to detail, and prompt, courteous service on every project.</p>' +
      '<span class="foot-loc">Pelham, New Hampshire 03076</span>' +
      "</div>" +
      '<div> <h4>Services</h4><nav class="links">' +
      "<a href='services.html'>Brick paver installation</a>" +
      "<a href='services.html#driveways'>Brick driveways</a>" +
      "<a href='services.html#walkways'>Walkways &amp; paths</a>" +
      "<a href='services.html#patios'>Patios</a>" +
      "<a href='services.html#pools'>Pool decks</a>" +
      "<a href='services.html#walls'>Retaining walls</a>" +
      "<a href='btu-bricks.html'>BTU Bricks</a>" +
      "</nav></div>" +
      '<div class="foot-contact"> <h4>Contact</h4>' +
      '<a class="foot-phone" href="tel:' + tel + '">' + phone + "</a>" +
      '<p style="margin-top:.6rem;font-size:.92rem;color:#d9cbb4">' +
      'E-mail: <a href="mailto:cjmbrick@comcast.net">cjmbrick@comcast.net</a><br>' +
      "Fax: (603) 635-9144<br>" +
      '<span style="font-size:.8rem">Money orders, traveler&rsquo;s checks, personal checks accepted &middot; credit terms &amp; financing available</span>' +
      "</p>" +
      '<p style="margin-top:.8rem;font-size:.85rem;color:#a79377">' +
      "Serving NH &amp; MA: Pelham, Windham, Salem, Hudson, Nashua, Londonderry, Derry, Manchester, Litchfield, Dracut, Lowell, Methuen, Tyngsborough, Chelmsford &middot; New England &amp; the North Shore" +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div class="copy">&copy; <span class="yr">2026</span> Chris Miller &middot; Brick Paver Installer &middot; Pelham, NH &middot; Free Estimates &middot; Fully Insured &middot; 5-Year Paver Installation Warranty</div>' +
      "</div>";

    document.body.insertBefore(ctaBar, document.body.firstChild);
    document.body.insertBefore(announce, document.body.firstChild);
    document.body.insertBefore(header, document.body.firstChild);
    document.body.appendChild(menu);
    document.body.appendChild(footer);

    /* ---- burger / menu ---- */
    var btn = header.querySelector(".burger");
    var mm = menu;
    var closeBtn = menu.querySelector(".menu-x");
    function openM() {
      mm.classList.add("open");
      mm.setAttribute("aria-hidden", "false");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeM() {
      mm.classList.remove("open");
      mm.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    btn.addEventListener("click", openM);
    closeBtn.addEventListener("click", closeM);
    mm.addEventListener("click", function (e) {
      if (e.target === mm) closeM();
    });
    mm.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeM);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeM();
    });

    /* ---- top shadow + mobile CTA ---- */
    var cta = document.getElementById("ctaBar");
    var shown = false;
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 8);
      if (!shown && window.scrollY > 120) {
        shown = true;
        cta.classList.add("in");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---- fade reveal ---- */
    function reveal(els) {
      els.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.classList.add("in");
        }
      });
    }
    var fades = document.querySelectorAll(".fade");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      fades.forEach(function (el) { io.observe(el); });
    } else {
      fades.forEach(function (el) { el.classList.add("in"); });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
})();