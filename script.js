// =========================================================
// GLOBAL DATA (Movies shown on homepage + used on watch page)
// =========================================================
const allVideos = [
    { 
        id: 1, 
        title: "RRR",
        genre: "Silent Film",
        year: 2023,
        uploader: "Film Archive",
        image: "images/RRR.png",
        // 👇 Your Google Drive video for RRR
        videoUrl: "https://drive.google.com/uc?export=download&id=170D3UL3r70aKYUqLCIbc6fmqRjLxFqle",
        desc: "RRR – your first movie hosted on Google Drive."
    },
    { 
        id: 2, 
        title: "KGF 1", 
        genre: "Horror", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: "images/KGF 1.png",
        // TODO: put your Google Drive link here when ready
        videoUrl: "",
        desc: "KGF 1 – add your own description and videoUrl when ready."
    }, 
    { 
        id: 3, 
        title: "Salaar", 
        genre: "Action", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: "images/Salaar.png",
        // TODO: put your Google Drive link here when ready
        videoUrl: "",
        desc: "Salaar – add your own description and videoUrl when ready."
    },

    // Example extra slot – edit or remove as you like
    {
        id: 6,
        title: "My New Movie Title",
        genre: "Sci-Fi",
        year: 2025,
        uploader: "My Channel",
        image: "images/mynewmovie.jpg",
        videoUrl: "",
        desc: "Describe your new movie here."
    }
];

// =========================================================
// HOMEPAGE LOGIC
// =========================================================
function initializeHomepage() {
    const videoGrid = document.querySelector(".video-grid");
    const filterContainer = document.querySelector(".category-filters");

    if (!videoGrid) return; 

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

    renderVideos(allVideos);

    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("chip")) {
                filterContainer.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
                e.target.classList.add("active");
                const genre = e.target.getAttribute("data-genre");
                renderVideos(genre === "All" ? allVideos : allVideos.filter(v => v.genre === genre));
            }
        });
    }
}

// =========================================================
// WATCH PAGE LOGIC
// =========================================================
function initializeWatchPage() {
    const player = document.getElementById("main-player");
    if (!player) return; // Exit if not on watch page

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
        if (descEl) descEl.textContent = video.desc || "No description provided.";
        if (uploaderLabelEl) uploaderLabelEl.textContent = video.uploader;

        // 3. Set video source (Google Drive or fallback)
        if (video.videoUrl && video.videoUrl.trim() !== "") {
            player.src = video.videoUrl;
        } else {
            // Fallback demo video if no URL set
            player.src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        }
        player.poster = video.image;

        // 4. Populate sidebar recommendations
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
// UPLOAD PAGE LOGIC (unchanged from your original)
// =========================================================
function initializeUploadForm() {
    const form = document.getElementById("upload-form");
    if (!form) return; 

    const steps = form.querySelectorAll(".upload-step");
    const stepIndicators = form.querySelectorAll(".step");
    const publishBtn = document.getElementById("publish-btn");
    const certifyCheckbox = document.getElementById("certify");
    const fileInput = document.getElementById("video-file");
    const progressBar = document.getElementById("upload-progress");
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

