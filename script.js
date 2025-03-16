// دالة لتحويل العلامات إلى تنسيقات HTML
function formatText(text) {
    // تحويل **كلمة** إلى <strong>كلمة</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // تحويل ```كلمة``` إلى <code>كلمة</code>
    text = text.replace(/```(.*?)```/g, "<code>$1</code>");

    // تحويل __كلمة__ إلى <u>كلمة</u> (تحت الخط)
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");

    // تحويل ~~كلمة~~ إلى <del>كلمة</del> (نص مشطوب)
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // تحويل *كلمة* إلى <em>كلمة</em> (مائل)
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return text;
}

// دالة لاستخراج video-id من رابط YouTube
function getYouTubeThumbnail(videoLink) {
    const videoId = videoLink.split("v=")[1]; // استخراج video-id
    return `https://img.youtube.com/vi/${videoId}/0.jpg`; // إنشاء رابط الصورة المصغرة
}

// Fetch and display posts
document.addEventListener("DOMContentLoaded", function () {
    fetchPosts();
    fetchFooterData(); // جلب بيانات الفوتر من data.json
});

async function fetchPosts() {
    try {
        const response = await fetch("Files/Codes.json");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const codes = await response.json();
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = ""; // Clear existing posts

        codes.forEach(code => {
            const thumbnail = getYouTubeThumbnail(code.videoLink); // إنشاء رابط الصورة المصغرة
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
        document.getElementById("noResults").style.display = "block"; // إظهار رسالة "No results found" في حالة الخطأ
    }
}

// Open video details page
function openVideoDetails(code) {
    fetch("Files/Codes.json") // قراءة الملف مباشرة
        .then(response => response.json())
        .then(codes => {
            const foundCode = codes.find(c => c.code === code);
            if (!foundCode) {
                throw new Error("Code not found");
            }
            document.getElementById("videoTitle").innerText = foundCode.name;
            document.getElementById("videoThumbnail").src = getYouTubeThumbnail(foundCode.videoLink); // عرض الصورة المصغرة
            document.getElementById("videoDescription").innerText = foundCode.description;
            document.getElementById("developer").innerText = `Developer: ${foundCode.developer}`; // عرض Developer
            document.getElementById("description2").innerText = foundCode.description2; // عرض description2

            // عرض روابط التحميل
            const linksList = document.getElementById("videoLinks");
            linksList.innerHTML = foundCode.links.map(link => `<li><a href="${link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${link}</a></li>`).join("");

            // تشغيل الفيديو
            const videoPlayer = document.getElementById("videoPlayer");
            const videoId = foundCode.videoLink.split("v=")[1]; // استخراج video-id
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`; // تعيين رابط الفيديو

            document.getElementById("postsContainer").style.display = "none";
            document.getElementById("videoDetailsPage").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching video details:", error);
            alert("Failed to load video details!");
        });
}

// Go back to posts
function goBack() {
    document.getElementById("postsContainer").style.display = "block";
    document.getElementById("videoDetailsPage").style.display = "none";
    document.getElementById("postsContainer").style.textAlign = "center"; // إعادة المحاذاة إلى الوسط
    fetchPosts(); // Refresh posts
}

// Search posts
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

// Fetch and display footer data from data.json
async function fetchFooterData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error("Failed to fetch data.json");
        }
        const data = await response.json();

        // عرض روابط About
        const aboutLinks = document.getElementById("aboutLinks");
        aboutLinks.innerHTML = data.about.map(link => `<a href="${link.link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${formatText(link.name)}</a>`).join("");

        // عرض روابط Terms
        const termsLinks = document.getElementById("termsLinks");
        termsLinks.innerHTML = data.terms.map(link => `<a href="${link.link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${formatText(link.name)}</a>`).join("");

        // عرض روابط Socials
        const socialsLinks = document.getElementById("socialsLinks");
        socialsLinks.innerHTML = data.socials.map(link => `<a href="${link.link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${formatText(link.name)}</a>`).join("");
    } catch (error) {
        console.error("Error fetching footer data:", error);
    }
}
