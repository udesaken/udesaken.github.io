/* ==========================================================================
   UDESAKEN 2026 - DARK LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR DINÂMICA ---
    const navbar = document.getElementById('navbar');
    
    function updateNavbar() {
        if (window.scrollY > 20) {
            // Ao rolar: fundo preto sólido com blur
            navbar.classList.add('bg-dark-950/90', 'shadow-lg', 'backdrop-blur-xl');
            navbar.classList.remove('bg-transparent', 'border-transparent');
        } else {
            // No topo: Transparente
            navbar.classList.remove('bg-dark-950/90', 'shadow-lg', 'backdrop-blur-xl');
            navbar.classList.add('bg-transparent', 'border-transparent');
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // --- 2. MENU MOBILE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Fecha ao clicar em links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- 3. ANIMAÇÃO SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});