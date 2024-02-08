import { useState, useEffect } from 'react'
import countyService from './services/countries'

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      find countries{' '}
      <input value={value} onChange={handleChange} />
    </div>
  )
}

const Info = ({ countries, handleClick }) => {
  if (countries.length > 10) {
    return <p>Too many mathces, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => <CountrySimple key={country.name.common} country={country} handleClick={() => handleClick(country)} />)}
      </div>
    )
  }

  return null
}

const CountrySimple = ({ country, handleClick }) => {
  return (
    <div>
      {country.name.common} {' '}
      <button onClick={handleClick}>show</button>
    </div>
  )
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        capital {country.capital}
      </div>
      <div>
        area {country.area}
      </div>
      <b>languages:</b>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} width='200' />
    </div>
  )
}

const Weather = ({ weather, country }) => {
  if (!weather || !country) {
    return null
  }

  return (
    <div>
      <b>Weather in {country.capital}</b>
      <p>temperature {weather.current.temp} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.current.weather.icon}@2x.png`} width='50' />
      <p>wind {weather.current.wind_speed} m/s</p>
    </div>
  )
}

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLocaleLowerCase()))

  useEffect(() => {
    countyService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    if (country) {
      countyService
        .getWeather(country)
        .then(newWeather => {
          setWeather(newWeather)
        })
    }
  }, [country])

  const handleFilterChange = (event) => {
    console.log(`Handle filter change. ${event.target.value}`)
    const newFiltered = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLocaleLowerCase()))
    setFilter(event.target.value)
    setCountry(newFiltered.length === 1 ? newFiltered[0] : null)
  }

  const handleClick = (country) => {
    setCountry(country)
  }

  if (countries.length === 0) {
    return null
  }

  return (
    <div>
      <Filter value={filter} handleChange={handleFilterChange} />
      <Info countries={filteredCountries} handleClick={handleClick} />
      <Country country={country} />
      <Weather weather={weather} country={country} />
    </div>
  )
}

export default App
