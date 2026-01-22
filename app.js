const API = "/api";

/* ================= INTRO ================= */
setTimeout(() => {
  document.getElementById("intro").style.display = "none";
}, 2600);

/* ================= HERO BANNERS ================= */
const bannerWrap = document.getElementById("banners");

fetch(API + "/banners")
  .then(r => r.json())
  .then(banners => {
    banners.forEach(b => {
      const img = document.createElement("img");
      img.src = b.url;
      bannerWrap.appendChild(img);
    });

    let i = 0;
    setInterval(() => {
      if (!banners.length) return;
      i = (i + 1) % banners.length;
      bannerWrap.style.transform = `translateX(-${i * 100}vw)`;
    }, 5000);
  });

/* ================= VIDEOS ================= */
const videosEl = document.getElementById("videos");
const searchEl = document.getElementById("search");
const noResultsEl = document.getElementById("no-results");

let allVideos = [];

fetch(API + "/videos")
  .then(r => r.json())
  .then(videos => {
    allVideos = videos;
    renderVideos(videos);
  });

function renderVideos(list){
  videosEl.innerHTML = "";
  noResultsEl.classList.add("hidden");

  if (!list.length){
    noResultsEl.classList.remove("hidden");
    return;
  }

  list.forEach(v => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <h3>${v.name}</h3>
      <p>${v.description || ""}</p>
      <a href="${v.videoLink}" target="_blank">View details</a>
    `;
    videosEl.appendChild(d);
  });
}

/* ================= SEARCH ================= */
searchEl.addEventListener("input", () => {
  const q = searchEl.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.name.toLowerCase().includes(q) ||
    (v.description || "").toLowerCase().includes(q)
  );

  renderVideos(filtered);
});
