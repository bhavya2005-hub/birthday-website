// =========================================================
// SETUP
// =========================================================

const TOTAL_PHOTOS = 21;

// Pages
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');

const gift1 = document.getElementById('gift1');
const gift2 = document.getElementById('gift2');
const gift3 = document.getElementById('gift3');

const videoPage = document.getElementById('videoPage');

// Media
const page2Audio = document.getElementById('page2Audio');
const songAudio = document.getElementById('songAudio');
const mainVideo = document.getElementById('mainVideo');

// All pages
const allPages = [
  page1,
  page2,
  page3,
  gift1,
  gift2,
  gift3,
  videoPage
];


// =========================================================
// PAGE SWITCHING
// =========================================================

function showPage(page) {

  // -------------------------------------------------------
  // Stop Gift 1 song whenever we leave Gift 1
  // -------------------------------------------------------

  if (page !== gift1) {
    songAudio.pause();
  }


  // -------------------------------------------------------
  // Stop video whenever we leave video page
  // -------------------------------------------------------

  if (page !== videoPage) {
    mainVideo.pause();
  }


  // -------------------------------------------------------
  // Stop Page 2 music whenever we leave Page 2
  // -------------------------------------------------------

  if (page !== page2) {
    page2Audio.pause();
  }


  // -------------------------------------------------------
  // Hide all pages
  // -------------------------------------------------------

  allPages.forEach(p => {
    p.classList.remove('page--active');
  });


  // -------------------------------------------------------
  // Show selected page
  // -------------------------------------------------------

  page.classList.add('page--active');
}


// =========================================================
// BUILD PHOTO REELS
// =========================================================

function buildReel(container) {

  // We duplicate the photos twice.
  // This creates the seamless infinite scrolling effect.

  for (let copy = 0; copy < 2; copy++) {

    for (let i = 1; i <= TOTAL_PHOTOS; i++) {

      const img = document.createElement('img');

      img.src = `images/PHOTO${i}.JPG`;

      img.alt = '';

      container.appendChild(img);
    }
  }
}


// Build both reels

buildReel(document.getElementById('reelTop'));

buildReel(document.getElementById('reelBottom'));


// =========================================================
// PAGE 1 → PAGE 2
// =========================================================

function goAhead() {

  // Show Page 2
  showPage(page2);


  // -------------------------------------------------------
  // Start Page 2 birthday music
  // -------------------------------------------------------

  page2Audio.currentTime = 0;

  const playPromise = page2Audio.play();

  if (playPromise !== undefined) {

    playPromise.catch(() => {

      // If browser blocks autoplay,
      // try again after the next user interaction.

      const resumeOnTap = () => {

        page2Audio.play().catch(() => {});

        document.removeEventListener(
          'click',
          resumeOnTap
        );
      };

      document.addEventListener(
        'click',
        resumeOnTap,
        { once: true }
      );
    });
  }
}


document
  .getElementById('goAheadBtn')
  .addEventListener('click', goAhead);


// =========================================================
// PAGE 2 → GIFTS
// =========================================================

function showGifts() {

  // Stop Page 2 music
  page2Audio.pause();

  page2Audio.currentTime = 0;

  // Show gifts page
  showPage(page3);
}


document
  .getElementById('moreGiftsBtn')
  .addEventListener('click', showGifts);


// =========================================================
// PAGE 3 → OPEN A GIFT
// =========================================================

function openGift(number) {

  // -------------------------------------------------------
  // GIFT 1 — SONG
  // -------------------------------------------------------

  if (number === 1) {

    showPage(gift1);

    setupSongPlayback();
  }


  // -------------------------------------------------------
  // GIFT 2 — LETTER
  // -------------------------------------------------------

  else if (number === 2) {

    showPage(gift2);


    // Restart letter animation

    const letter = document.getElementById('letter');

    letter.style.animation = 'none';

    void letter.offsetWidth;

    letter.style.animation = '';
  }


  // -------------------------------------------------------
  // GIFT 3 — VIDEO QUESTION
  // -------------------------------------------------------

  else if (number === 3) {

    showPage(gift3);

    resetNoButton();
  }
}


// Add click events to gift boxes

document
  .querySelectorAll('.gift-box')
  .forEach(box => {

    box.addEventListener('click', () => {

      const giftNumber = Number(
        box.dataset.gift
      );

      openGift(giftNumber);
    });
  });


