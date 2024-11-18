//Gets a geolocation from nomination openstreetmap from coordinates 
export function getGeolocationName(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://nominatim.openstreetmap.org/reverse.php?lat=${location.lat}&lon=${location.long}&zoom=10&format=jsonv2`
        ) .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                reject(response.json())
            }
        }) .then(data => {
            resolve(makeString(data))
        });
    });
}

//Makes a string from nomination data
function makeString(data) {
    if (!data.address) {
        return 'Okänd'
    }

    let locString = '';

    locString += data.address.city ?? data.address.town ?? data.address.municipality ?? '';
    if (locString.length !== 0) {
        locString += ', ';
    }
    let locStringZoom2 = data.address.state ?? data.address.county ?? data.address.state_district ?? '';
    locString += locStringZoom2
    if (locStringZoom2.length !== 0) {
        locString += ', ';
    }
    locString += data.address.country ?? 'Okänd';

    return locString;
}