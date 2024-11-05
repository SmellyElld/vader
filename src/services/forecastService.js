export function getForecast(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=ms&timezone=auto&daily=weather_code,sunrise,sunset`
        ) .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                reject(response.json())
            }
        }) .then(data => {
            resolve(transformData(data, 1))
        });
    });
}


export function getCurrent(location){
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms&forecast_days=1`
        ) .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                reject(response.json())
            }
        }) .then(data => {
            resolve(transformData(data, 2))
        });
    });
}

/**
 * Transforms data from open metio to a more usable format
 * @param {object} data 
 * @param {int} flags 
 * 1:forecast 2:current
 * @returns 
 */
function transformData(data, flags){

    let weatherData = {};
    weatherData.position = {lat: data.latitude, long: data.longitude};
    weatherData.timezone = {offset: data.utc_offset_seconds, name: data.timezone, short: data.timezone_abbreviation};

    if (flags == 1) {
        let days = [];
        //loop for week
        for (let currentDay=0; currentDay < data.hourly.time.length / 24; currentDay++) {

            let day = {};
            day.hourly = {};
            day.precip_sum = 0;
            day.temp = {min: 0, max: 0};
            day.sun = {up: '00:00', down: '00:00'};

            //loop for day
            for (let i=1; i < 24; i++) {
                let t = currentDay*24 + i;

                day.hourly[i] = {
                    time: String(data.hourly.time[t]).split('T')[1],
                    temp: data.hourly.temperature_2m[t], 
                    apparent_temp: data.hourly.apparent_temperature[t],
                    precip: data.hourly.precipitation[t],
                    precip_prob: data.hourly.precipitation_probability[t],
                    code: data.hourly.weather_code[t],
                    wind_speed: data.hourly.wind_speed_10m[t],
                    wind_gusts: data.hourly.wind_gusts_10m[t],
                    wind_direction: data.hourly.wind_direction_10m[t],
                }

                //Get precip sum and min/max temp of the day
                day.precip_sum =+ Number(data.hourly.precipitation[t].toFixed(1))
            }

            day.date = String(data.hourly.time[currentDay*24]).split('T')[0];
            day.code = data.daily.weather_code[data.daily.time.indexOf(day.date)];
            day.temp.min = Math.min(... data.hourly.temperature_2m.slice(currentDay*24, currentDay*24 + 24));
            day.temp.max = Math.max(... data.hourly.temperature_2m.slice(currentDay*24, currentDay*24 + 24));
            day.temp.average = Number(((data.hourly.temperature_2m.slice(currentDay*24, currentDay*24 + 24).reduceRight((acc, cur) => acc + cur, 0))/24).toFixed(1));
            day.sun.up = data.daily.sunrise[data.daily.time.indexOf(day.date)];
            day.sun.down = data.daily.sunset[data.daily.time.indexOf(day.date)];

            days[currentDay] = day;
        }
        weatherData.weather = {
            days: days,
            units: {
                time: data.hourly_units['time'],
                temp: data.hourly_units['temperature_2m'],
                precip: data.hourly_units['precipitation'],
                wind_speed: data.hourly_units['wind_speed_10m'],
                wind_direction :data.hourly_units['wind_direction_10m'],
            }
        }

    } else if (flags == 2) {
        weatherData.weather = {
            time: data.current.time,
            code: data.current.weather_code,
            temp: {
                temp: data.current.temperature_2m,
                apparent_temp: data.current.apparent_temperature,
                unit: data.current_units.temperature_2m
            },
            precipitation: {
                precipitation: data.current.precipitation,
                unit: data.current_units.precipitation
            },
            wind: {
                direction: data.current.wind_direction_10m,
                direction_unit: data.current_units.wind_direction_10m,
                speed: data.current.wind_speed_10m,
                gusts: data.current.wind_gusts_10m,
                wind_speed_unit: data.current_units.wind_speed_10m
            },
            pressure: {
                pressure: data.current.pressure_msl,
                unit: data.current_units.pressure_msl, 
            },
            cloud_cover: {
                cloud_cover: data.current.cloud_cover,
                unit: data.current_units.cloud_cover
            }
        }
    }
    return weatherData
}