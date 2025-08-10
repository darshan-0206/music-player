document.addEventListener("DOMContentLoaded", () => {
  const songs = [
    {
      songName: "We Don't Talk Anymore",
      filePath: "assets/songs/Song1.mp3",
      coverPath: "assets/images/cover1.jpg",
      liked: false,
    },
    {
      songName: "Dusk Till Dawn",
      filePath: "assets/songs/Song2.mp3",
      coverPath: "assets/images/cover2.jpg",
      liked: false,
    },
    {
      songName: "What Makes You Beautiful",
      filePath: "assets/songs/Song3.mp3",
      coverPath: "assets/images/cover3.jpg",
      liked: false,
    },
    {
      songName: "Hymn For The Weekend",
      filePath: "assets/songs/Song4.mp3",
      coverPath: "assets/images/cover4.jpg",
      liked: false,
    },
    {
      songName: "Hall Of Fame",
      filePath: "assets/songs/Song5.mp3",
      coverPath: "assets/images/cover5.jpg",
      liked: false,
    },
    {
      songName: "Perfect",
      filePath: "assets/songs/Song6.mp3",
      coverPath: "assets/images/cover6.jpg",
      liked: false,
    },
  ];

  songs.sort((a, b) => a.songName.localeCompare(b.songName));

  let songIndex = 0;
  let isShuffleOn = false;
  let isLoopOn = false;
  let shuffleOrder = [];
  let audioElement = new Audio(songs[songIndex].filePath);

  const get = (id) => document.getElementById(id);
  const cardContainer = get("card-cont");
  const musiccover = get("musiccover");
  const masterPlay = get("masterplay");
  const masterPause = get("masterpause");
  const myProgressBar = get("myProgressBar");
  const masterSongName = get("mastersongName");
  const timestamp = get("time");
  const duration = get("duration");
  const prev = get("prev");
  const next = get("next");
  const heartout = get("heartout");
  const heartfill = get("heartfill");
  const shuffleIcon = get("shuffle-button");
  const loopIcon = get("loop-button");
  const volumeSlider = get("volume-slider");

  const bg1 = get("bg1");
  const bg2 = get("bg2");
  const bannertitle = get("bannertitle");
  const dots = document.querySelectorAll(".slider-dots .dot");

  let songCards = [];

  const updateShuffleOrder = () => {
    shuffleOrder = songs.map((_, i) => i);
    for (let i = shuffleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffleOrder[i], shuffleOrder[j]] = [shuffleOrder[j], shuffleOrder[i]];
    }
  };

  const updateHeartState = () => {
    heartout?.classList.toggle("hidy", songs[songIndex].liked);
    heartfill?.classList.toggle("hidy", !songs[songIndex].liked);
  };

  const syncSongCardButtons = () => {
    songCards.forEach((card, i) => {
      const [playBtn, pauseBtn] = card.querySelectorAll(".playme");
      const isActive = i === songIndex && !audioElement.paused;
      playBtn.classList.toggle("hidy", isActive);
      pauseBtn.classList.toggle("hidy", !isActive);
    });
  };

  const updateSongDetails = () => {
    audioElement.pause();
    audioElement.src = songs[songIndex].filePath;
    musiccover.src = songs[songIndex].coverPath;
    masterSongName.textContent = songs[songIndex].songName;
    audioElement.currentTime = 0;
    myProgressBar.value = 0;
    updateHeartState();
    syncSongCardButtons();
  };

  const syncUIAfterSongChange = () => {
    masterPlay.classList.add("hidy");
    masterPause.classList.remove("hidy");
    syncSongCardButtons();
  };

  const populateSongCards = () => {
    songs.forEach((song, i) => {
      const card = document.createElement("div");
      card.className = "song-card";
      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${song.coverPath}" class="card-img" />
          <div class="overlay-controls">
            <button class="playme"><img src="assets/icons/blue_mus_play.svg"></button>
            <button class="playme hidy"><img src="assets/icons/blue_mus_pause.svg"></button>
          </div>
        </div>
        <span class="song-name">${song.songName}</span>
      `;
      cardContainer.appendChild(card);
      songCards.push(card);

      const [playBtn, pauseBtn] = card.querySelectorAll(".playme");

      playBtn.addEventListener("click", () => {
        songIndex = i;
        updateSongDetails();
        audioElement.play();
        syncUIAfterSongChange();
      });

      pauseBtn.addEventListener("click", () => {
        audioElement.pause();
        masterPlay.classList.remove("hidy");
        masterPause.classList.add("hidy");
        syncSongCardButtons();
      });
    });
  };

  const togglePlay = () => {
    if (audioElement.paused) {
      audioElement.play();
      masterPlay.classList.add("hidy");
      masterPause.classList.remove("hidy");
    } else {
      audioElement.pause();
      masterPlay.classList.remove("hidy");
      masterPause.classList.add("hidy");
    }
    syncSongCardButtons();
  };

  const playNext = () => {
    songIndex = isShuffleOn
      ? shuffleOrder[(shuffleOrder.indexOf(songIndex) + 1) % songs.length]
      : (songIndex + 1) % songs.length;
    updateSongDetails();
    audioElement.play();
    syncUIAfterSongChange();
  };

  const playPrev = () => {
    songIndex = isShuffleOn
      ? shuffleOrder[
          (shuffleOrder.indexOf(songIndex) - 1 + songs.length) % songs.length
        ]
      : (songIndex - 1 + songs.length) % songs.length;
    updateSongDetails();
    audioElement.play();
    syncUIAfterSongChange();
  };

  prev?.addEventListener("click", playPrev);
  next?.addEventListener("click", playNext);
  masterPlay?.addEventListener("click", togglePlay);
  masterPause?.addEventListener("click", togglePlay);

  myProgressBar?.addEventListener("input", () => {
    if (audioElement.duration) {
      audioElement.currentTime =
        (myProgressBar.value * audioElement.duration) / 100;
    }
  });

  audioElement.addEventListener("timeupdate", () => {
    const current = audioElement.currentTime;
    const dur = audioElement.duration || 1;
    myProgressBar.value = (current / dur) * 100;
    timestamp.textContent = `${Math.floor(current / 60)}:${String(
      Math.floor(current % 60)
    ).padStart(2, "0")}`;
  });

  audioElement.addEventListener("loadedmetadata", () => {
    const totalMin = Math.floor(audioElement.duration / 60);
    const totalSec = String(Math.floor(audioElement.duration % 60)).padStart(
      2,
      "0"
    );
    duration.textContent = `${totalMin}:${totalSec}`;
  });

  audioElement.addEventListener("ended", () => {
    if (!isLoopOn) playNext();
  });

  heartout?.addEventListener("click", () => {
    songs[songIndex].liked = true;
    updateHeartState();
  });

  heartfill?.addEventListener("click", () => {
    songs[songIndex].liked = false;
    updateHeartState();
  });

  shuffleIcon?.addEventListener("click", () => {
    isShuffleOn = !isShuffleOn;
    shuffleIcon.classList.toggle("activeicon", isShuffleOn);
    if (isShuffleOn) updateShuffleOrder();
  });

  loopIcon?.addEventListener("click", () => {
    isLoopOn = !isLoopOn;
    loopIcon.classList.toggle("activeicon", isLoopOn);
    audioElement.loop = isLoopOn;
  });

  volumeSlider.value = 30;
  audioElement.volume = 0.3;
  volumeSlider?.addEventListener("input", () => {
    audioElement.volume = volumeSlider.value / 100;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") playPrev();
    if (e.key === "ArrowRight") playNext();
    if (e.key.toLowerCase() === "x") shuffleIcon?.click();
    if (e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  });

  // Background image banner
  let imgIndex = 0;
  let isBg1Active = true;
  const changeImage = () => {
    const current = songs[imgIndex % songs.length];
    const targetBg = isBg1Active ? bg2 : bg1;
    const inactiveBg = isBg1Active ? bg1 : bg2;

    targetBg.style.backgroundImage = `url(${current.coverPath})`;
    targetBg.classList.add("active");
    inactiveBg.classList.remove("active");

    bannertitle.textContent = current.songName;
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === imgIndex % dots.length)
    );

    imgIndex++;
    isBg1Active = !isBg1Active;
  };

  bg1.style.backgroundImage = `url(${songs[0].coverPath})`;
  bg1.classList.add("active");
  bannertitle.textContent = songs[0].songName;
  setInterval(changeImage, 5000);

  // Initialize app
  populateSongCards();
  updateSongDetails();
});