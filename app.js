const API = "https://chillaxy.up.railway.app/api";

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
      i = (i + 1) % banners.length;
      bannerWrap.style.transform = `translateX(-${i * 100}vw)`;
    }, 5000);
  });

/* ================= VIDEOS ================= */
const videosEl = document.getElementById("videos");

fetch(API + "/videos")
  .then(r => r.json())
  .then(videos => {
    videos.forEach(v => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `
        <h3>${v.name}</h3>
        <p>${v.description || ""}</p>
        <a href="${v.videoLink}" target="_blank">مشاهدة</a>
      `;
      videosEl.appendChild(d);
    });
  });
