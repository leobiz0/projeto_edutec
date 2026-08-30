// Preenche a largura da tela e continua acompanhando redimensionamentos de
// janela de verdade — SEM brigar com o zoom nativo do navegador (Ctrl +/-).
//
// Lógica: o zoom do navegador muda window.innerWidth e
// window.devicePixelRatio na proporção INVERSA um do outro (pra uma
// janela física do mesmo tamanho: dobra o DPR, cai pela metade o
// innerWidth). Multiplicando innerWidth pela razão DPR-atual/DPR-inicial,
// o efeito do zoom se cancela matematicamente e sobra só a largura
// "verdadeira" da janela — que SÓ muda quando a janela é redimensionada
// de verdade, nunca só por causa de zoom.
//
// Esse valor "verdadeiro" é aplicado via `zoom` (não transform, que não
// se mistura com o zoom nativo do jeito certo). Como os dois usam o
// mesmo mecanismo, o zoom do usuário multiplica livremente por cima
// deste valor: em 25% de zoom, o projeto realmente fica 4x menor.
(function () {
  var PAGE_WIDTH = 1440;
  var initialDPR = window.devicePixelRatio;
  var matchedMargin = false;

  // O header precisa ficar mais largo que 1440px (pra sempre cobrir a tela
  // toda), mas o .page tem overflow:hidden pra cortar tudo que passa da
  // borda do frame do Figma (elementos decorativos que vazam de propósito).
  // Isso cortava o header de volta assim que ele ficava mais largo que
  // 1440px. Solução: move todo o RESTO do conteúdo pra um wrapper interno
  // que faz esse corte, deixando o .page em si sem overflow — o header,
  // que fica fora desse wrapper, nunca é cortado.
  function detachHeaderFromClip() {
    var page = document.querySelector('.page');
    var header = document.querySelector('.site-header');
    if (!page || !header) return;
    if (page.querySelector(':scope > .page-frame')) return; // já rodou

    var frame = document.createElement('div');
    frame.className = 'page-frame';
    frame.style.position = 'relative';
    frame.style.width = PAGE_WIDTH + 'px';
    frame.style.height = '100%';
    frame.style.overflow = 'hidden';

    var kids = Array.prototype.slice.call(page.childNodes);
    kids.forEach(function (node) {
      if (node === header) return;
      frame.appendChild(node);
    });
    page.appendChild(frame);
    page.style.overflow = 'visible';
  }

  function apply() {
    var page = document.querySelector('.page');
    if (!page) return;
    var trueWidth = window.innerWidth * (window.devicePixelRatio / initialDPR);
    page.style.zoom = trueWidth / PAGE_WIDTH;

    // Header sempre ocupa a tela inteira (100vw), inclusive durante o zoom
    // real do navegador — diferente do resto da página, que fica do mesmo
    // tamanho relativo (não briga com o zoom). Como o header herda o MESMO
    // `zoom` do .page acima, dá pra cancelar isso especificamente pra ele:
    // width = 1440 * (DPR inicial / DPR atual) faz a largura RENDERIZADA
    // do header (width * zoom do .page) ficar sempre exatamente igual a
    // window.innerWidth, em qualquer zoom, em qualquer instante.
    var header = document.querySelector('.site-header');
    if (header) {
      var scale = trueWidth / PAGE_WIDTH;
      header.style.width = (PAGE_WIDTH * initialDPR / window.devicePixelRatio) + 'px';
      // .page fica centralizado na tela (body usa justify-content:center),
      // então tem uma margem à esquerda sempre que a largura do .page não
      // bate exatamente com a da janela. O header usa left:0 relativo ao
      // .page — sem corrigir isso, ele nasce empurrado por essa margem,
      // sobrando espaço à direita e "faltando" à esquerda. Cancela essa
      // margem convertendo pra dentro do sistema de coordenadas do .page
      // (dividindo pela escala atual, já que left também é afetado pelo zoom).
      var pageLeft = page.getBoundingClientRect().left;
      header.style.left = (-pageLeft / scale) + 'px';
    }

    // A margem que sobra ao redor (quando o zoom encolhe o conteúdo) usa a
    // MESMA cor de fundo da própria página, em vez de uma cor fixa — assim
    // não aparece nenhuma borda preta/estranha, só "mais canvas" da mesma cor.
    if (!matchedMargin) {
      var pageBg = getComputedStyle(page).backgroundColor;
      document.documentElement.style.background = pageBg;
      document.body.style.background = pageBg;
      matchedMargin = true;
    }
  }

  function init() {
    detachHeaderFromClip(); // precisa rodar ANTES do primeiro apply() (zoom ainda em 1, altura correta)
    apply();
  }

  window.addEventListener('resize', apply);
  // O evento "resize" nem sempre dispara de forma confiável durante o zoom
  // real do navegador (Ctrl +/-) em todos os browsers/SOs. Em vez de
  // depender só dele, confere continuamente (custo baixíssimo) se
  // innerWidth ou devicePixelRatio mudaram, e recalcula na hora — garante
  // que funciona mesmo quando o evento não dispara.
  var lastWidth = window.innerWidth;
  var lastDPR = window.devicePixelRatio;
  setInterval(function () {
    if (window.innerWidth !== lastWidth || window.devicePixelRatio !== lastDPR) {
      lastWidth = window.innerWidth;
      lastDPR = window.devicePixelRatio;
      apply();
    }
  }, 150);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
