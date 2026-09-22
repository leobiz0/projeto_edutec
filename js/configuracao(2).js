// Ajustes da corrida. Distâncias em metros; física em pixels e segundos.
window.RUNNER_CONFIG = Object.freeze({
  width: 1100,           // Largura lógica do cenário.
  height: 520,           // Altura lógica do cenário.
  ground: 418,           // Altura do chão.
  finish: 600,           // Distância para vencer.
  pixelsPerMeter: 36,
  speed: 225,           // Velocidade normal, sem pressionar nenhuma seta.
  speedBoost: 1.25,     // A seta direita deixa a corrida apenas 25% mais rápida.
  gravity: 1650,
  jumpVelocity: -835,    // Mais negativo = salto mais alto.
  moveSpeed: 270,
  rollDuration: 1.0,     // Tempo suficiente para atravessar o obstáculo baixo.
  protection: 2.4        // Proteção ao retomar após uma resposta certa.
});
