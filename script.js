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
// IMPORTANT: STOP ALL MEDIA ON INITIAL LOAD
// =========================================================

if (songAudio) {
  songAudio.pause();
  songAudio.currentTime = 150;
}

if (mainVideo) {
  mainVideo.pause();
  mainVideo.currentTime = 0;
}

if (page2Audio) {
  page2Audio.pause();
  page2Audio.currentTime = 0;
}


// =========================================================
// PAGE SWITCHING
// =========================================================

function showPage(page) {

  // Stop Gift 1 song unless we are actually on Gift 1
  if (page !== gift1 && songAudio) {
    songAudio.pause();
  }

  // Stop video unless we are actually on video page
  if (page !== videoPage && mainVideo) {
    mainVideo.pause();
  }

  // Stop Page 2 music unless we are actually on Page 2
  if (page !== page2 && page2Audio) {
    page2Audio.pause();
    page2Audio.currentTime = 0;
  }

  // Hide all pages
  allPages.forEach(p => {
    if (p) {
      p.classList.remove('page--active');
    }
  });

  // Show requested page
  if (page) {
    page.classList.add('page--active');
  }
}


// =========================================================
// BUILD PHOTO REELS
// =========================================================

function buildReel(container) {

  if (!container) return;

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

  // Show Page 2
  showPage(page2);

  // Start Page 2 music
  if (page2Audio) {

    page2Audio.currentTime = 0;

    const playPromise = page2Audio.play();

    if (playPromise !== undefined) {

      playPromise.catch(() => {

        // Browser fallback
        document.addEventListener(
          'click',
          function resumeMusic() {

            if (page2.classList.contains('page--active')) {
              page2Audio.play().catch(() => {});
            }

          },
          { once: true }
        );

      });
    }
  }
}


// Attach Go Ahead button

const goAheadBtn = document.getElementById('goAheadBtn');

if (goAheadBtn) {
  goAheadBtn.addEventListener('click', goAhead);
}


// =========================================================
// PAGE 2 → PAGE 3
// =========================================================

const moreGiftsBtn =
  document.getElementById('moreGiftsBtn');

if (moreGiftsBtn) {

  moreGiftsBtn.addEventListener(
    'click',
    function () {

      if (page2Audio) {
        page2Audio.pause();
        page2Audio.currentTime = 0;
      }

      showPage(page3);
    }
  );
}


// =========================================================
// PAGE 3 → GIFTS
// =========================================================

function openGift(number) {

  // -----------------------------
  // GIFT 1
  // -----------------------------

  if (number === 1) {

    showPage(gift1);

    setupSongPlayback();
  }


  // -----------------------------
  // GIFT 2
  // -----------------------------

  else if (number === 2) {

    showPage(gift2);

    const letter =
      document.getElementById('letter');

    if (letter) {

      letter.style.animation = 'none';

      void letter.offsetWidth;

      letter.style.animation = '';
    }
  }


  // -----------------------------
  // GIFT 3
  // -----------------------------

  else if (number === 3) {

    showPage(gift3);

    resetNoButton();
  }
}


// Gift buttons

document
  .querySelectorAll('.gift-box')
  .forEach(box => {

    box.addEventListener(
      'click',
      function () {

        const number =
          Number(box.dataset.gift);

        openGift(number);
      }
    );
  });


// =========================================================
// GIFT 1 — SONG
// =========================================================

const SONG_START = 150;
const SONG_END = 210;


// Prepare song WITHOUT playing

function setupSongPlayback() {

  if (!songAudio) return;

  songAudio.pause();

  songAudio.currentTime = SONG_START;
}


// Make sure song never starts outside Gift 1

if (songAudio) {

  songAudio.addEventListener(
    'play',
    function () {

      // If Gift 1 isn't visible,
      // immediately stop the song.

      if (!gift1.classList.contains('page--active')) {

        songAudio.pause();

        return;
      }


      // Keep playback inside 2:30–3:30

      if (
        songAudio.currentTime < SONG_START ||
        songAudio.currentTime >= SONG_END
      ) {

        songAudio.currentTime = SONG_START;
      }
    }
  );


  // Stop at 3:30

  songAudio.addEventListener(
    'timeupdate',
    function () {

      if (songAudio.currentTime >= SONG_END) {

        songAudio.pause();

        songAudio.currentTime = SONG_START;
      }
    }
  );
}


// Stop song

function stopSong() {

  if (!songAudio) return;

  songAudio.pause();

  songAudio.currentTime = SONG_START;
}


// =========================================================
// GIFT 3 — ESCAPING NO BUTTON
// =========================================================

const noBtn =
  document.getElementById('noBtn');

const questionBtns =
  document.querySelector('.question-btns');


function resetNoButton() {

  if (!noBtn) return;

  noBtn.style.position = 'static';
  noBtn.style.left = '';
  noBtn.style.top = '';
}


function moveNoButton() {

  if (!noBtn || !questionBtns) return;

  const containerRect =
    questionBtns.getBoundingClientRect();

  const btnRect =
    noBtn.getBoundingClientRect();

  const maxX =
    Math.max(
      containerRect.width - btnRect.width,
      40
    );

  const newX =
    Math.random() * maxX;

  const newY =
    (Math.random() - 0.5) * 120;

  noBtn.style.position = 'absolute';

  noBtn.style.left =
    `${newX}px`;

  noBtn.style.top =
    `${newY + 20}px`;
}


if (noBtn) {

  noBtn.addEventListener(
    'mouseenter',
    moveNoButton
  );

  noBtn.addEventListener(
    'click',
    function (e) {

      e.preventDefault();

      moveNoButton();
    }
  );

  noBtn.addEventListener(
    'touchstart',
    function (e) {

      e.preventDefault();

      moveNoButton();
    }
  );
}


// =========================================================
// YES → VIDEO PAGE
// =========================================================

const yesBtn =
  document.getElementById('yesBtn');


if (yesBtn) {

  yesBtn.addEventListener(
    'click',
    showVideo
  );
}


function showVideo() {

  // Stop everything else

  if (page2Audio) {
    page2Audio.pause();
  }

  if (songAudio) {
    songAudio.pause();
  }

  // Show video page

  showPage(videoPage);


  // IMPORTANT:
  // Video does NOT autoplay.

  if (mainVideo) {

    mainVideo.pause();

    mainVideo.currentTime = 0;
  }
}


// =========================================================
// BACK TO GIFTS
// =========================================================

function backToGifts() {

  // Stop Page 2 music

  if (page2Audio) {

    page2Audio.pause();

    page2Audio.currentTime = 0;
  }


  // Stop song

  stopSong();


  // Stop video

  if (mainVideo) {

    mainVideo.pause();

    mainVideo.currentTime = 0;
  }


  // Return to gifts

  showPage(page3);
}


// Back buttons

document
  .querySelectorAll('[data-back]')
  .forEach(btn => {

    btn.addEventListener(
      'click',
      backToGifts
    );
  });