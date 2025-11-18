// scripts/includeComponents.js

// --- 1. FUNÇÕES AUXILIARES ---
async function carregarHTML(seletor, arquivo) {
    const container = document.querySelector(seletor);
    if (!container) {
        console.warn(`Container ${seletor} não encontrado`);
        return;
    }

    try {
        const resposta = await fetch(arquivo);
        if (!resposta.ok) throw new Error(`Erro HTTP! status: ${resposta.status}`);
        const html = await resposta.text();
        container.innerHTML = html;
        console.log(`Carregado com sucesso: ${arquivo}`);
    } catch (erro) {
        console.error(`Erro ao carregar ${arquivo}:`, erro);
    }
}

// --- 2. INICIALIZAÇÃO DA ACESSIBILIDADE ---
function inicializarAcessibilidade() {
    console.log("Inicializando funções de acessibilidade...");
    
    const corpo = document.body;
    const elementoHtml = document.documentElement;

    // --- MENU HAMBURGUER (MOBILE) ---
    const botaoSanduiche = document.getElementById('botao-menu');
    const menuNavegacao = document.getElementById('nav-menu');

    if (botaoSanduiche && menuNavegacao) {
        botaoSanduiche.addEventListener('click', () => {
            menuNavegacao.classList.toggle('ativo');
        });
    }

    // --- POPUP DE ACESSIBILIDADE ---
    const btnAbrirAcessibilidade = document.getElementById('btn-acessibilidade-toggle');
    const btnFecharAcessibilidade = document.getElementById('btn-acessibilidade-close');
    const popupAcessibilidade = document.getElementById('menu-acessibilidade-popup');

    if (btnAbrirAcessibilidade && popupAcessibilidade) {
        btnAbrirAcessibilidade.addEventListener('click', () => {
            // Remove a classe 'hidden' para mostrar o menu
            popupAcessibilidade.classList.remove('hidden'); 
        });
    }

    if (btnFecharAcessibilidade && popupAcessibilidade) {
        btnFecharAcessibilidade.addEventListener('click', () => {
            // Adiciona a classe 'hidden' para esconder o menu
            popupAcessibilidade.classList.add('hidden');
        });
    }

    // --- ALTO CONTRASTE ---
    const btnContraste = document.getElementById('toggle-contrast');
    if (btnContraste) {
        // Verifica se já estava salvo no navegador
        if (localStorage.getItem('altoContraste') === 'true') {
            corpo.classList.add('high-contrast');
        }

        btnContraste.addEventListener('click', () => {
            const ativado = corpo.classList.toggle('high-contrast');
            localStorage.setItem('altoContraste', ativado);
            console.log("Alto contraste: " + (ativado ? "Ativado" : "Desativado"));
        });
    }

    // --- FONTE PARA DISLEXIA ---
    const btnDislexia = document.getElementById('toggle-dyslexia');
    if (btnDislexia) {
        if (localStorage.getItem('fonteDislexia') === 'true') {
            corpo.classList.add('dyslexia-font');
        }

        btnDislexia.addEventListener('click', () => {
            const ativado = corpo.classList.toggle('dyslexia-font');
            localStorage.setItem('fonteDislexia', ativado);
            console.log("Modo leitura: " + (ativado ? "Ativado" : "Desativado"));
        });
    }

    // --- TAMANHO DA FONTE ---
    const btnAumentar = document.getElementById('font-increase');
    const btnDiminuir = document.getElementById('font-decrease');
    const btnResetar = document.getElementById('font-reset');
    
    if (btnAumentar && btnDiminuir && btnResetar) {
        const tamanhoPadrao = 16; // Tamanho base em pixels (equivalente a 1rem padrão)
        let tamanhoAtual = parseFloat(localStorage.getItem('tamanhoFonte')) || tamanhoPadrao;

        function definirTamanhoFonte(tamanhoPx) {
            // Limites de tamanho (mínimo 12px, máximo 24px)
            if (tamanhoPx < 12) tamanhoPx = 12;
            if (tamanhoPx > 24) tamanhoPx = 24;
            
            tamanhoAtual = tamanhoPx;
            // Aplica na tag HTML para funcionar com medidas REM
            elementoHtml.style.fontSize = tamanhoAtual + 'px';
            localStorage.setItem('tamanhoFonte', tamanhoAtual);
        }

        // Aplicar tamanho salvo ao carregar
        definirTamanhoFonte(tamanhoAtual);

        btnAumentar.addEventListener('click', () => definirTamanhoFonte(tamanhoAtual + 1));
        btnDiminuir.addEventListener('click', () => definirTamanhoFonte(tamanhoAtual - 1));
        btnResetar.addEventListener('click', () => definirTamanhoFonte(tamanhoPadrao));
    }
}

// --- 3. O INICIALIZADOR PRINCIPAL ---
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Iniciando sistema...");

    try {
        // Carrega header e footer
        await Promise.all([
            carregarHTML("header", "/src/components/header.html"),
            carregarHTML("footer", "/src/components/footer.html")
        ]);

        console.log("Componentes visuais carregados.");
        
        // Inicializa a lógica dos botões logo após o HTML ser inserido
        inicializarAcessibilidade();

        // Avisa o restante do site que carregou (útil se tiver outros scripts)
        document.dispatchEvent(new CustomEvent('componentesCarregados'));

    } catch (erro) {
        console.error("Erro crítico ao carregar componentes:", erro);
    }
});