<script setup>
import wc from "@/assets/data/weatherCodes.json"
import { ref } from "vue";

const props = defineProps(['current']);
const weatherCodes = ref(wc);

function getText(code) {
    let wcText = weatherCodes.value.find(itm => {
        return itm.code == code
    }).description ?? 'Unknown';
    return wcText
}

function getIcon(code, isDay) {
    let wcIcon = weatherCodes.value.find(itm => {
        return itm.code == code
    })[isDay ? 'icon_day' : 'icon_night'] ?? 'default.svg'
    return new URL(`../assets/icons/${wcIcon}`, import.meta.url);
}

function getWindColor(windSpeed) {
    if (windSpeed < 10) {
        return 'hsl(220, 100%, 95%)';
    } else if (windSpeed < 15) {
        return 'hsl(220, 100%, 70%)';
    } else if (windSpeed < 20) {
        return 'hsl(220, 100%, 50%)'
    } else {
        return 'hsl(243, 100%, 35%)'
    }
}
</script>

<template>
    <div v-if="props.current.weather" class="currentWeather">
        <div class="currentWeatherCard"><img :src="getIcon(props.current.weather.code, props.current.isDay)" :title="getText(props.current.weather.code)" class="weatherIcon"></div>
        <div class="currentWeatherCard">
            <h3>Temperatur</h3>
            {{ Math.round(props.current.weather.temp.temp) }}{{ props.current.weather.temp.unit }}
            ({{ props.current.weather.temp.apparent_temp }}{{ props.current.weather.temp.unit }})
        </div>
        <div class="currentWeatherCard">
            <h3>Vind</h3>
            <img src="../assets/icons/arrow.svg" :style="`transform: rotate(${props.current.weather.wind.direction}deg); background-color: ${getWindColor(props.current.weather.wind.speed)}; border-radius: 100%`" class="windDirectionIcon" :title="props.current.weather.wind.direction + props.current.weather.wind.direction_unit">
            {{ Math.round(props.current.weather.wind.speed) }} ({{ Math.round(props.current.weather.wind.gusts) }}){{ props.current.weather.wind.wind_speed_unit }}            
        </div>
        <div class="currentWeatherCard">
            <h3>Tryck</h3>
            {{ props.current.weather.pressure.pressure }}{{ props.current.weather.pressure.unit }}
        </div>
        <div class="currentWeatherCard">
            <h3>Molnighet</h3>
            {{ props.current.weather.cloud_cover.cloud_cover }}{{ props.current.weather.cloud_cover.unit }}
        </div>
    </div>
</template>

<style scoped>
    div.currentWeather {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
    }
    div.currentWeatherCard {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        position: relative;
        font-size: medium;
        text-align: center;
        padding: 0.3em;
        width: 100px;
        height: 100px;
        margin: 10px;
        border-radius: 0.6em;
        background: linear-gradient(45deg, rgb(192, 241, 255), rgb(254, 255, 255));
        box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.468);
        outline: 4px rgba(3, 150, 255, 0.253) solid;
    }
    .weatherIcon {
        width: 70%;
    }
    .windDirectionIcon {
        width: 30%;
    }
    h3 {
        font-size: large;
    }
    ul {
        padding:  5px;
        display: grid;
        grid-template-columns: 15% 15% 15% 20% 20% auto;
        border-radius: 10px;
        align-items: center;
    }
    li {
        padding: 0 .5em;
        list-style-type: none;
        vertical-align: top;
        font-weight: 350;
    }
    ul#header {
        padding:  5px;
        background-color: rgb(0, 208, 255);
    }
    ul#header li {
        font-size: 1.05em;
        font-weight: 450;
    }
</style>