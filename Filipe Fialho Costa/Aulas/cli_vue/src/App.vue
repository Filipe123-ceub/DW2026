<template>
 <div>
 <home-component></home-component>
 </div>
</template>

<script>

import HomeComponent from './components/HomeComponent.vue';

export default {
  name: 'App',
  components: {
    HomeComponent,
  },
  mounted() {
  console.log('Minha aplicação montada com sucesso!');
  },
  created() {
  console.log('Minha aplicação criada com sucesso!');
  },
  errorCaptured(error) {
    alert(`Ocorreu um erro: ${error.message}`);
    return false;
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
