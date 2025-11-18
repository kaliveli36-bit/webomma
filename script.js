// =========================================================
// GLOBAL DATA (Used for Homepage Filtering Demo)
// =========================================================
const allVideos = [
    // This is the structure you need to follow:
    { 
        id: 1, 
        title: "RRR", // <= CHANGE THIS
        genre: "Silent Film", 
        year: 2023, 
        uploader: "Film Archive", 
        image: 'images/RRR.png' // <= CHANGE THIS TO YOUR IMAGE PATH
        videoUrl: 'https://drive.google.com/uc?export=download&id=170D3UL3r70aKYUqLCIbc6fmqRjLxFqle',
        desc: 'A powerful story of rise , Roar, Revolt.'
    },
    { 
        id: 2, 
        title: "KGF 1", 
        genre: "Horror", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: 'images/KGF 1.png' 
    }, 
    { 
        id: 3, 
        title: "Salaar", 
        genre: "Action", 
        year: 2022, 
        uploader: "UGC Curators", 
        image: 'images/Salaar.png' 
    },

    // ADD YOUR NEW VIDEOS HERE:
    {
        id: 6, // Make sure the ID is unique!
        title: "My New Movie Title",
        genre: "Sci-Fi", // Must match one of the categories: All, Classic, Horror, Sci-Fi, Silent Film [cite: 5]
        year: 2025,
        uploader: "My Channel",
        image: 'images/mynewmovie.jpg' // This must match the file in your folder!
    }
];
// =========================================================
// HOMEPAGE LOGIC
// =========================================================
function initializeHomepage() {
    const videoGrid = document.querySelector('.video-grid');
    const filterContainer = document.querySelector('.category-filters');

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
        `).join('');
    }

    renderVideos(allVideos);

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                filterContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                const genre = e.target.getAttribute('data-genre');
                renderVideos(genre === 'All' ? allVideos : allVideos.filter(v => v.genre === genre));
            }
        });
    }
}

// =========================================================
// WATCH PAGE LOGIC (NEW)
// =========================================================
function initializeWatchPage() {
    const player = document.getElementById('main-player');
    if (!player) return; // Exit if not on watch page

    // 1. Get ID from URL (e.g., watch.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));

    // 2. Find Video Data
    const video = allVideos.find(v => v.id === videoId);

    if (video) {
        // Update UI
        document.title = `${video.title} | We Bomma`;
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-uploader').textContent = video.uploader;
        document.getElementById('video-genre-tag').textContent = video.genre;
        document.getElementById('video-desc').textContent = video.desc;
        
       // Use your Google Drive video
if (video.videoUrl) {
    player.src = video.videoUrl;
} else {
    // fallback demo video if no URL is set
    player.src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
}
player.poster = video.image;

        // Populate Sidebar with other videos
        const recommendations = allVideos.filter(v => v.id !== videoId);
        const sidebar = document.getElementById('recommended-list');
        sidebar.innerHTML = recommendations.map(rec => `
            <a href="watch.html?id=${rec.id}" class="side-video-card">
                <img src="${rec.image}" alt="thumb">
                <div class="side-video-info">
                    <h4>${rec.title}</h4>
                    <p>${rec.uploader}</p>
                </div>
            </a>
        `).join('');
    } else {
        document.querySelector('.container').innerHTML = "<h1>Video not found.</h1>";
    }
}

// =========================================================
// UPLOAD LOGIC (Unchanged)
// =========================================================
function initializeUploadForm() {
    const form = document.getElementById('upload-form');
    if (!form) return; 

    const steps = form.querySelectorAll('.upload-step');
    const stepIndicators = form.querySelectorAll('.step');
    const publishBtn = document.getElementById('publish-btn');
    const certifyCheckbox = document.getElementById('certify');
    const fileInput = document.getElementById('video-file');
    const progressBar = document.getElementById('upload-progress');
    const fileNameDisplay = document.getElementById('file-name-display');

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((s, i) => s.style.display = i === index ? 'block' : 'none');
        stepIndicators.forEach((s, i) => s.classList.toggle('active', i === index));
        currentStep = index;
    }

    if(fileInput) {
        fileInput.addEventListener('change', () => {
            if(fileInput.files.length > 0) {
                fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) clearInterval(interval);
                    else { width += 10; progressBar.style.width = width + '%'; }
                }, 100);
            }
        });
    }

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-next')) showStep(currentStep + 1);
        if (e.target.classList.contains('btn-prev')) showStep(currentStep - 1);
    });

    form.addEventListener('change', () => {
        if (currentStep === 2) publishBtn.disabled = !certifyCheckbox.checked;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Success! Film submitted.");
        form.reset();
        showStep(0);
    });
    
    showStep(0);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeHomepage();
    initializeUploadForm();
    initializeWatchPage();

});
