/* ==========================================================================
   cardapio.js
   Responsabilidade única: renderizar o cardápio, filtrar por categoria
   e adicionar produtos ao pedido.
   Depende de produtos.js e carrinho.js.
   ========================================================================== */

let categoriaAtiva = "todos";
const quantidadesSelecionadas = {}; // produtoId -> quantidade escolhida no card

function inicializarCardapio() {
  renderizarFiltros();
  renderizarProdutos();
  atualizarBarraCarrinho();

  document.querySelector(".cart-bar a")?.addEventListener("click", () => {
    // deixa o link normal navegar para pedido.html
  });
}

function renderizarFiltros() {
  const container = document.querySelector(".filters");
  if (!container) return;

  container.innerHTML = "";
  CATEGORIAS.forEach((categoria) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "filter-btn";
    botao.textContent = categoria.nome;
    botao.dataset.categoria = categoria.id;
    botao.setAttribute("aria-pressed", String(categoria.id === categoriaAtiva));

    botao.addEventListener("click", () => {
      categoriaAtiva = categoria.id;
      container.querySelectorAll(".filter-btn").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.categoria === categoriaAtiva));
      });
      renderizarProdutos();
    });

    container.appendChild(botao);
  });
}

function renderizarProdutos() {
  const grid = document.querySelector(".menu-grid");
  if (!grid) return;

  const produtosFiltrados = filtrarProdutosPorCategoria(categoriaAtiva);
  grid.innerHTML = "";

  produtosFiltrados.forEach((produto) => {
    grid.appendChild(criarCardProduto(produto));
  });
}

function criarCardProduto(produto) {
  const quantidadeAtual = quantidadesSelecionadas[produto.id] || 1;

  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-media" data-categoria="${produto.categoria}">${produto.emoji}</div>
    <div class="product-body">
      <h3>${produto.nome}</h3>
      <p class="product-desc">${produto.descricao}</p>
      <div class="product-footer">
        <span class="product-price">${produto.precoFormatado}</span>
        <div class="stepper">
          <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">−</button>
          <output>${quantidadeAtual}</output>
          <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button type="button" class="btn btn-primary add-btn">Adicionar ao pedido</button>
    </div>
  `;

  const output = card.querySelector("output");
  const botaoAdicionar = card.querySelector(".add-btn");

  card.querySelector('[data-acao="diminuir"]').addEventListener("click", () => {
    const novaQtd = Math.max(1, Number(output.textContent) - 1);
    output.textContent = novaQtd;
    quantidadesSelecionadas[produto.id] = novaQtd;
  });

  card.querySelector('[data-acao="aumentar"]').addEventListener("click", () => {
    const novaQtd = Math.min(20, Number(output.textContent) + 1);
    output.textContent = novaQtd;
    quantidadesSelecionadas[produto.id] = novaQtd;
  });

  botaoAdicionar.addEventListener("click", () => {
    const quantidade = Number(output.textContent);
    const carrinho = new Carrinho();
    carrinho.adicionarItem(produto.id, quantidade);

    atualizarBadgeCarrinho();
    atualizarBarraCarrinho();

    const textoOriginal = botaoAdicionar.textContent;
    botaoAdicionar.textContent = "Adicionado ✓";
    botaoAdicionar.classList.add("is-added");
    setTimeout(() => {
      botaoAdicionar.textContent = textoOriginal;
      botaoAdicionar.classList.remove("is-added");
    }, 1200);
  });

  return card;
}

function atualizarBarraCarrinho() {
  const barra = document.querySelector(".cart-bar");
  if (!barra) return;

  const carrinho = new Carrinho();
  const totalItens = carrinho.totalDeItens();

  barra.classList.toggle("is-visible", totalItens > 0);
  const resumo = barra.querySelector("[data-resumo]");
  if (resumo) {
    const plural = totalItens === 1 ? "item" : "itens";
    resumo.innerHTML = `<strong>${totalItens} ${plural}</strong> no pedido — ${formatarMoeda(carrinho.subtotal())}`;
  }
}

document.addEventListener("DOMContentLoaded", inicializarCardapio);
