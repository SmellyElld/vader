export function getForecast(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&wind_speed_unit=ms&timezone=auto`
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
 * 
 * @param {object} data 
 * @param {int} flags 
 * 1:forecast 2:current
 * @returns 
 */
function transformData(data, flags){
    let wheaterData = {};
    wheaterData.position = {lat: data.latitude, long: data.longitude};
    wheaterData.timezone = {offset: data.utc_offset_seconds, name: data.timezone, short: data.timezone_abbreviation};

    if (flags == 1) {
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
    } else if (flags == 2) {
        wheaterData.wheater = {
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
    return wheaterData
}

