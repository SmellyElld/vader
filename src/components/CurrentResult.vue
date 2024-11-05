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

function isDay(start, end, now) {
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    now = new Date(now).getTime();

    if (start === end) {
        return false
    }
    if (now > start && now < end) {
        return true
    }
    return false
}
</script>

<template>
    <ul id="header">
        <li>Date</li>
        <li>Temp</li>
        <li>Precip</li>
        <li>Wind</li>
        <li>Pressure</li>
        <li>Cloud cover</li>
    </ul>
    <ul v-if="props.current.weather">
        <div v-for="day in props.current.weather" :key="day">
            <div><img :src="getIcon(day.code, isDay())"></div>
        </div>
        <li>
            {{ new Date(props.current.weather.time).getDate() }}.{{ new Date(props.current.weather.time).getMonth() + 1 }}<br>
            {{ getText(props.current.weather.code) }}
        </li>
        <li>{{ props.current.weather.temp.temp }}{{ props.current.weather.temp.unit }}<br>({{ props.current.weather.temp.apparent_temp }}{{ props.current.weather.temp.unit }})</li>
        <li>{{ props.current.weather.precipitation.precipitation }}{{ props.current.weather.precipitation.unit }}</li>
        <li>{{ Math.round(props.current.weather.wind.speed) }} ({{ Math.round(props.current.weather.wind.gusts) }}){{ props.current.weather.wind.wind_speed_unit }}<br>{{ props.current.weather.wind.direction }}{{ props.current.weather.wind.direction_unit }}</li>
        <li>{{ props.current.weather.pressure.pressure }}{{ props.current.weather.pressure.unit }}</li>
        <li>{{ props.current.weather.cloud_cover.cloud_cover }}{{ props.current.weather.cloud_cover.unit }}</li>
    </ul>
</template>

<style scoped>
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