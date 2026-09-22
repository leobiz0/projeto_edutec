/* INOVA RUNNER — JavaScript puro, sem bibliotecas ou conexão com a internet.
* Máquina de estados: menu → running → quiz → running | lost → menu.
* Uma única animação controla o jogo; reiniciar não cria loops extras.
*/
"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const canvas = $("world");
  const CONFIG = window.RUNNER_CONFIG;
  const QUESTIONS = window.RUNNER_QUESTIONS;
  const sprites = {
  };
  const keys = new Set();
  const confetti = window.createConfetti($("confetti"));
  let state = "menu", chosen = "bin", distance = 0, correctAnswers = 0;
  let elapsed = 0, lastTime = 0, invulnerable = 0, currentQuestion = null;
  let answered = false, questions = [], questionIndex = 0, obstacles = [];
  let player = {
    x:175, y:0, vy:0, roll:0
  };
  const loadCharacters = window.createCharacterLoader(sprites);
  const draw = window.createRenderer(canvas, CONFIG, sprites, () => ({
    chosen, distance, elapsed, invulnerable, player, obstacles, obstacleRect
  }));
  // 1. Preparação da partida e navegação entre telas.
  function shuffle(items) {
    const copy = [...items];
    for (let i=copy.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]] = [copy[j],copy[i]];
    }
    return copy;
  }

  // Embaralha as alternativas e encontra novamente onde ficou a correta.
  // Assim, a letra correta muda sem alterar o conteúdo da pergunta.
  function shuffleAnswers(question) {
    const alternatives = question.a.map((text, originalIndex) => ({
      text,
      isCorrect: originalIndex === question.correct
    }));
    const shuffled = shuffle(alternatives);
    return {
      ...question,
      a: shuffled.map(alternative => alternative.text),
      correct: shuffled.findIndex(alternative => alternative.isCorrect)
    };
  }
  function screen(name) {
    for(const id of ["menu","game","result"]) $(id).hidden=id!==name;
  }
  function closeDialogs() {
    for(const id of ["quiz","pause-dialog"]) if($(id).open) $(id).close();
  }
  function clearInput() {
    keys.clear();
  }
  function updateHud() {
    $("distance").textContent=`${Math.floor(distance)} / ${CONFIG.finish} m`;
    $("score").textContent=String(correctAnswers).padStart(2,"0");
    $("progress-fill").style.width=`${distance/CONFIG.finish*100}%`;
    document.querySelector(".progress").setAttribute("aria-valuenow",Math.floor(distance));
  }
  function start(name=chosen) {
    chosen=name;
    confetti.stop();
    closeDialogs();
    clearInput();
    distance=0;
    correctAnswers=0;
    elapsed=0;
    invulnerable=0;
    player={
      x:175,y:0,vy:0,roll:0
    };
    questions=shuffle(QUESTIONS);
    questionIndex=0;
    obstacles=[];
    // Espaçamento previsível: cada obstáculo pode ser vencido sozinho.
    // Coordenadas no mundo; a câmera avança conforme a distância percorrida.
    for(let meter=28,i=0; meter<CONFIG.finish-20; meter+=38,i++) {
      const type=i%3===1?"scanner":i%3===2?"chip":"data";
      obstacles.push({
        worldX:meter*CONFIG.pixelsPerMeter+175,type,passed:false,
        w:type==="scanner"?100:type==="chip"?54:64
      });
    }
    $("runner-name").textContent=`${chosen==="bin"?"BIN":"Marcio"} na corrida`;
    $("game-status").textContent="Boa corrida!";
    screen("game");
    state="running";
    updateHud();
    $("pause").focus({
      preventScroll:true
    });
  }
  function home() {
    confetti.stop();
    closeDialogs();
    clearInput();
    state="menu";
    screen("menu");
    document.querySelector(`[data-character="${chosen}"]`).focus({
      preventScroll:true
    });
  }
  function finish(won, explanation="") {
    state=won?"won":"lost";
    clearInput();
    closeDialogs();
    screen("result");
    $("result-symbol").textContent=won?"★":"↻";
    $("result-eyebrow").textContent=won?"Percurso concluído":"Fim de jogo";
    $("result-title").textContent=won?`Parabéns, ${chosen==="bin"?"BIN":"Marcio"}!`:"Vamos tentar de novo?";
    $("result-description").textContent=won?"Você completou os 600 metros!":"Você errou a resposta. Quer tentar mais uma vez?";
    $("result-detail").textContent=won?`${CONFIG.finish} metros concluídos · ${correctAnswers} resposta(s) certa(s).`:`${Math.floor(distance)} metros percorridos. ${explanation}`;
    $("retry").hidden=won;
    if(won) confetti.start();
    else confetti.stop();
    $(won?"home":"retry").focus({
      preventScroll:true
    });
  }
  // 2. Perguntas e respostas. A corrida fica parada enquanto o diálogo está aberto.
  function openQuestion(obstacle) {
    obstacle.passed=true;
    state="quiz";
    clearInput();
    answered=false;
    if(questionIndex>=questions.length) {
      questions=shuffle(QUESTIONS);
      questionIndex=0;
    }
    currentQuestion=shuffleAnswers(questions[questionIndex++]);
    $("question-category").textContent=currentQuestion.category;
    $("question-title").textContent=currentQuestion.q;
    $("answer-feedback").textContent="";
    $("continue").hidden=true;
    $("answers").replaceChildren();
    currentQuestion.a.forEach((answer,index)=>{
      const button=document.createElement("button");
      button.className="answer";
      const letter=document.createElement("b");
      letter.textContent=String.fromCharCode(65+index);
      const label=document.createElement("span");
      label.textContent=answer;
      button.append(letter,label);
      button.addEventListener("click",()=>answerQuestion(index));
      $("answers").append(button);
    });
    $("quiz").showModal();
  }
  function answerQuestion(index) {
    if(state!=="quiz" || answered) return;
    answered=true;
    if(index!==currentQuestion.correct) {
      finish(false,`Resposta correta: ${currentQuestion.a[currentQuestion.correct]}. ${currentQuestion.why}`);
      return;
    }
    correctAnswers++;
    updateHud();
    [...$("answers").children].forEach((button,i)=>{
      button.disabled=true;
      button.classList.toggle("correct",i===index);
    });
    $("answer-feedback").textContent=`Acertou! ${currentQuestion.why}`;
    $("continue").hidden=false;
    $("continue").focus();
  }
  function continueRun() {
    if(state!=="quiz" || !answered) return;
    $("quiz").close();
    clearInput();
    // A posição vertical é resetada para uma retomada previsível.
    player.y=0;
    player.vy=0;
    player.roll=0;
    invulnerable=CONFIG.protection;
    state="running";
    $("game-status").textContent="Resposta certa! Você ganhou proteção temporária.";
    $("pause").focus({
      preventScroll:true
    });
  }
  // 3. Pausa e controles de teclado/toque.
  function pause() {
    if(state!=="running") return;
    state="paused";
    clearInput();
    $("pause-dialog").showModal();
  }
  function resume() {
    if(state!=="paused") return;
    $("pause-dialog").close();
    clearInput();
    state="running";
  }
  function press(code) {
    if(state!=="running") return;
    if(code==="ArrowUp" && player.y===0 && player.roll<=0) player.vy=CONFIG.jumpVelocity;
    if(code==="ArrowDown" && player.y===0 && player.roll<=0) player.roll=CONFIG.rollDuration;
    keys.add(code);
  }
  const controls=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];
  document.addEventListener("keydown",event=>{
    if(controls.includes(event.code) && state==="running") {
      event.preventDefault();
      if(!event.repeat)press(event.code);
    }
    if(event.code==="Escape" && (state==="running" || state==="paused")) {
      event.preventDefault();
      state==="running"?pause():resume();
    }
  });
  document.addEventListener("keyup",event=>keys.delete(event.code));
  window.addEventListener("blur",()=>{
    clearInput();
    pause();
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      clearInput();
      pause();
    }
  });
  // Escape nunca fecha a pergunta: é necessário respondê-la.
  $("quiz").addEventListener("cancel",event=>event.preventDefault());
  $("pause-dialog").addEventListener("cancel",event=>{
    event.preventDefault();
    resume();
  });
  document.querySelectorAll("[data-control]").forEach(button=>{
    button.addEventListener("pointerdown",event=>{
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      press(button.dataset.control);
    });
    for(const type of ["pointerup","pointercancel","lostpointercapture"])
    button.addEventListener(type,()=>keys.delete(button.dataset.control));
  });
  document.querySelectorAll("[data-character]").forEach(button=>button.addEventListener("click",()=>start(button.dataset.character)));
  $("pause").addEventListener("click",pause);
  $("resume").addEventListener("click",resume);
  $("pause-home").addEventListener("click",home);
  $("home").addEventListener("click",home);
  $("retry").addEventListener("click",()=>start());
  $("continue").addEventListener("click",continueRun);
  // 4. Física e colisões, independentes do tamanho visual da tela.
  function obstacleRect(obstacle) {
    const x=obstacle.worldX-distance*CONFIG.pixelsPerMeter;
    // O portal deixa 57 px livres embaixo. Em pé: 119 px; rolando: 42 px.
    return {
      x,y:obstacle.type==="scanner"?CONFIG.ground-176:CONFIG.ground-(obstacle.type==="chip"?40:65),
      w:obstacle.w,h:obstacle.type==="scanner"?119:obstacle.type==="chip"?40:65
    };
  }
  function playerRect() {
    const rolling=player.roll>0;
    return {
      x:player.x-(rolling?39:25),y:CONFIG.ground+player.y-(rolling?42:119),w:rolling?78:50,h:rolling?42:115
    };
  }
  function intersects(a,b) {
    return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
  }
  function update(dt) {
    if(state!=="running") return;
    elapsed+=dt;
    invulnerable=Math.max(0,invulnerable-dt);
    const axis=Number(keys.has("ArrowRight"))-Number(keys.has("ArrowLeft"));
    player.x=Math.max(80,Math.min(490,player.x+axis*CONFIG.moveSpeed*dt));
    player.roll=Math.max(0,player.roll-dt);
    if(player.vy!==0 || player.y<0) {
      player.vy+=CONFIG.gravity*dt;
      player.y+=player.vy*dt;
      if(player.y>=0) {
        player.y=0;
        player.vy=0;
      }
    }
    // A seta para a direita continua funcionando mesmo quando o personagem
    // chega ao limite da tela: enquanto pressionada, ela acelera o percurso.
    const speedMultiplier = keys.has("ArrowRight") ? CONFIG.speedBoost : 1;
    distance=Math.min(
      CONFIG.finish,
      distance + CONFIG.speed * speedMultiplier * dt / CONFIG.pixelsPerMeter
    );
    const hitbox=playerRect();
    for(const obstacle of obstacles) {
      if(!obstacle.passed && invulnerable<=0 && intersects(hitbox,obstacleRect(obstacle))) {
        openQuestion(obstacle);
        break;
      }
    }
    updateHud();
    if(invulnerable===0) {
      $("game-status").textContent = keys.has("ArrowRight")
        ? "Acelerando!"
        : "Desvie dos obstáculos.";
    }
    if(state==="running" && distance>=CONFIG.finish)finish(true);
  }
  // 5. Loop único de atualização e desenho.
  function tick(now) {
    // Limita passos a 1/120 s para colisões consistentes. Uma aba suspensa
    // não causa saltos no mundo quando volta a ficar visível.
    let remaining=Math.min((now-lastTime)/1000 || 0,.05);
    lastTime=now;
    while(remaining>0) {
      const step=Math.min(remaining,1/120);
      update(step);
      remaining-=step;
    }
    draw();
    requestAnimationFrame(tick);
  }
  loadCharacters();
  requestAnimationFrame(tick);
})();
