<script setup>
import { ref, watchEffect } from 'vue';
import { getCurrent, getForecast } from '@/services/forecastService';
import { getGeolocationName } from '@/services/nameService'
import ForecastResult from '@/components/ForecastResult.vue';
import CurrentResult from '@/components/CurrentResult.vue';

const currentLocation = ref({ position: {lat: 0, long: 0}, name: 'Okänd' });
const forecastData = ref({});
const currentData = ref({});
const props = defineProps(['location'])
const shownLocation = ref('Okänd');

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

        if (currentLocation.value.name == 'Nuvarande position')
            getGeolocationName(currentLocation.value.position)
                .then(response => {
                    shownLocation.value = response;
                })
                .catch(err => {
                    console.log(err);
                });
        else {
            shownLocation.value = currentLocation.value.name
        }
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
        <p>{{ shownLocation }} finns inte i listan över platser</p>
    </template>
    <template v-else>
        <div class="locationContainer">
            <h2>{{ shownLocation }}</h2>
            <span class="location"><span>{{ getCoords(currentData.position ?? currentLocation.position).lat }}</span>  <span>{{ getCoords(currentData.position ?? currentLocation.position).long }}</span></span>
        </div>
        <br>
        <CurrentResult :current="currentData" />
        <br>
        <ForecastResult :forecast="forecastData" />
    </template>
</template>

<style scoped>
h2.locationContainer {
    display: inline;
}
.locationContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    font-size: medium;
    max-width: 600px;
    padding: 0.3em;
    margin: 10px;
    border-radius: 0.6em;
    background: linear-gradient(-15deg, rgb(192, 241, 255), rgb(254, 255, 255));
    box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.468);
    outline: 4px rgba(3, 150, 255, 0.253) solid;
    margin-left: auto;
    margin-right: auto;
}
.location {
    display: inline-block;
    margin: 0 2em;
}
.location span {
    font-weight: 350;
}
h2, h3 {
    margin: 0 1em;
}
@media (max-width: 650px) {
    .locationContainer {
        margin-left: 8px;
        margin-right: 8px;
    }
}
</style>