const container = document.getElementById('main-container');
const music = document.getElementById('bg-music');
const micBtn = document.getElementById('mic-btn');
const flames = document.querySelectorAll('.flame');
const loveNote = document.getElementById('love-note');

let touchStartY = 0;
let touchEndY = 0;

// Function to slide the container
function scrollToPage(pageNumber) {
    const yOffset = pageNumber * -100;
    container.style.transform = `translateY(${yOffset}vh)`;
}

// 1. Initial Start
function goToCake() {
    music.play();
    music.volume = 1.0;
    scrollToPage(1); // Slide to Page 2
}

// 2. Blow logic
micBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);
        
        analyzer.fftSize = 512;
        const data = new Uint8Array(analyzer.frequencyBinCount);

        micBtn.innerText = "Now Blow! 🌬️";
        let blowDuration = 0;

        function check() {
            analyzer.getByteFrequencyData(data);
            let sum = data.reduce((a, b) => a + b, 0);
            let volume = sum / data.length;

            if (volume > 45) { 
                blowDuration++; 
            } else {
                blowDuration = 0;
            }

            if (blowDuration > 10) { 
                flames.forEach(f => {
                    f.style.transition = "opacity 0.5s ease";
                    f.style.opacity = '0';
                });

                setTimeout(() => {
                    loveNote.style.display = 'flex'; // Show the swipe hint overlay
                    micBtn.style.display = 'none'; // Hide the blow button
                }, 600);
                return;
            }
            requestAnimationFrame(check);
        }
        check();
    } catch (e) {
        alert("Allow mic access to blow the candles!");
    }
});

// 3. Swipe logic
window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const threshold = 70;

    // Only allow swiping to the letter if the candles are already blown
    if (loveNote.style.display === 'flex') {
        if (swipeDistance > threshold) {
            scrollToPage(2); // Slide to Page 3
            music.volume = 0.5; // Soften music for reading
        }
    }
}
function goToCake() {
    const music = document.getElementById('bg-music');
    
    // This starts the music
    music.play().catch(error => {
        console.log("Music couldn't play automatically:", error);
    });
    
    music.volume = 1.0; // Set volume to 100%
    scrollToPage(1);    // Move to the Cake page
}