<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

//Load locations from localstorage
onMounted(() => {
  let locations = JSON.parse(localStorage.getItem('locations'));
  if (!locations) {
    let location = [{name: 'Mariehamn', position: {lat: 60, long: 20}, default: true}];
    localStorage.setItem('locations', JSON.stringify(location));
  }
})
</script>

<template>
  <header>
    <nav class="navbar">
        <RouterLink to="/">Väder</RouterLink>
        <RouterLink to="/location">Platser</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
  .navbar a {
    color: black;
    font-size: large;
    padding: 10px;
    background: linear-gradient(10deg rgb(237, 255, 255) rgb(186, 247, 255));
  }
  .navbar a:hover {
    padding: 10px;
    background-color: rgba(255, 255, 255, 0);
  }
  .navbar {
    display: flex;
    justify-content: center;
  }
</style>
