const API = "https://chillaxy.up.railway.app/api";
const videosEl = document.getElementById("videos");
const bannersEl = document.getElementById("banners");

/* ===== VIDEOS ===== */
fetch(API + "/videos")
  .then(r => r.json())
  .then(videos => {
    videos.forEach(v => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `
        <h3>${v.name}</h3>
        <p>${v.description || ""}</p>
        <a href="${v.videoLink}" target="_blank">Watch</a>
      `;
      videosEl.appendChild(d);
    });
  });

/* ===== BANNERS SLIDER ===== */
fetch(API + "/banners")
  .then(r => r.json())
  .then(banners => {
    banners.forEach(b => {
      const img = document.createElement("img");
      img.src = b.url;
      bannersEl.appendChild(img);
    });

    let offset = 0;
    setInterval(() => {
      offset += 1;
      bannersEl.style.transform = `translateX(-${offset * 440}px)`;
      if (offset >= banners.length) offset = 0;
    }, 4000);
  });
