/* ==========================================================================
   UDESAKEN - CORE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Sticky com Glass Effect
    const navbar = document.getElementById('navbar');
    
    function updateNavbar() {
        if (window.scrollY > 10) {
            navbar.classList.add('glass-nav');
            navbar.classList.remove('border-transparent');
        } else {
            navbar.classList.remove('glass-nav');
            navbar.classList.add('border-transparent');
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // 2. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. Scroll Reveal Animation (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});