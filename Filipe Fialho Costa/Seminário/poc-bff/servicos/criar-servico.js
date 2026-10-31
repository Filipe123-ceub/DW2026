// Função auxiliar: cria um "microsserviço" HTTP simples, sem dependências.
// Cada serviço roda sozinho, em sua própria porta, com seus próprios dados.
const http = require('http');

function criarServico(nome, porta, rotas, atrasoMs = 0) {
  const servidor = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${porta}`);
    console.log(`[${nome}] ${req.method} ${url.pathname}`);

    // CORS liberado só para a demo do modo "SEM BFF" (o navegador chamando o serviço direto).
    // Com BFF isso não seria necessário: só o BFF conversa com os serviços.
    res.setHeader('Access-Control-Allow-Origin', '*');

    for (const rota of rotas) {
      const match = url.pathname.match(rota.padrao);
      if (match) {
        // atraso artificial para simular latência de rede
        setTimeout(() => {
          const resultado = rota.handler(match);
          if (!resultado) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ erro: 'Não encontrado' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(resultado));
        }, atrasoMs);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ erro: 'Rota inexistente' }));
  });

  servidor.listen(porta, () => console.log(`✔ ${nome} rodando em http://localhost:${porta}`));
  return servidor;
}

module.exports = { criarServico };
