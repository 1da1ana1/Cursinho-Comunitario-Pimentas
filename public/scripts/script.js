// Botão hamburguer do layout mobile
const botaoMenu = document.getElementById('botao-menu');
const navMenu = document.getElementById('nav-menu');

botaoMenu.addEventListener('click', () => {
    navMenu.classList.toggle('ativo');
});