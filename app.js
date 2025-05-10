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
    const progressBar = document.querySelector('.progress-bar'); // Alterado para .progress-bar
    const progressDisplay = document.querySelector('.progress'); // Novo: Elemento para a barra de progresso visual
    const currentTimeDisplay = document.querySelector('#current-time');
    const durationDisplay = document.querySelector('#duration');
    const volumeButton = document.querySelector('.volume-button');
    const volumeSlider = document.querySelector('.volume-slider');
    const nextButton = document.querySelector('.next-track');
    const prevButton = document.querySelector('.prev-track');

    // --- Estado do Player ---
    let currentAlbum = null;
    let isPlaying = false;
    let originalBackgroundColor = '#121212'; // Cor de fundo padrão

    // --- Dados dos Álbuns ---
    const albumsData = [
        {
            title: 'The Fame',
            year: 2008,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video116/v4/12/e9/1e/12e91eaf-1ed9-c38f-a0cb-5134d425adab/Jobedf0124b-9306-45a7-8d8b-e6373cf1bd6d-154984021-PreviewImage_preview_image_nonvideo_sdr-Time1693423091097.png/316x316bb.jpg',
            audioFiles: ['01-just_dance.mp3', '02-lovegame.mp3', '03-paparazzi.mp3', '04-poker_face.mp3'],
            trackTitles: ['Just Dance', 'LoveGame', 'Paparazzi', 'Poker Face'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#443a6f' // Um roxo escuro
        },
        {
            title: 'The Fame Monster',
            year: 2009,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/5b/a4/0a/5ba40a95-9bf6-3b0c-ee7b-82f0bf71f589/10UMGIM00578.rgb.jpg/316x316bb.jpg',
            audioFiles: ['01-bad_romance.mp3', '02-alejandro.mp3', '03-monster.mp3', '06-telephone.mp3'],
            trackTitles: ['Bad Romance', 'Alejandro', 'Monster', 'Telephone'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#a83c32' // Um vermelho escuro
        },
        {
            title: 'Born This Way',
            year: 2011,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video115/v4/01/f8/75/01f875d6-19fb-b068-c730-853c6b98669a/Jobb2d6eca9-9008-4dd1-b1e8-6b6c70c7a9c3-114006709-PreviewImage_preview_image_nonvideo_sdr-Time1621641746478.png/316x316bb.jpg',
            audioFiles: ['01-marry_the_night.mp3', '02-born_this_way.mp3', '04-judas.mp3', '14-the_edge_of_glory.mp3'],
            trackTitles: ['Marry The Night', 'Born This Way', 'Judas', 'The Edge Of Glory'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#3e606f'
        },
        {
            title: 'ARTPOP',
            year: 2013,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0c/33/64/0c336478-aaa9-95dc-d373-f6fb8510b170/13UAAIM69752.rgb.jpg/316x316bb.jpg',
            audioFiles: ['01-aura.mp3', '02-venus.mp3', '03-g_u_y.mp3', '14-applause.mp3'],
            trackTitles: ['Aura', 'Venus', 'G.U.Y', 'Applause'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#9c6644'
        },
        {
            title: 'Joanne',
            year: 2016,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c7/79/a9/c779a941-7961-7dfa-99b8-0a99ebbfd1b8/16UMGIM68302.rgb.jpg/316x316bb.webp.',
            audioFiles: ['02-a_yo.mp3', '04-john_wayne.mp3', '05-dancin_ in_circles.mp3', '07-million_reasons.mp3'],
            trackTitles: ['A-YO', 'John Wayne', 'Dancin In Circles', 'Million Reasons'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#545e3c'
        },
        {
            title: 'Chromatica',
            year: 2020,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5d/4d/f9/5d4df96a-e95e-2fe9-404a-5d570513762d/20UMGIM15390.rgb.jpg/316x316bb.webp',
            audioFiles: ['03-stupid_love.mp3', '04-rain_on_me.mp3', '08-911.mp3', '12-replay.mp3'],
            trackTitles: ['Stupid Love', 'Rain On Me', '911', 'Replay'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#880e4f' // Um rosa escuro
        },
        {
            title: 'MAYHEM',
            year: 2025,
            cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/85/96/e5/8596e5c9-ea5d-f074-14ab-0def74d49a41/Job55a60f4d-834e-43b4-b0ac-bc65708cbd78-187464330-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_366977506_2078765148-Time1741332248310.png/316x316bb.jpg',
            audioFiles: ['01-disease.mp3', '02-abracadabra.mp3', '04-perfect_celebrity.mp3', '05-vanish_into_you.mp3'],
            trackTitles: ['Disease', 'Abracadabra', 'Perfect Celebrity', 'Vanish Into You'],
            artist: 'Lady Gaga',
            currentTrackIndex: 0,
            backgroundColor: '#222f3e'
        }
    ];

    // --- Funções ---

    // Cria os cards de álbum na interface
    function createAlbumCards() {
        albumsData.forEach(album => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album-card');

            const coverImg = document.createElement('img');
            coverImg.src = album.cover;
            coverImg.alt = `Capa do álbum ${album.title}`;

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('title-container');

            const titleHeading = document.createElement('h2');
            titleHeading.textContent = album.title;
            titleHeading.addEventListener('click', (event) => {
                event.stopPropagation();
                loadAndPlayAlbum(album);
            });
            titleHeading.style.cursor = 'pointer';

            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.addEventListener('click', (event) => {
                event.stopPropagation();
                // Load and play on click of the play button
                loadAndPlayAlbum(album);
            });

            titleContainer.appendChild(titleHeading);
            titleContainer.appendChild(playButton);

            const yearParagraph = document.createElement('p');
            yearParagraph.textContent = `Ano: ${album.year}`;

            albumDiv.appendChild(coverImg);
            albumDiv.appendChild(titleContainer);
            albumDiv.appendChild(yearParagraph);

            albumDiv.addEventListener('click', () => {
                // Load and play on click of the album card
                loadAndPlayAlbum(album);
            });

            albumContainer.appendChild(albumDiv);
        });
    }

    // Carrega os dados do álbum e inicia a reprodução
    function loadAndPlayAlbum(album) {
        if (!album || !album.audioFiles || album.audioFiles.length === 0) {
            console.error("Álbum inválido ou sem faixas de áudio.");
            return;
        }

        currentAlbum = album;
        currentAlbum.currentTrackIndex = 0;
        loadAndPlayTrack();
        updatePlayerDisplay();

        // Start playing the audio
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

    function loadAndPlayTrack() {
        audioElement.src = `/audio/${currentAlbum.title}/${currentAlbum.audioFiles[currentAlbum.currentTrackIndex]}`;
    }

    // Atualiza as informações exibidas no player
    function updatePlayerDisplay() {
        if (!currentAlbum) return;

        playerCover.src = currentAlbum.cover;
        playerTitle.textContent = currentAlbum.trackTitles[currentAlbum.currentTrackIndex];
        playerArtist.textContent = currentAlbum.artist;
    }

    function playNextTrack() {
        if (!currentAlbum) return;
        currentAlbum.currentTrackIndex++;
        if (currentAlbum.currentTrackIndex >= currentAlbum.audioFiles.length) {
            currentAlbum.currentTrackIndex = 0;
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
        audioElement.play()
            .then(() => {
                isPlaying = true;
                updatePlayPauseIcons();
            })
            .catch(error => {
                console.error("Erro ao reproduzir a próxima faixa:", error);
                isPlaying = false;
                updatePlayPauseIcons();
            });
    }

    function playPreviousTrack() {
        if (!currentAlbum) return;
        currentAlbum.currentTrackIndex--;
        if (currentAlbum.currentTrackIndex < 0) {
            currentAlbum.currentTrackIndex = currentAlbum.audioFiles.length - 1;
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
        audioElement.play()
            .then(() => {
                isPlaying = true;
                updatePlayPauseIcons();
            })
            .catch(error => {
                console.error("Erro ao reproduzir a faixa anterior:", error);
                isPlaying = false;
                updatePlayPauseIcons();
            });
    }

    // Alterna entre play e pause
    playPauseButton.addEventListener('click', () => {
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
            progressDisplay.style.width = `${progress}%`; // Atualiza a barra de progresso visual
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
        if (audioElement.duration) {
            const clickPosition = event.offsetX / progressBar.offsetWidth;
            audioElement.currentTime = audioElement.duration * clickPosition;
        }
    });

    // Controla o volume
    volumeButton.addEventListener('click', () => {
        audioElement.muted = !audioElement.muted;
        volumeButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });

    // Controla o volume com o slider
    volumeSlider.addEventListener('input', () => {
        audioElement.volume = volumeSlider.value;
    });

    audioElement.volume = 0.5; // Volume inicial

    // --- Inicialização ---
    createAlbumCards();

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

});
