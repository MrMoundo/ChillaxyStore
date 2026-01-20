const API = "https://chillaxy.up.railway.app/api/videos";
const container = document.getElementById("videos");
const search = document.getElementById("search");

let videos = [];

fetch(API)
  .then(r=>r.json())
  .then(data=>{
    videos = data;
    render();
  });

function render(){
  const q = search.value.toLowerCase();
  container.innerHTML = "";

  videos
    .filter(v=>v.name.toLowerCase().includes(q))
    .forEach(v=>{
      const div = document.createElement("div");
      div.className="card";
      div.innerHTML=`
        <h3>${v.name}</h3>
        <p>${v.description || ""}</p>
        <a href="${v.videoLink}" target="_blank">Watch Video →</a>
      `;
      container.appendChild(div);
    });
}

search.addEventListener("input",render);
