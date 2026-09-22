// Carregamento, recorte dos três quadros e retratos dos personagens.
// Os JPEGs originais são preservados; o recorte acontece na memória.
window.createCharacterLoader = function (sprites) {
  const $ = (id) => document.getElementById(id);
  // Mantém os JPEGs originais. O recorte e a transparência são feitos apenas
  // na memória do navegador. O preenchimento parte das bordas, preservando
  // áreas cinzentas internas da roupa. Data URLs permitem abrir via file://.
  function makeFrame(img, rect, removeGrayBackground = true) {
    const buffer = document.createElement("canvas");
    buffer.width = rect[2];
    buffer.height = rect[3];
    const context = buffer.getContext("2d", { willReadFrequently: true });
    context.drawImage(img, ...rect, 0, 0, buffer.width, buffer.height);

    // As poses novas já são PNGs transparentes. Nos JPEGs originais,
    // removemos somente pixels próximos à cor do canto cinza.
    if (!removeGrayBackground) return buffer;
    const pixels = context.getImageData(0, 0, buffer.width, buffer.height);
    const data = pixels.data;
    const bg = [data[0], data[1], data[2]];
    for (let i = 0; i < data.length; i += 4) {
      const distance = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
      if (distance < 30) data[i + 3] = 0;
      else if (distance < 52) data[i + 3] = Math.round((distance - 30) / 22 * data[i + 3]);
    }
    context.putImageData(pixels, 0, 0);
    return buffer;
  }
  async function loadCharacters() {
    try {
      await Promise.all(["bin","marcio"].map(async name => {
        const img = new Image();
        await new Promise((resolve,reject) => {
          img.onload=resolve;
          img.onerror=reject;
          img.src=window.CHARACTER_IMAGES[name];
        });
        // Cada retângulo contém um dos três movimentos fornecidos.
        const h=img.height;
        const frameWidth = Math.floor(img.width / 3);
        sprites[name] = [0, 1, 2].map(index =>
          makeFrame(img, [index * frameWidth, 0, frameWidth, h], false)
        );
      const rollImage = new Image();
      await new Promise((resolve, reject) => {
        rollImage.onload = resolve;
        rollImage.onerror = reject;
        rollImage.src = window.RUNNER_ROLL_IMAGES[name];
      });
      sprites[name].roll = makeFrame(rollImage, [0, 0, rollImage.width, rollImage.height], false);
        const portrait=$("portrait-"+name).getContext("2d");
        const frame=sprites[name][0], dh=355, dw=frame.width/frame.height*dh;
        portrait.drawImage(frame,(310-dw)/2,5,dw,dh);
      }));
      document.querySelectorAll("[data-character]").forEach(button=>button.disabled=false);
      $("load-status").textContent="Escolha BIN ou Marcio para jogar.";
    } catch(error) {
      $("load-status").textContent="Não foi possível carregar os personagens. Extraia todos os arquivos do ZIP e abra index.html novamente.";
      console.error("Erro ao carregar personagens:",error);
    }
  }
  return loadCharacters;
};
