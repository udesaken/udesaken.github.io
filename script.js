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
// --- LÓGICA DO PLAYER PERSISTENTE UDESAKEN (PREMIUM FADE) ---
document.addEventListener('DOMContentLoaded', () => {
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
            trackStatus.innerText = 'Tocando agora';
            playerContainer.classList.add('playing', 'playing-glow');
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
            trackStatus.innerText = 'Pausado';
            playerContainer.classList.remove('playing', 'playing-glow');
        }
    }

    loadTrack(currentTrackIndex);
    setTimeout(() => playerContainer.classList.add('visible'), 1000);

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
        progressBar.style.width = `${progress}%`;
        localStorage.setItem('usk_audio_time', audio.currentTime);
    });

    audio.addEventListener('ended', () => nextBtn.click());
});