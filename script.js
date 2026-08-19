// =========================================================
// SETUP
// =========================================================

const TOTAL_PHOTOS = 21;

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const gift1 = document.getElementById('gift1');
const gift2 = document.getElementById('gift2');
const gift3 = document.getElementById('gift3');
const videoPage = document.getElementById('videoPage');

const page2Audio = document.getElementById('page2Audio');
const songAudio = document.getElementById('songAudio');
const mainVideo = document.getElementById('mainVideo');

// All "page" sections, used to hide everything before showing one
const allPages = [page1, page2, page3, gift1, gift2, gift3, videoPage];

function showPage(page) {
  allPages.forEach(p => p.classList.remove('page--active'));
  page.classList.add('page--active');
}

// =========================================================
// BUILD THE PHOTO REELS (21 photos, duplicated for seamless loop)
// =========================================================

function buildReel(container) {
  // Build the sequence twice in a row so the CSS animation
  // (which moves exactly 50% of the track width) loops with no visible seam.
  for (let copy = 0; copy < 2; copy++) {
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
      const img = document.createElement('img');
      img.src = `images/PHOTO${i}.JPG`;
      img.alt = '';
      container.appendChild(img);
    }
  }
}

buildReel(document.getElementById('reelTop'));
buildReel(document.getElementById('reelBottom'));

// =========================================================
// PAGE 1 → PAGE 2
// =========================================================

function goAhead() {
  showPage(page2);

  // Use this click as the user gesture that unlocks audio autoplay.
  page2Audio.currentTime = 0;
  const playPromise = page2Audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If the browser still blocks it, try again on the next tap anywhere.
      const resumeOnTap = () => {
        page2Audio.play().catch(() => {});
        document.removeEventListener('click', resumeOnTap);
      };
      document.addEventListener('click', resumeOnTap, { once: true });
    });
  }
}

document.getElementById('goAheadBtn').addEventListener('click', goAhead);

// =========================================================
// PAGE 2 → GIFTS (PAGE 3)
// =========================================================

function showGifts() {
  // stop page 2 music completely before leaving
  page2Audio.pause();
  page2Audio.currentTime = 0;

  showPage(page3);
}

document.getElementById('moreGiftsBtn').addEventListener('click', showGifts);

// =========================================================
// PAGE 3 → OPEN A GIFT
// =========================================================

function openGift(number) {
  if (number === 1) {
    showPage(gift1);
    setupSongPlayback();
  } else if (number === 2) {
    showPage(gift2);
    // replay the rise-in animation each time the letter is opened
    const letter = document.getElementById('letter');
    letter.style.animation = 'none';
    void letter.offsetWidth; // force reflow so the animation can restart
    letter.style.animation = '';
  } else if (number === 3) {
    showPage(gift3);
    resetNoButton();
  }
}

document.querySelectorAll('.gift-box').forEach(box => {
  box.addEventListener('click', () => {
    openGift(Number(box.dataset.gift));
  });
});

// =========================================================
// GIFT 1 — SONG (only plays 2:30 → 3:30)
// =========================================================

const SONG_START = 150; // seconds (2:30)
const SONG_END = 210;   // seconds (3:30)

function setupSongPlayback() {
  songAudio.currentTime = SONG_START;
  const playPromise = songAudio.play();
  if (playPromise function setupSongPlayback() {
  songAudio.pause();
  songAudio.currentTime = SONG_START;
}!== undefined) {
    playPromise.catch(() => {});
  }
}

songAudio.addEventListener('play', () => {
  if (songAudio.currentTime < SONG_START || songAudio.currentTime >= SONG_END) {
    songAudio.currentTime = SONG_START;
  }
});

songAudio.addEventListener('timeupdate', () => {
  if (songAudio.currentTime >= SONG_END) {
    songAudio.pause();
    songAudio.currentTime = SONG_START;
  }
});

function stopSong() {
  songAudio.pause();
  songAudio.currentTime = SONG_START;
}

// =========================================================
// GIFT 3 — THE ESCAPING "NO" BUTTON
// =========================================================

const noBtn = document.getElementById('noBtn');
const questionBtns = document.querySelector('.question-btns');

function resetNoButton() {
  noBtn.style.position = 'static';
  noBtn.style.left = '';
  noBtn.style.top = '';
}

function moveNoButton() {
  const containerRect = questionBtns.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(containerRect.width - btnRect.width, 40);
  const maxY = Math.max(containerRect.height - btnRect.height, 40);

  // Pick a new random spot, roughly nearby rather than anywhere on the page,
  // so it feels playful instead of frustrating.
  const newX = Math.random() * maxX;
  const newY = (Math.random() - 0.5) * 120; // small vertical wiggle

  noBtn.style.position = 'absolute';
  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY + 20}px`;
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

document.getElementById('yesBtn').addEventListener('click', showVideo);

// =========================================================
// YES → VIDEO PAGE
// =========================================================

function showVideo() {
  showPage(videoPage);

  // Start the video ONLY after she clicks YES
  mainVideo.currentTime = 0;

  const playPromise = mainVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

// =========================================================
// BACK TO GIFTS (from any gift page)
// =========================================================

function backToGifts() {
  // stop any playing audio
  stopSong();

  // stop/reset any playing video
  mainVideo.pause();
  mainVideo.currentTime = 0;

  // Page 2 music must never restart here — it stays stopped.
  showPage(page3);
}

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', backToGifts);
});
