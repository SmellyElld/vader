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
    <ul v-if="props.current.wheater">
        <li>
            {{ new Date(props.current.wheater.time).getDate() }}.{{ new Date(props.current.wheater.time).getMonth() + 1 }}<br>
            {{ getText(props.current.wheater.code) }}
        </li>
        <li>{{ props.current.wheater.temp.temp }}{{ props.current.wheater.temp.unit }}<br>({{ props.current.wheater.temp.apparent_temp }}{{ props.current.wheater.temp.unit }})</li>
        <li>{{ props.current.wheater.precipitation.precipitation }}{{ props.current.wheater.precipitation.unit }}</li>
        <li>{{ Math.round(props.current.wheater.wind.speed) }} ({{ Math.round(props.current.wheater.wind.gusts) }}){{ props.current.wheater.wind.wind_speed_unit }}<br>{{ props.current.wheater.wind.direction }}{{ props.current.wheater.wind.direction_unit }}</li>
        <li>{{ props.current.wheater.pressure.pressure }}{{ props.current.wheater.pressure.unit }}</li>
        <li>{{ props.current.wheater.cloud_cover.cloud_cover }}{{ props.current.wheater.cloud_cover.unit }}</li>
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