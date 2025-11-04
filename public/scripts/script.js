// Botão hamburguer do layout mobile
const botaoMenu = document.getElementById('botao-menu');
const navMenu = document.getElementById('nav-menu');

botaoMenu.addEventListener('click', () => {
    navMenu.classList.toggle('ativo');
});

// --- CÓDIGO DO CARROSSEL PARA ARRASTAR ---
function setupCarousel() {
    const carousel = document.querySelector('.slide1');
    if (!carousel) return; // Se não houver carrossel na página, para aqui

    const sliders = carousel.querySelector('.sliders');
    const radioInputs = carousel.querySelectorAll(':scope > input[name="radio-btn"]');
    if (!sliders || radioInputs.length === 0) return;

    let isDragging = false;
    let startX;
    let currentSlide = 0;
    let carouselWidth = carousel.offsetWidth; // Largura do carrossel

    // --- FUNÇÃO PRINCIPAL DE MOVIMENTO ---
    function goToSlide(index, animate = true) {
        // Garante que o índice está dentro dos limites (0, 1, 2)
        index = Math.max(0, Math.min(index, radioInputs.length - 1));
        
        // 1. Calcula o novo translate em pixels
        const newTransform = -(index * carouselWidth);
        
        // 2. Aplica a animação (ou não, se for no resize)
        sliders.style.transition = animate ? 'transform 0.4s ease-in-out' : 'none';
        sliders.style.transform = `translateX(${newTransform}px)`;
        
        // 3. Atualiza o radio button (para as bolinhas)
        if (!radioInputs[index].checked) {
             radioInputs[index].checked = true;
        }
        
        // 4. Armazena o slide atual
        currentSlide = index;
    }

    // --- FUNÇÕES DE ARRASTAR (DRAG) ---
    function dragStart(e) {
        isDragging = true;
        // Pega a posição inicial do mouse ou do dedo
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        currentSlide = getCheckedIndex(); // Pega o slide atual
        carouselWidth = carousel.offsetWidth; // Recalcula a largura (caso a tela mude)
        sliders.style.transition = 'none'; // Desliga a animação CSS para o arraste ser fluido
        carousel.style.cursor = 'grabbing';
    }

    function dragMove(e) {
        if (!isDragging) return;
        if (e.type.includes('touch')) e.preventDefault(); // Previne rolar a pág. no mobile
        
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diffX = currentX - startX; // O quanto o usuário arrastou
        
        // Posição base (ex: -800px) + o quanto arrastou
        const baseTranslate = -(currentSlide * carouselWidth);
        sliders.style.transform = `translateX(${baseTranslate + diffX}px)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';

        const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
        const diffX = currentX - startX;
        
        // O usuário precisa arrastar pelo menos 1/5 (20%) da tela
        const threshold = carouselWidth / 5; 

        if (diffX > threshold) {
            // Arrastou para a direita (voltar slide)
            goToSlide(currentSlide - 1); 
        } else if (diffX < -threshold) {
            // Arrastou para a esquerda (avançar slide)
            goToSlide(currentSlide + 1);
        } else {
            // Não arrastou o suficiente, volta ao slide atual
            goToSlide(currentSlide);
        }
    }
    
    // Função helper para achar o slide atual
    function getCheckedIndex() {
        for (let i = 0; i < radioInputs.length; i++) {
            if (radioInputs[i].checked) return i;
        }
        return 0; // Default
    }

    // --- ADICIONA OS "ESCUTADORES" DE EVENTOS ---
    
    carousel.style.cursor = 'grab';
    // Desktop
    sliders.addEventListener('mousedown', dragStart);
    sliders.addEventListener('mousemove', dragMove);
    sliders.addEventListener('mouseup', dragEnd);
    sliders.addEventListener('mouseleave', dragEnd);
    // Mobile
    sliders.addEventListener('touchstart', dragStart, { passive: true });
    sliders.addEventListener('touchmove', dragMove, { passive: false });
    sliders.addEventListener('touchend', dragEnd);
    // Impede que o navegador "arraste a imagem"
    sliders.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    radioInputs.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            goToSlide(index);
        });
    });

    window.addEventListener('resize', () => {
         carouselWidth = carousel.offsetWidth;
         goToSlide(getCheckedIndex(), false);
    });

    goToSlide(getCheckedIndex(), false);
}
setupCarousel();