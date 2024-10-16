<script setup>
import { ref } from 'vue';

const location = ref({name: '', position: {lat: 0, long: 0}, default: false})
const locationsList = ref([
    {name: 'Mariehamn', position: {lat: 60.0, long: 20.0}, default:false},
    {name: 'Stockholm', position: {lat: 59.32, long: 18.32}, default: true},
    {name: 'London', position: {lat: 51.5, long: -0.1}, default: false},
    {name: 'Cape Town', position: {lat: -34, long: 18.5}, default: false}
])

function resetInput() {
    const inputs = document.querySelectorAll(".input");
    for (let input of inputs) {
        input.value = "";
    }
}

function saveLocation() {
    locationsList.value.push({name: location.value.name, position: {lat: location.value.position.lat, long: location.value.position.long}, default: false});
}

function removeLocation(e) {
    locationsList.value = locationsList.value.filter((obj) => {
        let objToDel = locationsList.value.indexOf(obj) == e.target.parentElement.id.slice(12);
        if (obj.default && objToDel) {
            locationsList.value[0].default = true
        }
        return !objToDel
    })
}

function setDefault(e) {
    for (let loc of locationsList.value) {
        if (locationsList.value.indexOf(loc) == e.target.parentElement.id.slice(12)) {
            loc.default = true;
        } else {
            loc.default = false;
        }
    }
}
</script>

<template>
    <h2>Location</h2>
    <label>Name: <input type="text" v-model="location.name" class="input" /></label>
    <label>Lat: <input type="number" max="90" min="-90" step="0.1" size="5" v-model="location.position.lat" class="input"></label>
    <label>Long: <input type="number" max="180" min="-180" step="0.1" size="8" v-model="location.position.long" class="input"></label>
    <button @click="saveLocation()">Save</button><button @click="resetInput">Reset</button>
    <hr>
    <h3>List</h3>
        <ul id="locationList">
            <li v-for="loc in locationsList" :key="loc" :class="loc.default ? 'default':''" :id="'locationItem' + locationsList.indexOf(loc)">
                <span @click="setDefault">
                    {{ loc.name }},
                    ( {{ Math.abs(loc.position.lat).toFixed(2) }}°{{ loc.position.lat > 0 ? 'N' : 'S' }}
                    {{ Math.abs(loc.position.long).toFixed(2) }}°{{ loc.position.long > 0 ? 'E' : 'W'}}
                    )
                </span>
                <span class="delete" @click="removeLocation">x</span>
            </li>
        </ul>
</template>

<style scoped>
label {
    display: block;
    width: 15em;
    padding-top: 0.5em;
}

.default span {
    font-weight: bold;
}
.delete {
    color: red;
}
.delete:hover {
    background-color: brown;
    cursor: pointer;
}
</style>