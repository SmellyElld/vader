export function getForecast(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`
        ) .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                reject(response.json())
            }
        }) .then(data => {
            resolve(transformData(data))
        });
    });
}

function transformData(data){
    let wheaterData = {};
    wheaterData.position = {lat: data.latitude, long: data.longitude};
    wheaterData.timezone = {offset: data.utc_offset_seconds, name: data.timezone, short: data.timezone_abbreviation};

    wheaterData.weather = [];
    for (let i=0; i < data.daily.time.length; i++) {
        let dayData = {
            date: data.daily.time[i],
            code: data.daily.weather_code[i],
            temp: {
                max: data.daily.temperature_2m_max[i],
                min: data.daily.temperature_2m_min[i],
                unit: data.daily_units.temperature_2m_max
            },
            precipitation: {
                sum: data.daily.precipitation_sum[i],
                probability: data.daily.precipitation_probability_max[i],
                unit: data.daily_units.precipitation_sum
            },
            wind: {
                direction: data.daily.wind_direction_10m_dominant[i],
                direction_unit: data.daily_units.wind_direction_10m_dominant,
                speed: data.daily.wind_speed_10m_max[i],
                gusts: data.daily.wind_gusts_10m_max[i],
                unit: data.daily_units.wind_speed_10m_max
            },
            sun: {
                rise: data.daily.sunrise[i],
                set: data.daily.sunset[i],
                time_type: data.daily_units.sunrise
            }
        };
        wheaterData.weather.push(dayData);
    }
    return wheaterData
}