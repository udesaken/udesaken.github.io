/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Effects (Final Fix)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAÇÃO DO PLAYER ---
    const audio = document.getElementById('bg-audio');
    const widget = document.getElementById('musicWidget');
    const playBtnIcon = document.querySelector('#playPauseBtn i');
    const trackNameLabel = document.getElementById('trackName');
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volIcon = document.getElementById('volIcon');

    // LISTA DE MÚSICAS (Verifique se os nomes dos arquivos estão exatos)
    const playlist = [
        { name: "Udesaken Theme", src: "musicusk.mp3" }, // Música 1
        { name: "Vibes Mode", src: "uskmusic2.mp3" }    // Música 2
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;

    // --- INICIALIZAÇÃO OBRIGATÓRIA (Corrige o bug do Play) ---
    function initPlayer() {
        if(audio) {
            // Carrega a primeira música imediatamente no sistema
            audio.src = playlist[0].src;
            audio.load();
            
            // Define volume bem baixo (Ambiente de Mercado)
            audio.volume = 0.1; 
            if(volumeSlider) volumeSlider.value = 0.1;
        }
    }
    
    // Roda a configuração assim que abre o site
    initPlayer();

    // --- CONTROLE DE VOLUME ---
    if(volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            audio.volume = val;

            if(val == 0) {
                volIcon.className = 'fas fa-volume-mute';
            } else if (val < 0.5) {
                volIcon.className = 'fas fa-volume-down';
            } else {
                volIcon.className = 'fas fa-volume-up';
            }
        });
    }

    // --- FUNÇÕES DE TOCAR ---
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

    window.toggleMusic = function() {
        if (!audio) return;

        if (audio.paused) {
            // Tenta tocar a música já carregada
            let playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    updatePlayerUI();
                })
                .catch(error => {
                    console.log("Play bloqueado (clique necessário):", error);
                });
            }
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayerUI();
        }
    };

    window.nextTrack = function() {
        if (!audio) return;
        currentTrackIndex++;
        if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
        
        // Troca e toca
        audio.src = playlist[currentTrackIndex].src;
        if(trackNameLabel) trackNameLabel.textContent = playlist[currentTrackIndex].name;
        
        audio.play().then(() => {
            isPlaying = true;
            updatePlayerUI();
        });
    };

    // --- 2. EFEITOS VISUAIS E MOBILE ---
    
    // Spotlight (Luz do Mouse)
    const cards = document.querySelectorAll('.price-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });

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

    // Scroll Reveal
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
