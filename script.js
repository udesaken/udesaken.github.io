/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Effects (Aurora Premium Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PLAYER DE MÚSICA AVANÇADO (Playlist, Widget & Volume) ---
    const audio = document.getElementById('bg-audio');
    const widget = document.getElementById('musicWidget');
    const playBtnIcon = document.querySelector('#playPauseBtn i');
    const trackNameLabel = document.getElementById('trackName');
    
    // Elementos do Volume
    const volumeSlider = document.getElementById('volumeSlider');
    const volIcon = document.getElementById('volIcon');

    // Playlist: Suas músicas
    const playlist = [
        { name: "Udesaken Theme", src: "uskmusic.mp3" },
        { name: "Vibes Mode", src: "uskmusic2.mp3" }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;

    // --- CONFIGURAÇÃO INICIAL DE VOLUME ---
    // Define o volume para 40% ao carregar para não assustar o usuário
    if(audio && volumeSlider) {
        audio.volume = 0.2; 
        volumeSlider.value = 0.2;
    }

    // Listener do Slider de Volume
    if(volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            audio.volume = val;

            // Muda o ícone conforme o volume
            if(val == 0) {
                volIcon.className = 'fas fa-volume-mute';
            } else if (val < 0.5) {
                volIcon.className = 'fas fa-volume-down';
            } else {
                volIcon.className = 'fas fa-volume-up';
            }
        });
    }

    // Função para atualizar a interface visual (Play/Pause)
    function updatePlayerUI() {
        if (!widget || !playBtnIcon) return;

        if (isPlaying) {
            widget.classList.remove('paused'); // Barrinhas se mexem
            playBtnIcon.classList.remove('fa-play');
            playBtnIcon.classList.add('fa-pause');
        } else {
            widget.classList.add('paused'); // Barrinhas param
            playBtnIcon.classList.remove('fa-pause');
            playBtnIcon.classList.add('fa-play');
        }
    }

    // Tocar/Pausar (Global)
    window.toggleMusic = function() {
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                updatePlayerUI();
            }).catch(e => {
                console.log("Autoplay bloqueado pelo navegador:", e);
            });
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayerUI();
        }
    };

    // Próxima Música (Global)
    window.nextTrack = function() {
        if (!audio) return;

        currentTrackIndex++;
        // Loop da playlist
        if (currentTrackIndex >= playlist.length) {
            currentTrackIndex = 0;
        }
        
        // Carrega nova faixa
        audio.src = playlist[currentTrackIndex].src;
        if(trackNameLabel) trackNameLabel.textContent = playlist[currentTrackIndex].name;
        
        // Mantém tocando se já estava
        audio.play().then(() => {
            isPlaying = true;
            updatePlayerUI();
        }).catch(e => console.log("Erro ao trocar faixa:", e));
    };


    // --- 2. EFEITO SPOTLIGHT (Luz do Mouse nos Cards) ---
    const cards = document.querySelectorAll('.price-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Passa coordenadas para o CSS
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });


    // --- 3. MENU MOBILE (Gaveta Lateral) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { 
        if(navLinks) navLinks.classList.toggle('active'); 
    }
    
    function closeMenu() { 
        if(navLinks) navLinks.classList.remove('active'); 
    }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    
    links.forEach(link => link.addEventListener('click', closeMenu));


    // --- 4. SCROLL REVEAL (Animação ao rolar) ---
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-zoom, .reveal-fade');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });


    // --- 5. BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookieBanner');
    const btnAccept = document.getElementById('btnAccept');

    if (!localStorage.getItem('udesaken_cookies_accepted')) {
        setTimeout(() => { 
            if(cookieBanner) cookieBanner.classList.add('active'); 
        }, 2000);
    }

    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('udesaken_cookies_accepted', 'true');
            if(cookieBanner) cookieBanner.classList.remove('active');
        });
    }

});