document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. MENU HAMBURGUER (Mobile)
    // =====================================================
    const botaoMenu = document.getElementById('botao-menu');
    const navMenu = document.getElementById('nav-menu');
    
    // Verificação de segurança para não dar erro se o elemento não existir
    if(botaoMenu && navMenu) {
        botaoMenu.addEventListener('click', () => {
            navMenu.classList.toggle('ativo');
        });
    }

    // =====================================================
    // 2. CARROSSEL DE CARDS (Página Inicial)
    // =====================================================
    // Mantivemos este funcionando pois ele é diferente do da história
    const scrollContainer = document.getElementById('scroll-container');
    const btnAnt = document.getElementById('btn-ant');
    const btnProx = document.getElementById('btn-prox');

    if (scrollContainer && btnAnt && btnProx) {
        // Clique nas setas
        btnProx.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });

        btnAnt.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });

        // Arrastar com Mouse (Desktop)
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.classList.add('active');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener('mouseleave', () => { isDown = false; });
        scrollContainer.addEventListener('mouseup', () => { isDown = false; });
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // =====================================================
    // 3. CARROSSEL DE IMAGENS (Sua Nova Lógica)
    // =====================================================
    function setupCarousel() {
        const carousel = document.querySelector('.slide1');
        if (!carousel) return; // Se não houver carrossel na página, para aqui

        const sliders = carousel.querySelector('.sliders');
        // O seletor :scope garante que pegamos apenas os inputs diretos deste carrossel
        const radioInputs = carousel.querySelectorAll(':scope > input[name="radio-btn"]');
        
        if (!sliders || radioInputs.length === 0) return;

        let isDragging = false;
        let startX;
        let currentSlide = 0;
        let carouselWidth = carousel.offsetWidth; // Largura do carrossel

        // --- FUNÇÃO PRINCIPAL DE MOVIMENTO ---
        function goToSlide(index, animate = true) {
            // Garante que o índice está dentro dos limites
            index = Math.max(0, Math.min(index, radioInputs.length - 1));
            
            // 1. Calcula o novo translate em pixels (negativo para mover para a esquerda)
            const newTransform = -(index * carouselWidth);
            
            // 2. Aplica a animação (ou não, se for durante o arraste ou resize)
            sliders.style.transition = animate ? 'transform 0.4s ease-in-out' : 'none';
            sliders.style.transform = `translateX(${newTransform}px)`;
            
            // 3. Atualiza o radio button (para as bolinhas de navegação)
            if (radioInputs[index] && !radioInputs[index].checked) {
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
            currentSlide = getCheckedIndex(); // Sincroniza com o slide atual real
            carouselWidth = carousel.offsetWidth; // Recalcula a largura (segurança)
            
            sliders.style.transition = 'none'; // Desliga animação para resposta imediata
            carousel.style.cursor = 'grabbing';
        }

        function dragMove(e) {
            if (!isDragging) return;
            // No mobile, previne o scroll da tela se estiver arrastando muito horizontalmente
            if (e.type.includes('touch')) {
                 // Opcional: lógica para permitir scroll vertical se necessário
            } 
            
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diffX = currentX - startX; // Distância arrastada
            
            // Calcula a posição em tempo real: Posição Base + Deslocamento
            const baseTranslate = -(currentSlide * carouselWidth);
            sliders.style.transform = `translateX(${baseTranslate + diffX}px)`;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.cursor = 'grab';

            const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
            const diffX = currentX - startX;
            
            // Define o limite para trocar de slide (20% da largura)
            const threshold = carouselWidth / 5; 

            if (diffX > threshold) {
                // Arrastou para a direita -> Voltar slide
                goToSlide(currentSlide - 1); 
            } else if (diffX < -threshold) {
                // Arrastou para a esquerda -> Avançar slide
                goToSlide(currentSlide + 1);
            } else {
                // Não arrastou o suficiente -> Volta para o centro do slide atual
                goToSlide(currentSlide);
            }
        }
        
        // Função helper para descobrir qual bolinha está marcada
        function getCheckedIndex() {
            for (let i = 0; i < radioInputs.length; i++) {
                if (radioInputs[i].checked) return i;
            }
            return 0;
        }

        // --- ADICIONA OS EVENTOS ---
        carousel.style.cursor = 'grab';
        
        // Desktop (Mouse)
        sliders.addEventListener('mousedown', dragStart);
        sliders.addEventListener('mousemove', dragMove);
        sliders.addEventListener('mouseup', dragEnd);
        sliders.addEventListener('mouseleave', dragEnd);
        
        // Mobile (Touch)
        // 'passive: true' melhora a performance do scroll, mas 'passive: false' seria necessário se quisesse usar e.preventDefault() no touchmove
        sliders.addEventListener('touchstart', dragStart, { passive: true });
        sliders.addEventListener('touchmove', dragMove); 
        sliders.addEventListener('touchend', dragEnd);
        
        // Impede que o navegador tente arrastar a imagem como um arquivo
        sliders.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Clique nas bolinhas de navegação
        radioInputs.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                // Atualiza largura caso a tela tenha mudado
                carouselWidth = carousel.offsetWidth;
                goToSlide(index);
            });
        });

        // Redimensionamento da tela
        window.addEventListener('resize', () => {
             carouselWidth = carousel.offsetWidth;
             // Recalcula posição sem animação para não "pular"
             goToSlide(getCheckedIndex(), false);
        });

        // Inicialização
        goToSlide(getCheckedIndex(), false);
    }

    // Inicializa o carrossel de história
    setupCarousel();
});