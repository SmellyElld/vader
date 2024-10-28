<script setup>
import { RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue';
import { ref, onMounted } from 'vue';

onMounted(() => {
  let locations = JSON.parse(localStorage.getItem('locations'));
  if (!locations) {
    let location = [{name: 'Mariehamn', position: {lat: 60, long: 20}, default: true}];
    localStorage.setItem('locations', JSON.stringify(location));
  }
})

const menuActive = ref(false);
</script>

<template>
  <header>
    <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
  </header>

  <RouterView />
</template>

<style scoped>
</style>
