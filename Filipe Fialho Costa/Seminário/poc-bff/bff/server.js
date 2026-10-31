// =====================================================================
//  BFF — Backend for Frontend (porta 4000)
//  É o ÚNICO endereço que o front conhece. Ele:
//   1. ORQUESTRA:   chama os microsserviços em paralelo e em sequência
//   2. AGREGA:      junta tudo em uma resposta só
//   3. ADAPTA:      devolve o JSON no formato exato da tela (sem dados sensíveis)
//   4. RESILIÊNCIA: se um serviço cair, devolve resposta parcial
// =====================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = 4000;
const SERVICOS = {
  usuarios: 'http://localhost:3001',
  pedidos: 'http://localhost:3002',
  recomendacoes: 'http://localhost:3003',
};

// ---------------- CHAMADA A UM SERVIÇO ----------------
// fetch com timeout + registro de tempo (para o front desenhar a "linha do tempo")
async function buscar(rastro, servico, caminho, timeoutMs = 2000) {
  const registro = { servico, inicioMs: Date.now() - rastro.inicio, fimMs: null, ok: false };
  rastro.chamadas.push(registro);
  try {
    const resposta = await fetch(SERVICOS[servico] + caminho, { signal: AbortSignal.timeout(timeoutMs) });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    registro.ok = true;
    return dados;
  } finally {
    registro.fimMs = Date.now() - rastro.inicio;
  }
}

// ---------------- ADAPTADORES (formatam para a tela) ----------------
const STATUS_LEGIVEL = {
  ENTREGUE: 'Entregue',
  EM_TRANSITO: 'Em trânsito',
  PROCESSANDO: 'Processando',
};

const formatarReais = (centavos) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------------- ORQUESTRAÇÃO ----------------
async function montarPainel(usuarioId) {
  const rastro = { inicio: Date.now(), chamadas: [] };

  // PARALELO: usuário e pedidos não dependem um do outro → disparam juntos
  const promUsuario = buscar(rastro, 'usuarios', `/usuarios/${usuarioId}`);
  const promPedidos = buscar(rastro, 'pedidos', `/pedidos/usuario/${usuarioId}`);

  // SEQUENCIAL: recomendações dependem do PLANO do usuário →
  // só disparam quando o usuário chega (sem esperar os pedidos)
  const promRecomendacoes = promUsuario.then(u => buscar(rastro, 'recomendacoes', `/recomendacoes/${u.plano}`));

  // Espera tudo terminar, dando certo ou não (allSettled não "explode" no primeiro erro)
  const [resUsuario, resPedidos, resRecomendacoes] = await Promise.allSettled([promUsuario, promPedidos, promRecomendacoes]);

  // Sem usuário não existe painel: esse é o único erro fatal
  if (resUsuario.status === 'rejected') {
    const naoExiste = resUsuario.reason.message === 'HTTP 404';
    throw Object.assign(new Error(naoExiste ? 'Usuário não encontrado' : 'Serviço de usuários indisponível'), { status: naoExiste ? 404 : 503 });
  }
  const usuario = resUsuario.value;

  // Pedidos ou recomendações falharam? Segue sem eles (degradação graciosa)
  const pedidos = resPedidos.status === 'fulfilled' ? resPedidos.value : null;
  const recomendacoes = resRecomendacoes.status === 'fulfilled' ? resRecomendacoes.value : null;

  // PASSO 3 — AGREGAR e ADAPTAR para o formato da tela
  return {
    usuario: {
      nome: usuario.nome,                  // cpf e senhaHash ficam de FORA
      plano: usuario.plano === 'premium' ? 'Premium ⭐' : 'Básico',
    },
    pedidos: pedidos && pedidos.map(p => ({
      id: p.id,
      produto: p.produto,
      valor: formatarReais(p.valorCentavos),
      status: STATUS_LEGIVEL[p.status] ?? p.status,
    })),
    totalGasto: pedidos && formatarReais(pedidos.reduce((s, p) => s + p.valorCentavos, 0)),
    recomendacoes: recomendacoes && recomendacoes.map(r => r.titulo),
    avisos: [
      ...(pedidos ? [] : ['Pedidos indisponíveis no momento']),
      ...(recomendacoes ? [] : ['Recomendações indisponíveis no momento']),
    ],
    _meta: { tempoMs: Date.now() - rastro.inicio, chamadasInternas: rastro.chamadas },
  };
}

// ---------------- ENDPOINT PARA A PARTE 2 (Clean Architecture em React) ----------------
// O ApiItemRepository da poc-clean-architecture espera ItemEntity[]:
//   { id: string, nome: string, preco: number, descricao?: string }
// O serviço devolve { sku, titulo, precoCentavos, estoque, fornecedorId }.
// O BFF traduz de um formato para o outro e esconde o que a tela não usa.
async function montarItens() {
  const rastro = { inicio: Date.now(), chamadas: [] };
  const produtos = await buscar(rastro, 'recomendacoes', '/produtos');
  return produtos
    .filter(p => p.estoque > 0)                       // regra da tela: só o que dá para comprar
    .map(p => ({
      id: p.sku,
      nome: p.titulo,
      preco: p.precoCentavos / 100,
      descricao: p.estoque <= 5 ? `Últimas ${p.estoque} unidades` : undefined,
    }));
}

// ---------------- SERVIDOR HTTP ----------------
const PASTA_FRONT = path.join(__dirname, '..', 'front');
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`);

  // Libera o front React da parte 2 (roda em outra porta, a 5173 do Vite)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Endpoint para o catálogo da poc-clean-architecture
  if (url.pathname === '/api/itens') {
    console.log('[BFF] GET /api/itens → catálogo para o front React');
    try {
      const itens = await montarItens();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(itens));
    } catch (e) {
      console.log(`[BFF] ✖ ${e.message}`);
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ erro: 'Catálogo indisponível' }));
    }
  }

  // Endpoint do BFF — feito sob medida para a tela "Painel"
  const rotaPainel = url.pathname.match(/^\/api\/painel\/(\d+)$/);
  if (rotaPainel) {
    console.log(`[BFF] GET /api/painel/${rotaPainel[1]} → orquestrando os serviços...`);
    try {
      const painel = await montarPainel(rotaPainel[1]);
      console.log(`[BFF] ✔ resposta pronta em ${painel._meta.tempoMs}ms ${painel.avisos.length ? '(parcial)' : ''}`);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(painel));
    } catch (e) {
      console.log(`[BFF] ✖ ${e.message}`);
      res.writeHead(e.status || 503, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ erro: e.message }));
    }
  }

  // Serve o front (para a demo rodar com um único endereço)
  const arquivo = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  const caminho = path.join(PASTA_FRONT, arquivo);
  if (caminho.startsWith(PASTA_FRONT) && fs.existsSync(caminho) && fs.statSync(caminho).isFile()) {
    res.writeHead(200, { 'Content-Type': (TIPOS[path.extname(caminho)] || 'text/plain') + '; charset=utf-8' });
    return fs.createReadStream(caminho).pipe(res);
  }
  res.writeHead(404); res.end('Não encontrado');
}).listen(PORTA, () => console.log(`✔ BFF rodando em http://localhost:${PORTA}  ← abra no navegador`));
