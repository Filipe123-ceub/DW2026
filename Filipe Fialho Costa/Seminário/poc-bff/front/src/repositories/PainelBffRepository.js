// =====================================================================
//  CAMADA REPOSITORY — versão COM BFF
//  É aqui que o projeto em camadas do grupo se liga ao BFF.
//  O front faz UMA chamada e recebe o painel pronto para desenhar.
//  Ele nem sabe que existem 3 microsserviços por trás.
// =====================================================================
export class PainelBffRepository {
  constructor(urlBff = '') {
    this.urlBff = urlBff;
  }

  async obterPainel(usuarioId) {
    const inicio = performance.now();
    const url = `${this.urlBff}/api/painel/${usuarioId}`;
    const resposta = await fetch(url);                    // ← UMA chamada só
    const texto = await resposta.text();
    const ms = Math.round(performance.now() - inicio);
    const corpo = JSON.parse(texto);

    if (!resposta.ok) throw new Error(corpo.erro || 'Falha ao carregar painel');

    return {
      painel: corpo,
      rede: {
        requisicoesDoNavegador: [{ url, inicioMs: 0, fimMs: ms, ok: true }],
        chamadasInternasDoBff: corpo._meta.chamadasInternas,
        tempoMs: ms,
        bytesRecebidos: texto.length,
        camposSensiveisRecebidos: [],                     // o BFF filtrou
      },
    };
  }
}
