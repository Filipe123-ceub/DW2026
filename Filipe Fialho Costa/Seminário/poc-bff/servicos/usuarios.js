// Microsserviço de USUÁRIOS (porta 3001)
// Repare: ele devolve MUITO mais campos do que a tela precisa.
const { criarServico } = require('./criar-servico');

const usuarios = {
  1: {
    id: 1,
    nome: 'Ana Souza',
    email: 'ana@email.com',
    cpf: '000.000.000-00',          // dado sensível que o front NÃO deveria receber
    senhaHash: '$2b$10$abc...',      // dado sensível que o front NÃO deveria receber
    criadoEm: '2023-04-12T10:00:00Z',
    ultimoLogin: '2026-10-28T21:14:00Z',
    plano: 'premium',
  },
  2: {
    id: 2,
    nome: 'Bruno Lima',
    email: 'bruno@email.com',
    cpf: '111.111.111-11',
    senhaHash: '$2b$10$def...',
    criadoEm: '2024-01-05T10:00:00Z',
    ultimoLogin: '2026-10-27T08:00:00Z',
    plano: 'basico',
  },
};

criarServico('Serviço de Usuários', 3001, [
  { padrao: /^\/usuarios\/(\d+)$/, handler: ([, id]) => usuarios[id] },
], 300);
