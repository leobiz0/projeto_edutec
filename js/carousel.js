// Arrastar-para-rolar no carrossel de pôsteres (igual ao gesto de arrastar do Figma)
document.querySelectorAll('.filmes-carousel').forEach((carousel) => {
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScrollLeft = carousel.scrollLeft;
    carousel.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    carousel.scrollLeft = startScrollLeft - dx;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });

  // impede o navegador de iniciar o arrastar nativo de imagem OU de link
  // (sem isso, arrastar em cima de um pôster que é <a> mostra o "fantasma"
  // de link sendo puxado em vez de só rolar o carrossel)
  carousel.addEventListener('dragstart', (e) => e.preventDefault());

  // impede que o clique final após arrastar dispare como um clique normal
  carousel.addEventListener('click', (e) => {
    if (moved) e.preventDefault();
  }, true);
});
