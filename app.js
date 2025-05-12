document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const albumContainer = document.querySelector('.album-container');
    const audioElement = document.querySelector('#audio-element');
    const playerCover = document.querySelector('#player-cover');
    const playerTitle = document.querySelector('#player-title');
    const playerArtist = document.querySelector('#player-artist');
    const playPauseButton = document.querySelector('.play-pause');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const progressBar = document.querySelector('.progress-bar');
    const progressDisplay = document.querySelector('.progress');
    const currentTimeDisplay = document.querySelector('#current-time');
    const durationDisplay = document.querySelector('#duration');
    const volumeButton = document.querySelector('.volume-button');
    const volumeSlider = document.querySelector('.volume-slider');
    const nextButton = document.querySelector('.next-track');
    const prevButton = document.querySelector('.prev-track');
    const repeatButton = document.querySelector('.fa-redo');
    const randomButton = document.querySelector('.fa-random');

    // --- Estado do Player ---
    let currentAlbum = null;
    let isPlaying = false;
    let isRepeat = false;
    let isRandom = false;
    let currentTrackIndex = 0;

    // --- Dados dos Álbuns ---
    const albumsData = [
        {
            title: 'The Fame',
            year: 2008,
            cover: 'img/the_fame.jpg',
            audioFiles: ['01-just_dance.mp3', '02-lovegame.mp3', '03-paparazzi.mp3', '04-poker_face.mp3', '07-the_fame.mp3'],
            trackTitles: ['Just Dance', 'LoveGame', 'Paparazzi', 'Poker Face', 'The Fame'],
            artist: 'Lady Gaga',
            backgroundColor: '#443a6f'
        },
        {
            title: 'The Fame Monster',
            year: 2009,
            cover: 'img/the_fame_monster.jpg',
            audioFiles: ['01-bad_romance.mp3', '02-alejandro.mp3', '03-monster.mp3', '05-dance_in_the_dark.mp3', '06-telephone.mp3'],
            trackTitles: ['Bad Romance', 'Alejandro', 'Monster', 'Dance In The Dark', 'Telephone'],
            artist: 'Lady Gaga',
            backgroundColor: '#a83c32'
        },
        {
            title: 'Born This Way',
            year: 2011,
            cover: 'img/born_this_way.jpg',
            audioFiles: ['01-marry_the_night.mp3', '02-born_this_way.mp3', '04-judas.mp3', '13-you_and_i.mp3', '14-the_edge_of_glory.mp3'],
            trackTitles: ['Marry The Night', 'Born This Way', 'Judas', 'Yoü And I', 'The Edge Of Glory'],
            artist: 'Lady Gaga',
            backgroundColor: '#3e606f'
        },
        {
            title: 'ARTPOP',
            year: 2013,
            cover: 'img/ARTPOP.jpg',
            audioFiles: ['01-aura.mp3', '02-venus.mp3', '03-g_u_y.mp3', '09-donatella.mp3', '14-applause.mp3'],
            trackTitles: ['Aura', 'Venus', 'G.U.Y', 'Donatella', 'Applause'],
            artist: 'Lady Gaga',
            backgroundColor: '#9c6644'
        },
        {
            title: 'Joanne',
            year: 2016,
            cover: 'img/joanne.jpg',
            audioFiles: ['01-diamond_heart.mp3', '02-a_yo.mp3', '04-john_wayne.mp3', '05-dancin_ in_circles.mp3', '07-million_reasons.mp3'],
            trackTitles: ['Diamond Heart', 'A-YO', 'John Wayne', 'Dancin In Circles', 'Million Reasons'],
            artist: 'Lady Gaga',
            backgroundColor: '#545e3c'
        },
        {
            title: 'Chromatica',
            year: 2020,
            cover: 'img/chromatica.jpg',
            audioFiles: ['03-stupid_love.mp3', '04-rain_on_me.mp3', '08-911.mp3', '12-replay.mp3', '16-babylon.mp3'],
            trackTitles: ['Stupid Love', 'Rain On Me', '911', 'Replay', 'Babylon'],
            artist: 'Lady Gaga',
            backgroundColor: '#880e4f'
        },
        {
            title: 'MAYHEM',
            year: 2025,
            cover: 'img/MAYHEM.jpg',
            audioFiles: ['01-disease.mp3', '02-abracadabra.mp3', '03-garden_of_eden.mp3', '04-perfect_celebrity.mp3', '05-vanish_into_you.mp3'],
            trackTitles: ['Disease', 'Abracadabra', 'Garden Of Eden', 'Perfect Celebrity', 'Vanish Into You'],
            artist: 'Lady Gaga',
            backgroundColor: '#222f3e'
        }
    ];

    // --- Funções ---

    // Cria os cards de álbum na interface
    function createAlbumCards() {
        albumContainer.innerHTML = '';
        albumsData.forEach((album, index) => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album-card');
            albumDiv.style.backgroundColor = album.backgroundColor;
            albumDiv.dataset.albumIndex = index;

            const coverImg = document.createElement('img');
            coverImg.src = album.cover;
            coverImg.alt = `Capa do álbum ${album.title}`;

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('title-container');

            const titleHeading = document.createElement('h2');
            titleHeading.textContent = album.title;
            titleHeading.addEventListener('click', (event) => {
                event.stopPropagation();
                loadAndPlayAlbum(index);
            });
            titleHeading.style.cursor = 'pointer';

            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.addEventListener('click', (event) => {
                event.stopPropagation();
                loadAndPlayAlbum(index);
            });

            titleContainer.appendChild(titleHeading);
            titleContainer.appendChild(playButton);

            const yearParagraph = document.createElement('p');
            yearParagraph.textContent = `Ano: ${album.year}`;

            albumDiv.appendChild(coverImg);
            albumDiv.appendChild(titleContainer);
            albumDiv.appendChild(yearParagraph);

            albumDiv.addEventListener('click', () => {
                loadAndPlayAlbum(index);
            });

            albumContainer.appendChild(albumDiv);
        });
    }

    // Carrega os dados do álbum e inicia a reprodução
    function loadAndPlayAlbum(albumIndex) {
        const album = albumsData[albumIndex];
        if (!album || !album.audioFiles || album.audioFiles.length === 0) {
            console.error("Álbum inválido ou sem faixas de áudio.");
            return;
        }

        currentAlbum = album;
        currentTrackIndex = 0;
        loadAndPlayTrack();
        updatePlayerDisplay();
    }

    // Carrega e toca a faixa atual
    function loadAndPlayTrack() {
        if (!currentAlbum || !currentAlbum.audioFiles || currentAlbum.audioFiles.length === 0) {
            console.error("Álbum ou faixas de áudio inválidos.");
            return;
        }
        const trackPath = `audio/${currentAlbum.title}/${currentAlbum.audioFiles[currentTrackIndex]}`;
        audioElement.src = trackPath;

        audioElement.play()
            .then(() => {
                isPlaying = true;
                updatePlayPauseIcons();
            })
            .catch(error => {
                console.error("Erro ao iniciar a reprodução:", error);
                isPlaying = false;
                updatePlayPauseIcons();
            });
    }

    // Atualiza as informações exibidas no player
    function updatePlayerDisplay() {
        if (!currentAlbum) return;

        playerCover.src = currentAlbum.cover;
        playerTitle.textContent = `${currentAlbum.trackTitles[currentTrackIndex]}`;
        playerArtist.textContent = currentAlbum.artist;
    }

    // Função para tocar a próxima faixa
    function playNextTrack() {
        if (!currentAlbum) return;

        if (isRandom) {
            let newTrackIndex;
            do {
                newTrackIndex = Math.floor(Math.random() * currentAlbum.audioFiles.length);
            } while (newTrackIndex === currentTrackIndex);
            currentTrackIndex = newTrackIndex;
        } else {
            currentTrackIndex++;
            if (currentTrackIndex >= currentAlbum.audioFiles.length) {
                currentTrackIndex = 0;
            }
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
    }

    // Função para tocar a faixa anterior
    function playPreviousTrack() {
        if (!currentAlbum) return;

        if (isRandom) {
            let newTrackIndex;
            do {
                newTrackIndex = Math.floor(Math.random() * currentAlbum.audioFiles.length);
            } while (newTrackIndex === currentTrackIndex);
            currentTrackIndex = newTrackIndex;
        } else {
            currentTrackIndex--;
            if (currentTrackIndex < 0) {
                currentTrackIndex = currentAlbum.audioFiles.length - 1;
            }
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
    }

    // Alterna entre play e pause
    playPauseButton.addEventListener('click', () => {
        if (!currentAlbum) return;

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcons();
    });

    // Atualiza os ícones do botão play/pause
    function updatePlayPauseIcons() {
        if (playIcon && pauseIcon) {
            playIcon.style.display = isPlaying ? 'none' : 'inline-block';
            pauseIcon.style.display = isPlaying ? 'inline-block' : 'none';
        }
    }

    // Atualiza a barra de progresso e o tempo atual
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressDisplay.style.width = `${progress}%`;
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
        }
    });

    // Atualiza a duração total da música
    audioElement.addEventListener('loadedmetadata', () => {
        if (audioElement.duration) {
            durationDisplay.textContent = formatTime(audioElement.duration);
        }
    });

    // Formata o tempo em minutos:segundos
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    // Permite que o usuário clique na barra de progresso para alterar o tempo
    progressBar.addEventListener('click', (event) => {
        if (audioElement.duration && currentAlbum) {
            const clickPosition = event.offsetX / progressBar.offsetWidth;
            audioElement.currentTime = audioElement.duration * clickPosition;
        }
    });

    // Controla o volume
    volumeButton.addEventListener('click', () => {
        if (!currentAlbum) return;
        audioElement.muted = !audioElement.muted;
        volumeButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });

    // Controla o volume com o slider
    volumeSlider.addEventListener('input', () => {
        if (!currentAlbum) return;
        audioElement.volume = volumeSlider.value;
    });

    audioElement.volume = 0.5;

    // --- Inicialização ---
    createAlbumCards();

    // Event listeners para os botões de próximo e anterior
    nextButton.addEventListener('click', () => {
        if (currentAlbum) {
            playNextTrack();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentAlbum) {
            playPreviousTrack();
        }
    });

    // Event listeners para os botões de repetir e aleatório
    repeatButton.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('active', isRepeat);
        repeatButton.style.color = isRepeat ? '#0075ff' : '#cccccc';
    });

    randomButton.addEventListener('click', () => {
        isRandom = !isRandom;
        randomButton.classList.toggle('active', isRandom);
        randomButton.style.color = isRandom ? '#0075ff' : '#cccccc';
    });

    audioElement.addEventListener('ended', () => {
        if (isRepeat) {
            audioElement.play();
        } else {
            playNextTrack();
        }
    });
});
