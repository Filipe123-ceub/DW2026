// =====================================================================
//  CAMADA UI (Vue 3) — só desenha. Não sabe de microsserviços,
//  não formata centavo, não decide nada: pede o painel ao Repository.
//  Trocar "com BFF" por "sem BFF" é só trocar o Repository injetado.
// =====================================================================
import { ref, computed, watch, onMounted } from 'vue';
import { PainelBffRepository } from './repositories/PainelBffRepository.js';
import { PainelDiretoRepository } from './repositories/PainelDiretoRepository.js';

const repositorios = {
  bff: new PainelBffRepository(),
  direto: new PainelDiretoRepository(),
};

export default {
  setup() {
    const modo = ref('bff');
    const usuarioId = ref('1');
    const carregando = ref(false);
    const painel = ref(null);
    const rede = ref(null);
    const erro = ref('');

    async function carregar() {
      carregando.value = true;
      erro.value = '';
      try {
        const resultado = await repositorios[modo.value].obterPainel(usuarioId.value);
        painel.value = resultado.painel;
        rede.value = resultado.rede;
      } catch (e) {
        painel.value = null;
        erro.value = e.message;
        rede.value = e.requisicoes ? { requisicoesDoNavegador: e.requisicoes, chamadasInternasDoBff: [], camposSensiveisRecebidos: [] } : null;
      } finally {
        carregando.value = false;
      }
    }

    function trocarModo(novo) { modo.value = novo; carregar(); }

    // Linha do tempo: no modo BFF mostra as chamadas que o BFF fez lá dentro;
    // no modo direto mostra as chamadas que o navegador fez.
    const linhaDoTempo = computed(() => {
      if (!rede.value) return [];
      const lista = modo.value === 'bff' ? rede.value.chamadasInternasDoBff : rede.value.requisicoesDoNavegador;
      const max = Math.max(1, ...lista.map(c => c.fimMs ?? 0));
      return lista.map(c => ({
        nome: c.servico || c.url.replace('http://localhost:', ':'),
        ok: c.ok,
        ms: (c.fimMs ?? 0) - c.inicioMs,
        esquerda: (c.inicioMs / max) * 100 + '%',
        largura: Math.max(2, (((c.fimMs ?? 0) - c.inicioMs) / max) * 100) + '%',
      }));
    });

    watch(usuarioId, carregar);   // trocou o usuário no select → recarrega
    onMounted(carregar);
    return { modo, usuarioId, carregando, painel, rede, erro, carregar, trocarModo, linhaDoTempo };
  },

  template: `
  <header>
    <h1>Meu Painel</h1>
    <div class="controles">
      <div class="alternador" role="group" aria-label="Modo">
        <button :class="{ ativo: modo === 'bff' }" @click="trocarModo('bff')">Com BFF</button>
        <button :class="{ ativo: modo === 'direto' }" @click="trocarModo('direto')">Sem BFF</button>
      </div>
      <select v-model="usuarioId">
        <option value="1">Ana (premium)</option>
        <option value="2">Bruno (básico)</option>
      </select>
      <button class="recarregar" @click="carregar" :disabled="carregando">{{ carregando ? 'Carregando…' : 'Recarregar' }}</button>
    </div>
  </header>

  <main>
    <section class="card full erro" v-if="erro">✖ {{ erro }}</section>
    <section class="card full" v-if="painel && painel.avisos.length">
      <div class="aviso" v-for="a in painel.avisos" :key="a">⚠ {{ a }}</div>
    </section>

    <section class="card">
      <h2>Usuário</h2>
      <p v-if="painel"><strong>{{ painel.usuario.nome }}</strong><br>Plano: {{ painel.usuario.plano }}</p>
      <p v-else class="vazio">—</p>
    </section>

    <section class="card">
      <h2>Recomendações</h2>
      <ul v-if="painel && painel.recomendacoes"><li v-for="r in painel.recomendacoes" :key="r">{{ r }}</li></ul>
      <p v-else class="vazio">Indisponível</p>
    </section>

    <section class="card full">
      <h2>Pedidos</h2>
      <template v-if="painel && painel.pedidos">
        <table>
          <tr v-for="p in painel.pedidos" :key="p.id"><td>#{{ p.id }}</td><td>{{ p.produto }}</td><td>{{ p.valor }}</td><td>{{ p.status }}</td></tr>
        </table>
        <p><strong>Total gasto: {{ painel.totalGasto }}</strong></p>
      </template>
      <p v-else class="vazio">Indisponível</p>
    </section>

    <section class="card full rede" v-if="rede">
      <h2>O que aconteceu na rede — {{ modo === 'bff' ? 'COM BFF' : 'SEM BFF' }}</h2>
      <div class="numeros">
        <div><span>{{ rede.requisicoesDoNavegador.length }}</span>requisição(ões) do navegador</div>
        <div v-if="rede.tempoMs != null"><span>{{ rede.tempoMs }} ms</span>tempo total</div>
        <div :class="{ perigo: rede.camposSensiveisRecebidos.length }">
          <span>{{ rede.camposSensiveisRecebidos.length ? rede.camposSensiveisRecebidos.join(', ') : 'nenhum' }}</span>dado sensível no navegador
        </div>
      </div>

      <h3>{{ modo === 'bff' ? 'Chamadas que o BFF fez por dentro (o navegador não vê)' : 'Chamadas que o navegador teve que fazer' }}</h3>
      <div class="linha" v-for="c in linhaDoTempo" :key="c.nome">
        <span class="nome">{{ c.nome }}</span>
        <div class="trilho"><div class="barra" :class="{ falha: !c.ok }" :style="{ left: c.esquerda, width: c.largura }"></div></div>
        <span class="ms">{{ c.ok ? c.ms + ' ms' : 'falhou' }}</span>
      </div>
      <p class="legenda" v-if="modo === 'bff'">Barras lado a lado = chamadas em <b>paralelo</b>. Barra que começa depois = chamada em <b>sequência</b> (precisa do plano do usuário).</p>
    </section>
  </main>`,
};
