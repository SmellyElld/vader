<script setup>
import { RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue';
import { ref } from 'vue';

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
