/* ==========================================================================
   nav.js
   Responsabilidade única: menu responsivo + badge do carrinho no header.
   Depende de carrinho.js (classe Carrinho).
   ========================================================================== */

function inicializarNav() {
  const header = document.querySelector(".site-header");
  const botao = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (botao && links) {
    botao.addEventListener("click", () => {
      const aberto = links.classList.toggle("is-open");
      header.classList.toggle("menu-open", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        header.classList.remove("menu-open");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  }

  atualizarBadgeCarrinho();
}

function atualizarBadgeCarrinho() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;

  const carrinho = new Carrinho();
  const total = carrinho.totalDeItens();
  badge.textContent = total;
  badge.dataset.empty = String(total === 0);
}

document.addEventListener("DOMContentLoaded", inicializarNav);
