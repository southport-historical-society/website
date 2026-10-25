/* SHS homepage announcements renderer.
   Fetches data/announcements.json and renders each announcement as
   image-left / title+text-right, matching the site style guide.
   Dependency-free. If the JSON fails to load, the section stays empty
   rather than breaking the page. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(list) {
    var mount = document.getElementById("announcements-list");
    if (!mount || !Array.isArray(list)) return;
    var frag = document.createDocumentFragment();
    list.forEach(function (a) {
      if (!a || !a.title) return;
      var row = document.createElement("article");
      row.className = "announcement" + (a.image ? "" : " announcement--no-media");

      if (a.image) {
        var media = document.createElement("div");
        media.className = "announcement-media";
        var img = document.createElement("img");
        img.src = a.image;
        img.alt = "";
        img.loading = "lazy";
        /* Images link to the announcement's link when one is set. */
        if (a.link) {
          var imglink = document.createElement("a");
          imglink.href = a.link;
          imglink.appendChild(img);
          media.appendChild(imglink);
        } else {
          media.appendChild(img);
        }
        row.appendChild(media);
      }

      var body = document.createElement("div");
      body.className = "announcement-body";
      var h = document.createElement("h2");
      h.textContent = a.title;
      body.appendChild(h);
      var text = document.createElement("div");
      /* html is trusted society content authored in announcements.json */
      text.innerHTML = a.html || "";
      body.appendChild(text);

      if (a.link) {
        var p = document.createElement("p");
        var link = document.createElement("a");
        link.href = a.link;
        link.className = "btn";
        link.textContent = "Learn more";
        p.appendChild(link);
        body.appendChild(p);
      }

      row.appendChild(body);
      frag.appendChild(row);

      /* PRESALE CHECKER (temporary - remove after Nov 16, 2026):
         embed the eligibility checker directly below the Holiday Tour announcement. */
      if (/35th Annual Holiday Tour of Homes/.test(a.title)) {
        var checker = document.createElement("section");
        checker.className = "presale-checker";
        checker.setAttribute("aria-label", "Members-only presale eligibility checker");
        checker.style.cssText = "background:#eef1f5;padding:2rem 1rem;margin:0 0 2rem;";
        var frame = document.createElement("iframe");
        frame.src = "https://script.google.com/macros/s/AKfycbxowp0mNC7ESpJkak4Knj3eOF5Y6BQjlz1uq4ccyczxI3_zH02ePBp0N5wr2UGGFr6v/exec";
        frame.title = "2026 Holiday Tour of Homes - Members-Only Presale Eligibility Checker";
        frame.loading = "lazy";
        frame.style.cssText = "width:100%;max-width:760px;height:660px;border:0;display:block;margin:0 auto;background:#fff";
        checker.appendChild(frame);
        frag.appendChild(checker);
      }
    });
    mount.appendChild(frag);
  }

  function load() {
    if (!("fetch" in window)) return;
    fetch("data/announcements.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(render)
      .catch(function () { /* stay empty rather than break the page */ });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
