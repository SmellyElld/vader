<script setup>
import wc from "@/assets/data/weatherCodes.json"
import { ref, watch } from "vue";

const props = defineProps(['forecast']);
const weatherCodes = ref(wc);
const forecastLoaded = ref(false);

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

function showForecast(date) {
    let forecastDays = document.getElementsByClassName('forecastDay');
    let buttons = document.getElementsByClassName('dayCard');

    for (let forecast of forecastDays){
        if (forecast.id == 'forecastID' + date) {
            forecast.classList.remove('unselected')
            forecast.classList.add('selected')
        } else {
            forecast.classList.remove('selected')
            forecast.classList.add('unselected')
        }
    }
    for (let button of buttons) {
        if (button.id == 'daycardID' + date) {
            button.classList.remove('unselected')
            button.classList.add('selected')
        } else {
            button.classList.remove('selected')
            button.classList.add('unselected')
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

function getColor(precipProb) {
    if (precipProb > 45) {
        return 'rgb(255,255,255)';
    } else {
        return 'rgb(0,0,0)';
    }
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

function isOld(datetime) {
    if (new Date(datetime).getTime() < Date.now() - 3600000) {
        return 'prev';
    }
}

watch(forecastLoaded, () => {
    showForecast(new Date().toISOString().split('T')[0]);
});
</script>

<template>
    <section v-if="props.forecast.weather">
        <div class="forecastNav">
            <div v-for="day in props.forecast.weather.days" :key="day" class="dayCard" :id="'daycardID' + day.date" @click="showForecast(day.date)">
                <span>{{ getDayNameShort(new Date(day.date), 'full') }}</span>
                <span class="img"><img :src="getIcon(day.code, true)" :alt="getText(day.code)"></span>
                {{ day.temp.average }}{{ props.forecast.weather.units.temp }}
            </div>
        </div>
        <div class="forecast">
            <div v-for="day in props.forecast.weather.days" :key="day" class="forecastDay unselected" :id="'forecastID' + day.date">
                <div class="forecastHourTableHeader">
                    {{ getDayNameShort(new Date(day.date), 'full') }} {{ (new Date(day.date)).getDate() }}.{{ (new Date(day.date)).getMonth() + 1}}
                </div>
                <div class="forecastHourTable">
                    <ul v-for="hour in day.hourly" :key="hour" :class="isOld(day.date + 'T' + hour.time)">
                        <li>{{ hour.time.split(':')[0] }}</li>
                        <li><img :src="getIcon(hour.code, isDay(day.sun.up, day.sun.down, day.date + 'T' + hour.time))" :title="getText(hour.code)" class="weatherIcon"></li>
                        <li><br></li>
                        <li :title="`vindriktning ${hour.wind_direction + props.forecast.weather.units.wind_direction}`"><img src="../assets/icons/arrow.svg" :style="`transform: rotate(${hour.wind_direction}deg); background-color: ${getWindColor(hour.wind_speed)}; border-radius: 100%`" class="windDirectionIcon"></li>
                        <li title="vind">{{ Math.round(hour.wind_speed) }}</li>
                        <li title="vindbyar">({{ Math.round(hour.wind_gusts) }})</li>
                        <li>{{ props.forecast.weather.units.wind_speed }}</li>
                        <li><br></li>
                        <li title="temperatur">{{ Math.round(hour.temp) }}</li>
                        <li title="känns som">({{ Math.round(hour.apparent_temp) }})</li>
                        <li>{{ props.forecast.weather.units.temp }}</li>
                        <li class="rainMeter"><div :style="`height: ${hour.precip * 10}px`" class="rainMeter"></div></li>
                        <li>{{ hour.precip }}</li>
                        <li>{{ props.forecast.weather.units.precip }}</li>
                        <li class='rainProb' :style="`color: ${getColor(hour.precip_prob)}; background-color: rgba(40,150,255, ${hour.precip_prob/100})`">{{ hour.precip_prob }}%</li>
                    </ul>
                </div>
            </div>
        </div>
        <div hidden="true" v-if="forecastLoaded = true" v-once></div>
    </section>
</template>

<style scoped>
ul {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1px;
    align-items: center;
    width: 100%;
    min-width: 4%;
}
ul.prev {
    background-color: rgb(232, 232, 232);
    color: rgb(160, 160, 160);
}
ul.prev .rainProb {
    display: none;
}
li {
    display: flex;
    flex-direction: column;
    align-items: center;
    vertical-align: top;
    font-weight: 350;
    width: 100%;
}
.weatherIcon {
    width: 80%;
}
.windDirectionIcon {
    width: 60%;
}
.forecastDay {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
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
    flex-wrap: nowrap;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 10px;
}
.forecastHourTable {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
.forecastHourTableHeader {
    background-color: rgb(50, 155, 255);
    color: white;
    font-weight: 650;
    font-size: large;
    padding-left: 20px;
    padding-top: 3px;
    padding-bottom: 3px;
    box-shadow: 0px -3px 0px black;
}
div.rainMeter {
    position: absolute;
    content: "";
    background-color: blue;
    width: 40%;
    bottom: 0;
}
li.rainMeter {
    position: relative;
    height: 40px;
}
.dayCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: relative;
    font-size: medium;
    margin-bottom: 0;
    padding: 0.3em;
    max-width: 100px;
    height: 100px;
    width: 11%;
    border-radius: 0.6em;
    cursor: pointer;
    background: linear-gradient(45deg, rgb(192, 241, 255), rgb(254, 255, 255));
    box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.468);
}
.dayCard img{
    height: 100%;
    width: 100%;
}
.dayCard .img {
    height: 100%;
    aspect-ratio: 1 / 1;
}

.dayCard.selected .img{
    padding: 8px;
    border-radius: 100%;
    background: linear-gradient(45deg, rgb(175, 235, 255), rgb(254, 255, 255));
}
.dayCard.selected {
    background-color: rgb(50, 155, 255);
    background: linear-gradient(0deg, rgb(50, 155, 255), rgb(192, 241, 255) 60%);
    height: 110px;
    width: 18%;
}
@media (min-width: 650px) {
    .forecastHourTableHeader {
        border-radius: 10px 10px 0 0;
        border-right: solid black 3px;
        border-left: solid black 3px;
    }
    .forecastNav {
        gap: 10px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .forecastHourTable{
        border-right: solid black 3px;
        border-left: solid black 3px;
        box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.468);
    }
    .dayCard.selected {
        box-shadow: 0px 1em 0px rgb(50, 155, 255);
        border-radius: 0.6em 0.6em 0 0;
        border-top: 3px solid black;
        border-right: 3px solid black;
        border-left: 3px solid black;
    }
    .dayCard.selected::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: -20px; /* Position at the bottom left */
        width: 20px;
        height: 20px;
        border-right: 3px solid black;
        border-bottom: 3px solid black;
        box-shadow: 5px 5px 0px rgb(50, 155, 255);
        border-radius: 0 0 70% 0;
    }
    .dayCard.selected::before {
        content: "";
        position: absolute;
        bottom: -10px;
        right: -20px; /* Position at the bottom left */
        width: 20px;
        height: 20px;
        border-left: 3px solid black;
        border-bottom: 3px solid black;
        box-shadow: -5px 5px 0px rgb(50, 155, 255);
        border-radius: 0 0 0 70%;
    }
}

@media (max-width: 650px) {
    .dayCard {
        min-width: 60px;
    }
    .dayCard.selected {
        min-width: 80px;
        border-radius: 0.6em;
        border: 3px solid black;
    }
    .forecastNav {
        overflow-x: scroll;
        gap: 5px;
        justify-content: space-around;
    }
    .forecastHourTable{
        overflow-x: scroll;
    }
    .forecastHourTable ul {
        min-width: 40px;
    }
}
</style>