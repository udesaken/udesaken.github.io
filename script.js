// Script Principal Udesaken Group

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // TEMA: CLARO / ESCURO
    // ==========================================
    const themeBtns = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('udesaken_theme');
    
    function applyTheme(theme) {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            updateIcons(true); 
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            updateIcons(false); 
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

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('dark');
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    });

    // ==========================================
    // MENU E NAVEGAÇÃO
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('glass-nav'); 
        } else {
            navbar.classList.remove('glass-nav');
        }
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // ==========================================
    // INTERSECTION OBSERVER (Fade Up & Grok Reveal)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-up, .grok-reveal').forEach(el => observer.observe(el));

    // ==========================================
    // EFEITO HOVER GLASS PANELS
    // ==========================================
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================
    // FUNDO ESPACIAL AUTOMÁTICO (Universo)
    // ==========================================
    function createUniverseCanvas() {
        if (!document.getElementById('universe')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'universe';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.zIndex = '-1';
            canvas.style.pointerEvents = 'none';
            document.body.prepend(canvas);

            const ctx = canvas.getContext('2d');
            let stars = [];
            
            function initStars() {
                stars = [];
                for (let i = 0; i < 150; i++) {
                    stars.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        r: Math.random() * 1.5,
                        dx: (Math.random() - 0.5) * 0.3,
                        dy: (Math.random() - 0.5) * 0.3
                    });
                }
            }

            function drawStars() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.6)';
                
                stars.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                    ctx.fill();
                    star.x += star.dx;
                    star.y += star.dy;
                    
                    if (star.x < 0) star.x = canvas.width;
                    if (star.x > canvas.width) star.x = 0;
                    if (star.y < 0) star.y = canvas.height;
                    if (star.y > canvas.height) star.y = 0;
                });
                requestAnimationFrame(drawStars);
            }

            initStars();
            drawStars();
            window.addEventListener('resize', initStars);
        }
    }
    
    createUniverseCanvas();
});

