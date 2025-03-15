let lastModifiedCodes = null;
let lastModifiedData = null;

// التحقق من التحديثات كل 5 ثوانٍ
setInterval(checkForUpdates, 5000);

async function checkForUpdates() {
    try {
        document.getElementById("loading").style.display = "block"; // إظهار رسالة التحميل
        // التحقق من تحديثات Codes.json
        const codesResponse = await fetch("Files/Codes.json");
        if (!codesResponse.ok) {
            throw new Error("Failed to fetch Codes.json");
        }
        const codesLastModified = new Date(codesResponse.headers.get("Last-Modified"));
        if (!lastModifiedCodes || codesLastModified > lastModifiedCodes) {
            lastModifiedCodes = codesLastModified;
            fetchPosts();
            playNotificationSound(); // تشغيل صوت عند التحديث
        }

        // التحقق من تحديثات data.json
        const dataResponse = await fetch("data.json");
        if (!dataResponse.ok) {
            throw new Error("Failed to fetch data.json");
        }
        const dataLastModified = new Date(dataResponse.headers.get("Last-Modified"));
        if (!lastModifiedData || dataLastModified > lastModifiedData) {
            lastModifiedData = dataLastModified;
            fetchFooterData();
            playNotificationSound(); // تشغيل صوت عند التحديث
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    } finally {
        document.getElementById("loading").style.display = "none"; // إخفاء رسالة التحميل
    }
}

function playNotificationSound() {
    const audio = new Audio("notification.mp3"); // تأكد من وجود ملف الصوت في مجلد المشروع
    audio.play();
}

// Fetch and display posts
document.addEventListener("DOMContentLoaded", function () {
    fetchPosts();
    fetchFooterData(); // جلب بيانات الفوتر من data.json
});

async function fetchPosts() {
    try {
        console.log("Fetching posts..."); // إضافة هذا السطر للتحقق
        const response = await fetch("Files/Codes.json"); // قراءة الملف مباشرة
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const codes = await response.json();
        console.log("Posts fetched successfully:", codes); // إضافة هذا السطر للتحقق
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = ""; // Clear existing posts

        if (codes.length === 0) {
            document.getElementById("noResults").style.display = "block"; // إظهار رسالة "No results found"
            return;
        }

        codes.forEach(code => {
            const post = document.createElement("div");
            post.className = "post";
            post.innerHTML = `
                <img src="${code.thumbnail}" alt="Post Image" style="width:100%; border-radius: 10px;">
                <h3>${code.name}</h3>
                <p>${code.description}</p>
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
            document.getElementById("videoThumbnail").src = foundCode.thumbnail;
            document.getElementById("videoDescription").innerText = foundCode.description;
            document.getElementById("developer").innerText = `Developer: ${foundCode.developer}`; // عرض Developer
            document.getElementById("description2").innerText = foundCode.description2; // عرض description2
            const linksList = document.getElementById("videoLinks");
            linksList.innerHTML = foundCode.links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join("");
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
        console.log("Fetching footer data..."); // إضافة هذا السطر للتحقق
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error("Failed to fetch data.json");
        }
        const data = await response.json();
        console.log("Footer data fetched successfully:", data); // إضافة هذا السطر للتحقق

        // عرض روابط About
        const aboutLinks = document.getElementById("aboutLinks");
        aboutLinks.innerHTML = data.about.map(link => `<a href="${link.link}" target="_blank">${link.name}</a>`).join("");

        // عرض روابط Terms
        const termsLinks = document.getElementById("termsLinks");
        termsLinks.innerHTML = data.terms.map(link => `<a href="${link.link}" target="_blank">${link.name}</a>`).join("");

        // عرض روابط Socials
        const socialsLinks = document.getElementById("socialsLinks");
        socialsLinks.innerHTML = data.socials.map(link => `<a href="${link.link}" target="_blank">${link.name}</a>`).join("");
    } catch (error) {
        console.error("Error fetching footer data:", error);
    }
}
