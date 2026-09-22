/* CONFETES: animação isolada, iniciada somente na vitória. */
window.createConfetti = function (canvas) {
  const context = canvas.getContext("2d");
  const colors = ["#8A4FFF", "#57E6FF", "#FF66C4", "#FFFFFF", "#FFD166"];
  let pieces = [];
  let animationId = 0;
  let stopTimer = 0;
  let lastTime = 0;

  function resize() {
    const scale = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(box.width * scale));
    canvas.height = Math.max(1, Math.floor(box.height * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);
    return box;
  }

  function makePiece(width, fromCenter = false) {
    return {
      x: fromCenter ? width / 2 + (Math.random() - .5) * 130 : Math.random() * width,
      y: fromCenter ? 260 : -20 - Math.random() * 280,
      vx: fromCenter ? (Math.random() - .5) * 360 : (Math.random() - .5) * 50,
      vy: fromCenter ? -230 - Math.random() * 210 : 85 + Math.random() * 150,
      gravity: 235 + Math.random() * 90,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * 9,
      width: 7 + Math.random() * 8,
      height: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function frame(now) {
    const box = resize();
    const dt = Math.min((now - lastTime) / 1000 || 0, .034);
    lastTime = now;
    context.clearRect(0, 0, box.width, box.height);
    for (const piece of pieces) {
      piece.vy += piece.gravity * dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.rotation += piece.spin * dt;
      if (piece.y > box.height + 30) Object.assign(piece, makePiece(box.width));
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      context.restore();
    }
    animationId = requestAnimationFrame(frame);
  }

  function start() {
    stop();
    const box = resize();
    pieces = Array.from({ length: 110 }, (_, index) => makePiece(box.width, index < 50));
    lastTime = performance.now();
    animationId = requestAnimationFrame(frame);
    stopTimer = window.setTimeout(stop, 4000);
  }

  function stop() {
    if (animationId) cancelAnimationFrame(animationId);
    if (stopTimer) window.clearTimeout(stopTimer);
    animationId = 0;
    stopTimer = 0;
    pieces = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { start, stop };
};
