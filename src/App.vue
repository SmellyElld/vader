<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/forecast">Forecast</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
