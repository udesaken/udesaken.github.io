/* ==========================================================================
   UDESAKEN - THEME LOGIC & CORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE TEMAS (DARK/LIGHT) ---
    const themeBtns = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;
    
    // Verifica preferência salva ou do sistema
    const savedTheme = localStorage.getItem('udesaken_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    function applyTheme(theme) {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            updateIcons(true); // Ícone de Sol
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            updateIcons(false); // Ícone de Lua
        }
        localStorage.setItem('udesaken_theme', theme);
    }

    function updateIcons(isLight) {
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (isLight) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // Inicialização
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Se não tiver salvo, segue o sistema
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // Evento de clique
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    });

    // --- 2. NAVBAR STICKY ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('glass-nav'); // Classe visual se necessário
        } else {
            navbar.classList.remove('glass-nav');
        }
    });

    // --- 3. MENU MOBILE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 4. ANIMAÇÕES ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});
/* ==========================================================================
   UDESAKEN - PERSISTENT AUDIO ENGINE (READY)
   ========================================================================== */

function injectUdesakenPlayer() {
    const playerHTML = `
        <audio id="main-audio" preload="auto" loop></audio>
        <div class="flex items-center gap-2">
            <div class="flex items-center gap-3 glass-pill shadow-2xl">
                <div class="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                    <img src="/uskcoroa.png" alt="Capa" class="w-full h-full object-cover">
                    <div id="visualizer" class="absolute inset-0 bg-black/60 flex items-center justify-center gap-[2px] opacity-0 transition-opacity">
                        <span class="v-bar bar-1"></span>
                        <span class="v-bar bar-2"></span>
                        <span class="v-bar bar-3"></span>
                    </div>
                </div>

                <div class="flex flex-col min-w-[120px] max-w-[160px] leading-tight">
                    <span id="track-name" class="text-[11px] font-bold text-white truncate tracking-tight uppercase">Lounge 01</span>
                    <span id="track-artist" class="text-[9px] text-zinc-400 font-semibold opacity-60">Udesaken Records</span>
                </div>

                <button id="play-pause-btn" class="w-8 h-8 flex items-center justify-center hover:scale-110 transition active:scale-90 bg-white/5 rounded-full">
                    <i class="fas fa-play text-[10px] text-white" id="play-icon"></i>
                </button>
            </div>

            <button id="next-track-btn" class="glass-circle shadow-2xl hover:scale-110 transition active:scale-90">
                <i class="fas fa-forward text-[10px] text-zinc-400"></i>
            </button>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'audio-player-container';
    container.className = 'fixed bottom-10 z-[100]';
    container.innerHTML = playerHTML;
    document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
    injectUdesakenPlayer();

    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const nextBtn = document.getElementById('next-track-btn');
    const trackName = document.getElementById('track-name');
    const trackArtist = document.getElementById('track-artist');
    const playerContainer = document.getElementById('audio-player-container');

    const playlist = [
        { name: 'Love Me', artist: 'JMSN', src: '/uskmusic.mp3' },
        { name: 'A Little Death', artist: 'The Neighbourhood', src: '/uskmusic2.mp3' }
    ];

    // --- LOGICA DE PERSISTENCIA ---
    let currentTrackIndex = parseInt(localStorage.getItem('usk_track_index')) || 0;
    const savedTime = parseFloat(localStorage.getItem('usk_audio_time')) || 0;
    
    // Agora verificamos se o usuário já estava ouvindo música antes de trocar de página
    let isPlaying = localStorage.getItem('usk_is_playing') === 'true';

    function fadeInAudio() {
        audio.volume = 0;
        let vol = 0;
        const interval = setInterval(() => {
            // Mudei de 0.1 para 0.03 (apenas 3% de volume)
            if (vol < 0.03) { 
                // Mudei o passo de 0.01 para 0.001 para o fade ser bem lento e suave
                vol += 0.001; 
                audio.volume = vol;
            } else {
                clearInterval(interval);
            }
        }, 50); // A cada 50ms ele sobe 0.001 até chegar em 0.03
    }

    function loadTrack(index, startTime = 0, autoPlay = false) {
        audio.src = playlist[index].src;
        trackName.innerText = playlist[index].name;
        trackArtist.innerText = playlist[index].artist;
        localStorage.setItem('usk_track_index', index);
        
        audio.onloadedmetadata = () => {
            audio.currentTime = startTime;
            if (autoPlay) {
                audio.play().then(() => {
                    updateUI(true);
                    fadeInAudio();
                }).catch(() => {
                    // Se o navegador bloquear o autoplay, resetamos o estado
                    console.log("Autoplay impedido pelo navegador.");
                    localStorage.setItem('usk_is_playing', 'false');
                    updateUI(false);
                });
            }
        };
    }

    function updateUI(playing) {
        if (playing) {
            playIcon.classList.replace('fa-play', 'fa-pause');
            document.getElementById('visualizer').style.opacity = '1';
            playerContainer.classList.add('playing');
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
            document.getElementById('visualizer').style.opacity = '0';
            playerContainer.classList.remove('playing');
        }
    }

    // Inicializa carregando a posição salva e o autoplay baseado no estado anterior
    loadTrack(currentTrackIndex, savedTime, isPlaying);

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                localStorage.setItem('usk_is_playing', 'true');
                updateUI(true);
                fadeInAudio();
            });
        } else {
            audio.pause();
            isPlaying = false;
            localStorage.setItem('usk_is_playing', 'false');
            updateUI(false);
        }
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        localStorage.setItem('usk_audio_time', 0);
        localStorage.setItem('usk_is_playing', 'true'); // Força tocar a próxima
        loadTrack(currentTrackIndex, 0, true);
    });

    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('usk_audio_time', audio.currentTime);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
            updateUI(false);
            // Não alteramos o localStorage aqui para ele poder voltar a tocar quando recarregar
        }
    });

    audio.addEventListener('ended', () => nextBtn.click());
    setTimeout(() => playerContainer.classList.add('visible'), 500);
});