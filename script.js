/* ==========================================================================
    UDESAKEN SYSTEM - Logic Core
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- PLAYER DE MÚSICA ---
    const audio = document.getElementById('bg-audio');
    const widget = document.getElementById('musicWidget');
    const playBtnIcon = document.querySelector('#playPauseBtn i');
    const trackNameLabel = document.getElementById('trackName');
    const volumeSlider = document.getElementById('volumeSlider');
    const volIcon = document.getElementById('volIcon');

    // Playlist (Confirme se os nomes dos arquivos estão na mesma pasta)
    const playlist = [
        { name: "Udesaken Theme", src: "musicusk.mp3" },
        { name: "Vibes Mode", src: "uskmusic2.mp3" }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Inicialização segura
    if(audio) {
        audio.src = playlist[0].src;
        audio.volume = 0.1; // Começa bem baixinho (10%)
        if(volumeSlider) volumeSlider.value = 0.1;
    }

    // Controle de Volume
    if(volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            audio.volume = val;
            if(val == 0) volIcon.className = 'fas fa-volume-mute';
            else if (val < 0.5) volIcon.className = 'fas fa-volume-down';
            else volIcon.className = 'fas fa-volume-up';
        });
    }

    // Atualiza Visual Play/Pause
    function updatePlayerUI() {
        if (!widget || !playBtnIcon) return;
        if (isPlaying) {
            widget.classList.remove('paused');
            playBtnIcon.className = 'fas fa-pause';
        } else {
            widget.classList.add('paused');
            playBtnIcon.className = 'fas fa-play';
        }
    }

    // Função Tocar Global
    window.toggleMusic = function() {
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                updatePlayerUI();
            }).catch(e => console.log("Bloqueio de autoplay do navegador:", e));
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayerUI();
        }
    };

    // Função Próxima Faixa
    window.nextTrack = function() {
        if (!audio) return;
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        
        audio.src = playlist[currentTrackIndex].src;
        if(trackNameLabel) trackNameLabel.textContent = playlist[currentTrackIndex].name;
        
        audio.play().then(() => {
            isPlaying = true;
            updatePlayerUI();
        });
    };

    // --- EFEITOS VISUAIS ---
    
    // Menu Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { if(navLinks) navLinks.classList.toggle('active'); }
    function closeMenu() { if(navLinks) navLinks.classList.remove('active'); }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));

    // Luz do Mouse (Spotlight)
    const cards = document.querySelectorAll('.price-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });

    // Scroll Reveal (Animação de entrada)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-zoom, .reveal-fade').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // Cookies
    const cookieBanner = document.getElementById('cookieBanner');
    const btnAccept = document.getElementById('btnAccept');
    if (!localStorage.getItem('udesaken_cookies_accepted')) {
        setTimeout(() => { if(cookieBanner) cookieBanner.classList.add('active'); }, 2000);
    }
    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('udesaken_cookies_accepted', 'true');
            if(cookieBanner) cookieBanner.classList.remove('active');
        });
    }
});