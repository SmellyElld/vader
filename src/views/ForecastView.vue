<script setup>
import { onMounted, ref } from 'vue';
import { getForecast } from '@/services/forecastService';
import ForecastResult from '@/components/ForecastResult.vue';

const location = ref({ lat: 0, long: 0, name: 'Nuvarande position' });
const info = ref({});
onMounted(() => {
    getForecast(location.value)
        .then(response => {
            info.value = response;
        })
        .catch(err => {
            console.log(err);
        });
})


</script>

<template>
    <h2>{{ location.name }}</h2>
    <p class="location">Lat: <span>{{ location.lat.toFixed(3) }}</span></p>
    <p class="location">Long: <span>{{ location.long.toFixed(3) }}</span></p>
    <ForecastResult :forecast="info" />
</template>

<style scoped>
.location {
    display: inline-block;
    margin: 0 1em;
}
</style>