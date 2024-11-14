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
            resolve(data.name ?? data.display_name ?? 'okänd')
        });
    });
}