/* ==========================================================================
   UDESAKEN - THEME LOGIC & CORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE TEMAS (DARK/LIGHT) ---
    const themeBtns = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('udesaken_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
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
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

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
            navbar.classList.add('glass-nav'); 
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

    // --- 4. ANIMAÇÕES FADE-UP ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // --- 5. EFEITO DE BRILHO SEGUINDO O MOUSE (SPOTLIGHT) ---
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
                    <img src="/logousk1.png" alt="Capa" class="w-full h-full object-cover">
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
        { name: 'A Little Death', artist: 'The Neighbourhood', src: '/uskmusic2.mp3' },
        { name: 'MAKEUP', artist: 'Chris Grey', src: '/uskmusic3.mp3' },
        { name: 'Can"t Feel My Face', artist: 'The Weeknd', src: '/uskmusic4.mp3' }
    ];

    let currentTrackIndex = parseInt(localStorage.getItem('usk_track_index')) || 0;
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
        localStorage.setItem('usk_is_playing', 'true'); 
        loadTrack(currentTrackIndex, 0, true);
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

    audio.addEventListener('ended', () => nextBtn.click());
    setTimeout(() => playerContainer.classList.add('visible'), 500);
});

/* ==========================================================================
   UDESAKEN - DYNAMIC FAVICON ENGINE
   ========================================================================== */
(function() {
    const link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = '/logousk.png'; 
    document.getElementsByTagName('head')[0].appendChild(link);
})();

/* ==========================================================================
   UDESAKEN - ENVIO DE PARCERIA VIA API SQUARE CLOUD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const webhookURL = 'https://api-udesaken.squareweb.app/api/parceria';
    const linkGrupoEspera = "https://chat.whatsapp.com/HqRNjrQzRJ87K112xJcOvm?mode=gi_t";

    // --- FUNÇÃO GLOBAL DE ENVIO (Agora com parâmetro para Empresa) ---
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
                // VERIFICAÇÃO: Se for empresa, dá um aviso amigável. Se for grupo, manda pro zap.
                if (isEmpresa) {
                    alert("✅ Proposta enviada com sucesso! Nossa equipe comercial avaliará os dados e entrará em contato em breve.");
                    window.location.href = "/"; // Redireciona de volta para a home
                } else {
                    window.location.href = linkGrupoEspera; // Redireciona pro zap
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

    // --- 1. ENVIO DO FORMULÁRIO DE COMUNIDADE (GRUPOS) ---
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

            // Envia passando "false" para isEmpresa (Comportamento de Grupo)
            enviarParaSquareCloud(formComunidade, payload, false);
        });
    }

    // --- 2. ENVIO DO FORMULÁRIO DE EMPRESAS (B2B) ---
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

            // Envia passando "true" para isEmpresa (Mostra alerta e não manda pro grupo do zap)
            enviarParaSquareCloud(formEmpresa, payload, true);
        });
    }
});

/* ==========================================================================
   UDESAKEN - CLEAN URL SYSTEM (Remove index.html dos links)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('index.html')) {
            link.setAttribute('href', href.replace('index.html', ''));
        }
    });
});

/* ==========================================================================
   UDESAKEN - DYNAMIC OPEN GRAPH & LINK PREVIEW ENGINE
   ========================================================================== */
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