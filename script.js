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
   UDESAKEN - AUTO-INJECT SPLIT PLAYER (APPLE STYLE)
   ========================================================================== */

function injectUdesakenPlayer() {
    const playerHTML = `
        <audio id="main-audio" preload="auto"></audio>
        
        <div class="flex items-center gap-2">
            <div id="player-main" class="flex items-center gap-3 px-2 py-1.5 glass-pill shadow-lg">
                <div class="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="uskcoroa.png" alt="Capa" class="w-full h-full object-cover">
                    <div id="visualizer" class="absolute inset-0 bg-black/40 flex items-center justify-center gap-[2px] opacity-0 transition-opacity">
                        <span class="v-bar bar-1"></span>
                        <span class="v-bar bar-2"></span>
                        <span class="v-bar bar-3"></span>
                    </div>
                </div>

                <div class="flex flex-col min-w-[120px] max-w-[160px]">
                    <span id="track-name" class="text-[10px] font-bold text-main truncate tracking-tight uppercase">Udesaken Lounge</span>
                    <span id="track-status" class="text-[8px] text-muted font-bold italic opacity-60">Pausado</span>
                </div>

                <button id="play-pause-btn" class="w-8 h-8 flex items-center justify-center hover:scale-110 transition active:scale-90 mr-1">
                    <i class="fas fa-play text-sm text-main" id="play-icon"></i>
                </button>
            </div>

            <button id="next-track-btn" class="glass-circle shadow-lg hover:scale-110 transition active:scale-90 group">
                <i class="fas fa-forward text-[10px] text-muted group-hover:text-main"></i>
            </button>
        </div>

        <div class="absolute bottom-0 left-4 w-[calc(100%-65px)] h-[1.5px] bg-white/5 overflow-hidden rounded-full">
            <div id="progress-bar" class="h-full bg-brand-gold w-0 transition-all duration-300"></div>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'audio-player-container';
    container.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-[100]';
    container.innerHTML = playerHTML;
    document.body.appendChild(container);
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    injectUdesakenPlayer();

    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const nextBtn = document.getElementById('next-track-btn');
    const trackName = document.getElementById('track-name');
    const trackStatus = document.getElementById('track-status');
    const progressBar = document.getElementById('progress-bar');
    const playerContainer = document.getElementById('audio-player-container');

    const playlist = [
        { name: 'Udesaken Lounge 01', src: 'uskmusic.mp3' },
        { name: 'Udesaken Lounge 02', src: 'uskmusic2.mp3' }
    ];

    let currentTrackIndex = parseInt(localStorage.getItem('usk_track_index')) || 0;
    let isPlaying = localStorage.getItem('usk_is_playing') === 'true';
    const targetVolume = 0.1; // Volume 10% estilo mercado

    function loadTrack(index) {
        audio.src = playlist[index].src;
        trackName.innerText = playlist[index].name;
        localStorage.setItem('usk_track_index', index);
        const savedTime = localStorage.getItem('usk_audio_time');
        if (savedTime) audio.currentTime = parseFloat(savedTime);
    }

    function fadeInAudio() {
        audio.volume = 0;
        audio.play().catch(() => { isPlaying = false; updateUI(false); });
        let fade = setInterval(() => {
            if (audio.volume < targetVolume) {
                audio.volume = Math.min(audio.volume + 0.01, targetVolume);
            } else { clearInterval(fade); }
        }, 150);
    }

    function updateUI(playing) {
        if (playing) {
            playIcon.classList.replace('fa-play', 'fa-pause');
            trackStatus.innerText = 'Em reprodução';
            playerContainer.classList.add('playing');
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
            trackStatus.innerText = 'Pausado';
            playerContainer.classList.remove('playing');
        }
    }

    loadTrack(currentTrackIndex);
    
    // Torna visível após injetar
    setTimeout(() => playerContainer.classList.add('visible'), 500);

    if (isPlaying) {
        fadeInAudio();
        updateUI(true);
    }

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            fadeInAudio();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
        updateUI(isPlaying);
        localStorage.setItem('usk_is_playing', isPlaying);
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        localStorage.setItem('usk_audio_time', 0);
        loadTrack(currentTrackIndex);
        fadeInAudio();
        isPlaying = true;
        updateUI(true);
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
        localStorage.setItem('usk_audio_time', audio.currentTime);
    });

    audio.addEventListener('ended', () => nextBtn.click());
});