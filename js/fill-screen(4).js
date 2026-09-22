// Define a escala já no head, evitando letras maiores durante a troca de página.
(() => {
  function fit() {
    const width = document.documentElement.clientWidth;
    const scale = Math.min(1080, width) / 1440;
    document.documentElement.style.setProperty('--page-scale', scale);
    document.documentElement.style.setProperty('--header-background-height', `${112 * scale}px`);
    document.documentElement.style.setProperty('--page-viewport-height', `${window.innerHeight / scale}px`);
    document.documentElement.style.setProperty('--page-viewport-width', `${width / scale}px`);
  }
  fit();
  document.addEventListener('DOMContentLoaded', fit);
  window.addEventListener('resize', fit);
})();
