<template>
  <div id="app">
    <header class="header">
      <h1>Rick and Morty App</h1>
    </header>

    <main class="container">
      <div v-if="loading" class="loading">Carregando personagens...</div>

      <div v-else class="cards-grid">
        <CharacterCard
          v-for="character in characters"
          :key="character.id"
          :character="character"
        />
      </div>

      <!-- Paginação -->
      <div class="pagination">
        <button
          :disabled="currentPage === 1 || loading"
          @click="fetchCharacters(currentPage - 1)"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages || loading"
          @click="fetchCharacters(currentPage + 1)"
        >
          Próxima
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import CharacterCard from "./components/CharacterCard.vue";

export default {
  name: "App",
  components: {
    CharacterCard
  },
  data() {
    return {
      characters: [],
      currentPage: 1,
      totalPages: 1,
      loading: false
    };
  },
  mounted() {
    this.fetchCharacters(this.currentPage);
  },
  methods: {
    async fetchCharacters(page) {
      this.loading = true;
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character?page=${page}`
        );
        this.characters = response.data.results;
        this.totalPages = response.data.info.pages;
        this.currentPage = page;
      } catch (error) {
        console.error("Erro ao procurar personagens:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

body {
  background-color: #272b33;
  color: #ffffff;
}

.header {
  text-align: center;
  padding: 30px;
  background-color: #202329;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin: 40px 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #ff9800;
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
}

.pagination button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>
