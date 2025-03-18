// دالة لتحويل العلامات إلى تنسيقات HTML
function formatText(text) {
    if (!text) return ''; // إذا كان النص فارغًا، نعود بسلسلة فارغة

    // تحويل **كلمة** إلى <strong>كلمة</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // تحويل `كلمة` إلى <code>كلمة</code>
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");

    // تحويل __كلمة__ إلى <u>كلمة</u> (تحت الخط)
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");

    // تحويل ~~كلمة~~ إلى <del>كلمة</del> (نص مشطوب)
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // تحويل *كلمة* إلى <em>كلمة</em> (مائل)
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // تحويل [النص](الرابط) إلى <a href="الرابط">النص</a>
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #ff4b2b; text-decoration: underline;">$1</a>');

    // تحويل \n إلى <br> (سطر جديد)
    text = text.replace(/\n/g, "<br>");

    return text;
}

// دالة لاستخراج video-id من رابط YouTube
function getYouTubeThumbnail(videoLink) {
    const videoId = videoLink.split("v=")[1]; // استخراج video-id
    return `https://img.youtube.com/vi/${videoId}/0.jpg`; // إنشاء رابط الصورة المصغرة
}

// تشغيل الفيديو عند الضغط على الصورة المصغرة
function playVideo() {
    const videoThumbnail = document.getElementById("videoThumbnail");
    const videoPlayer = document.getElementById("videoPlayer");

    videoThumbnail.style.display = "none"; // إخفاء الصورة
    videoPlayer.style.display = "block"; // إظهار الفيديو
    videoPlayer.src += "?autoplay=1"; // تشغيل الفيديو تلقائيًا
}

// العودة إلى الصورة عند الضغط على زر Go Back
function goBack() {
    const videoThumbnail = document.getElementById("videoThumbnail");
    const videoPlayer = document.getElementById("videoPlayer");

    videoPlayer.style.display = "none"; // إخفاء الفيديو
    videoThumbnail.style.display = "block"; // إظهار الصورة
    videoPlayer.src = videoPlayer.src.split("?")[0]; // إيقاف الفيديو

    document.getElementById("postsContainer").style.display = "flex"; // إعادة عرض القائمة
    document.getElementById("videoDetailsPage").style.display = "none"; // إخفاء صفحة التفاصيل
    document.getElementById("postsContainer").style.justifyContent = "center"; // إعادة المحاذاة إلى الوسط
    fetchPosts(); // Refresh posts
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
            document.getElementById("videoTitle").innerHTML = formatText(foundCode.name); // تطبيق التنسيقات على العنوان
            document.getElementById("videoThumbnail").src = getYouTubeThumbnail(foundCode.videoLink); // عرض الصورة المصغرة
            document.getElementById("videoDescription").innerHTML = formatText(foundCode.description); // تطبيق التنسيقات على الوصف
            document.getElementById("developer").innerHTML = formatText(`Developer: ${foundCode.developer}`); // تطبيق التنسيقات على Developer
            document.getElementById("description2").innerHTML = formatText(foundCode.description2); // تطبيق التنسيقات على description2

            // عرض روابط التحميل
            const linksList = document.getElementById("videoLinks");
            linksList.innerHTML = foundCode.links.map(link => `<li><a href="${link}" target="_blank" style="color: #ff4b2b; text-decoration: underline;">${link}</a></li>`).join("");

            // تعيين رابط الفيديو
            const videoPlayer = document.getElementById("videoPlayer");
            const videoId = foundCode.videoLink.split("v=")[1]; // استخراج video-id
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`; // تعيين رابط الفيديو
            videoPlayer.style.display = "none"; // إخفاء الفيديو في البداية

            document.getElementById("postsContainer").style.display = "none";
            document.getElementById("videoDetailsPage").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching video details:", error);
            alert("Failed to load video details!");
        });
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

// دالة لفتح القائمة التفاعلية
function openPopup(content) {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    popupContent.innerHTML = content; // تعيين المحتوى
    popup.style.display = "flex"; // إظهار النافذة المنبثقة
}

// دالة لإغلاق القائمة التفاعلية
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none"; // إخفاء النافذة المنبثقة
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
        aboutLinks.innerHTML = data.about.map(link => `
            <div class="footer-card" onclick="openPopup('<h3>${formatText(link.name)}</h3><p>${formatText(link.description)}</p>')">
                <h3>${formatText(link.name)}</h3>
                <p>${formatText(link.description)}</p>
            </div>
        `).join("");

        // عرض روابط Terms
        const termsLinks = document.getElementById("termsLinks");
        termsLinks.innerHTML = data.terms.map(link => `
            <div class="footer-card" onclick="openPopup('<h3>${formatText(link.name)}</h3><p>${formatText(link.description)}</p>')">
                <h3>${formatText(link.name)}</h3>
                <p>${formatText(link.description)}</p>
            </div>
        `).join("");

        // عرض روابط Socials
        const socialsLinks = document.getElementById("socialsLinks");
        socialsLinks.innerHTML = data.socials.map(link => `
            <div class="social-card" onclick="window.open('${link.link}', '_blank')">
                <h3>${formatText(link.name)}</h3>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching footer data:", error);
    }
}

// إغلاق النافذة المنبثقة عند الضغط خارجها
document.addEventListener("click", function (event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        closePopup();
    }
});
