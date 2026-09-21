/* CENÁRIO: este arquivo só desenha. As regras ficam em jogo.js. */
window.createRenderer = function (canvas, CONFIG, sprites, getState) {
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const C = { purple: "#8A4FFF", dark: "#273043", white: "#FFFFFF", pink: "#FF66C4", cyan: "#57E6FF" };

  function rounded(x, y, w, h, r, fill, stroke) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }

  function drawSky(scroll, ground) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ground);
    gradient.addColorStop(0, "#17122F");
    gradient.addColorStop(.55, "#5030A5");
    gradient.addColorStop(1, C.purple);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, CONFIG.width, ground);
    const moon = ctx.createRadialGradient(875, 92, 2, 875, 92, 78);
    moon.addColorStop(0, "rgba(255,255,255,.8)"); moon.addColorStop(1, "rgba(138,79,255,0)");
    ctx.fillStyle = moon; ctx.beginPath(); ctx.arc(875, 92, 78, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 28; i++) {
      const x = ((i * 163 - scroll * .08) % 1250 + 1250) % 1250 - 40;
      const y = 38 + (i * 71) % 220;
      ctx.fillStyle = i % 5 === 0 ? C.cyan : "rgba(255,255,255,.55)";
      ctx.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
    }
  }

  function drawCity(scroll, ground) {
    for (let layer = 0; layer < 2; layer++) {
      const speed = layer ? .28 : .14;
      for (let i = 0; i < 13; i++) {
        const w = 82 + (i % 3) * 22;
        const h = 75 + ((i * 47 + layer * 31) % 150);
        const x = ((i * 128 - scroll * speed) % 1664 + 1664) % 1664 - 150;
        ctx.fillStyle = layer ? "rgba(39,48,67,.65)" : "rgba(39,48,67,.3)";
        ctx.fillRect(x, ground - h, w, h);
        ctx.fillStyle = layer ? "rgba(87,230,255,.28)" : "rgba(255,255,255,.15)";
        for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
          if ((row + col + i) % 3) ctx.fillRect(x + 13 + col * 22, ground - h + 17 + row * 25, 7, 4);
        }
      }
    }
    ctx.strokeStyle = "rgba(87,230,255,.32)"; ctx.lineWidth = 2;
    for (let row = 0; row < 3; row++) {
      ctx.beginPath(); const y = ground - 68 - row * 34; ctx.moveTo(0, y);
      for (let x = 0; x <= CONFIG.width; x += 70) ctx.lineTo(x, y + Math.sin((x + scroll * .25) / 80) * 10);
      ctx.stroke();
    }
  }

  function drawTrack(scroll, ground) {
    ctx.fillStyle = C.dark; ctx.fillRect(0, ground, CONFIG.width, CONFIG.height - ground);
    ctx.fillStyle = C.white; ctx.fillRect(0, ground, CONFIG.width, 4);
    for (let x = -scroll % 105; x < CONFIG.width; x += 105) {
      ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.fillRect(x, ground + 49, 46, 3);
    }
  }

  function drawMarkers(distance, ground) {
    const next = Math.floor(distance / 50) * 50;
    ctx.font = "bold 12px Trebuchet MS"; ctx.fillStyle = "rgba(255,255,255,.55)";
    for (let meters = next; meters <= next + 100; meters += 50) {
      const x = (meters - distance) * CONFIG.pixelsPerMeter + 175;
      if (x > -50 && x < CONFIG.width) ctx.fillText(`${meters} m`, x, ground + 83);
    }
  }

  function drawFinish(distance, ground) {
    const x = (CONFIG.finish - distance) * CONFIG.pixelsPerMeter + 175;
    if (x > CONFIG.width + 100) return;
    ctx.fillStyle = C.white; ctx.fillRect(x, ground - 230, 5, 230);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 6; col++) {
      ctx.fillStyle = (row + col) % 2 ? C.purple : C.white;
      ctx.fillRect(x + 5 + col * 13, ground - 230 + row * 13, 13, 13);
    }
    ctx.fillStyle = C.white; ctx.font = "bold 15px Trebuchet MS"; ctx.fillText("CHEGADA", x - 25, ground - 248);
  }

  function drawData(rect) {
    rounded(rect.x, rect.y, rect.w, rect.h, 7, C.dark, C.cyan);
    ctx.fillStyle = C.cyan;
    ctx.fillRect(rect.x + 10, rect.y + 12, rect.w - 20, 5);
    ctx.fillRect(rect.x + 10, rect.y + 25, rect.w - 30, 5);
    ctx.fillRect(rect.x + 10, rect.y + 38, rect.w - 14, 5);
  }

  function drawChip(rect) {
    rounded(rect.x, rect.y, rect.w, rect.h, 8, C.white, C.dark);
    rounded(rect.x + 13, rect.y + 9, rect.w - 26, rect.h - 18, 3, C.purple);
    ctx.strokeStyle = C.cyan;
    for (let y = rect.y + 8; y < rect.y + rect.h; y += 11) {
      ctx.beginPath(); ctx.moveTo(rect.x - 7, y); ctx.lineTo(rect.x, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rect.x + rect.w, y); ctx.lineTo(rect.x + rect.w + 7, y); ctx.stroke();
    }
  }

  function drawScanner(rect) {
    rounded(rect.x, rect.y, rect.w, rect.h, 8, C.dark, C.pink);
    ctx.fillStyle = C.pink; ctx.fillRect(rect.x + 7, rect.y + rect.h - 15, rect.w - 14, 5);
    ctx.beginPath(); ctx.arc(rect.x + 19, rect.y + 22, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rect.x + rect.w - 19, rect.y + 22, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.white; ctx.font = "bold 22px Trebuchet MS"; ctx.textAlign = "center";
    ctx.fillText("↓", rect.x + rect.w / 2, rect.y + 42); ctx.textAlign = "start";
  }

  function drawObstacles(obstacles, obstacleRect) {
    for (const obstacle of obstacles) {
      if (obstacle.passed) continue;
      const rect = obstacleRect(obstacle);
      if (rect.x + rect.w < -20 || rect.x > CONFIG.width + 20) continue;
      if (obstacle.type === "scanner") drawScanner(rect);
      else if (obstacle.type === "chip") drawChip(rect);
      else drawData(rect);
    }
  }

  function drawPlayer(game, ground) {
    const rolling = game.player.roll > 0;
    const airborne = game.player.y < 0;
    const frame = rolling ? sprites[game.chosen].roll
      : sprites[game.chosen][airborne ? 0 : 1 + Math.floor(game.elapsed * 9) % 2];
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath(); ctx.ellipse(game.player.x, ground + 2, 37, 7, 0, 0, Math.PI * 2); ctx.fill();
    if (game.invulnerable > 0) {
      ctx.strokeStyle = C.cyan; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(game.player.x, ground + game.player.y - 67, 57, 82, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = .68 + .32 * Math.sin(game.elapsed * 22) ** 2;
    }
    const height = rolling ? 82 : 143;
    const width = frame.width / frame.height * height;
    const y = rolling ? ground - height + 6 : ground + game.player.y - height + 5;
    if (rolling) {
      const rollProgress = 1 - game.player.roll / CONFIG.rollDuration;
      ctx.translate(game.player.x, ground - height / 2 + 4);
      ctx.rotate(rollProgress * Math.PI * 2);
      ctx.drawImage(frame, -width / 2, -height / 2, width, height);
    } else {
      ctx.drawImage(frame, game.player.x - width / 2, y, width, height);
    }
    ctx.restore();
  }

  function draw() {
    const game = getState();
    if (!sprites[game.chosen] || $("game").hidden) return;
    const scroll = game.distance * CONFIG.pixelsPerMeter;
    drawSky(scroll, CONFIG.ground); drawCity(scroll, CONFIG.ground); drawTrack(scroll, CONFIG.ground);
    drawMarkers(game.distance, CONFIG.ground); drawFinish(game.distance, CONFIG.ground);
    drawObstacles(game.obstacles, game.obstacleRect); drawPlayer(game, CONFIG.ground);
  }
  return draw;
};
