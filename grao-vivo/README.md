# Grão Vivo Café

Site institucional de uma cafeteria, com cardápio, pedido online (carrinho), localização e formulário de contato. Projeto acadêmico desenvolvido com **HTML, CSS e JavaScript puro** (sem frameworks), seguindo as práticas de Engenharia de Software trabalhadas em aula.

## Tecnologias usadas

- HTML5 semântico
- CSS3 (design system em variáveis, layout responsivo, sem frameworks)
- JavaScript ES6+ puro (classes, localStorage, sem bibliotecas)
- Fontes: Google Fonts (Fraunces + Work Sans)
- Mapa: OpenStreetMap (iframe embed, sem chave de API)

## Pré-requisitos

Nenhum. Não há backend, build step ou dependências (`npm`). Basta um navegador.

## Como executar

1. Clone ou baixe o repositório.
2. Abra o arquivo `index.html` diretamente no navegador (duplo clique) **ou** sirva a pasta com uma extensão tipo Live Server.
3. Navegue pelas páginas pelo menu superior.

## Estrutura de pastas

```
grao-vivo/
├── index.html          # Home
├── cardapio.html        # Cardápio com filtro por categoria
├── pedido.html           # Carrinho / pedido
├── localizacao.html       # Endereço, horários e mapa
├── contato.html           # Formulário de contato
├── css/
│   └── style.css          # Design system e todos os estilos
├── js/
│   ├── produtos.js        # Classe Produto + dados do cardápio
│   ├── carrinho.js        # Classe Carrinho (persistência em localStorage)
│   ├── nav.js              # Menu responsivo + badge do carrinho (compartilhado)
│   ├── cardapio.js         # Filtro por categoria + adicionar ao pedido
│   ├── pedido.js            # Listagem, quantidade, remoção, total, finalizar
│   └── contato.js            # Classe Cliente + validação do formulário
└── README.md
```

Cada arquivo JS tem uma única responsabilidade, conforme as boas práticas de modularização vistas em aula.

## Telas

| # | Tela | Descrição |
|---|------|-----------|
| 1 | Home | Apresentação da cafeteria, destaques do cardápio e chamada para localização |
| 2 | Cardápio | Lista de produtos com filtro por categoria e adição ao pedido |
| 3 | Pedido | Carrinho com quantidade, remoção, cálculo de total e finalização |
| 4 | Localização | Endereço, horário de funcionamento e mapa incorporado |
| 5 | Contato | Formulário validado (nome, e-mail, telefone, assunto, mensagem) |

## Requisitos Funcionais (RF)

| ID | Descrição | Prioridade | Critério de aceitação |
|----|-----------|------------|------------------------|
| RF-001 | Listar produtos do cardápio agrupados por categoria | Must | Todos os produtos cadastrados aparecem ao carregar `cardapio.html` |
| RF-002 | Filtrar produtos por categoria (Todos, Cafés, Doces, Salgados, Bebidas geladas) | Must | Clicar em um filtro exibe apenas os produtos daquela categoria |
| RF-003 | Adicionar produto ao pedido com quantidade escolhida | Must | Botão "Adicionar ao pedido" grava o item no carrinho e atualiza o badge |
| RF-004 | Persistir o pedido entre páginas e ao recarregar o navegador | Must | Pedido permanece salvo em `localStorage` mesmo após fechar a aba |
| RF-005 | Alterar a quantidade de um item já no pedido | Must | Botões +/- na tela de pedido atualizam quantidade e subtotal em tempo real |
| RF-006 | Remover um item do pedido | Must | Botão "Remover" apaga o item da lista e recalcula o total |
| RF-007 | Calcular subtotal, taxa de entrega e total do pedido | Must | Valores exibidos batem com a soma dos itens; frete grátis acima de R$ 60 |
| RF-008 | Exibir estado vazio quando não há itens no pedido | Should | Mensagem amigável com link para o cardápio quando o carrinho está vazio |
| RF-009 | Finalizar pedido com número de confirmação | Should | Ao finalizar, é exibida mensagem de confirmação e o carrinho é esvaziado |
| RF-010 | Validar campos do formulário de contato ao perder o foco (onBlur) | Must | Campo inválido exibe mensagem de erro em vermelho abaixo dele |
| RF-011 | Validar formulário completo ao enviar (onSubmit) | Must | Envio com campos inválidos é bloqueado e o primeiro campo inválido recebe foco |
| RF-012 | Aplicar máscara automática no campo telefone | Should | Digitação formata automaticamente para `(xx) xxxxx-xxxx` |
| RF-013 | Exibir mensagem de confirmação após envio do formulário | Should | Mensagem de sucesso aparece e o formulário é limpo |
| RF-014 | Exibir menu de navegação responsivo (mobile) | Must | Em telas estreitas, o menu vira um botão hambúrguer funcional |
| RF-015 | Exibir horário de funcionamento e mapa da localização | Should | Página `localizacao.html` mostra tabela de horários e mapa incorporado |

## Requisitos Não Funcionais (RNF)

| ID | Descrição | Métrica |
|----|-----------|---------|
| RNF-001 | Compatibilidade entre navegadores | Funcional em Chrome, Firefox e Edge (últimas 2 versões) |
| RNF-002 | Responsividade | Layout utilizável em telas ≥ 320px de largura |
| RNF-003 | Sem dependências externas de backend | Site 100% estático, sem servidor ou banco de dados |
| RNF-004 | Persistência local | Dados do pedido e das mensagens de contato salvos via `localStorage` |
| RNF-005 | Acessibilidade básica | Foco visível em elementos interativos, labels associadas a inputs, `aria-live` nas confirmações |
| RNF-006 | Organização do código | Um arquivo JS = uma responsabilidade; nomes de variáveis/funções descritivos |

## Arquitetura

- **UI (apresentação):** HTML + CSS puro, sem componentes de terceiros.
- **Lógica:** JavaScript modular carregado via `<script>` (sem bundler), com classes `Produto`, `Carrinho` e `Cliente`.
- **Persistência:** `localStorage` do navegador (chave `graovivo.pedido` para o carrinho, `graovivo.mensagens` para o histórico de contato).

## Checklist de qualidade (aplicado)

- [x] Testado em Chrome e Firefox
- [x] Testado em tela pequena (modo responsivo)
- [x] Sem erros no console do DevTools
- [x] Nomes de variáveis e funções revelam a intenção
- [x] Sem código comentado ou `console.log` esquecido em produção
- [x] Um arquivo, uma responsabilidade (modularização)
