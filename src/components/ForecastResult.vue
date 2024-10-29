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

function getIcon(code) {
    let wcIcon = weatherCodes.value.find(itm => {
        return itm.code == code
    }).icon_night ?? 'default.svg'
    return new URL(`../assets/icons/${wcIcon}`, import.meta.url);
}

function showForecast(date) {
    let forecastDays = document.getElementsByClassName('forecastDay');

    for (let forecast of forecastDays){
        if (forecast.id == 'forecastID' + date) {
            forecast.classList.remove('unselected')
            forecast.classList.add('selected')
        } else {
            forecast.classList.remove('selected')
            forecast.classList.add('unselected')
        }
    }
}

function getDayNameShort(date, type='short') {
    // Array of day names
    const dayNames = [
        'Söndag',
        'Måndag',
        'Tisdag',
        'Onsdag',
        'Torsdag',
        'Fredag',
        'Lördag'
    ];
    
    // Get the day of the week (0-6)
    const dayIndex = date.getDay();

    //Return
    if (type === 'short') {
        return dayNames[dayIndex].substring(0, 2);
    }
    if (type === 'full') {
        return dayNames[dayIndex];
    }
}
</script>

<template>
    <section v-if="props.forecast.weather">
        <div class="forecastNav">
            <div v-for="day in props.forecast.weather.days" :key="day">
                <div class="dayCard" :id="'daycardID' + day.date" @click="showForecast(day.date)">
                    <span>{{ getDayNameShort(new Date(day.date)) }}</span>
                    <span>{{ getText(day.code) }}</span>
                    {{ day.temp.average }}{{ props.forecast.weather.units.temp }}
                </div>
            </div>
        </div>
        <div class="forecast">
            <div v-for="day in props.forecast.weather.days" :key="day" class="forecastDay unselected" :id="'forecastID' + day.date">
                <div>
                    {{ getDayNameShort(new Date(day.date), 'full') }} {{ (new Date(day.date)).getDate() }}.{{ (new Date(day.date)).getMonth() + 1}}
                </div>
                <ul v-for="hour in day.hourly" :key="hour">
                    <li>{{ hour.time }}</li>
                    <li><img :src="getIcon(hour.code)" :title="getText(hour.code)"></li>
                    <li>
                        {{ hour.wind_direction }}<br>
                        {{ hour.wind_speed }}<br>
                        ({{ hour.wind_gusts }})<br>
                        {{ props.forecast.weather.units.wind_speed }}
                    </li>
                    <li>
                        {{ hour.temp }}{{ props.forecast.weather.units.temp }} <br>
                        ({{ hour.apparent_temp }}{{ props.forecast.weather.units.temp }})
                    </li>
                    <li>
                        {{ hour.precip }}{{  props.forecast.weather.units.precip }}<br>
                        {{ hour.precip_prob }}%
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style scoped>
    ul {
        padding:  5px;
        display: grid;
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
    .selected {
        display: flex;
    }
    .unselected {
        display: none;
    }

    .forecastNav {
        display: flex;
        flex-direction: row;
    }

    .dayCard {
        display: flex;
        flex-direction: column;
        background-color: aqua;
        margin: 5px;
    }
</style>