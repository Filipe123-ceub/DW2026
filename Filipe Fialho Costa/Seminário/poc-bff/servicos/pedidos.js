// Microsserviço de PEDIDOS (porta 3002)
// Os valores vêm em CENTAVOS (formato interno do backend).
const { criarServico } = require('./criar-servico');

const pedidos = [
  { id: 101, usuarioId: 1, produto: 'Notebook', valorCentavos: 450000, status: 'ENTREGUE', data: '2026-09-02' },
  { id: 102, usuarioId: 1, produto: 'Mouse sem fio', valorCentavos: 8990, status: 'EM_TRANSITO', data: '2026-10-20' },
  { id: 103, usuarioId: 1, produto: 'Teclado mecânico', valorCentavos: 32000, status: 'PROCESSANDO', data: '2026-10-27' },
  { id: 201, usuarioId: 2, produto: 'Monitor 27"', valorCentavos: 129900, status: 'ENTREGUE', data: '2026-08-15' },
];

criarServico('Serviço de Pedidos', 3002, [
  { padrao: /^\/pedidos\/usuario\/(\d+)$/, handler: ([, id]) => pedidos.filter(p => p.usuarioId === Number(id)) },
], 400);
