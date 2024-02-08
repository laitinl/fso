import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => {
        console.log('Get request fulfilled')
        return response.data
    })
}

const getWeather = (country) => {
    const [lat, lng] = country.latlng
    const request = axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${api_key}`)
    return request.then(response => {
        console.log('Weather data request fulfilled')
        return response.data
    })
        .catch(error => {
            console.log('API call failed:', error.message)
        })
}

export default { getAll, getWeather }