// ==========================================
// UDESAKEN AUDIO PLAYER (1 MÚSICA - PLAY/PAUSE ÚNICO)
// ==========================================
function injectUdesakenPlayer() {
    const playerHTML = `
        <audio id="main-audio" preload="auto" loop></audio>
        <div class="flex items-center gap-2">
            <div class="flex items-center gap-3 glass-pill shadow-2xl">
                <div class="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                    <img src="/logousk1.png" alt="Capa" class="w-full h-full object-cover">
                    <div id="visualizer" class="absolute inset-0 bg-black/60 flex items-center justify-center gap-[2px] opacity-0 transition-opacity">
                        <span class="v-bar bar-1"></span>
                        <span class="v-bar bar-2"></span>
                        <span class="v-bar bar-3"></span>
                    </div>
                </div>
                <div class="flex flex-col min-w-[120px] max-w-[160px] leading-tight mr-2">
                    <span id="track-name" class="text-[11px] font-bold text-white truncate tracking-tight uppercase">Love Me</span>
                    <span id="track-artist" class="text-[9px] text-zinc-400 font-semibold opacity-60">JMSN</span>
                </div>
                <button id="play-pause-btn" class="w-8 h-8 flex items-center justify-center hover:scale-110 transition active:scale-90 bg-white/10 rounded-full">
                    <i id="play-pause-icon" class="fas fa-play text-[10px] text-white"></i>
                </button>
            </div>
        </div>
    `;
    const container = document.createElement('div');
    container.id = 'audio-player-container';
    container.className = 'fixed bottom-10 z-[100] transition-all duration-500 ease-in-out';
    container.innerHTML = playerHTML;
    document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
    injectUdesakenPlayer();

    const audio = document.getElementById('main-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const trackName = document.getElementById('track-name');
    const trackArtist = document.getElementById('track-artist');
    const playerContainer = document.getElementById('audio-player-container');

    const singleTrack = { name: 'Interestelar', artist: 'UdesakenMusic', src: '/interestelar.mp3' };

    const savedTime = parseFloat(localStorage.getItem('usk_audio_time')) || 0;
    let isPlaying = localStorage.getItem('usk_is_playing') === 'true';
    let fadeInterval; 

    function fadeInAudio() {
        if (fadeInterval) clearInterval(fadeInterval); 
        audio.volume = 0;
        let vol = 0;
        const maxVolume = 0.04; 
        fadeInterval = setInterval(() => {
            if (vol < maxVolume) {
                vol += 0.0005; 
                audio.volume = Math.min(vol, maxVolume); 
            } else {
                audio.volume = maxVolume; 
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    function loadSingleTrack(startTime = 0, autoPlay = false) {
        audio.src = singleTrack.src;
        trackName.innerText = singleTrack.name;
        trackArtist.innerText = singleTrack.artist;
        
        audio.onloadedmetadata = () => {
            audio.currentTime = startTime;
            if (autoPlay) {
                audio.play().then(() => {
                    updateUI(true);
                    fadeInAudio();
                }).catch(() => {
                    console.log("Autoplay impedido pelo navegador.");
                    localStorage.setItem('usk_is_playing', 'false');
                    updateUI(false);
                });
            }
        };
    }

    function updateUI(playing) {
        if (playing) {
            document.getElementById('visualizer').style.opacity = '1';
            playerContainer.classList.add('playing');
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            document.getElementById('visualizer').style.opacity = '0';
            playerContainer.classList.remove('playing');
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    }

    loadSingleTrack(savedTime, isPlaying);

    playPauseBtn.addEventListener('click', () => {
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

    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('usk_audio_time', audio.currentTime);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
            updateUI(false);
        }
    });

    setTimeout(() => playerContainer.classList.add('visible'), 500);

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            playerContainer.classList.add('minimized');
            playerContainer.style.transform = 'translateY(150%)';
            playerContainer.style.opacity = '0';
            playerContainer.style.pointerEvents = 'none';
        } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
            playerContainer.classList.remove('minimized');
            playerContainer.style.transform = 'translateY(0)';
            playerContainer.style.opacity = '1';
            playerContainer.style.pointerEvents = 'auto';
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
});

// ==========================================
// FAVICON E OUTROS UTILITÁRIOS
// ==========================================
(function() {
    const link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = '/logousk.png'; 
    document.getElementsByTagName('head')[0].appendChild(link);
})();

document.addEventListener('DOMContentLoaded', () => {
    const _0x9f3a = 'aHR0cHM6Ly9hcGktdWRlc2FrZW4u';
    const _0x8d2b = 'c3F1YXJld2ViLmFwcC9hcGkvcGFyY2VyaWE=';
    const webhookURL = atob(_0x9f3a + _0x8d2b);

    const linkGrupoEspera = "https://chat.whatsapp.com/HqRNjrQzRJ87K112xJcOvm?mode=gi_t";

    async function enviarParaSquareCloud(form, payload, isEmpresa = false) {
        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
        btnSubmit.disabled = true;

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (isEmpresa) {
                    const modal = document.getElementById('modal-sucesso-empresa');
                    if (modal) {
                        modal.classList.remove('hidden');
                        setTimeout(() => {
                            modal.classList.remove('opacity-0');
                            modal.querySelector('#modal-content').classList.remove('scale-95');
                        }, 10);
                    }
                } else {
                    window.location.href = linkGrupoEspera;
                }
            } else {
                throw new Error('Falha de comunicação com a API');
            }
        } catch (error) {
            console.error("Erro ao enviar webhook:", error);
            alert("Ocorreu um erro ao enviar sua solicitação. Verifique sua conexão e tente novamente.");
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.disabled = false;
        }
    }

    const formComunidade = document.getElementById('form-parceria-comunidade');
    if (formComunidade) {
        formComunidade.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const inputs = formComunidade.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])');
            const selectCategoria = formComunidade.querySelector('select');
            
            const dados = {
                nomeGrupo: inputs[0].value,
                linkGrupo: inputs[1].value,
                membros: inputs[2].value,
                responsavel: inputs[3].value,
                contato: inputs[4].value,
                mensagens: inputs[5].value,
                categoria: selectCategoria.options[selectCategoria.selectedIndex].text,
                ativo: document.querySelector('#container-comunidade input[name="ativo"]:checked').value,
                tipoParceria: document.querySelector('#container-comunidade input[name="tipo_parceria"]:checked').value
            };

            const isOficial = dados.tipoParceria === 'oficial';
            const payload = {
                embeds: [{
                    title: isOficial ? "🌟 Nova Solicitação de Parceria OFICIAL" : "🤝 Nova Solicitação de Parceria BÁSICA",
                    color: isOficial ? 16766720 : 2829617, 
                    fields: [
                        { name: "👑 Nome do Grupo", value: dados.nomeGrupo, inline: true },
                        { name: "👥 Membros", value: dados.membros, inline: true },
                        { name: "📂 Categoria", value: dados.categoria, inline: true },
                        { name: "📈 Grupo Ativo?", value: dados.ativo === 'sim' ? `Sim ✅ (${dados.mensagens} msg/dia)` : 'Não ❌', inline: true },
                        { name: "👤 Responsável", value: dados.responsavel, inline: true },
                        { name: "📱 Contato", value: dados.contato, inline: true },
                        { name: "🔗 Link do WhatsApp", value: dados.linkGrupo, inline: false }
                    ],
                    thumbnail: {
                        url: isOficial ? "https://udesaken.site/uskcoroa.png" : "https://udesaken.site/logousk.png"
                    },
                    footer: { text: "Udesaken Group | Sistema Operante" },
                    timestamp: new Date().toISOString()
                }]
            };

            enviarParaSquareCloud(formComunidade, payload, false);
        });
    }

    const formEmpresa = document.getElementById('form-parceria-empresa');
    if (formEmpresa) {
        formEmpresa.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const inputs = formEmpresa.querySelectorAll('input');
            const textarea = formEmpresa.querySelector('textarea');
            
            const dados = {
                nomeEmpresa: inputs[0].value,
                linkEmpresa: inputs[1].value,
                segmento: inputs[2].value,
                representante: inputs[3].value,
                cargo: inputs[4].value,
                email: inputs[5].value,
                wpp: inputs[6].value,
                proposta: textarea.value
            };

            const payload = {
                embeds: [{
                    title: "💼 NOVA PROPOSTA COMERCIAL (MARCA/EMPRESA)",
                    color: 16753920, 
                    fields: [
                        { name: "🏢 Empresa / Marca", value: dados.nomeEmpresa, inline: true },
                        { name: "🏷️ Segmento", value: dados.segmento, inline: true },
                        { name: "🔗 Site / Instagram", value: dados.linkEmpresa, inline: true },
                        { name: "👤 Representante", value: dados.representante, inline: true },
                        { name: "👔 Cargo", value: dados.cargo, inline: true },
                        { name: "📱 Contato (Wpp)", value: dados.wpp, inline: true },
                        { name: "✉️ E-mail Corporativo", value: dados.email, inline: true },
                        { name: "📝 Proposta de Colaboração", value: dados.proposta, inline: false }
                    ],
                    thumbnail: {
                        url: "https://udesaken.site/logousk.png" 
                    },
                    footer: { text: "Udesaken Group | Comercial & Negócios" },
                    timestamp: new Date().toISOString()
                }]
            };

            enviarParaSquareCloud(formEmpresa, payload, true);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('index.html')) {
            link.setAttribute('href', href.replace('index.html', ''));
        }
    });
});

