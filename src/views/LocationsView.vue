<script setup>
import router from '@/router';
import { getPosistion } from '@/services/positioningService';
import { onMounted, ref } from 'vue';

onMounted(() => {
    locationsList.value = JSON.parse(localStorage.getItem("locations"));
    let current = locationsList.value.find(loc => {
        return loc.name === 'Current location'
    });
    if (!current) {
        current = {name: 'Current location', position: {lat: 0, long: 0}, default: false};
        locationsList.value.unshift(current)
    }

    getPosistion()
        .then(response => {
            current.position = response.position
            let index = locationsList.value.findIndex(loc => {
                return loc.name === 'Current location';
            });
            locationsList.value.splice(index, 1, current);
        })
        .catch(err => {
            let index = locationsList.value.findIndex(loc => {
                return loc.name === 'Current location';
            });
            locationsList.value.splice(index, 1);
            console.log(err)
        })
});

const location = ref({name: '', position: {lat: 0, long: 0}, default: false})
const locationsList = ref([])

function resetInput() {
    const inputs = document.querySelectorAll(".input");
    for (let input of inputs) {
        input.value = "";
    }
}


function saveLocation() {
    if (location.value.name != "") {
        locationsList.value.push({name: location.value.name, position: {lat: location.value.position.lat, long: location.value.position.long}, default: false});
        resetInput()
    }
    if (locationsList.value.find((obj) => {
        if (obj.default) {
            return true;
        }
        return false;
    }) == undefined){
        locationsList.value[0].default = true;
    }
    localStorage.setItem("locations", JSON.stringify(locationsList.value))
}

function removeLocation(e) {
    let defaultDeleted = false
    locationsList.value = locationsList.value.filter((obj) => {
        let objToDel = locationsList.value.indexOf(obj) == e.target.parentElement.id.slice(12);
        if (obj.default && objToDel) {
            defaultDeleted = true
        }
        return !objToDel
    })
    if (defaultDeleted && locationsList.value.length != 0) {
        locationsList.value[0].default = true
    }
    localStorage.setItem("locations", JSON.stringify(locationsList.value))
}

function setDefault(e) {
    for (let loc of locationsList.value) {
        if (locationsList.value.indexOf(loc) == e.target.parentElement.id.slice(12)) {
            loc.default = true;
            router.push(`/forecast/${loc.name}`)
        } else {
            loc.default = false;
        }
    }
    localStorage.setItem("locations", JSON.stringify(locationsList.value));
}
</script>

<template>
    <h2>Location</h2>
    <label>Name: <input type="text" v-model="location.name" class="input" /></label>
    <label>Lat: <input type="number" max="90" min="-90" step="0.1" size="5" v-model="location.position.lat" class="input"></label>
    <label>Long: <input type="number" max="180" min="-180" step="0.1" size="8" v-model="location.position.long" class="input"></label>
    <button @click="saveLocation">Save</button><button @click="resetInput">Reset</button>
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
                <span class="delete" @click="removeLocation" v-show="loc.name !== 'Current location'">x</span>
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