/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Effects (Aurora Premium Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PLAYER DE MÚSICA AVANÇADO (Playlist & Widget) ---
    const audio = document.getElementById('bg-audio');
    const widget = document.getElementById('musicWidget');
    const playBtnIcon = document.querySelector('#playPauseBtn i');
    const trackNameLabel = document.getElementById('trackName');

    // Playlist: Adicione aqui suas músicas
    const playlist = [
        { name: "Udesaken Theme", src: "musicusk.mp3" },
        { name: "Vibes Mode", src: "uskmusic2.mp3" }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Função para atualizar a interface visual do player
    function updatePlayerUI() {
        if (!widget || !playBtnIcon) return;

        if (isPlaying) {
            widget.classList.remove('paused'); // Ativa a animação das barrinhas
            playBtnIcon.classList.remove('fa-play');
            playBtnIcon.classList.add('fa-pause');
        } else {
            widget.classList.add('paused'); // Pausa a animação das barrinhas
            playBtnIcon.classList.remove('fa-pause');
            playBtnIcon.classList.add('fa-play');
        }
    }

    // Tocar/Pausar (Acessível globalmente pelo HTML)
    window.toggleMusic = function() {
        if (!audio) return;

        if (audio.paused) {
            // Tenta tocar
            audio.play().then(() => {
                isPlaying = true;
                updatePlayerUI();
            }).catch(e => {
                console.log("Autoplay bloqueado ou erro:", e);
                // Alguns navegadores exigem interação do usuário antes de tocar som
            });
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayerUI();
        }
    };

    // Próxima Música (Acessível globalmente)
    window.nextTrack = function() {
        if (!audio) return;

        currentTrackIndex++;
        // Se chegar ao fim da lista, volta para o começo
        if (currentTrackIndex >= playlist.length) {
            currentTrackIndex = 0;
        }
        
        // Carrega a nova música
        audio.src = playlist[currentTrackIndex].src;
        if(trackNameLabel) trackNameLabel.textContent = playlist[currentTrackIndex].name;
        
        // Toca a nova música
        audio.play().then(() => {
            isPlaying = true;
            updatePlayerUI();
        }).catch(e => console.log("Erro ao trocar faixa:", e));
    };


    // --- 2. EFEITO SPOTLIGHT (Luz que segue o mouse nos cards) ---
    const cards = document.querySelectorAll('.price-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calcula a posição do mouse relativa ao card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Envia as coordenadas para o CSS usar no radial-gradient
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
    
    // Fecha o menu ao clicar em qualquer link
    links.forEach(link => link.addEventListener('click', closeMenu));


    // --- 4. SCROLL REVEAL (Animação suave ao rolar a página) ---
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-zoom, .reveal-fade');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quando o elemento aparece na tela:
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 }); // Dispara quando 10% do elemento está visível

    // Configura o estado inicial (invisível e deslocado)
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)'; // Move um pouco para baixo
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'; // Suavidade Apple/iOS
        observer.observe(el);
    });


    // --- 5. BANNER DE COOKIES (Opcional - Se existir no HTML) ---
    const cookieBanner = document.getElementById('cookieBanner');
    const btnAccept = document.getElementById('btnAccept');

    // Verifica se já aceitou antes
    if (!localStorage.getItem('udesaken_cookies_accepted')) {
        setTimeout(() => { 
            if(cookieBanner) cookieBanner.classList.add('active'); 
        }, 2000); // Mostra após 2 segundos
    }

    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('udesaken_cookies_accepted', 'true');
            if(cookieBanner) cookieBanner.classList.remove('active');
        });
    }

});