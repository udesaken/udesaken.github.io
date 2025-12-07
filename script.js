// --- FORÇAR ROLAGEM PARA O TOPO AO ATUALIZAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
}


import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- FORÇAR ROLAGEM PARA O TOPO AO ATUALIZAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
}
// ----------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// --- SUA CONFIGURAÇÃO (Copiada da imagem) ---
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

// --- 1. CONTADOR DE VISUALIZAÇÕES ---
async function carregarEstatisticas() {
    const docRef = doc(db, "site_dados", "geral");
    
    try {
        // Tenta ler o documento primeiro
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Se existe, aumenta +1
            await updateDoc(docRef, { visualizacoes: increment(1) });
            const dadosAtualizados = (await getDoc(docRef)).data();
            atualizarTela(dadosAtualizados.visualizacoes);
        } else {
            // Se é a primeira vez (banco vazio), cria o documento começando em 1.200.000
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
        // Remove animação antiga para não sobrescrever
        viewCounter.removeAttribute('data-target');
    }
}

// Executa ao abrir o site
carregarEstatisticas();


// --- 2. SISTEMA DE LOGIN ADMIN ---
// Tornamos a função global para o botão HTML conseguir chamar
window.fazerLoginAdmin = async function() {
    const email = document.querySelector('.login-box input[type="text"]').value;
    const senha = document.querySelector('.login-box input[type="password"]').value;
    const btn = document.querySelector('.btn-login');

    if(!email || !senha) return alert("Preencha todos os campos.");

    try {
        btn.innerText = "Verificando...";
        
        // Autentica com o Google
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        alert(`Login realizado com sucesso!\nUsuário: ${user.email}`);
        document.getElementById('adminModal').classList.remove('active');
        
        ativarModoAdmin();

    } catch (error) {
        btn.innerText = "Acessar Sistema";
        console.error(error);
        alert("Erro: E-mail ou senha incorretos.");
    }
}

function ativarModoAdmin() {
    const adminBtn = document.querySelector('.admin-link');
    adminBtn.innerText = "🟢 PAINEL ATIVO (SAIR)";
    adminBtn.style.color = "#00ff00";
    adminBtn.style.fontWeight = "bold";
    
    adminBtn.onclick = async () => {
        await signOut(auth);
        alert("Desconectado.");
        window.location.reload();
    };
}


// --- 3. LÓGICA VISUAL (MENU E ANIMAÇÕES) ---

// Funções Globais para o HTML
window.toggleAdmin = function() {
    const modal = document.getElementById('adminModal');
    modal.classList.toggle('active');
}

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');
const icon = hamburger ? hamburger.querySelector('i') : null;

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(icon) {
            icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        }
    });
}

if(links) {
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(icon) icon.className = 'fas fa-bars';
        });
    });
}

// ... (seu código existente do hamburger) ...

// LÓGICA DO NOVO BOTÃO DE FECHAR (X)
const closeBtn = document.querySelector('.close-btn-mobile');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        // 1. Remove a classe que deixa o menu visível
        navLinks.classList.remove('active');
        
        // 2. Se o ícone do topo estiver como "X", volta ele para "Barras"
        if(icon) {
            icon.className = 'fas fa-bars';
        }
    });
}

// Animação Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
});
document.querySelectorAll('.hidden, .stat').forEach((el) => observer.observe(el));

// Contador Visual (Apenas para os números estáticos)
const statsSection = document.querySelector('.stats-bar');
let started = false;
window.onscroll = function() {
    if (statsSection && window.scrollY >= statsSection.offsetTop - 500) {
        if (!started) {
            // Pega apenas elementos com data-target (o de visualizações não terá mais)
            const counters = document.querySelectorAll('.stat h3[data-target]');
            const speed = 200;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText.replace(/\D/g, '');
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = "+" + target.toLocaleString();
                    }
                };
                updateCount();
            });
            started = true;
        }
    }
};

// --- PROTEÇÃO DE MARCA (CONSOLE) ---
const estiloTitulo = "color: #8a2be2; font-size: 40px; font-weight: bold; -webkit-text-stroke: 1px black; text-shadow: 0 0 10px #8a2be2;";
const estiloAviso = "color: white; font-size: 16px; font-weight: bold; background: #1a0033; padding: 10px; border-radius: 5px;";

console.log("%c UDESAKEN ", estiloTitulo);
console.log("%c⚠ PARE! Este código é propriedade intelectual da Udesaken.\nA cópia não autorizada, total ou parcial, é proibida e sujeita a denúncia.", estiloAviso);
console.log("Dúvidas ou parcerias? Entre em contato: https://udesaken.github.io");

// --- SISTEMA DE MÚSICA ---
// Tornando global para o HTML acessar
window.toggleMusic = function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');

    // Define o volume bem baixinho (10%)
    audio.volume = 0.1;

    if (audio.paused) {
        audio.play().then(() => {
            btn.classList.add('playing');
            btn.title = "Pausar Música";
        }).catch(error => {
            console.log("Interação necessária para tocar áudio:", error);
            alert("Clique na página primeiro para ativar o som!");
        });
    } else {
        audio.pause();
        btn.classList.remove('playing');
        icon.className = 'fas fa-volume-mute'; // Volta ícone de mudo
        btn.title = "Ligar Som";
    }
}

// --- CORREÇÃO: PAUSAR MÚSICA AO SAIR DA ABA ---
document.addEventListener("visibilitychange", function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');

    // Se a aba ficou oculta (usuário saiu ou minimizou)
    if (document.hidden) {
        if (!audio.paused) {
            audio.pause();
        }
    } 
    // Se o usuário voltou para a aba
    else {
        // Só volta a tocar se o botão visualmente estiver como "tocando"
        if (btn.classList.contains('playing')) {
            audio.play().catch(e => console.log("Áudio não pôde retomar automaticamente"));
        }
    }
});