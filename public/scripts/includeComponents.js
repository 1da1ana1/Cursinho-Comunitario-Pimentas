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

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "/src/components/header.html");
  loadHTML("footer", "/src/components/footer.html");
});
