async function loadHTML(selector, file) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const response = await fetch(file);
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error(`Erro ao carregar ${file}:`, err);
  }
}

// Função para carregar um script dinamicamente
function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    // CAMINHOS CORRIGIDOS (sem / no início)
    loadHTML("header", "components/header.html"),
    loadHTML("footer", "components/footer.html")
  ]);

  // CAMINHO CORRIGIDO (sem / no início)
  loadScript("scripts/script.js");
});