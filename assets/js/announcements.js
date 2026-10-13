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
        media.appendChild(img);
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
