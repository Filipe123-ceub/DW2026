<template>
  <div class="card">
    <img :src="character.image" :alt="character.name" class="card-img" />
    <div class="card-info">
      <h3>{{ character.name }}</h3>
      
      <!-- Ícone visual de status (vivo / morto) -->
      <p class="status">
        <span
          class="status-icon"
          :class="{
            'status-alive': character.status === 'Alive',
            'status-dead': character.status === 'Dead',
            'status-unknown': character.status === 'unknown'
          }"
        ></span>
        {{ character.status }} - {{ character.species }}
      </p>

      <!-- Local onde vive -->
      <p class="location">
        <strong>Localização:</strong> {{ character.location.name }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CharacterCard",
  props: {
    character: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.card {
  background-color: #202329;
  color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.card-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.card-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.status-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-alive {
  background-color: #55cc44;
}

.status-dead {
  background-color: #d63d2e;
}

.status-unknown {
  background-color: #9e9e9e;
}

.location {
  font-size: 0.9em;
  color: #9e9e9e;
}
</style>
