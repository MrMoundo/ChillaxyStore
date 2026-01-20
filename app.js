const API_URL = "https://chillaxy.up.railway.app/api/videos";

function formatText(text) {
    if (!text) return '';
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" style="color:#00ffd5;text-decoration:underline;">$1</a>'
    );
    text = text.replace(/\n/g, "<br>");
    return text;
}

// استخراج Thumbnail من يوتيوب
function getYouTubeThumbnail(videoLink) {
    let videoId = "";
    if (videoLink.includes("v=")) {
        videoId = videoLink.split("v=")[1].split("&")[0];
    } else if (videoLink.includes("youtu.be/")) {
        videoId = videoLink.split("youtu.be/")[1];
    }
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

function playVideo() {
    const thumb = document.getElementById("videoThumbnail");
    const player = document.getElementById("videoPlayer");
    thumb.style.display = "none";
    player.style.display = "block";
    player.src += "?autoplay=1";
}

function goBack() {
    const thumb = document.getElementById("videoThumbnail");
    const player = document.getElementById("videoPlayer");

    player.style.display = "none";
    thumb.style.display = "block";
    player.src = player.src.split("?")[0];

    document.getElementById("videoDetailsPage").style.display = "none";
    document.getElementById("postsContainer").style.display = "flex";

    fetchPosts();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPosts();
    fetchFooterData();
});

async function fetchPosts() {
    try {
        const res = await fetch(API_URL);
        const codes = await res.json();

        const container = document.getElementById("postsContainer");
        container.innerHTML = "";

        if (!codes.length) {
            document.getElementById("noResults").style.display = "block";
            return;
        }

        document.getElementById("noResults").style.display = "none";

        codes.forEach(code => {
            const post = document.createElement("div");
            post.className = "post";
            post.dataset.search =
                `${code.name} ${code.description} ${code.developer}`.toLowerCase();

            post.innerHTML = `
                <img src="${getYouTubeThumbnail(code.videoLink)}"
                     style="width:100%;border-radius:10px;">
                <h3>${formatText(code.name)}</h3>
                <p>${formatText(code.description)}</p>
                <button class="get-btn" onclick="openVideoDetails('${code.code}')">
                    ▶️ Watch
                </button>
            `;
            container.appendChild(post);
        });

    } catch (err) {
        console.error(err);
        document.getElementById("noResults").style.display = "block";
    }
}

function openVideoDetails(codeId) {
    fetch(API_URL)
        .then(res => res.json())
        .then(codes => {
            const video = codes.find(v => v.code === codeId);
            if (!video) return;

            document.getElementById("videoTitle").innerHTML = formatText(video.name);
            document.getElementById("videoDescription").innerHTML = formatText(video.description);
            document.getElementById("developer").innerHTML =
                formatText(`Developer: ${video.developer || "Chillaxy"}`);
            document.getElementById("description2").innerHTML =
                formatText(video.description2 || "");

            const thumb = document.getElementById("videoThumbnail");
            const player = document.getElementById("videoPlayer");

            const videoId = getYouTubeThumbnail(video.videoLink)
                .split("/vi/")[1].split("/")[0];

            thumb.src = getYouTubeThumbnail(video.videoLink);
            player.src = `https://www.youtube.com/embed/${videoId}`;
            player.style.display = "none";
            thumb.style.display = "block";

            // Links (لو موجودة بس)
            const linksList = document.getElementById("videoLinks");
            if (video.links && video.links.length > 0) {
                linksList.innerHTML = video.links
                    .map(l => `<li><a href="${l}" target="_blank">${l}</a></li>`)
                    .join("");
                linksList.style.display = "block";
            } else {
                linksList.style.display = "none";
            }

            document.getElementById("postsContainer").style.display = "none";
            document.getElementById("videoDetailsPage").style.display = "block";
        });
}

function searchPosts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const posts = document.querySelectorAll(".post");
    let found = false;

    posts.forEach(p => {
        if (p.dataset.search.includes(input)) {
            p.style.display = "block";
            found = true;
        } else {
            p.style.display = "none";
        }
    });

    document.getElementById("noResults").style.display = found ? "none" : "block";
}

// Footer
async function fetchFooterData() {
    const res = await fetch("data.json");
    const data = await res.json();

    document.getElementById("aboutLinks").innerHTML =
        data.about.map(a => `
        <div class="footer-card" onclick="openPopup('<h3>${a.name}</h3><p>${formatText(a.description)}</p>')">
            <h3>${a.name}</h3>
            <p>${formatText(a.description)}</p>
        </div>
    `).join("");

    document.getElementById("termsLinks").innerHTML =
        data.terms.map(t => `
        <div class="footer-card" onclick="openPopup('<h3>${t.name}</h3><p>${formatText(t.description)}</p>')">
            <h3>${t.name}</h3>
            <p>${formatText(t.description)}</p>
        </div>
    `).join("");

    document.getElementById("socialsLinks").innerHTML =
        data.socials.map(s => `
        <div class="social-card" onclick="window.open('${s.link}','_blank')">
            <h3>${s.name}</h3>
        </div>
    `).join("");
}

function openPopup(content) {
    const popup = document.getElementById("popup");
    document.getElementById("popupContent").innerHTML = content;
    popup.style.display = "flex";
}

document.addEventListener("click", e => {
    if (e.target.id === "popup") {
        document.getElementById("popup").style.display = "none";
    }
});
