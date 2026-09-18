/* ==========================================================================
   produtos.js
   Responsabilidade única: modelar e listar os produtos do cardápio.
   ========================================================================== */

/**
 * Representa um item do cardápio da cafeteria.
 */
class Produto {
  constructor(id, nome, categoria, preco, descricao, emoji) {
    this.id = id;
    this.nome = nome;
    this.categoria = categoria; // "cafes" | "doces" | "salgados" | "geladas"
    this.preco = preco;
    this.descricao = descricao;
    this.emoji = emoji;
  }

  get precoFormatado() {
    return `R$ ${this.preco.toFixed(2).replace(".", ",")}`;
  }
}

const CATEGORIAS = [
  { id: "todos", nome: "Todos" },
  { id: "cafes", nome: "Cafés" },
  { id: "doces", nome: "Doces" },
  { id: "salgados", nome: "Salgados" },
  { id: "geladas", nome: "Bebidas geladas" },
];

const PRODUTOS = [
  new Produto(1, "Espresso", "cafes", 6.0, "Tiro curto, encorpado, torra média-escura.", "☕"),
  new Produto(2, "Cappuccino", "cafes", 9.0, "Espresso, leite vaporizado e espuma cremosa.", "☕"),
  new Produto(3, "Latte caramelo", "cafes", 10.5, "Café com leite e calda de caramelo artesanal.", "🥤"),
  new Produto(4, "Mocha", "cafes", 11.0, "Espresso, chocolate meio amargo e leite vaporizado.", "🍫"),
  new Produto(5, "Croissant", "doces", 8.0, "Amanteigado, folhado, assado todas as manhãs.", "🥐"),
  new Produto(6, "Bolo de cenoura", "doces", 7.0, "Cobertura de chocolate, fatia generosa.", "🍰"),
  new Produto(7, "Brownie", "doces", 9.0, "Chocolate 70%, casquinha crocante, centro macio.", "🧁"),
  new Produto(8, "Pão de queijo", "salgados", 6.0, "Porção com 4 unidades, quentinhos.", "🧀"),
  new Produto(9, "Torrada de abacate", "salgados", 12.0, "Pão de fermentação natural e limão.", "🥑"),
  new Produto(10, "Café gelado", "geladas", 10.0, "Espresso duplo, gelo e um fio de leite.", "🧊"),
  new Produto(11, "Chá gelado de frutas vermelhas", "geladas", 8.5, "Infusão artesanal servida com gelo.", "🍓"),
];

function buscarProdutoPorId(id) {
  return PRODUTOS.find((produto) => produto.id === Number(id)) ?? null;
}

function filtrarProdutosPorCategoria(categoriaId) {
  if (categoriaId === "todos") return PRODUTOS;
  return PRODUTOS.filter((produto) => produto.categoria === categoriaId);
}
