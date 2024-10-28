<script setup>
import wc from "@/assets/data/weatherCodes.json"
import { ref } from "vue";

const props = defineProps(['forecast']);
const weatherCodes = ref(wc);

function getText(code) {
    let wcText = weatherCodes.value.find(itm => {
        return itm.code == code
    }).description ?? 'Unknown';
    return wcText
}
</script>

<template>
    <ul id="header">
        <li>Date</li>
        <li>Temp</li>
        <li>Precip</li>
        <li>Wind</li>
    </ul>
    <div v-for="day in props.forecast.weather" :key="day" class="forecastNav">
        <div class="dayCard" :id="'daycardID' + day.date" @click="showForecast(day.date)">

        </div>

        <li>
            {{ new Date(day.date).getDate() }}.{{ new Date(day.date).getMonth() + 1 }}<br>
            {{ getText(day.code) }}
        </li>
        <li>{{ day.temp.min }}{{ day.temp.unit }} - {{ day.temp.max }}{{ day.temp.unit }}</li>
        <li>{{ day.precipitation.sum }}{{ day.precipitation.unit }}<br>({{ day.precipitation.probability}}%)</li>
        <li>{{ Math.round(day.wind.speed) }} ({{ Math.round(day.wind.gusts) }}){{ day.wind.unit }}<br>{{ day.wind.direction }}{{ day.wind.direction_unit }}</li>
    </div>
    <div class="forecast"></div>
</template>

<style scoped>
    ul {
        padding:  5px;
        display: grid;
        grid-template-columns: 25% 25% 20% auto;
        border-radius: 10px;
        align-items: center;
    }
    ul:nth-child(even) {
        background-color: rgb(198, 240, 255);
    }
    ul:nth-child(odd) {
        background-color: rgb(235, 242, 254);
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