/* ==========================================================================
   UDESAKEN 2026 - Logic Core
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR DINÂMICA (EFEITO GLASS AO ROLAR) ---
    const navbar = document.getElementById('navbar');
    
    function updateNavbar() {
        if (window.scrollY > 20) {
            // Quando rolar para baixo: fundo mais escuro e sombra
            navbar.classList.add('bg-dark-900/90', 'shadow-lg', 'backdrop-blur-xl');
            // Removemos a classe padrão para evitar conflito de opacidade
            navbar.classList.remove('glass-nav'); 
        } else {
            // No topo: volta ao estilo original translúcido
            navbar.classList.remove('bg-dark-900/90', 'shadow-lg', 'backdrop-blur-xl');
            navbar.classList.add('glass-nav');
        }
    }

    // Otimização: Executa no scroll e no carregamento (caso já esteja rolado)
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();


    // --- 2. MENU MOBILE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    if (mobileBtn && mobileMenu) {
        // Alternar menu ao clicar no botão
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Fechar o menu automaticamente ao clicar em qualquer link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }


    // --- 3. SCROLL REVEAL (ANIMAÇÃO DE ENTRADA) ---
    // Configuração do Observador
    const observerOptions = {
        root: null,        // Observa em relação à viewport
        threshold: 0.1,    // Ativa quando 10% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Margem negativa para ativar um pouco antes do fim da tela
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe .active que contém o transform: translateY(0) e opacity: 1
                entry.target.classList.add('active');
                
                // (Opcional) Para de observar o elemento depois que animou uma vez
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos com a classe .reveal e começa a observar
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });


    // --- 4. SMOOTH SCROLL CORREÇÃO (PARA HEADER FIXO) ---
    // O Tailwind 'scroll-smooth' funciona, mas isso garante o offset correto do menu fixo
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Altura aproximada do header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});