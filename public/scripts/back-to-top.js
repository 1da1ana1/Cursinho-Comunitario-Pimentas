document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o botão pelo ID ou classe
    const backToTopButton = document.querySelector('.back-to-top');

    // Verifica se o botão existe na página antes de continuar
    if (!backToTopButton) return;

    // Função para mostrar/ocultar o botão baseado no scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) { // Aparece após rolar 200px
            backToTopButton.style.display = 'flex'; 
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Função de clique para subir suavemente
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault(); // Previne comportamento padrão se for um link
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});