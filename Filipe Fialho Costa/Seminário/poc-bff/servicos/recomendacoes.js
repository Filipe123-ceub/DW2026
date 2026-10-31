// Microsserviço de RECOMENDAÇÕES (porta 3003)
// Depende do PLANO do usuário — ou seja, só dá para chamar depois de saber quem é o usuário.
const { criarServico } = require('./criar-servico');

const porPlano = {
  premium: [
    { sku: 'P-01', titulo: 'Headset gamer', score: 0.92 },
    { sku: 'P-02', titulo: 'Webcam 4K', score: 0.87 },
    { sku: 'P-03', titulo: 'Suporte de monitor', score: 0.71 },
  ],
  basico: [
    { sku: 'B-01', titulo: 'Mousepad', score: 0.80 },
    { sku: 'B-02', titulo: 'Hub USB', score: 0.65 },
  ],
};

// Catálogo completo de produtos, no formato INTERNO do backend
// (sku, titulo, precoCentavos). Quem consome é o BFF, que adapta para o front.
const produtos = [
  { sku: 'P-01', titulo: 'Headset gamer', precoCentavos: 34990, estoque: 12, fornecedorId: 'F-88' },
  { sku: 'P-02', titulo: 'Webcam 4K', precoCentavos: 59900, estoque: 3, fornecedorId: 'F-12' },
  { sku: 'P-03', titulo: 'Suporte de monitor', precoCentavos: 18900, estoque: 0, fornecedorId: 'F-88' },
  { sku: 'B-01', titulo: 'Mousepad', precoCentavos: 4990, estoque: 40, fornecedorId: 'F-03' },
  { sku: 'B-02', titulo: 'Hub USB', precoCentavos: 12900, estoque: 7, fornecedorId: 'F-03' },
];

criarServico('Serviço de Recomendações', 3003, [
  { padrao: /^\/recomendacoes\/(\w+)$/, handler: ([, plano]) => porPlano[plano] },
  { padrao: /^\/produtos$/, handler: () => produtos },
], 350);
