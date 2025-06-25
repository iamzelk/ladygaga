document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const albumContainer = document.querySelector(".album-container");
  const audioElement = document.querySelector("#audio-element");
  const playerCover = document.querySelector("#player-cover");
  const playerTitle = document.querySelector("#player-title");
  const playerArtist = document.querySelector("#player-artist");
  const playPauseButton = document.querySelector(".play-pause");
  const playIcon = document.querySelector(".play-icon");
  const pauseIcon = document.querySelector(".pause-icon");
  const progressBar = document.querySelector(".progress-bar");
  const progressDisplay = document.querySelector(".progress");
  const currentTimeDisplay = document.querySelector("#current-time");
  const durationDisplay = document.querySelector("#duration");
  const volumeButton = document.querySelector(".volume-button");
  const volumeSlider = document.querySelector(".volume-slider");
  const nextButton = document.querySelector(".next-track");
  const prevButton = document.querySelector(".prev-track");
  const repeatButton = document.querySelector(".fa-redo");
  const randomButton = document.querySelector(".fa-random");
  const searchInput = document.querySelector("#search-input");

  // === State ===
  let currentAlbum = null;
  let currentTrackIndex = 0;
  let isPlaying = false;
  let isRepeat = false;
  let isRandom = false;

  // === Data ===
  const albumsData = [
    {
      title: "The Fame",
      year: 2008,
      cover: "img/the_fame.jpg",
      audioFiles: [
        "01-just_dance.mp3",
        "02-lovegame.mp3",
        "03-paparazzi.mp3",
        "04-poker_face.mp3",
      ],
      trackTitles: ["Just Dance", "LoveGame", "Paparazzi", "Poker Face"],
      artist: "Lady Gaga",
      backgroundColor: "#443a6f",
    },
    {
      title: "The Fame Monster",
      year: 2009,
      cover: "img/the_fame_monster.jpg",
      audioFiles: [
        "01-bad_romance.mp3",
        "02-alejandro.mp3",
        "03-monster.mp3",
        "06-telephone.mp3",
      ],
      trackTitles: ["Bad Romance", "Alejandro", "Monster", "Telephone"],
      artist: "Lady Gaga",
      backgroundColor: "#a83c32",
    },
    {
      title: "Born This Way",
      year: 2011,
      cover: "img/born_this_way.jpg",
      audioFiles: [
        "01-marry_the_night.mp3",
        "02-born_this_way.mp3",
        "04-judas.mp3",
        "14-the_edge_of_glory.mp3",
      ],
      trackTitles: ["Marry The Night", "Born This Way", "Judas", "The Edge Of Glory"],
      artist: "Lady Gaga",
      backgroundColor: "#3e606f",
    },
    {
      title: "ARTPOP",
      year: 2013,
      cover: "img/ARTPOP.jpg",
      audioFiles: ["01-aura.mp3", "02-venus.mp3", "03-g_u_y.mp3", "14-applause.mp3"],
      trackTitles: ["Aura", "Venus", "G.U.Y", "Applause"],
      artist: "Lady Gaga",
      backgroundColor: "#9c6644",
    },
    {
      title: "Joanne",
      year: 2016,
      cover: "img/joanne.jpg",
      audioFiles: [
        "02-a_yo.mp3",
        "04-john_wayne.mp3",
        "05-dancin_ in_circles.mp3",
        "07-million_reasons.mp3",
      ],
      trackTitles: ["A-YO", "John Wayne", "Dancin In Circles", "Million Reasons"],
      artist: "Lady Gaga",
      backgroundColor: "#545e3c",
    },
    {
      title: "Chromatica",
      year: 2020,
      cover: "img/chromatica.jpg",
      audioFiles: [
        "03-stupid_love.mp3",
        "04-rain_on_me.mp3",
        "08-911.mp3",
        "12-replay.mp3",
      ],
      trackTitles: ["Stupid Love", "Rain On Me", "911", "Replay"],
      artist: "Lady Gaga",
      backgroundColor: "#880e4f",
    },
    {
      title: "MAYHEM",
      year: 2025,
      cover: "img/MAYHEM.jpg",
      audioFiles: [
        "01-disease.mp3",
        "02-abracadabra.mp3",
        "04-perfect_celebrity.mp3",
        "05-vanish_into_you.mp3",
      ],
      trackTitles: ["Disease", "Abracadabra", "Perfect Celebrity", "Vanish Into You"],
      artist: "Lady Gaga",
      backgroundColor: "#222f3e",
    },
  ];

  // === Render Albums ===
  function createAlbumCards() {
    albumContainer.innerHTML = "";

    albumsData.forEach((album, index) => {
      const albumDiv = document.createElement("div");
      albumDiv.classList.add("album-card");
      albumDiv.style.backgroundColor = album.backgroundColor;
      albumDiv.dataset.albumIndex = index;

      const coverWrapper = document.createElement("div");
      coverWrapper.classList.add("cover-wrapper");

      const coverImg = document.createElement("img");
      coverImg.src = album.cover;
      coverImg.alt = `Capa do álbum ${album.title}`;

      const playButton = document.createElement("button");
      playButton.classList.add("play-button");
      playButton.innerHTML = '<i class="fas fa-play"></i>';

      playButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (currentAlbum === album && isPlaying) {
          audioElement.pause();
          isPlaying = false;
        } else if (currentAlbum === album && !isPlaying) {
          audioElement.play();
          isPlaying = true;
        } else {
          loadAndPlayAlbum(index);
        }
        updatePlayerDisplay();
        updatePlayPauseIcons();
        updateAlbumCardStates();
      });

      coverWrapper.appendChild(coverImg);
      coverWrapper.appendChild(playButton);

      const title = document.createElement("h2");
      title.textContent = album.title;

      const year = document.createElement("p");
      year.textContent = `Ano: ${album.year}`;

      albumDiv.appendChild(coverWrapper);
      albumDiv.appendChild(title);
      albumDiv.appendChild(year);

      albumDiv.addEventListener("click", () => {
        loadAndPlayAlbum(index);
      });

      albumContainer.appendChild(albumDiv);
    });
  }

  function loadAndPlayAlbum(index) {
    currentAlbum = albumsData[index];
    currentTrackIndex = 0;
    loadAndPlayTrack();
    updatePlayerDisplay();
    updateAlbumCardStates();
  }

  function loadAndPlayTrack() {
    if (!currentAlbum) return;
    const trackPath = `audio/${currentAlbum.title}/${currentAlbum.audioFiles[currentTrackIndex]}`;
    audioElement.src = trackPath;
    audioElement.play().then(() => {
      isPlaying = true;
      updatePlayPauseIcons();
      updateAlbumCardStates();
    }).catch((error) => {
      console.error("Erro ao reproduzir:", error);
    });
  }

  function updatePlayerDisplay() {
    playerCover.src = currentAlbum.cover;
    playerTitle.textContent = currentAlbum.trackTitles[currentTrackIndex];
    playerArtist.textContent = currentAlbum.artist;

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-check-circle", "verified-icon");
    playerArtist.appendChild(icon);
  }

  function updatePlayPauseIcons() {
    playIcon.style.display = isPlaying ? "none" : "inline-block";
    pauseIcon.style.display = isPlaying ? "inline-block" : "none";
  }

  function updateAlbumCardStates() {
    document.querySelectorAll(".album-card").forEach((card) => {
      card.classList.remove("active");
      const playBtn = card.querySelector(".play-button");
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    if (currentAlbum) {
      const index = albumsData.indexOf(currentAlbum);
      const activeCard = document.querySelector(`.album-card[data-album-index="${index}"]`);
      activeCard?.classList.add("active");
      const playBtn = activeCard?.querySelector(".play-button");
      if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
    }
  }

  function playNextTrack() {
    if (!currentAlbum) return;
    currentTrackIndex = isRandom
      ? Math.floor(Math.random() * currentAlbum.audioFiles.length)
      : (currentTrackIndex + 1) % currentAlbum.audioFiles.length;
    loadAndPlayTrack();
    updatePlayerDisplay();
  }

  function playPreviousTrack() {
    if (!currentAlbum) return;
    currentTrackIndex = isRandom
      ? Math.floor(Math.random() * currentAlbum.audioFiles.length)
      : (currentTrackIndex - 1 + currentAlbum.audioFiles.length) % currentAlbum.audioFiles.length;
    loadAndPlayTrack();
    updatePlayerDisplay();
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  // === Event Listeners ===
  playPauseButton.addEventListener("click", () => {
    if (!currentAlbum) return;
    isPlaying ? audioElement.pause() : audioElement.play();
    isPlaying = !isPlaying;
    updatePlayPauseIcons();
    updateAlbumCardStates();
  });

  nextButton.addEventListener("click", playNextTrack);
  prevButton.addEventListener("click", playPreviousTrack);

  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatButton.classList.toggle("active", isRepeat);
    repeatButton.style.color = isRepeat ? "#1db954" : "#ccc";
  });

  randomButton.addEventListener("click", () => {
    isRandom = !isRandom;
    randomButton.classList.toggle("active", isRandom);
    randomButton.style.color = isRandom ? "#1db954" : "#ccc";
  });

  volumeButton.addEventListener("click", () => {
    audioElement.muted = !audioElement.muted;
    volumeButton.innerHTML = audioElement.muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
  });

  volumeSlider.addEventListener("input", () => {
    audioElement.volume = volumeSlider.value;
  });

  audioElement.addEventListener("timeupdate", () => {
    if (audioElement.duration) {
      const pct = (audioElement.currentTime / audioElement.duration) * 100;
      progressDisplay.style.width = `${pct}%`;
      currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    }
  });

  audioElement.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audioElement.duration);
  });

  progressBar.addEventListener("click", (e) => {
    const clickPos = e.offsetX / progressBar.offsetWidth;
    audioElement.currentTime = audioElement.duration * clickPos;
  });

  audioElement.addEventListener("ended", () => {
    if (isRepeat) {
      audioElement.play();
    } else {
      playNextTrack();
    }
    updateAlbumCardStates();
  });

  // === SEARCH FUNCTIONALITY ===
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".album-card").forEach((card) => {
      const title = card.querySelector("h2")?.textContent.toLowerCase() || "";
      const visible = title.includes(query);
      card.classList.toggle("hidden", !visible);
    });
  });

  // === INIT ===
  audioElement.volume = 0.5;
  createAlbumCards();
});
