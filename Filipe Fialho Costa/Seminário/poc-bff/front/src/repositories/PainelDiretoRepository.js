// =====================================================================
//  CAMADA REPOSITORY — versão SEM BFF (só para comparação na demo)
//  Aqui o PRÓPRIO NAVEGADOR faz o trabalho que o BFF faria:
//   - conhece o endereço dos 3 serviços (acoplamento)
//   - faz 3 requisições pela rede do usuário
//   - recebe dados que a tela não usa, inclusive CPF e hash de senha
//   - precisa formatar centavos, status etc. aqui no front
//   - implementação "ingênua": se UM serviço cair, a tela inteira quebra
// =====================================================================
const SERVICOS = {
  usuarios: 'http://localhost:3001',
  pedidos: 'http://localhost:3002',
  recomendacoes: 'http://localhost:3003',
};
const CAMPOS_SENSIVEIS = ['cpf', 'senhaHash', 'email'];

export class PainelDiretoRepository {
  async obterPainel(usuarioId) {
    const inicio = performance.now();
    const requisicoes = [];
    let bytes = 0;

    const buscar = async (servico, caminho) => {
      const reg = { url: SERVICOS[servico] + caminho, inicioMs: Math.round(performance.now() - inicio), fimMs: null, ok: false };
      requisicoes.push(reg);
      try {
        const resposta = await fetch(reg.url);
        const texto = await resposta.text();
        bytes += texto.length;
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        reg.ok = true;
        return JSON.parse(texto);
      } catch (e) {
        throw new Error(`Falha ao chamar ${servico}: ${e.message}`);
      } finally {
        reg.fimMs = Math.round(performance.now() - inicio);
      }
    };

    try {
      // A orquestração agora mora no navegador...
      const [usuario, pedidos] = await Promise.all([
        buscar('usuarios', `/usuarios/${usuarioId}`),
        buscar('pedidos', `/pedidos/usuario/${usuarioId}`),
      ]);
      const recomendacoes = await buscar('recomendacoes', `/recomendacoes/${usuario.plano}`);

      // ...e a formatação também (regra duplicada em cada front: web, app, etc.)
      const reais = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const STATUS = { ENTREGUE: 'Entregue', EM_TRANSITO: 'Em trânsito', PROCESSANDO: 'Processando' };

      return {
        painel: {
          usuario: { nome: usuario.nome, plano: usuario.plano === 'premium' ? 'Premium ⭐' : 'Básico' },
          pedidos: pedidos.map(p => ({ id: p.id, produto: p.produto, valor: reais(p.valorCentavos), status: STATUS[p.status] ?? p.status })),
          totalGasto: reais(pedidos.reduce((s, p) => s + p.valorCentavos, 0)),
          recomendacoes: recomendacoes.map(r => r.titulo),
          avisos: [],
        },
        rede: {
          requisicoesDoNavegador: requisicoes,
          chamadasInternasDoBff: [],
          tempoMs: Math.round(performance.now() - inicio),
          bytesRecebidos: bytes,
          camposSensiveisRecebidos: CAMPOS_SENSIVEIS.filter(c => c in usuario),
        },
      };
    } catch (e) {
      e.requisicoes = requisicoes;
      throw e;
    }
  }
}
