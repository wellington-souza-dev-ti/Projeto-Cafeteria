/* ==========================================================================
   pedido.js
   Responsabilidade única: renderizar e gerenciar a tela de pedido (carrinho).
   Depende de produtos.js e carrinho.js.
   ========================================================================== */

function inicializarPedido() {
  renderizarPedido();

  document.querySelector("#btn-finalizar")?.addEventListener("click", finalizarPedido);
}

function renderizarPedido() {
  const carrinho = new Carrinho();
  const itens = carrinho.listarItensDetalhados();

  const listaEl = document.querySelector(".order-items");
  const vazioEl = document.querySelector(".empty-state");
  const resumoEl = document.querySelector(".order-summary");

  if (itens.length === 0) {
    if (listaEl) listaEl.style.display = "none";
    if (resumoEl) resumoEl.style.display = "none";
    if (vazioEl) vazioEl.style.display = "block";
    return;
  }

  if (vazioEl) vazioEl.style.display = "none";
  if (listaEl) listaEl.style.display = "flex";
  if (resumoEl) resumoEl.style.display = "block";

  listaEl.innerHTML = "";
  itens.forEach(({ produto, quantidade, subtotal }) => {
    const linha = document.createElement("div");
    linha.className = "order-item";
    linha.innerHTML = `
      <span class="emoji">${produto.emoji}</span>
      <div>
        <h4>${produto.nome}</h4>
        <span class="unit-price">${produto.precoFormatado} un.</span>
      </div>
      <div class="stepper">
        <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">−</button>
        <output>${quantidade}</output>
        <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
      </div>
      <div>
        <div class="line-total">${formatarMoeda(subtotal)}</div>
        <button type="button" class="remove-btn">Remover</button>
      </div>
    `;

    const output = linha.querySelector("output");

    linha.querySelector('[data-acao="diminuir"]').addEventListener("click", () => {
      const carrinhoAtual = new Carrinho();
      const novaQtd = quantidade - 1;
      carrinhoAtual.definirQuantidade(produto.id, novaQtd);
      renderizarPedido();
      atualizarBadgeCarrinho();
    });

    linha.querySelector('[data-acao="aumentar"]').addEventListener("click", () => {
      const carrinhoAtual = new Carrinho();
      carrinhoAtual.definirQuantidade(produto.id, quantidade + 1);
      renderizarPedido();
      atualizarBadgeCarrinho();
    });

    linha.querySelector(".remove-btn").addEventListener("click", () => {
      const carrinhoAtual = new Carrinho();
      carrinhoAtual.removerItem(produto.id);
      renderizarPedido();
      atualizarBadgeCarrinho();
    });

    listaEl.appendChild(linha);
  });

  atualizarResumo(carrinho);
}

function atualizarResumo(carrinho) {
  const elSubtotal = document.querySelector("[data-subtotal]");
  const elTaxa = document.querySelector("[data-taxa]");
  const elTotal = document.querySelector("[data-total]");
  const elAviso = document.querySelector("[data-aviso-frete]");

  if (elSubtotal) elSubtotal.textContent = formatarMoeda(carrinho.subtotal());
  if (elTaxa) elTaxa.textContent = carrinho.taxaEntrega() === 0 ? "Grátis" : formatarMoeda(carrinho.taxaEntrega());
  if (elTotal) elTotal.textContent = formatarMoeda(carrinho.total());

  if (elAviso) {
    const faltante = VALOR_MINIMO_FRETE_GRATIS - carrinho.subtotal();
    elAviso.textContent =
      faltante > 0
        ? `Faltam ${formatarMoeda(faltante)} para entrega grátis.`
        : "Você garantiu entrega grátis!";
  }
}

function finalizarPedido() {
  const carrinho = new Carrinho();
  if (carrinho.totalDeItens() === 0) return;

  const numeroPedido = Math.floor(1000 + Math.random() * 9000);
  const caixaConfirmacao = document.querySelector(".confirm-box");

  if (caixaConfirmacao) {
    caixaConfirmacao.textContent = `Pedido #${numeroPedido} confirmado! Vamos preparar tudo com carinho — retirada em cerca de 15 minutos.`;
    caixaConfirmacao.classList.add("is-visible");
  }

  carrinho.esvaziar();
  atualizarBadgeCarrinho();

  setTimeout(() => {
    renderizarPedido();
  }, 400);
}

document.addEventListener("DOMContentLoaded", inicializarPedido);
