function formatText(text) {
    if (!text) return '';
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #ff4b2b; text-decoration: underline;">$1</a>');
    text = text.replace(/\n/g, "<br>");
    return text;
}

// دالة محسنة لاستخراج video-id من أي رابط يوتيوب
function getYouTubeThumbnail(videoLink) {
    let videoId = '';
    if (videoLink.includes("v=")) {
        videoId = videoLink.split("v=")[1];
        const ampersandPosition = videoId.indexOf("&");
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
    } else if (videoLink.includes("youtu.be/")) {
        videoId = videoLink.split("youtu.be/")[1];
    }
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

function playVideo() {
    const videoThumbnail = document.getElementById("videoThumbnail");
    const videoPlayer = document.getElementById("videoPlayer");
    videoThumbnail.style.display = "none";
    videoPlayer.style.display = "block";
    videoPlayer.src += "?autoplay=1";
}

function goBack() {
    const videoThumbnail = document.getElementById("videoThumbnail");
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.style.display = "none";
    videoThumbnail.style.display = "block";
    videoPlayer.src = videoPlayer.src.split("?")[0];
    document.getElementById("postsContainer").style.display = "flex";
    document.getElementById("videoDetailsPage").style.display = "none";
    document.getElementById("postsContainer").style.justifyContent = "center";
    fetchPosts();
}

// دالة لعرض/إخفاء محتوى الفوتر
function toggleFooterContent(contentType) {
    // إخفاء كل محتويات الفوتر أولاً
    const allContents = document.querySelectorAll('.footer-links-container');
    allContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // عرض المحتوى المطلوب
    const contentToShow = document.getElementById(`${contentType}-content`);
    if (contentToShow) {
        if (contentToShow.style.display === 'block') {
            contentToShow.style.display = 'none';
        } else {
            contentToShow.style.display = 'block';
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchPosts();
    // إخفاء كل محتويات الفوتر عند التحميل
    const allContents = document.querySelectorAll('.footer-links-container');
    allContents.forEach(content => {
        content.style.display = 'none';
    });
});

async function fetchPosts() {
    try {
        const response = await fetch("Files/Codes.json");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const codes = await response.json();
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "";
        codes.forEach(code => {
            const thumbnail = getYouTubeThumbnail(code.videoLink);
            const post = document.createElement("div");
            post.className = "post";
            post.innerHTML = `
                <img src="${thumbnail}" alt="Post Image" style="width:100%; border-radius: 10px;">
                <h3>${formatText(code.name)}</h3>
                <p>${formatText(code.description)}</p>
                <button class="get-btn" onclick="openVideoDetails('${code.code}')">🔽 Get</button>
            `;
            postsContainer.appendChild(post);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        document.getElementById("noResults").style.display = "block";
    }
}

function openVideoDetails(code) {
    fetch("Files/Codes.json")
        .then(response => response.json())
        .then(codes => {
            const foundCode = codes.find(c => c.code === code);
            if (!foundCode) {
                throw new Error("Code not found");
            }
            document.getElementById("videoTitle").innerHTML = formatText(foundCode.name);
            document.getElementById("videoThumbnail").src = getYouTubeThumbnail(foundCode.videoLink);
            document.getElementById("videoDescription").innerHTML = formatText(foundCode.description);
            document.getElementById("developer").innerHTML = formatText(`Developer: ${foundCode.developer}`);
            document.getElementById("description2").innerHTML = formatText(foundCode.description2);
            const linksList = document.getElementById("videoLinks");
            linksList.innerHTML = foundCode.links.map(link => `<li><a href="${link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${link}</a></li>`).join("");
            const videoPlayer = document.getElementById("videoPlayer");
            const videoId = getYouTubeThumbnail(foundCode.videoLink).split("/vi/")[1].split("/")[0];
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
            videoPlayer.style.display = "none";
            document.getElementById("postsContainer").style.display = "none";
            document.getElementById("videoDetailsPage").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching video details:", error);
            alert("Failed to load video details!");
        });
}

function searchPosts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let posts = document.querySelectorAll(".post");
    let noResults = document.getElementById("noResults");
    let found = false;
    posts.forEach(post => {
        if (post.innerText.toLowerCase().includes(input)) {
            post.style.display = "block";
            found = true;
        } else {
            post.style.display = "none";
        }
    });
    noResults.style.display = found ? "none" : "block";
}

function openPopup(content) {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");
    popupContent.innerHTML = content;
    popup.style.display = "flex";
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        closePopup();
    }
});
