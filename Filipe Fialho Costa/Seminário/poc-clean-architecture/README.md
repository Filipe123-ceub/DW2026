# PoC: Arquitetura Limpa (Clean Architecture) em TypeScript & React

Esta aplicação é uma Prova de Conceito (PoC) desenvolvida para demonstrar a aplicação prática de uma **arquitetura em camadas estritamente desacopladas**, cumprindo os requisitos de separação de responsabilidades e inversão de dependências.

---

## 🎯 Objetivo do Projeto
Demonstrar que o núcleo de uma aplicação de software pode (e deve) ser completamente independente de frameworks visuais (como o React) ou de tecnologias de infraestrutura (como clientes HTTP ou bases de dados), facilitando a testabilidade, manutenção e escalabilidade a longo prazo.

---

## 📁 Estrutura de Pastas e Camadas

O código está organizado de forma modular dentro da pasta `src`, respeitando as fronteiras da Clean Architecture:

```text
src/
├── domain/               # 1. Núcleo: Entidades e Contratos (Interfaces) puros
│   ├── ItemEntity.ts     # Estrutura de dados central (Entidade)
│   └── IItemRepository.ts# Contrato/Interface de acesso a dados
│
├── usecases/             # 2. Aplicação: Regras de negócio e orquestração
│   └── BuscarItensUseCase.ts
│
├── repositories/         # 3. Infraestrutura: Comunicação externa e APIs
│   ├── httpClient.ts     # Wrapper genérico para requisições HTTP
│   └── ApiItemRepository.ts # Implementação concreta do contrato do Domínio
│
└── ui/                   # 4. Apresentação: Interface de Utilizador (React)
    ├── components/       # Componentes visuais "burros" (ex: ListaItens.tsx)
    ├── hooks/            # Pontes de estado e integração (ex: useItens.ts)
    └── pages/            # Páginas da aplicação (ex: ItensPage.tsx)


🔍 Como funciona o Desacoplamento?
Domain (O Coração):
Não conhece o React, o Axios ou o servidor. Define apenas o que a aplicação manipula através de entidades e interfaces puras em TypeScript (IItemRepository).

Use Cases (A Regra de Negócio):
Orquestra os fluxos da aplicação (BuscarItensUseCase). Recebe o repositório através de injeção de dependência via construtor, ignorando completamente se os dados vêm de uma API REST, de um ficheiro estático ou de memória local.

Repositories (A Infraestrutura):
Implementa os contratos definidos no domínio (ApiItemRepository). É o único sítio onde a tecnologia externa de rede (httpClient) é acedida. Se a API mudar, altera-se apenas esta camada.

UI (A Apresentação):
Focada exclusivamente na experiência do utilizador. Os componentes visuais apenas recebem propriedades e renderizam o ecrã, enquanto os hooks gerem o estado e ligam a interface aos casos de uso.

## 🔌 De onde vêm os dados

O `ApiItemRepository` chama o **BFF da parte 3** (`../poc-bff`) em `http://localhost:4000/api/itens`. O BFF busca os produtos no microsserviço (em centavos, com campos internos) e devolve no formato da `ItemEntity`. Por isso nenhuma camada daqui precisa converter dados ou saber que existem microsserviços.

## ▶️ Como rodar

1. Em um terminal, suba o BFF e os microsserviços:

```bash
cd ../poc-bff
npm start
```

2. Em outro terminal, rode esta aplicação:

```bash
npm install
npm run dev
```

3. Abra **http://localhost:5173**.

Para verificar os tipos do TypeScript: `npm run checar`.