(function injectOpenGraphTags() {
    function setMetaTag(property, content, isName = false) {
        const attr = isName ? 'name' : 'property';
        let meta = document.querySelector(`meta[${attr}="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    const pageTitle = document.title || "Udesaken Group";
    const currentUrl = window.location.href.replace('index.html', '');
    const imageUrl = 'https://udesaken.site/logousk1.png';
    const siteDescription = 'A marca oficial Udesaken. Sistema Operante.';

    setMetaTag('og:type', 'website');
    setMetaTag('og:url', currentUrl);
    setMetaTag('og:title', pageTitle);
    setMetaTag('og:description', siteDescription);
    setMetaTag('og:image', imageUrl);
    setMetaTag('og:image:width', '1200');
    setMetaTag('og:image:height', '630');

    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:url', currentUrl, true);
    setMetaTag('twitter:title', pageTitle, true);
    setMetaTag('twitter:description', siteDescription, true);
    setMetaTag('twitter:image', imageUrl, true);
})();

// ==========================================
// INTERSTELLAR PORTAL - WELCOME SCREEN (FINAL)
// ==========================================

// TELA DE LOADING
function showLoadingScreen() {
    if (document.getElementById('loading-screen')) return;
    
    const loadingHTML = `
        <div id="loading-screen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 20000; background: #000000; display: flex; align-items: center; justify-content: center; flex-direction: column; transition: opacity 0.8s ease;">
            <canvas id="loading-wormhole" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></canvas>
            <div style="position: relative; z-index: 2; text-align: center;">
                <div style="width: 60px; height: 60px; margin: 0 auto 20px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #ffffff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="color: #fff; font-size: 12px; letter-spacing: 3px; font-weight: 300;">CARREGANDO PORTAL</p>
                <p style="color: #444; font-size: 10px; margin-top: 10px;">o tempo é relativo...</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    
    if (!document.querySelector('#loading-spin-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spin-style';
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    
    const loadingCanvas = document.getElementById('loading-wormhole');
    if (loadingCanvas) {
        const ctx = loadingCanvas.getContext('2d');
        let width, height, time = 0;
        
        function resize() {
            width = loadingCanvas.width = window.innerWidth;
            height = loadingCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        
        function draw() {
            if (!loadingCanvas || !document.getElementById('loading-screen')) return;
            ctx.clearRect(0, 0, width, height);
            const centerX = width / 2;
            const centerY = height / 2;
            const maxR = Math.min(width, height) * 0.3;
            time += 0.02;
            
            for (let i = 0; i < 5; i++) {
                const r = maxR * (0.2 + i * 0.15);
                ctx.beginPath();
                ctx.arc(centerX, centerY, r + Math.sin(time * 2 + i) * 3, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${0.15 - i * 0.02})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
            requestAnimationFrame(draw);
        }
        draw();
    }
}

function hideLoadingScreen() {
    const loading = document.getElementById('loading-screen');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            if (loading && loading.parentNode) loading.remove();
        }, 800);
    }
}

// FUNÇÕES DO WORMHOLE
function initWormholeBackground() {
    const canvas = document.getElementById('wormhole-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let animationId = null;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    function drawWormhole() {
        if (!ctx || !canvas) return;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.5;
        
        time += 0.008;
        
        for (let ring = 0; ring < 10; ring++) {
            const ringRadius = maxRadius * (0.15 + ring * 0.07);
            const distortion = Math.sin(time * 2 + ring * 0.5) * 12;
            const rotation = time * (0.5 + ring * 0.1);
            
            const points = [];
            const segments = 70;
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2 + rotation;
                const waveX = Math.sin(angle * 4 + time * 3) * distortion;
                const waveY = Math.cos(angle * 3 + time * 2.5) * distortion;
                
                const r = ringRadius + waveX * 0.3;
                const x = centerX + Math.cos(angle) * r + waveX;
                const y = centerY + Math.sin(angle) * r + waveY;
                points.push({ x, y });
            }
            
            const gradient = ctx.createLinearGradient(
                centerX - ringRadius, centerY - ringRadius,
                centerX + ringRadius, centerY + ringRadius
            );
            const intensity = 0.25 - ring * 0.018;
            gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
            gradient.addColorStop(0.5, `rgba(150, 150, 150, ${intensity * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2 - ring * 0.06;
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            
            if (ring % 2 === 0) {
                for (let ray = 0; ray < 20; ray++) {
                    const rayAngle = (ray / 20) * Math.PI * 2 + time * 0.3;
                    const startX = centerX + Math.cos(rayAngle) * (ringRadius - 5);
                    const startY = centerY + Math.sin(rayAngle) * (ringRadius - 5);
                    const endX = centerX + Math.cos(rayAngle) * (ringRadius + 20 + distortion);
                    const endY = centerY + Math.sin(rayAngle) * (ringRadius + 20 + distortion);
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - ring * 0.01})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
        
        const radialGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.15);
        radialGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        radialGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.6)');
        radialGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);
        
        animationId = requestAnimationFrame(drawWormhole);
    }
    
    drawWormhole();
    
    return () => {
        if (animationId) cancelAnimationFrame(animationId);
    };
}

function initSpaceDust() {
    const container = document.getElementById('space-dust');
    if (!container) return;
    
    let intervalId = null;
    
    function createDust() {
        if (!container) return;
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        const size = Math.random() * 2.5 + 0.5;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 5 + 4;
        const delay = Math.random() * 8;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: ${window.innerHeight + 10}px;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            opacity: ${Math.random() * 0.4 + 0.1};
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }
    
    // Poeira inicial
    for (let i = 0; i < 60; i++) {
        setTimeout(() => createDust(), i * 80);
    }
    
    // Continua criando poeira
    intervalId = setInterval(() => {
        const portal = document.getElementById('welcome-portal');
        if (portal && portal.style.display !== 'none' && !portal.classList.contains('fade-out')) {
            createDust();
            const particles = container.querySelectorAll('.dust-particle');
            if (particles.length > 120) {
                particles[0].remove();
            }
        }
    }, 400);
    
    return () => {
        if (intervalId) clearInterval(intervalId);
    };
}

// INICIALIZAÇÃO DO PORTAL - desativada aqui, gerenciada pelo portal.js
(function initWelcomePortal_DISABLED() {
    return; // desativado para evitar conflito com portal.js
    /* ORIGINAL:
    const portal = document.getElementById('welcome-portal');
    const startBtn = document.getElementById('start-experience');
    
    if (!portal) {
        console.log('Portal não encontrado');
        return;
    }
    
    // GARANTE que o portal está visível inicialmente
    portal.style.opacity = '0';
    portal.style.visibility = 'visible';
    portal.style.display = 'flex';
    
    // Mostra loading
    showLoadingScreen();
    
    // Inicializa efeitos visuais
    initWormholeBackground();
    initSpaceDust();
    
    // Após 2 segundos, mostra o portal
    setTimeout(() => {
        hideLoadingScreen();
        portal.style.opacity = '1';
        portal.style.transition = 'opacity 1s ease';
    }, 2000);
    
    // Evento de clique - UMA ÚNICA VEZ
    if (startBtn) {
        // Remove eventos antigos para evitar duplicação
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            portal.classList.add('fade-out');
            
            setTimeout(() => {
                portal.style.display = 'none';
            }, 1800);
        });
    }
    */ 
})();
// ==========================================
// LOJA - CARRINHO E FUNCIONALIDADES
// ==========================================

// Só executa se estiver na página da loja (detecta elementos da loja)
function initStore() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return; // Não está na página da loja
    
    // ========== PRODUTOS ==========
    const storeProducts = [
        { id: 1, name: "VIP Semanal (Grupo)", category: "vip", price: 2.00, description: "Acesso VIP por 7 dias no grupo oficial. Imune a Vote Ban, PV liberado, comandos VIP e bônus de XP.", features: ["Imune a Vote Ban", "PV Liberado", "Comandos VIP", "Bônus de XP"], badge: "Teste Rápido", image: "https://udesaken.site/logousk1.png" },
        { id: 2, name: "VIP Quinzenal (Grupo)", category: "vip", price: 3.50, description: "15 dias de benefícios VIP: imunidade, prioridade média e comandos exclusivos.", features: ["Imune a Vote Ban", "PV Liberado", "Comandos VIP", "Prioridade Média"], badge: "Popular", image: "https://udesaken.site/logousk1.png" },
        { id: 3, name: "VIP Mensal (Grupo)", category: "vip", price: 5.00, description: "30 dias com todos os privilégios: mute reduzido (5m), burlar modo 'Só ADM', imunidade total, limite maior de ADV.", features: ["Imunidade Total", "Mute Reduzido (5m)", "Burlar Modo Só ADM", "PV Liberado", "Limite maior ADV"], badge: "Recomendado", image: "https://udesaken.site/logousk1.png" },
        { id: 4, name: "Bot no PV (1 Dia)", category: "pv", price: 1.50, description: "Teste rápido do bot no seu privado. Acesso total por 24h.", features: ["Acesso Total PV", "Sem limites", "Comandos liberados"], image: "https://udesaken.site/logousk1.png" },
        { id: 5, name: "Bot no PV (Quinzenal)", category: "pv", price: 2.50, description: "15 dias de uso pessoal do bot, com alta performance e privacidade.", features: ["15 dias", "Privacidade Total", "Respostas rápidas"], image: "https://udesaken.site/logousk1.png" },
        { id: 6, name: "Bot no PV (Mensal)", category: "pv", price: 3.50, description: "Mensalidade com vantagens máximas: melhor custo-benefício, respostas exclusivas e nenhuma restrição de anti-spam.", features: ["Alta Performance", "Respostas Exclusivas", "Privacidade Total", "Sem restrição de uso"], badge: "Mais Popular", image: "https://udesaken.site/logousk1.png" },
        { id: 7, name: "Bot Moderação (Grupo - 1 dia)", category: "bot", price: 1.50, description: "Sistema anti-link, boas-vindas e proteção anti-trava para seu grupo.", features: ["Anti-Link automático", "Mensagem de boas-vindas", "Proteção Anti-Trava"], image: "https://udesaken.site/logousk1.png" },
        { id: 8, name: "Bot Moderação (Grupo - Quinzenal)", category: "bot", price: 5.50, description: "15 dias de moderação completa + jogos e auto-resposta.", features: ["Moderação total", "Jogos interativos", "Auto-resposta configurável"], image: "https://udesaken.site/logousk1.png" },
        { id: 9, name: "Bot Moderação (Grupo - Mensal)", category: "bot", price: 7.50, description: "Plano completo para grupos: ferramentas de moderação e engajamento por 30 dias.", features: ["Moderação avançada", "Sistema de níveis", "Comandos personalizados", "Proteção total"], badge: "Top Vendas", image: "https://udesaken.site/logousk1.png" }
    ];
    
    // ========== CARRINHO ==========
    let cart = JSON.parse(localStorage.getItem('udesaken_cart')) || [];
    
    function saveCart() {
        localStorage.setItem('udesaken_cart', JSON.stringify(cart));
        updateCartUI();
    }
    
    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.innerText = totalItems;
        }
        
        if (cartItems && cartTotal) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="text-center text-gray-500 py-10">Seu carrinho está vazio</div>';
                cartTotal.innerText = 'R$ 0,00';
                return;
            }
            
            let total = 0;
            cartItems.innerHTML = cart.map(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                return `
                    <div class="flex gap-3 border-b border-white/10 pb-4 mb-4">
                        <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm text-gray-400">R$ ${item.price.toFixed(2)}</p>
                            <div class="flex items-center gap-3 mt-2">
                                <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 rounded-full border border-white/20">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 rounded-full border border-white/20">+</button>
                                <button onclick="removeFromCart(${item.id})" class="text-red-400 text-sm ml-auto">Remover</button>
                            </div>
                        </div>
                        <div class="font-bold">R$ ${subtotal.toFixed(2)}</div>
                    </div>
                `;
            }).join('');
            cartTotal.innerText = `R$ ${total.toFixed(2)}`;
        }
    }
    
    window.addToCart = function(productId) {
        const product = storeProducts.find(p => p.id === productId);
        if (!product) return;
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        
        // Notificação
        const notif = document.createElement('div');
        notif.className = 'fixed bottom-24 right-4 bg-white text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg z-50';
        notif.innerText = '✅ Adicionado ao carrinho!';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    };
    
    window.updateQuantity = function(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
            saveCart();
        }
    };
    
    window.removeFromCart = function(productId) {
        cart = cart.filter(i => i.id !== productId);
        saveCart();
    };
    
    window.toggleCart = function() {
        document.getElementById('cart-sidebar')?.classList.toggle('open');
    };
    
    window.checkoutWhatsApp = function() {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        
        let message = "Olá! Gostaria de comprar:%0A%0A";
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            message += `📦 ${item.name} × ${item.quantity} = R$ ${subtotal.toFixed(2)}%0A`;
        });
        message += `%0A💰 Total: R$ ${total.toFixed(2)}%0A%0A`;
        message += `Pode me passar os detalhes do pagamento?`;
        
        // TROQUE O NÚMERO ABAIXO PELO SEU WHATSAPP
        const whatsappNumber = "5511999999999";
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        
        // Zera o carrinho
        cart = [];
        saveCart();
        toggleCart();
    };
    
    window.openProductModal = function(product) {
        const modal = document.getElementById('product-modal');
        const content = document.getElementById('modal-product-content');
        if (!modal || !content) return;
        
        content.innerHTML = `
            <img src="${product.image}" class="w-24 h-24 rounded-2xl mx-auto mb-4">
            <h2 class="text-2xl font-bold text-center">${product.name}</h2>
            ${product.badge ? `<div class="text-center mt-2"><span class="bg-white/10 px-3 py-1 rounded-full text-xs">${product.badge}</span></div>` : ''}
            <p class="text-gray-400 text-center mt-4">${product.description}</p>
            <ul class="mt-5 space-y-2">
                ${product.features.map(f => `<li class="flex items-center gap-2 text-sm"><i class="fas fa-check text-white"></i> ${f}</li>`).join('')}
            </ul>
            <div class="text-3xl font-bold text-center mt-6">R$ ${product.price.toFixed(2)}</div>
            <button onclick="addToCart(${product.id}); closeProductModal();" class="w-full mt-6 btn-primary">Adicionar ao carrinho</button>
        `;
        modal.classList.add('active');
    };
    
    window.closeProductModal = function() {
        document.getElementById('product-modal')?.classList.remove('active');
    };
    
    // ========== RENDERIZAR PRODUTOS ==========
    let currentCategory = 'all';
    let searchTerm = '';
    
    function renderProducts() {
        let filtered = storeProducts;
        if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const grid = document.getElementById('products-grid');
        const noResults = document.getElementById('no-results');
        
        if (filtered.length === 0) {
            if (grid) grid.innerHTML = '';
            if (noResults) noResults.classList.remove('hidden');
            return;
        }
        
        if (noResults) noResults.classList.add('hidden');
        if (grid) {
            grid.innerHTML = filtered.map(prod => `
                <div class="product-card" onclick='openProductModal(${JSON.stringify(prod).replace(/'/g, "&#39;")})'>
                    <div class="flex justify-between">
                        <img src="${prod.image}" class="w-14 h-14 rounded-xl object-cover">
                        ${prod.badge ? `<span class="text-xs bg-white/10 px-2 py-1 rounded-full">${prod.badge}</span>` : ''}
                    </div>
                    <h3 class="font-bold text-lg mt-4">${prod.name}</h3>
                    <p class="text-gray-400 text-sm mt-1">${prod.description.substring(0, 70)}...</p>
                    <div class="flex justify-between items-center mt-5">
                        <span class="text-2xl font-bold">R$ ${prod.price.toFixed(2)}</span>
                        <button onclick="event.stopPropagation(); addToCart(${prod.id})" class="bg-white text-black rounded-full w-9 h-9 flex items-center justify-center hover:scale-105 transition">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Eventos de filtro
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        });
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderProducts();
        });
    }
    
    // Inicializar
    renderProducts();
    updateCartUI();
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initStore();
});