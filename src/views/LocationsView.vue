<script setup>
import router from '@/router';
import { getPosistion } from '@/services/positioningService';
import { getGeolocationName } from '@/services/nameService';
import { onMounted, ref, toRaw } from 'vue';
import L from 'leaflet';

const map = ref();
const location = ref({name: '', position: {lat: 0, long: 0}, default: false})
const locationsList = ref([])

onMounted(() => {
    //Leaflet map
    map.value = L.map('map').setView([0, 0], 8.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);

    //Place marker on map and remove any other
    let markers = L.layerGroup().addTo(toRaw(map.value));
    map.value.on('click', (e) => {
        markers.clearLayers()
        const marker = L.marker(e.latlng).addTo(toRaw(map.value));
        markers.addLayer(marker);
        location.value.position = {lat: Number(e.latlng.lat), long: Number(e.latlng.lng)};
        //Get geolocation name for popup and open it
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
        return loc.name === 'Nuvarande position'
    });
    if (!current) {
        current = {name: 'Nuvarande position', position: {lat: 0, long: 0}, default: false};
        locationsList.value.unshift(current)
    }

    let defaultLoc = locationsList.value.find(loc => {
        return loc.default === true;
    });

    map.value.setView([defaultLoc.position.lat, defaultLoc.position.long], 9);

    //gets current location
    getPosistion()
        .then(response => {
            current.position = response.position
            let index = locationsList.value.findIndex(loc => {
                return loc.name === 'Nuvarande position';
            });
            locationsList.value.splice(index, 1, current);
        })
        .catch(err => {
            let index = locationsList.value.findIndex(loc => {
                return loc.name === 'Nuvarande position';
            });
            locationsList.value.splice(index, 1);
            console.log(err)
        })
});

//Saves a location to list and local storage, cannot be empty
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

//Remove a location from list and local storage with the help of element id
function removeLocation(e) {
    console.log(e.target.parentElement.parentElement.id);
    let defaultDeleted = false
    locationsList.value = locationsList.value.filter((obj) => {
        let objToDel = locationsList.value.indexOf(obj) == e.target.parentElement.parentElement.id.slice(12);
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

//Sets default location in list and localstorage with the help of element id
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
    <div id="mapContainer">
        <div id="map"></div>
        <button @click="saveLocation" id="addButton">Lägg till plats</button>
    </div>
    <ul id="locationList">
        <li v-for="loc in locationsList" :key="loc" :class="loc.default ? 'default':''" :id="'locationItem' + locationsList.indexOf(loc)" class="location">
            <span @click="setDefault">
                {{ loc.name }},
                ( {{ Math.abs(loc.position.lat).toFixed(2) }}°{{ loc.position.lat > 0 ? 'N' : 'S' }}
                {{ Math.abs(loc.position.long).toFixed(2) }}°{{ loc.position.long > 0 ? 'E' : 'W'}}
                )
            </span>
            <span class="delete" @click="removeLocation" v-show="loc.name !== 'Nuvarande position'"><img src="@/assets/icons/remove.svg" style="width: inherit; height: inherit;"></span>
        </li>
    </ul>
</template>

<style scoped>
#map {
    height: 400px;
    box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.222);
    border-radius: 10px;
}
#addButton {
    justify-content: center;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 20px;
    border: none;
    border-radius: 6px;
    padding: 15px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    color: #000;
    display: inline-flex;
    align-items: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    background: linear-gradient(45deg, rgb(192, 241, 255), rgb(254, 255, 255));
}
#addButton:hover {
    background: linear-gradient(45deg, rgb(153, 233, 255), rgb(254, 255, 255));
}
label {
    display: block;
    width: 15em;
    padding-top: 0.5em;
}
#locationList {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 5px;
}
.location {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(-10deg, rgb(175, 235, 255), rgb(254, 255, 255));
    padding: 13px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 3px 3px 5px rgba(160, 160, 160, 0.233);
}
.default {
    border: solid black 3px;
    background: linear-gradient(-20deg, rgb(50, 155, 255), rgb(192, 241, 255) 30%);
    padding-top: 16px;
    padding-bottom: 16px;
}
.default span {
    font-weight: 600;
    font-size: medium;
}
.delete {
    width: 20px;
    height: 20px;
    color: rgb(255, 0, 0);
    border-radius: 2px;
}
.delete:hover {
    cursor: pointer;
    background-color: rgb(255, 0, 0);
}
@media (max-width: 650px) {
    #map {
        height: 600px;
        border-radius: 0px;
    }
}
</style>