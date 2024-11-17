<script setup>
import router from '@/router';
import { getPosistion } from '@/services/positioningService';
import { getGeolocationName } from '@/services/nameService';
import { onMounted, ref, toRaw } from 'vue';
import L from 'leaflet';

const map = ref();

onMounted(() => {
    //Leaflet map
    map.value = L.map('map').setView([0, 0], 8.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);

    let markers = L.layerGroup().addTo(toRaw(map.value));

    map.value.on('click', (e) => {
        markers.clearLayers()
        const marker = L.marker(e.latlng).addTo(toRaw(map.value));
        markers.addLayer(marker)
        location.value.position = {lat: Number(e.latlng.lat), long: Number(e.latlng.lng)}
        getGeolocationName({lat: Number(e.latlng.lat), long: Number(e.latlng.lng)})
            .then((name) => {
                location.value.name = name
                marker.bindPopup(name).openPopup();
            })
            .catch(err => {
                console.log(err);
            });
    })

    //Find or create current location and add to locationsList
    locationsList.value = JSON.parse(localStorage.getItem("locations"));
    let current = locationsList.value.find(loc => {
        return loc.name === 'Current location'
    });
    if (!current) {
        current = {name: 'Current location', position: {lat: 0, long: 0}, default: false};
        locationsList.value.unshift(current)
    }

    let defaultLoc = locationsList.value.find(loc => {
        return loc.default === true;
    });

    setMap(defaultLoc.position, defaultLoc.name);


    //gets current location
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

function setMap(location) {
    map.value.setView([location.lat, location.long], 9);
}

function saveLocation() {
    if (location.value.name != "") {
        locationsList.value.push({name: location.value.name, position: {lat: location.value.position.lat, long: location.value.position.long}, default: false});
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
    <div id="map"></div>
    <button @click="saveLocation">Lägg till plats</button>
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
#map {
    height: 400px; 
}
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