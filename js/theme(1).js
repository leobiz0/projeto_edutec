// Lê a preferência antes da primeira pintura e mantém o mesmo tema entre páginas.
(() => {
  const root = document.documentElement;
  try {
    root.dataset.theme =
      localStorage.getItem("inovaai-theme") === "dark" ? "dark" : "light";
  } catch {
    root.dataset.theme = "light";
  }
  function sync() {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.setAttribute(
        "aria-label",
        dark ? "Ativar modo claro" : "Ativar modo escuro",
      );
      button.setAttribute("aria-pressed", String(dark));
      button.querySelector("img").src = dark
        ? "/assets/images/sun.png"
        : "/assets/images/moon.png";
    });
    document.querySelectorAll("[data-dark-src]").forEach((img) => {
      img.src = dark ? img.dataset.darkSrc : img.dataset.lightSrc;
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".theme-toggle").forEach((button) =>
      button.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        try {
          localStorage.setItem("inovaai-theme", root.dataset.theme);
        } catch {}
        sync();
      }),
    );
    sync();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "inovaai-theme") {
      root.dataset.theme = event.newValue === "dark" ? "dark" : "light";
      sync();
    }
  });
})();
