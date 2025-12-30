/* ==========================================================================
    UDESAKEN SYSTEM 2026 ®
    Lógica Principal do Site
   ========================================================================== */

// --- FORÇAR ROLAGEM AO TOPO AO CARREGAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
    checkCookies(); // Verifica cookies ao carregar
}

// --- IMPORTAÇÕES DO FIREBASE (MANTENDO AS SUAS) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- SUA CONFIGURAÇÃO ---
const firebaseConfig = {
  apiKey: "AIzaSyDwtSWC3I0XcfsvnAdzlsMVOiv6n5qkH0Q",
  authDomain: "udesaken-system.firebaseapp.com",
  projectId: "udesaken-system",
  storageBucket: "udesaken-system.firebasestorage.app",
  messagingSenderId: "85407769934",
  appId: "1:85407769934:web:f5152f2785540733662a1f"
};

// INICIALIZANDO O SISTEMA
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- 1. CONTADOR DE VISUALIZAÇÕES (FIREBASE) ---
async function carregarEstatisticas() {
    // Procura o elemento de visualização (se existir na página)
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    
    if(!viewCounter) return; 

    const docRef = doc(db, "site_dados", "geral");
    
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { visualizacoes: increment(1) });
            const dadosAtualizados = (await getDoc(docRef)).data();
            atualizarTela(dadosAtualizados.visualizacoes);
        } else {
            await setDoc(docRef, { visualizacoes: 1200000 });
            atualizarTela(1200000);
        }
    } catch (error) {
        console.log("Modo offline ou erro no banco:", error);
    }
}

function atualizarTela(numero) {
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    if(viewCounter) {
        viewCounter.innerText = "+" + numero.toLocaleString('pt-BR');
        viewCounter.removeAttribute('data-target');
    }
}

// Executa stats
carregarEstatisticas();


// --- 2. LÓGICA DE INTERFACE (UI) ---

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const closeBtn = document.querySelector('.close-btn-mobile');
const icon = hamburger ? hamburger.querySelector('i') : null;

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(icon) icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
}

if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if(icon) icon.className = 'fas fa-bars';
    });
}

// Fechar menu ao clicar num link (Melhor experiência mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if(icon) icon.className = 'fas fa-bars';
    });
});

// Animação de Scroll (Fade In)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
});
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


// --- 3. SISTEMA DE ÁUDIO ---
window.toggleMusic = function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');

    try { audio.volume = 0.1; } catch (e) {}

    if (audio.paused) {
        audio.play().then(() => {
            btn.classList.add('playing');
            btn.title = "Pausar";
            if(icon) icon.className = ''; 
        }).catch(error => {
            console.log("Erro áudio:", error);
            // alert("Toque na tela para permitir o áudio!"); // Removido para não incomodar
        });
    } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.title = "Tocar";
        if(icon) icon.className = 'fas fa-volume-mute';
    }
}

// Pausa inteligente ao sair da aba
document.addEventListener("visibilitychange", function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    
    if(!audio) return;

    if (document.hidden && !audio.paused) {
        audio.pause();
    } else if (!document.hidden && btn && btn.classList.contains('playing')) {
        audio.play().catch(e => {});
    }
});


// --- 4. SISTEMA DE COOKIES (ATUALIZADO) ---
// Sincronizado com o novo Banner do HTML
function checkCookies() {
    if (!localStorage.getItem('udesaken_cookies')) {
        setTimeout(() => {
            const banner = document.getElementById('cookieBanner');
            if(banner) banner.classList.add('active');
        }, 2000);
    }
}

window.acceptCookies = function() {
    localStorage.setItem('udesaken_cookies', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if(banner) banner.classList.remove('active');
}


// --- 5. LÓGICA DE ABAS (TABS) ---
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    
    const target = document.getElementById('tab-' + tabName);
    if(target) {
        target.style.display = 'flex';
        setTimeout(() => target.classList.add('active'), 10);
    }
}


// --- 6. PROTEÇÃO DE MARCA ---
const estiloTitulo = "color: #FFD700; font-size: 30px; font-weight: bold; text-shadow: 0 0 10px #FFD700; background: #000; padding: 10px;";
console.log("%c UDESAKEN 2026 ", estiloTitulo);
console.log("Sistema carregado. Versão: 5.0 (Future Edition)");