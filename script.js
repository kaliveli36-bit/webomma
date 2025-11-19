// =========================================================
// GLOBAL DATA (Movies used on homepage + watch page)
// =========================================================
const allVideos = [
    { 
        id: 1, 
        title: "RRR",
        genre: "Silent Film",
        year: 2023,
        uploader: "Film Archive",
        image: "images/RRR.png",
        // Google Drive EMBED url (preview) – works inside iframe
        embedUrl: "https://www.youtube.com/embed/f_vbAtFSEc0",
        desc: "RRR – your first movie hosted on Google Drive."
    },
    { 
        id: 2, 
        title: "KGF 1", 
        genre: "Horror", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: "images/KGF 1.png",
        embedUrl: "",
        desc: "KGF 1 – add your Google Drive embed link here."
    }, 
    { 
        id: 3, 
        title: "Salaar", 
        genre: "Action", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: "images/Salaar.png",
        embedUrl: "",
        desc: "Salaar – add your Google Drive embed link here."
    },
    {
        id: 6,
        title: "My New Movie Title",
        genre: "Sci-Fi",
        year: 2025,
        uploader: "My Channel",
        image: "images/mynewmovie.jpg",
        embedUrl: "",
        desc: "Describe your new movie here."
    }
];

// =========================================================
// HOMEPAGE LOGIC
// =========================================================
function initializeHomepage() {
    const videoGrid = document.querySelector(".video-grid");
    const filterContainer = document.querySelector(".category-filters");

    if (!videoGrid) return; // not on homepage

    function renderVideos(videos) {
        videoGrid.innerHTML = videos.map(video => `
            <a href="watch.html?id=${video.id}" style="text-decoration: none; color: inherit;">
                <div class="video-card" data-genre="${video.genre}">
                    <img src="${video.image}" alt="${video.title} Poster">
                    <h3>${video.title}</h3>
                    <p class="metadata">${video.year} | ${video.uploader}</p>
                </div>
            </a>
        `).join("");
    }

    // show all videos initially
    renderVideos(allVideos);

    // genre filter chips
    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("chip")) {
                filterContainer.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
                e.target.classList.add("active");

                const genre = e.target.getAttribute("data-genre");
                const filtered = genre === "All"
                    ? allVideos
                    : allVideos.filter(v => v.genre === genre);
                renderVideos(filtered);
            }
        });
    }
}

// =========================================================
// WATCH PAGE LOGIC (iframe + Google Drive preview)
// =========================================================
function initializeWatchPage() {
    const frame = document.getElementById("video-frame");
    if (!frame) return; // not on watch page

    // 1. Get ID from URL (e.g., watch.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get("id"));

    // 2. Find Video Data
    const video = allVideos.find(v => v.id === videoId);

    if (video) {
        // Update page title
        document.title = `${video.title} | We Bomma`;

        // Update text fields
        const titleEl = document.getElementById("video-title");
        const uploaderEl = document.getElementById("video-uploader");
        const genreTagEl = document.getElementById("video-genre-tag");
        const descEl = document.getElementById("video-desc");
        const uploaderLabelEl = document.getElementById("video-uploader-label");

        if (titleEl) titleEl.textContent = video.title;
        if (uploaderEl) uploaderEl.textContent = video.uploader;
        if (genreTagEl) genreTagEl.textContent = video.genre;
        if (descEl) descEl.textContent = video.desc || "";
        if (uploaderLabelEl) uploaderLabelEl.textContent = video.uploader;

        // 3. Set iframe source
        if (video.embedUrl && video.embedUrl.trim() !== "") {
            frame.src = video.embedUrl;
        } else {
            // Fallback: sample YouTube embed if embedUrl not set
            frame.src = "https://www.youtube.com/embed/aqz-KE-bpKQ";
        }

        // 4. Sidebar recommendations
        const recommendations = allVideos.filter(v => v.id !== videoId);
        const sidebar = document.getElementById("recommended-list");
        if (sidebar) {
            sidebar.innerHTML = recommendations.map(rec => `
                <a href="watch.html?id=${rec.id}" class="side-video-card">
                    <img src="${rec.image}" alt="${rec.title} thumbnail">
                    <div class="side-video-info">
                        <h4>${rec.title}</h4>
                        <p>${rec.uploader}</p>
                    </div>
                </a>
            `).join("");
        }
    } else {
        const container = document.querySelector(".container");
        if (container) container.innerHTML = "<h1>Video not found.</h1>";
    }
}

// =========================================================
// UPLOAD PAGE LOGIC
// =========================================================
function initializeUploadForm() {
    const form = document.getElementById("upload-form");
    if (!form) return; // not on upload page

    const steps = form.querySelectorAll(".upload-step");
    const stepIndicators = form.querySelectorAll(".step");
    const publishBtn = document.getElementById("publish-btn");
    const certifyCheckbox = document.getElementById("certify");
    const fileInput = document.getElementById("video-file");
    const progressBar = document.querySelector(".progress-bar");
    const fileNameDisplay = document.getElementById("file-name-display");

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((s, i) => s.style.display = i === index ? "block" : "none");
        stepIndicators.forEach((s, i) => s.classList.toggle("active", i === index));
        currentStep = index;
    }

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
                }
                if (progressBar) {
                    let width = 0;
                    const interval = setInterval(() => {
                        if (width >= 100) clearInterval(interval);
                        else { width += 10; progressBar.style.width = width + "%"; }
                    }, 100);
                }
            }
        });
    }

    form.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-next")) showStep(currentStep + 1);
        if (e.target.classList.contains("btn-prev")) showStep(currentStep - 1);
    });

    form.addEventListener("change", () => {
        if (currentStep === 2 && publishBtn && certifyCheckbox) {
            publishBtn.disabled = !certifyCheckbox.checked;
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Success! Film submitted.");
        form.reset();
        showStep(0);
    });

    showStep(0);
}

// =========================================================
// Initialize all pages
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    initializeHomepage();
    initializeUploadForm();
    initializeWatchPage();
});

