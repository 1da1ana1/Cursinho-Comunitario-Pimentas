document.addEventListener('DOMContentLoaded', () => {
    // 1. Botão Hamburguer Mobile
    const botaoMenu = document.getElementById('botao-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if(botaoMenu && navMenu) {
        botaoMenu.addEventListener('click', () => {
            navMenu.classList.toggle('ativo');
        });
    }

    // 2. Carrossel com Setas (Desktop)
    const scrollContainer = document.getElementById('scroll-container');
    const btnAnt = document.getElementById('btn-ant');
    const btnProx = document.getElementById('btn-prox');

    if (scrollContainer && btnAnt && btnProx) {
        // Função para mover o carrossel para a direita
        btnProx.addEventListener('click', () => {
            // Rola 320px (tamanho aprox do card + gap)
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });

        // Função para mover o carrossel para a esquerda
        btnAnt.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }
});