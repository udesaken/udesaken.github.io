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
   UDESAKEN - PERSISTENT AUDIO ENGINE (APPLE FIDELITY)
   ========================================================================== */

function injectUdesakenPlayer() {
    const playerHTML = `
        <audio id="main-audio" preload="auto" loop></audio>
        <div class="flex items-center gap-2">
            <div class="flex items-center gap-3 glass-pill shadow-2xl">
                <div class="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                    <img src="uskcoroa.png" alt="Capa" class="w-full h-full object-cover">
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
    container.className = 'fixed bottom-10 z-[100]'; // Posição controlada pelo CSS
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
        { name: 'Udesaken Lounge 01', artist: 'Udesaken Records', src: 'uskmusic.mp3' },
        { name: 'Udesaken Lounge 02', artist: 'Udesaken Records', src: 'uskmusic2.mp3' }
    ];

    let currentTrackIndex = parseInt(localStorage.getItem('usk_track_index')) || 0;
    let isPlaying = localStorage.getItem('usk_is_playing') === 'true';
    const targetVolume = 0.1;

    function loadTrack(index) {
        audio.src = playlist[index].src;
        trackName.innerText = playlist[index].name;
        trackArtist.innerText = playlist[index].artist;
        localStorage.setItem('usk_track_index', index);
        
        // --- A MÁGICA DA PERSISTÊNCIA ---
        audio.oncanplay = () => {
            const savedTime = localStorage.getItem('usk_audio_time');
            if (savedTime) audio.currentTime = parseFloat(savedTime);
            
            if (isPlaying) {
                audio.play().then(() => updateUI(true)).catch(() => {
                    // Se o navegador bloquear o autoplay, resetamos o estado
                    isPlaying = false;
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

    loadTrack(currentTrackIndex);
    audio.volume = targetVolume;

    setTimeout(() => playerContainer.classList.add('visible'), 500);

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            isPlaying = true;
            audio.play();
            updateUI(true);
        } else {
            audio.pause();
            isPlaying = false;
            updateUI(false);
        }
        localStorage.setItem('usk_is_playing', isPlaying);
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        localStorage.setItem('usk_audio_time', 0);
        loadTrack(currentTrackIndex);
        isPlaying = true;
    });

    // Salva o tempo a cada segundo
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('usk_audio_time', audio.currentTime);
        }
    }, 1000);

    audio.addEventListener('ended', () => nextBtn.click());
});