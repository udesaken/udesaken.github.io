/* ==========================================================================
   UDESAKEN - PREMIUM LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR PREMIUM (Transição suave de vidro) ---
    const navbar = document.getElementById('navbar');
    
    function updateNavbar() {
        if (window.scrollY > 30) {
            // Ao rolar: Adiciona a classe de vidro premium definida no CSS
            navbar.classList.add('glass-nav');
            navbar.classList.remove('border-transparent');
        } else {
            // No topo: Totalmente transparente
            navbar.classList.remove('glass-nav');
            navbar.classList.add('border-transparent');
        }
    }
    
    // Listener de scroll otimizado
    window.addEventListener('scroll', () => requestAnimationFrame(updateNavbar));
    updateNavbar(); // Chama no início

    // --- 2. MENU MOBILE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 3. SCROLL REVEAL (Estilo Apple - Suave) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: parar de observar após animar para performance
                // observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.15, // Espera um pouco mais do elemento aparecer
        rootMargin: "0px 0px -100px 0px" // Ativa a animação um pouco antes
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});