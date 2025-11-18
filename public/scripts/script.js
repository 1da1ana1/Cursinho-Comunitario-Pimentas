document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. MENU HAMBURGUER (Mobile)
    // =====================================================
    const botaoMenu = document.getElementById('botao-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if(botaoMenu && navMenu) {
        botaoMenu.addEventListener('click', () => {
            navMenu.classList.toggle('ativo');
        });
    }

    // =====================================================
    // 2. LÓGICA DO BOTÃO PIX (NOVO)
    // =====================================================
    function setupPixCopy() {
        // Procura o botão pela classe .chave usada na página Apoie
        const pixBtn = document.querySelector('.chave');
        
        if(pixBtn) {
            pixBtn.addEventListener('click', () => {
                const pixKey = 'pixcursinho@gmail.com';
                
                // Tenta copiar para a área de transferência
                navigator.clipboard.writeText(pixKey).then(() => {
                    // Feedback Visual: Muda texto e cor
                    const textoOriginal = pixBtn.innerText;
                    const corOriginal = pixBtn.style.backgroundColor;
                    
                    pixBtn.innerText = 'Chave Copiada!';
                    pixBtn.style.backgroundColor = '#25D366'; // Verde WhatsApp
                    pixBtn.style.color = '#fff';
                    pixBtn.style.border = 'none';

                    // Volta ao normal após 2 segundos
                    setTimeout(() => {
                        pixBtn.innerText = textoOriginal;
                        pixBtn.style.backgroundColor = corOriginal;
                        pixBtn.style.color = ''; // Volta cor original definida no CSS
                        pixBtn.style.border = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar:', err);
                    // Fallback caso o navegador bloqueie
                    alert('A chave PIX é: ' + pixKey);
                });
            });
        }
    }
    setupPixCopy();

    // =====================================================
    // 3. CARROSSEL DE CARDS (Página Inicial)
    // =====================================================
    const scrollContainer = document.getElementById('scroll-container');
    const btnAnt = document.getElementById('btn-ant');
    const btnProx = document.getElementById('btn-prox');

    if (scrollContainer && btnAnt && btnProx) {
        btnProx.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });

        btnAnt.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });

        // Arrastar com Mouse
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
    // 4. CARROSSEL DE IMAGENS (História)
    // =====================================================
    function setupCarousel() {
        const carousel = document.querySelector('.slide1');
        if (!carousel) return; 

        const sliders = carousel.querySelector('.sliders');
        const radioInputs = carousel.querySelectorAll(':scope > input[name="radio-btn"]');
        
        if (!sliders || radioInputs.length === 0) return;

        let isDragging = false;
        let startX;
        let currentSlide = 0;
        let carouselWidth = carousel.offsetWidth;

        function goToSlide(index, animate = true) {
            index = Math.max(0, Math.min(index, radioInputs.length - 1));
            const newTransform = -(index * carouselWidth);
            sliders.style.transition = animate ? 'transform 0.4s ease-in-out' : 'none';
            sliders.style.transform = `translateX(${newTransform}px)`;
            if (radioInputs[index] && !radioInputs[index].checked) radioInputs[index].checked = true;
            currentSlide = index;
        }

        function dragStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentSlide = getCheckedIndex();
            carouselWidth = carousel.offsetWidth;
            sliders.style.transition = 'none';
            carousel.style.cursor = 'grabbing';
        }

        function dragMove(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diffX = currentX - startX;
            const baseTranslate = -(currentSlide * carouselWidth);
            sliders.style.transform = `translateX(${baseTranslate + diffX}px)`;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.cursor = 'grab';
            const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
            const diffX = currentX - startX;
            const threshold = carouselWidth / 5; 

            if (diffX > threshold) goToSlide(currentSlide - 1); 
            else if (diffX < -threshold) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide);
        }
        
        function getCheckedIndex() {
            for (let i = 0; i < radioInputs.length; i++) {
                if (radioInputs[i].checked) return i;
            }
            return 0;
        }

        carousel.style.cursor = 'grab';
        sliders.addEventListener('mousedown', dragStart);
        sliders.addEventListener('mousemove', dragMove);
        sliders.addEventListener('mouseup', dragEnd);
        sliders.addEventListener('mouseleave', dragEnd);
        sliders.addEventListener('touchstart', dragStart, { passive: true });
        sliders.addEventListener('touchmove', dragMove); 
        sliders.addEventListener('touchend', dragEnd);
        sliders.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', (e) => e.preventDefault()));

        radioInputs.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                carouselWidth = carousel.offsetWidth;
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
});