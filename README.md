# Grão Vivo Café

Site institucional de uma cafeteria, com cardápio interativo, pedido online (carrinho), página de localização e formulário de contato. Projeto acadêmico desenvolvido em **HTML, CSS e JavaScript puro** (sem frameworks, sem build step), seguindo boas práticas de Engenharia de Software: separação de responsabilidades, POO, persistência local e validação de formulários.

## Índice

- [O que o projeto faz](#o-que-o-projeto-faz)
- [Tecnologias usadas](#tecnologias-usadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como o código funciona](#como-o-código-funciona)
- [Páginas do site](#páginas-do-site)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Requisitos funcionais e não funcionais](#requisitos-funcionais-e-não-funcionais)

## O que o projeto faz

O **Grão Vivo Café** é um site de cinco páginas que simula a experiência completa de um cliente de cafeteria:

1. O cliente conhece a cafeteria na **Home**.
2. Explora o **Cardápio**, filtrando produtos por categoria (Cafés, Doces, Salgados, Bebidas geladas).
3. Ajusta a quantidade de cada produto e o adiciona ao **Pedido**.
4. Revisa o pedido, altera quantidades, remove itens, acompanha o cálculo automático de subtotal/taxa de entrega/total e finaliza a compra.
5. Consulta a **Localização** (endereço, horário de funcionamento e mapa).
6. Envia uma mensagem pelo formulário de **Contato**, com validação em tempo real.

Não há backend nem banco de dados: o pedido e o histórico de mensagens de contato são salvos no **`localStorage`** do próprio navegador, o que é suficiente para o escopo do projeto e permite que o pedido sobreviva à navegação entre páginas (e a um recarregamento da aba).

## Tecnologias usadas

| Tecnologia | Uso no projeto |
|---|---|
| **HTML5** | Estrutura semântica das 5 páginas |
| **CSS3** | Todo o layout e visual, em um único arquivo (`style.css`), com variáveis CSS (design tokens), Flexbox/Grid e media queries para responsividade |
| **JavaScript (ES6+)** | Toda a interatividade: classes, arrow functions, template literals, localStorage, manipulação de DOM — sem nenhuma biblioteca externa |
| **Google Fonts** | Fraunces (títulos, serifada) e Work Sans (corpo do texto), carregadas via `<link>` |
| **OpenStreetMap** | Mapa incorporado por `iframe` na página de Localização, sem necessidade de chave de API |

Não há `npm`, `package.json`, bundler ou dependências de terceiros no JavaScript — é tudo lido diretamente pelo navegador.

## Estrutura do projeto

Todos os arquivos ficam na raiz do projeto (sem subpastas), o que facilita a visualização direta no GitHub:

```
grao-vivo/
├── index.html          → Página Home
├── cardapio.html        → Página Cardápio
├── pedido.html           → Página Pedido (carrinho)
├── localizacao.html       → Página Localização
├── contato.html           → Página Contato
├── style.css               → Todo o CSS do site
├── produtos.js              → Classe Produto + lista de produtos do cardápio
├── carrinho.js                → Classe Carrinho (persistência em localStorage)
├── nav.js                       → Menu responsivo + badge do carrinho (usado em todas as páginas)
├── cardapio.js                    → Lógica exclusiva da página Cardápio
├── pedido.js                        → Lógica exclusiva da página Pedido
├── contato.js                         → Classe Cliente + validação do formulário
└── README.md
```

Cada arquivo `.js` tem **uma única responsabilidade** — é mais fácil de ler, testar e dar manutenção do que um único arquivo `script.js` com tudo misturado.

## Como o código funciona

### `produtos.js` — os dados do cardápio

Define a classe `Produto` (id, nome, categoria, preço, descrição, emoji) e um array `PRODUTOS` com os 11 itens do cardápio. Também expõe duas funções auxiliares usadas pelas outras páginas:

- `buscarProdutoPorId(id)` — encontra um produto pelo id (usado ao montar o carrinho).
- `filtrarProdutosPorCategoria(categoriaId)` — retorna só os produtos de uma categoria (usado no filtro do cardápio).

Esse arquivo é carregado **primeiro** em todas as páginas, porque `carrinho.js` e `cardapio.js` dependem dele.

### `carrinho.js` — o "cérebro" do pedido

Define a classe `Carrinho`, responsável por tudo que envolve o pedido:

- Guarda os itens como um objeto simples `{ produtoId: quantidade }`.
- `adicionarItem`, `definirQuantidade`, `removerItem`, `esvaziar` — alteram o pedido.
- `_carregar()` e `_salvar()` — métodos privados que leem/gravam esse objeto no `localStorage`, na chave `graovivo.pedido`. É por isso que o pedido continua lá mesmo se o cliente sair do Cardápio, for para a página de Localização e voltar depois.
- `listarItensDetalhados()` — junta cada item salvo com os dados completos do produto (via `buscarProdutoPorId`), calculando o subtotal de cada linha.
- `subtotal()`, `taxaEntrega()` e `total()` — fazem o cálculo financeiro do pedido. A regra de negócio (taxa fixa de R$ 6,00, grátis a partir de R$ 60,00 em produtos) fica isolada aqui, em constantes no topo do arquivo (`TAXA_ENTREGA`, `VALOR_MINIMO_FRETE_GRATIS`), nunca "hardcoded" espalhada pelo código.

Como toda página instancia `new Carrinho()` sempre que precisa ler ou alterar o pedido, e cada instância lê o `localStorage` na hora, os dados ficam sempre sincronizados entre páginas diferentes.

### `nav.js` — menu e badge (compartilhado por todas as páginas)

Duas responsabilidades:

1. **Menu responsivo**: no mobile, o botão hambúrguer (`.nav-toggle`) alterna a classe `is-open` no menu, mostrando/escondendo os links com uma transição de CSS.
2. **Badge do carrinho**: `atualizarBadgeCarrinho()` cria um `Carrinho`, pega `totalDeItens()` e atualiza o número ao lado de "Pedido" no menu — chamada tanto ao carregar qualquer página quanto depois de qualquer alteração no pedido.

### `cardapio.js` — página Cardápio

- `renderizarFiltros()` cria os botões de categoria dinamicamente a partir de `CATEGORIAS` (definida em `produtos.js`), marcando com `aria-pressed="true"` o filtro ativo.
- `renderizarProdutos()` usa `filtrarProdutosPorCategoria()` e monta um card (`criarCardProduto`) para cada produto, com um seletor de quantidade (+/-) e o botão "Adicionar ao pedido".
- Ao clicar em "Adicionar", o código instancia `new Carrinho()`, chama `adicionarItem(produto.id, quantidade)`, atualiza o badge do menu e mostra um feedback visual rápido ("Adicionado ✓") no próprio botão.
- `atualizarBarraCarrinho()` controla a barra fixa no rodapé da tela que mostra "X itens no pedido" — ela só aparece quando o carrinho tem pelo menos 1 item.

### `pedido.js` — página Pedido

- `renderizarPedido()` busca `carrinho.listarItensDetalhados()` e decide entre mostrar a lista de itens **ou** o estado vazio (ilustração + link para o cardápio), dependendo se há itens.
- Cada linha de item tem seus próprios botões de +/- e "Remover", que recriam um `Carrinho`, chamam `definirQuantidade()` ou `removerItem()`, e depois **renderizam a tela de novo** — um padrão simples de "estado muda → tela inteira é redesenhada a partir do estado", que evita a lista e os totais ficarem dessincronizados.
- `atualizarResumo()` escreve subtotal, taxa de entrega e total na barra lateral, e calcula quanto falta para o cliente ganhar frete grátis.
- `finalizarPedido()` gera um número de pedido aleatório, mostra a mensagem de confirmação, esvazia o carrinho e atualiza a tela — simulando a confirmação de um pedido real, sem precisar de um backend.

### `contato.js` — página Contato

- Define a classe `Cliente`, que representa uma mensagem enviada (nome, e-mail, telefone, assunto, mensagem, data de envio).
- Um objeto `validadores` guarda uma função de validação por campo (ex.: e-mail é validado com uma regex simples; telefone precisa ter pelo menos 10 dígitos). Um objeto `mensagensErro` guarda o texto de erro correspondente a cada campo — separar os dois deixa fácil adicionar ou mudar uma validação sem mexer no texto, e vice-versa.
- **Validação em duas camadas**, como pedido no enunciado do projeto:
  - `onBlur` (ao sair do campo): `validarCampo()` roda a validação daquele campo específico e mostra/esconde a mensagem de erro embaixo dele.
  - `onSubmit` (ao enviar o formulário): valida **todos** os campos de uma vez; se algum estiver inválido, o envio é bloqueado e o foco vai para o primeiro campo com erro.
- `formatarTelefone()` aplica a máscara `(xx) xxxxx-xxxx` automaticamente enquanto o cliente digita, usando expressões regulares para ir formatando os dígitos conforme a quantidade digitada.
- Ao enviar com sucesso, a mensagem é guardada em `localStorage` (chave `graovivo.mensagens`, um histórico em formato de lista) e o formulário é limpo.

### Fluxo geral de uma "sessão" no site

```
index.html → cardapio.html → (adicionar produtos) → pedido.html → (finalizar) → carrinho esvaziado
                                                              ↘ localizacao.html
                                                              ↘ contato.html
```

Como o estado do pedido vive no `localStorage` (não em variáveis JavaScript de uma página só), o cliente pode navegar livremente entre todas as páginas sem perder o que já escolheu.

## Páginas do site

| Página | Arquivo | O que tem |
|---|---|---|
| Home | `index.html` | Apresentação da cafeteria, destaques do cardápio (montados dinamicamente com JS a partir de `PRODUTOS`), chamada para localização |
| Cardápio | `cardapio.html` | Grade de produtos com filtro por categoria e botão de adicionar ao pedido |
| Pedido | `pedido.html` | Itens do carrinho, controle de quantidade, remoção, resumo de valores e botão de finalizar |
| Localização | `localizacao.html` | Endereço, tabela de horário de funcionamento e mapa incorporado |
| Contato | `contato.html` | Formulário validado (nome, e-mail, telefone, assunto, mensagem) |

## Como rodar o projeto

Não é necessário instalar nada.

1. Baixe ou clone o repositório.
2. Dê duplo clique em `index.html` para abrir no navegador — **ou**, para evitar eventuais bloqueios de arquivo local em alguns navegadores, sirva a pasta com um servidor simples:
   ```bash
   # Python
   python3 -m http.server 8000
   # depois acesse http://localhost:8000
   ```
   ou use a extensão **Live Server** do VS Code.
3. Navegue pelo site normalmente pelo menu superior.

## Requisitos funcionais e não funcionais

### Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| RF-001 | Listar produtos do cardápio agrupados por categoria |
| RF-002 | Filtrar produtos por categoria (Todos, Cafés, Doces, Salgados, Bebidas geladas) |
| RF-003 | Adicionar produto ao pedido com quantidade escolhida |
| RF-004 | Persistir o pedido entre páginas e ao recarregar o navegador (localStorage) |
| RF-005 | Alterar a quantidade de um item já no pedido |
| RF-006 | Remover um item do pedido |
| RF-007 | Calcular subtotal, taxa de entrega e total do pedido |
| RF-008 | Exibir estado vazio quando não há itens no pedido |
| RF-009 | Finalizar pedido com número de confirmação |
| RF-010 | Validar campos do formulário de contato ao perder o foco (onBlur) |
| RF-011 | Validar formulário completo ao enviar (onSubmit) |
| RF-012 | Aplicar máscara automática no campo telefone |
| RF-013 | Exibir mensagem de confirmação após envio do formulário |
| RF-014 | Exibir menu de navegação responsivo (mobile) |
| RF-015 | Exibir horário de funcionamento e mapa da localização |

### Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|-----------|
| RNF-001 | Compatibilidade com Chrome, Firefox e Edge (últimas 2 versões) |
| RNF-002 | Layout responsivo, utilizável em telas ≥ 320px |
| RNF-003 | Site 100% estático, sem backend ou banco de dados |
| RNF-004 | Persistência local via `localStorage` (pedido e mensagens de contato) |
| RNF-005 | Acessibilidade básica: foco visível, labels associadas a inputs, `aria-live` nas confirmações |
| RNF-006 | Código organizado em módulos de responsabilidade única, com nomes descritivos |
