/*
 * =============================================================
 * SEU SCRIPT PRINCIPAL (ex: includeComponents.js ou main.js)
 * VERSÃO FINAL COM TUDO FUNCIONANDO
 * =============================================================
 */

// --- 1. FUNÇÕES HELPER ---

async function loadHTML(selector, file) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const response = await fetch(file);
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error(`Erro ao carregar ${file}:`, err);
  }
}

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}


// --- 2. O INICIALIZADOR PRINCIPAL ---
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadHTML("header", "/src/components/header.html"),
    loadHTML("footer", "/src/components/footer.html")
  ]);

  // Avisa que o HTML do header/footer foi carregado
  document.dispatchEvent(new CustomEvent('componentsLoaded'));

  // Carrega outros scripts (como o do carrossel)
  loadScript("/public/scripts/script.js");
});


// --- 3. O SCRIPT DO HEADER E ACESSIBILIDADE ---
// Ouve o aviso e só então executa
document.addEventListener('componentsLoaded', () => {

  console.log("Componentes carregados. Iniciando script do header e acessibilidade...");

  // Elementos globais
  const body = document.body;
  const htmlElement = document.documentElement;

  // --- LÓGICA DO BOTÃO SANDUÍCHE (A PEÇA FALTANTE) ---
  const sandwichButton = document.getElementById('botao-menu');
  const navMenu = document.getElementById('nav-menu');

  if (sandwichButton && navMenu) {
    sandwichButton.addEventListener('click', () => {
      // O seu CSS usa a classe ".ativo" para mostrar o menu
      navMenu.classList.toggle('ativo');
    });
  }
  
  // --- LÓGICA DE ABRIR/FECHAR O POPUP ---
  const toggleButton = document.getElementById('btn-acessibilidade-toggle');
  const closeButton = document.getElementById('btn-acessibilidade-close');
  const popup = document.getElementById('menu-acessibilidade-popup');

  if (toggleButton && popup) {
    toggleButton.addEventListener('click', () => popup.classList.remove('hidden'));
  }
  if (closeButton && popup) {
    closeButton.addEventListener('click', () => popup.classList.add('hidden'));
  }

  
  // --- LÓGICA DO ALTO CONTRASTE ---
  const toggleContrastBtn = document.getElementById('toggle-contrast');

  function applyContrast() {
    const highContrast = localStorage.getItem('highContrast') === 'true';
    body.classList.toggle('high-contrast', highContrast);
  }

  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener('click', () => {
      const isHighContrast = body.classList.toggle('high-contrast');
      localStorage.setItem('highContrast', isHighContrast);
    });
  }


  // --- LÓGICA DA FONTE PARA DISLEXIA ---
  const toggleDyslexiaBtn = document.getElementById('toggle-dyslexia');

  function applyDyslexiaFont() {
    const dyslexiaFont = localStorage.getItem('dyslexiaFont') === 'true';
    body.classList.toggle('dyslexia-font', dyslexiaFont);
  }

  if (toggleDyslexiaBtn) {
    toggleDyslexiaBtn.addEventListener('click', () => {
      const isDyslexia = body.classList.toggle('dyslexia-font');
      localStorage.setItem('dyslexiaFont', isDyslexia);
    });
  }


  // --- LÓGICA DO TAMANHO DA FONTE ---
  const increaseBtn = document.getElementById('font-increase');
  const decreaseBtn = document.getElementById('font-decrease');
  const resetBtn = document.getElementById('font-reset');
  const defaultFontSize = 16;
  let currentFontSize = defaultFontSize;

  function setFontSize(sizeInPixels) {
    if (sizeInPixels < 12) sizeInPixels = 12;
    if (sizeInPixels > 24) sizeInPixels = 24;
    
    currentFontSize = sizeInPixels;
    htmlElement.style.setProperty('--font-size-base', currentFontSize + 'px', 'important');
    localStorage.setItem('fontSize', currentFontSize);
  }

  function applyFontSize() {
    const savedSize = localStorage.getItem('fontSize');
    currentFontSize = parseFloat(savedSize) || defaultFontSize;
    htmlElement.style.setProperty('--font-size-base', currentFontSize + 'px', 'important');
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => setFontSize(currentFontSize + 1));
  }
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => setFontSize(currentFontSize - 1));
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => setFontSize(defaultFontSize));
  }


  // --- APLICA TUDO AO CARREGAR A PÁGINA ---
  applyContrast();
  applyDyslexiaFont();
  applyFontSize();

});