// =========================================================
// GIFT 1 — SONG
// =========================================================

// 2:30
const SONG_START = 150;

// 3:30
const SONG_END = 210;


// ---------------------------------------------------------
// Prepare song
// ---------------------------------------------------------

function setupSongPlayback() {

  // IMPORTANT:
  // Do NOT play the song automatically.

  songAudio.pause();

  // Start the player at 2:30
  // so when she presses Play,
  // it starts from the part we want.

  songAudio.currentTime = SONG_START;
}


// ---------------------------------------------------------
// When she manually presses Play
// ---------------------------------------------------------

songAudio.addEventListener('play', () => {

  // If somehow the player is outside
  // our desired section, return to 2:30.

  if (
    songAudio.currentTime < SONG_START ||
    songAudio.currentTime >= SONG_END
  ) {

    songAudio.currentTime = SONG_START;
  }
});


// ---------------------------------------------------------
// Stop song at 3:30
// ---------------------------------------------------------

songAudio.addEventListener('timeupdate', () => {

  if (songAudio.currentTime >= SONG_END) {

    songAudio.pause();

    songAudio.currentTime = SONG_START;
  }
});


// ---------------------------------------------------------
// Stop / reset song
// ---------------------------------------------------------

function stopSong() {

  songAudio.pause();

  songAudio.currentTime = SONG_START;
}


// =========================================================
// GIFT 3 — ESCAPING "NO" BUTTON
// =========================================================

const noBtn = document.getElementById('noBtn');

const questionBtns =
  document.querySelector('.question-btns');


// ---------------------------------------------------------
// Reset NO button
// ---------------------------------------------------------

function resetNoButton() {

  noBtn.style.position = 'static';

  noBtn.style.left = '';

  noBtn.style.top = '';
}


// ---------------------------------------------------------
// Move NO button
// ---------------------------------------------------------

function moveNoButton() {

  const containerRect =
    questionBtns.getBoundingClientRect();

  const btnRect =
    noBtn.getBoundingClientRect();


  const maxX = Math.max(
    containerRect.width - btnRect.width,
    40
  );


  const maxY = Math.max(
    containerRect.height - btnRect.height,
    40
  );


  // Random horizontal position

  const newX =
    Math.random() * maxX;


  // Small vertical movement

  const newY =
    (Math.random() - 0.5) * 120;


  noBtn.style.position = 'absolute';

  noBtn.style.left =
    `${newX}px`;

  noBtn.style.top =
    `${newY + 20}px`;
}


// ---------------------------------------------------------
// Desktop
// ---------------------------------------------------------

noBtn.addEventListener(
  'mouseenter',
  moveNoButton
);


// ---------------------------------------------------------
// Click
// ---------------------------------------------------------

noBtn.addEventListener(
  'click',
  (e) => {

    e.preventDefault();

    moveNoButton();
  }
);


// ---------------------------------------------------------
// Mobile
// ---------------------------------------------------------

noBtn.addEventListener(
  'touchstart',
  (e) => {

    e.preventDefault();

    moveNoButton();
  }
);


// =========================================================
// YES → VIDEO PAGE
// =========================================================

document
  .getElementById('yesBtn')
  .addEventListener(
    'click',
    showVideo
  );


function showVideo() {

  // Show video page

  showPage(videoPage);


  // IMPORTANT:
  // Video must NOT autoplay.

  mainVideo.pause();

  mainVideo.currentTime = 0;
}


// =========================================================
// BACK TO GIFTS
// =========================================================

function backToGifts() {

  // -------------------------------------------------------
  // Stop song
  // -------------------------------------------------------

  stopSong();


  // -------------------------------------------------------
  // Stop video
  // -------------------------------------------------------

  mainVideo.pause();

  mainVideo.currentTime = 0;


  // -------------------------------------------------------
  // Stop Page 2 music
  // -------------------------------------------------------

  page2Audio.pause();

  page2Audio.currentTime = 0;


  // -------------------------------------------------------
  // Return to gifts
  // -------------------------------------------------------

  showPage(page3);
}


// Add Back button functionality

document
  .querySelectorAll('[data-back]')
  .forEach(btn => {

    btn.addEventListener(
      'click',
      backToGifts
    );
  });