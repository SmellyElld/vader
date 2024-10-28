<script setup>
import { ref, watchEffect } from 'vue';
import { getCurrent, getForecast } from '@/services/forecastService';
import ForecastResult from '@/components/ForecastResult.vue';
import CurrentResult from '@/components/CurrentResult.vue';

const currentLocation = ref({ position: {lat: 0, long: 0}, name: 'Unknown' });
const forecastData = ref({});
const currentData = ref({});
const props = defineProps(['location'])

watchEffect(() => {
    let locationsList = JSON.parse(localStorage.getItem('locations'));
    if (props.location) {
        currentLocation.value = locationsList.find(loc => {
            return loc.name.toLocaleLowerCase() === props.location.toLocaleLowerCase()
        })
    } else {
        currentLocation.value = locationsList.find(loc => {
            return loc.default
        })
    }

    if (currentLocation.value) {
        getForecast(currentLocation.value)
            .then(response => {
                forecastData.value = response;
            })
            .catch(err => {
                console.log(err);
            });
        getCurrent(currentLocation.value)
            .then(response => {
                currentData.value = response;
            })
            .catch(err => {
                console.log(err);
            });
    }
});

function getCoords(rawCords) {
    Math.abs(rawCords.lat).toFixed(2)

    return {
        lat: Math.abs(rawCords.lat).toFixed(2) + "°" + (rawCords.lat < 0 ? 'S' : 'N'),
        long: Math.abs(rawCords.long).toFixed(2) + "°" + (rawCords.long < 0 ? 'W' : 'E') , 
    };
}

</script>

<template>
    <template v-if="!currentLocation">
        <h2>Angiven plats saknas</h2>
        <p>{{ props.location }} finns inte i listan över platser</p>
    </template>
    <template v-else>
        <div class="locationContainer">
            <h2>{{ currentLocation.name }}</h2>
            <span class="location"><span>{{ getCoords(currentData.position ?? currentLocation.position).lat }}</span>  <span>{{ getCoords(currentData.position ?? currentLocation.position).long }}</span></span>
        </div>
        <h3>Nuvarande väder</h3>
        <CurrentResult :current="currentData" />
        <br>
        <h3>7 dagars Prognos</h3>
        <ForecastResult :forecast="forecastData" />
    </template>
</template>

<style scoped>
h2.locationContainer {
    display: inline;
}
.locationContainer {
    background: linear-gradient(45deg, #e0f7ff, #ffffff);
    border-radius: 0.5em;
    padding: 0.3em;
}
.location {
    display: inline-block;
    margin: 0 2em;
}
h2, h3 {
    margin: 0 1em;
}
</style>