/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Animations (Luxury Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SISTEMA DE MÚSICA CONTÍNUA (PERSISTENTE) ---
    const audio = document.getElementById('bg-audio');
    const btnMusic = document.querySelector('.music-btn');
    const iconMusic = document.getElementById('music-icon');

    // Função visual para alternar ícone/ondas
    function updateMusicUI(isPlaying) {
        if (!btnMusic || !iconMusic) return;
        if (isPlaying) {
            btnMusic.classList.add('playing');
            iconMusic.className = ''; // Remove ícone, mostra ondas via CSS
        } else {
            btnMusic.classList.remove('playing');
            iconMusic.className = 'fas fa-volume-mute'; // Mostra ícone mudo
        }
    }

    if(audio) {
        audio.volume = 0.05; // Volume inicial baixo

        // A. RECUPERAR ESTADO AO CARREGAR A PÁGINA
        const savedTime = localStorage.getItem('udesaken_music_time');
        const shouldPlay = localStorage.getItem('udesaken_music_playing') === 'true';

        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        if (shouldPlay) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updateMusicUI(true);
                }).catch(error => {
                    console.log("Autoplay bloqueado pelo navegador (aguardando clique):", error);
                    updateMusicUI(false);
                });
            }
        }

        // B. SALVAR ESTADO AO SAIR DA PÁGINA (OU RECARREGAR)
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('udesaken_music_time', audio.currentTime);
            localStorage.setItem('udesaken_music_playing', !audio.paused);
        });
    }

    // C. FUNÇÃO DE CLIQUE (TOGGLE) - DISPONÍVEL GLOBALMENTE
    window.toggleMusic = function() {
        if(!audio) return;
        
        if (audio.paused) {
            audio.play().then(() => {
                updateMusicUI(true);
                localStorage.setItem('udesaken_music_playing', 'true');
            }).catch(e => console.log("Erro play:", e));
        } else {
            audio.pause();
            updateMusicUI(false);
            localStorage.setItem('udesaken_music_playing', 'false');
        }
    };


    // --- 2. SISTEMA DE ANIMAÇÃO AO ROLAR (SCROLL REVEAL) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-zoom, .reveal-fade');
    animatedElements.forEach(el => scrollObserver.observe(el));


    // --- 3. MENU MOBILE (GAVETA) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { if(navLinks) navLinks.classList.toggle('active'); }
    function closeMenu() { if(navLinks) navLinks.classList.remove('active'); }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));


    // --- 4. PARTÍCULAS HELLO KITTY ---
    const container = document.body;
    const particleCount = 20;

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        
        // 50% de chance de ser laço
        if (Math.random() > 0.5) p.classList.add('bow');

        const startX = Math.random() * 100;
        const size = Math.random() * 6 + 4;
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`; 
        p.style.height = `${size}px`;
        
        const duration = Math.random() * 20 + 10;
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`;

        container.appendChild(p);
    }

    for(let i = 0; i < particleCount; i++) {
        createParticle();
    }


    // --- 5. BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookieBanner');
    const btnAccept = document.getElementById('btnAccept');

    if (!localStorage.getItem('udesaken_cookies')) {
        setTimeout(() => { 
            if(cookieBanner) cookieBanner.classList.add('active'); 
        }, 2000);
    }

    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('udesaken_cookies', 'accepted');
            if(cookieBanner) cookieBanner.classList.remove('active');
        });
    }
});
/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Effects (White Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFEITO SPOTLIGHT (Big Tech Style) ---
    // Faz um brilho seguir o mouse dentro dos cards
    const cards = document.querySelectorAll('.price-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Passa as coordenadas para o CSS
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // --- 2. MENU MOBILE ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { if(navLinks) navLinks.classList.toggle('active'); }
    function closeMenu() { if(navLinks) navLinks.classList.remove('active'); }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));


    // --- 3. SCROLL REVEAL (Animação ao rolar) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Aplica o estilo inicial e observa
    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // --- 4. PLAYER DE MÚSICA (Preservado) ---
    const audio = document.getElementById('bg-audio');
    window.toggleMusic = function() {
        if(!audio) return;
        if (audio.paused) {
            audio.play().catch(e => console.log(e));
            document.querySelector('.music-btn').style.opacity = '1';
        } else {
            audio.pause();
            document.querySelector('.music-btn').style.opacity = '0.5';
        }
    };
});