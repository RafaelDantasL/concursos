// Função para detectar se o bloco está visível na tela
function isVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
}

// Adicionar evento de rolagem para aplicar animação
window.addEventListener('scroll', () => {
  document.querySelectorAll('.block-3, .block-4, .block-5, .block-6').forEach(block => {
    if (isVisible(block)) {
      block.classList.add('visible');
    }
  });
});

// Função para rolar até o bloco 2 quando o botão "Comprar Agora" for clicado
document.querySelector('.buy-again .buy-button').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.block-2').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('scroll', function() {
  const slidingLine = document.querySelector('.sliding-line');
  const linePosition = slidingLine.getBoundingClientRect().top;
  const screenPosition = window.innerHeight / 1.3; // Define o ponto de disparo da animação

  if (linePosition < screenPosition) {
    slidingLine.classList.add('visible');
  }
});
