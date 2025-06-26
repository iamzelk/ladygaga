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
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar .search-icon');

    // --- Estado do Player ---
    let currentAlbum = null;
    let isPlaying = false;
    let isRepeat = false;
    let isRandom = false;
    let currentTrackIndex = 0;

    // --- Dados dos Álbuns da Lady Gaga ---
    // Cada objeto de álbum contém informações como título, ano, capa,
    // arquivos de áudio, títulos das faixas, artista e cor de fundo.
    const albumsData = [
        {
            title: 'The Fame',
            year: 2008,
            cover: 'img/the_fame.jpg',
            audioFiles: ['01-just_dance.mp3', '02-lovegame.mp3', '03-paparazzi.mp3', '04-poker_face.mp3'],
            trackTitles: ['Just Dance', 'LoveGame', 'Paparazzi', 'Poker Face'],
            artist: 'Lady Gaga',
            backgroundColor: '#443a6f'
        },
        {
            title: 'The Fame Monster',
            year: 2009,
            cover: 'img/the_fame_monster.jpg',
            audioFiles: ['01-bad_romance.mp3', '02-alejandro.mp3', '03-monster.mp3', '06-telephone.mp3'],
            trackTitles: ['Bad Romance', 'Alejandro', 'Monster', 'Telephone'],
            artist: 'Lady Gaga',
            backgroundColor: '#a83c32'
        },
        {
            title: 'Born This Way',
            year: 2011,
            cover: 'img/born_this_way.jpg',
            audioFiles: ['01-marry_the_night.mp3', '02-born_this_way.mp3', '04-judas.mp3', '14-the_edge_of_glory.mp3'],
            trackTitles: ['Marry The Night', 'Born This Way', 'Judas', 'The Edge Of Glory'],
            artist: 'Lady Gaga',
            backgroundColor: '#3e606f'
        },
        {
            title: 'ARTPOP',
            year: 2013,
            cover: 'img/ARTPOP.jpg',
            audioFiles: ['01-aura.mp3', '02-venus.mp3', '03-g_u_y.mp3', '14-applause.mp3'],
            trackTitles: ['Aura', 'Venus', 'G.U.Y', 'Applause'],
            artist: 'Lady Gaga',
            backgroundColor: '#9c6644'
        },
        {
            title: 'Joanne',
            year: 2016,
            cover: 'img/joanne.jpg',
            audioFiles: ['02-a_yo.mp3', '04-john_wayne.mp3', '05-dancin_ in_circles.mp3', '07-million_reasons.mp3'],
            trackTitles: ['A-YO', 'John Wayne', 'Dancin In Circles', 'Million Reasons'],
            artist: 'Lady Gaga',
            backgroundColor: '#545e3c'
        },
        {
            title: 'Chromatica',
            year: 2020,
            cover: 'img/chromatica.jpg',
            audioFiles: ['03-stupid_love.mp3', '04-rain_on_me.mp3', '08-911.mp3', '12-replay.mp3'],
            trackTitles: ['Stupid Love', 'Rain On Me', '911', 'Replay'],
            artist: 'Lady Gaga',
            backgroundColor: '#880e4f'
        },
        {
            title: 'MAYHEM',
            year: 2025,
            cover: 'img/MAYHEM.jpg',
            audioFiles: ['01-disease.mp3', '02-abracadabra.mp3', '04-perfect_celebrity.mp3', '05-vanish_into_you.mp3'],
            trackTitles: ['Disease', 'Abracadabra', 'Perfect Celebrity', 'Vanish Into You'],
            artist: 'Lady Gaga',
            backgroundColor: '#222f3e'
        }
    ];

    // --- Funções ---

    /**
     * Cria e renderiza os cards de álbum na interface.
     * Cada card inclui a capa, título, ano e um botão de play/pause.
     */
    function createAlbumCards() {
        albumContainer.innerHTML = ''; // Limpa o container antes de adicionar os cards
        albumsData.forEach((album, index) => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album-card');
            albumDiv.dataset.albumIndex = index; // Armazena o índice do álbum para referência

            // Aplica a cor de fundo individual do álbum
            albumDiv.style.backgroundColor = album.backgroundColor;

            const coverWrapper = document.createElement('div');
            coverWrapper.classList.add('cover-wrapper');

            const coverImg = document.createElement('img');
            coverImg.src = album.cover;
            coverImg.alt = `Capa do álbum ${album.title}`;

            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerHTML = '<i class="fas fa-play"></i>'; // Ícone inicial de play
            playButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o clique no botão ative o evento de clique do card

                // Lógica para play/pause direto do botão do card
                if (currentAlbum === album && isPlaying) {
                    audioElement.pause();
                    isPlaying = false;
                } else if (currentAlbum === album && !isPlaying) {
                    audioElement.play();
                    isPlaying = true;
                } else {
                    // Se um álbum diferente for clicado ou nada estiver tocando
                    loadAndPlayAlbum(index);
                }
                updatePlayPauseIcons(); // Atualiza o ícone do player global
                updateAlbumCardStates(); // Atualiza o ícone no card do álbum
            });

            coverWrapper.appendChild(coverImg);
            coverWrapper.appendChild(playButton);

            const titleHeading = document.createElement('h2');
            titleHeading.textContent = album.title;

            const yearParagraph = document.createElement('p');
            yearParagraph.textContent = `Ano: ${album.year}`;

            albumDiv.appendChild(coverWrapper);
            albumDiv.appendChild(titleHeading);
            albumDiv.appendChild(yearParagraph);

            // Adiciona um evento de clique ao card completo para carregar e tocar o álbum
            albumDiv.addEventListener('click', () => {
                loadAndPlayAlbum(index);
            });

            albumContainer.appendChild(albumDiv);
        });
    }

    /**
     * Carrega os dados de um álbum específico e inicia a reprodução da primeira faixa.
     * @param {number} albumIndex - O índice do álbum nos dados `albumsData`.
     */
    function loadAndPlayAlbum(albumIndex) {
        const album = albumsData[albumIndex];
        if (!album || !album.audioFiles || album.audioFiles.length === 0) {
            console.error("Álbum inválido ou sem faixas de áudio.");
            return;
        }

        currentAlbum = album;
        currentTrackIndex = 0; // Reseta o índice da faixa para a primeira ao carregar um novo álbum
        loadAndPlayTrack();
        updatePlayerDisplay(); // Atualiza as informações do player principal
        updateAlbumCardStates(); // Atualiza o estado dos ícones nos cards de álbum
    }

    /**
     * Carrega e inicia a reprodução da faixa atual do `currentAlbum`.
     */
    function loadAndPlayTrack() {
        if (!currentAlbum || !currentAlbum.audioFiles || currentAlbum.audioFiles.length === 0) {
            console.error("Álbum ou faixas de áudio inválidos.");
            return;
        }
        // Constrói o caminho completo para o arquivo de áudio
        // CORREÇÃO: Removido .replace(/\s/g, '_') para usar o título exato do álbum para o caminho da pasta
        const trackPath = `audio/${currentAlbum.title}/${currentAlbum.audioFiles[currentTrackIndex]}`;
        audioElement.src = trackPath;

        audioElement.play()
            .then(() => {
                isPlaying = true;
                updatePlayPauseIcons(); // Atualiza o ícone de play/pause do player global
                updateAlbumCardStates(); // Atualiza o estado dos cards de álbum
            })
            .catch(error => {
                console.error("Erro ao iniciar a reprodução:", error);
                isPlaying = false;
                updatePlayPauseIcons();
                updateAlbumCardStates();
            });
    }

    /**
     * Atualiza o estado visual dos botões de play/pause nos cards de álbum.
     * Adiciona uma classe 'active' ao card do álbum que está tocando e
     * muda o ícone do botão de play para pause (e vice-versa).
     */
    function updateAlbumCardStates() {
        // Reseta todos os cards: remove a classe 'active' e define o ícone de play padrão
        document.querySelectorAll('.album-card').forEach(card => {
            card.classList.remove('active');
            const playButton = card.querySelector('.play-button');
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para ícone de play padrão
            }
        });

        // Se um álbum estiver ativo, atualiza seu card específico
        if (currentAlbum) {
            const activeCardIndex = albumsData.indexOf(currentAlbum);
            // Seleciona o card do álbum usando o atributo data-album-index
            const activeCard = document.querySelector(`.album-card[data-album-index="${activeCardIndex}"]`);

            if (activeCard) {
                activeCard.classList.add('active'); // Marca o card como ativo

                const playButton = activeCard.querySelector('.play-button');
                if (playButton) {
                    if (isPlaying) {
                        playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Ícone de pause se estiver tocando
                    } else {
                        playButton.innerHTML = '<i class="fas fa-play"></i>'; // Ícone de play se estiver pausado
                    }
                }
            }
        }
    }

    /**
     * Atualiza as informações da capa, título e artista no player principal.
     * Inclui a adição do ícone de artista verificado.
     */
    function updatePlayerDisplay() {
        if (!currentAlbum) return;

        playerCover.src = currentAlbum.cover;
        playerTitle.textContent = `${currentAlbum.trackTitles[currentTrackIndex]}`;
        playerArtist.textContent = currentAlbum.artist;

        // Remove quaisquer ícones de verificação existentes para evitar duplicação
        playerArtist.querySelectorAll('.verified-icon').forEach(icon => icon.remove());

        // Cria e adiciona o ícone de artista verificado
        const verifiedIcon = document.createElement('i');
        verifiedIcon.classList.add('fas', 'fa-check-circle', 'verified-icon'); // Usando ícone Font Awesome
        playerArtist.appendChild(verifiedIcon); // Anexa o ícone após o nome do artista
    }

    /**
     * Toca a próxima faixa na lista de áudio do álbum atual.
     * Respeita os modos aleatório e repetição.
     */
    function playNextTrack() {
        if (!currentAlbum) return;

        if (isRandom) {
            let newTrackIndex;
            // Garante que a próxima faixa aleatória não seja a mesma que a atual
            do {
                newTrackIndex = Math.floor(Math.random() * currentAlbum.audioFiles.length);
            } while (newTrackIndex === currentTrackIndex);
            currentTrackIndex = newTrackIndex;
        } else {
            currentTrackIndex++;
            if (currentTrackIndex >= currentAlbum.audioFiles.length) {
                currentTrackIndex = 0; // Volta para a primeira faixa se chegar ao final
            }
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
        updateAlbumCardStates(); // Atualiza o estado dos cards de álbum
    }

    /**
     * Toca a faixa anterior na lista de áudio do álbum atual.
     * Respeita os modos aleatório e repetição.
     */
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
                currentTrackIndex = currentAlbum.audioFiles.length - 1; // Vai para a última faixa se estiver na primeira
            }
        }
        loadAndPlayTrack();
        updatePlayerDisplay();
        updateAlbumCardStates(); // Atualiza o estado dos cards de álbum
    }

    // --- Event Listeners para Controles do Player Principal ---

    // Alterna entre play e pause no player principal
    playPauseButton.addEventListener('click', () => {
        if (!currentAlbum) return; // Não faz nada se nenhum álbum estiver carregado

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcons(); // Atualiza o ícone do botão play/pause do player
        updateAlbumCardStates(); // Atualiza o estado dos cards de álbum
    });

    /**
     * Atualiza os ícones de play/pause no botão do player principal.
     */
    function updatePlayPauseIcons() {
        if (playIcon && pauseIcon) {
            playIcon.style.display = isPlaying ? 'none' : 'inline-block';
            pauseIcon.style.display = isPlaying ? 'inline-block' : 'none';
        }
    }

    // Atualiza a barra de progresso e o tempo atual da faixa
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressDisplay.style.width = `${progress}%`; // Atualiza a largura da barra de progresso
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime); // Atualiza o tempo atual
        }
    });

    // Atualiza a duração total da música quando os metadados são carregados
    audioElement.addEventListener('loadedmetadata', () => {
        if (audioElement.duration) {
            durationDisplay.textContent = formatTime(audioElement.duration);
        }
    });

    /**
     * Formata um tempo em segundos para o formato "minutos:segundos".
     * @param {number} timeInSeconds - O tempo em segundos.
     * @returns {string} O tempo formatado (ex: "3:45").
     */
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    // Permite que o usuário clique na barra de progresso para alterar o tempo da faixa
    progressBar.addEventListener('click', (event) => {
        if (audioElement.duration && currentAlbum) { // Só permite se houver uma faixa carregada
            // Calcula a posição do clique na barra de progresso
            const clickPosition = event.offsetX / progressBar.offsetWidth;
            // Define o tempo de reprodução com base na posição do clique
            audioElement.currentTime = audioElement.duration * clickPosition;
        }
    });

    // Controla o mute/unmute do volume
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

    audioElement.volume = 0.5; // Define o volume inicial ao carregar a página

    // Listener para quando a música termina de tocar
    audioElement.addEventListener('ended', () => {
        if (isRepeat) {
            audioElement.play(); // Se o modo repetir estiver ativo, toca a música atual novamente
        } else {
            playNextTrack(); // Caso contrário, toca a próxima música
        }
        updateAlbumCardStates(); // Atualiza o estado dos cards de álbum ao terminar a faixa
    });

    // --- Inicialização ---
    createAlbumCards(); // Chama a função para criar e exibir os cards dos álbuns ao carregar a página

    // Event listeners para os botões de próximo e anterior do player
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
        // Alterna a classe 'active' para indicar se o modo está ligado/desligado
        repeatButton.classList.toggle('active', isRepeat);
        // Altera a cor do ícone do botão
        repeatButton.style.color = isRepeat ? '#0075ff' : '#cccccc';
    });

    randomButton.addEventListener('click', () => {
        isRandom = !isRandom;
        randomButton.classList.toggle('active', isRandom);
        randomButton.style.color = isRandom ? '#0075ff' : '#cccccc';
    });

    // Garante que a cor inicial dos botões de repetir e aleatório seja aplicada
    repeatButton.style.color = isRepeat ? '#0075ff' : '#cccccc';
    randomButton.style.color = isRandom ? '#0075ff' : '#cccccc';

    // --- Sidebar Navigation (para lidar com o estado 'active' dos itens da sidebar) ---
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.addEventListener("click", function () {
            navItems.forEach((nav) => nav.classList.remove("active")); // Remove 'active' de todos
            this.classList.add("active"); // Adiciona 'active' ao item clicado
            console.log(`Navegado para: ${this.querySelector('span').textContent}`);
        });
    });

    // --- Funcionalidade de Busca ---
    /**
     * Filtra os cards de álbum com base no texto de pesquisa.
     * Esconde os cards que não correspondem e mostra os que correspondem.
     * Os cards encontrados recebem uma classe para serem exibidos em um tamanho menor.
     * @param {string} query - O texto de pesquisa.
     */
    function filterAlbums(query) {
        const normalizedQuery = query.toLowerCase();
        
        // Se a query de busca estiver vazia, mostra todos os álbuns no tamanho normal
        if (normalizedQuery === '') {
            document.querySelectorAll('.album-card').forEach(card => {
                card.style.display = 'flex'; // Mostra todos os cards
                card.classList.remove('search-result'); // Remove a classe de resultado de busca
            });
            // Opcional: Reajustar o grid se todos os álbuns voltarem ao tamanho normal
            albumContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
            return; // Sai da função
        }

        // Se há uma query de busca, filtra os álbuns
        document.querySelectorAll('.album-card').forEach(card => {
            const titleElement = card.querySelector('h2');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            
            // Pega o artista dos dados originais do álbum usando o índice
            const albumIndex = parseInt(card.dataset.albumIndex);
            const album = albumsData[albumIndex];
            const artist = album ? album.artist.toLowerCase() : '';
            
            // Verifica se o título do álbum ou o nome do artista inclui a query
            if (title.includes(normalizedQuery) || artist.includes(normalizedQuery)) {
                card.style.display = 'flex'; // Mostra o card
                card.classList.add('search-result'); // Adiciona a classe para estilo de "tamanho pequeno"
            } else {
                card.style.display = 'none'; // Esconde o card
                card.classList.remove('search-result'); // Garante que a classe seja removida se não corresponder
            }
        });
        // Ajusta o grid para acomodar os resultados da busca com tamanhos menores
        albumContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))'; // Ajusta para tamanho menor
    }

    // Event Listener para a barra de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            filterAlbums(event.target.value);
            // Opcional: Mudar cor do ícone de busca quando há texto
            if (event.target.value.length > 0) {
                searchIcon.style.color = '#1DB954'; // Cor verde
            } else {
                searchIcon.style.color = 'white'; // Cor padrão
            }
        });

        // Event listener para quando o campo de busca ganha foco
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.backgroundColor = '#2a2a2a'; // Fundo mais escuro no foco
        });

        // Event listener para quando o campo de busca perde o foco
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.backgroundColor = '#212121'; // Volta ao fundo normal
        });
    }
});
