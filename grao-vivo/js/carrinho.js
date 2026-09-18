/* ==========================================================================
   carrinho.js
   Responsabilidade única: gerenciar o pedido (itens, totais, persistência).
   Depende de produtos.js (classe Produto, PRODUTOS).
   ========================================================================== */

const CHAVE_STORAGE = "graovivo.pedido";
const TAXA_ENTREGA = 6.0;
const VALOR_MINIMO_FRETE_GRATIS = 60.0;

/**
 * Representa um pedido em andamento: um mapa de produtoId -> quantidade,
 * persistido em localStorage para sobreviver entre páginas do site.
 */
class Carrinho {
  constructor() {
    this.itens = this._carregar();
  }

  _carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE_STORAGE);
      return bruto ? JSON.parse(bruto) : {};
    } catch (erro) {
      console.error("Não foi possível ler o pedido salvo:", erro);
      return {};
    }
  }

  _salvar() {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this.itens));
  }

  adicionarItem(produtoId, quantidade = 1) {
    const id = String(produtoId);
    this.itens[id] = (this.itens[id] || 0) + quantidade;
    this._salvar();
  }

  definirQuantidade(produtoId, quantidade) {
    const id = String(produtoId);
    if (quantidade <= 0) {
      this.removerItem(id);
      return;
    }
    this.itens[id] = quantidade;
    this._salvar();
  }

  removerItem(produtoId) {
    delete this.itens[String(produtoId)];
    this._salvar();
  }

  esvaziar() {
    this.itens = {};
    this._salvar();
  }

  listarItensDetalhados() {
    return Object.entries(this.itens)
      .map(([id, quantidade]) => {
        const produto = buscarProdutoPorId(id);
        if (!produto) return null;
        return { produto, quantidade, subtotal: produto.preco * quantidade };
      })
      .filter(Boolean);
  }

  totalDeItens() {
    return Object.values(this.itens).reduce((soma, qtd) => soma + qtd, 0);
  }

  subtotal() {
    return this.listarItensDetalhados().reduce((soma, item) => soma + item.subtotal, 0);
  }

  taxaEntrega() {
    if (this.totalDeItens() === 0) return 0;
    return this.subtotal() >= VALOR_MINIMO_FRETE_GRATIS ? 0 : TAXA_ENTREGA;
  }

  total() {
    return this.subtotal() + this.taxaEntrega();
  }
}

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
