// Sobe os 3 microsserviços + o BFF de uma vez só (npm start).
// Para a demo de falha, é melhor rodar cada um em um terminal separado
// (npm run usuarios / pedidos / recomendacoes / bff) e derrubar um com Ctrl+C.
const { spawn } = require('child_process');

const processos = [
  'servicos/usuarios.js',
  'servicos/pedidos.js',
  'servicos/recomendacoes.js',
  'bff/server.js',
].map(arquivo => spawn(process.execPath, [arquivo], { stdio: 'inherit', cwd: __dirname }));

process.on('SIGINT', () => { processos.forEach(p => p.kill()); process.exit(); });
