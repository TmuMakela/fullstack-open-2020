import React, { useState, useEffect } from 'react'
import axios from 'axios'

const COUNTRIES_URL = 'https://restcountries.eu/rest/v2/all'
const WEATHER_URL = 'http://api.weatherstack.com/current'
const API_KEY = process.env.REACT_APP_API_KEY

const Filter = ({filter, handleChange, text}) => {
  return (
    <div>
      {text}
      <input value={filter} onChange={handleChange}/>
    </div>
  )
}

const WeatherInfo = ({country}) => {
  const [weather, setWeather] = useState(undefined)
  const [location, setLocation] = useState(country.capital)

  useEffect(() => {
    axios
      .get(buildUrl(location))
      .then(response => {
        setWeather(response.data.current)
      })
  }, [])

  if (weather === undefined) {
    return (
      <div>
        <h3>No weather data available for {location}</h3>
      </div>
    )
  }
  return (
    <div>
      <h3>Weather in {location}</h3>
      <b>temperature: </b> {weather.temperature} Celsius
      <div>
        <img 
          src={weather.weather_icons[0]} 
          alt={weather.weather_descriptions[0]}
          width='50'
          height='50'>
        </img>
      </div>
      <b>wind: </b> {`${weather.wind_speed} km/h direction ${weather.wind_dir}`}
    </div>
  )
}

const buildUrl = (location) => {
  const url = `${WEATHER_URL}?access_key=${API_KEY}&query=${location}`
  return url
}

const CountryInfo = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <li>capital {country.capital}</li>
      <li>population {country.population}</li>

      <h3>languages</h3>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>

      <img 
        src={country.flag} 
        alt={`Flag of ${country.name}`} 
        width='100' 
        height='100'>
      </img>

      <WeatherInfo country={country}></WeatherInfo>
    </div>
  )
}

const CountryEntry = ({country, setCountryFilter}) => {
  return (
    <div>
      {country.name}
      <button onClick={() => setCountryFilter(country.name)}>show</button>
    </div>
  )
}

const View = ({countries, setCountryFilter}) => {
  if (countries.length > 10) {
    return (<p>Too many matches, specify another filter</p>)
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => <CountryEntry key={country.name} country={country} setCountryFilter={setCountryFilter}></CountryEntry>)}
      </div>
    )
  } else if (countries.length === 1) {
    return <CountryInfo country={countries[0]}></CountryInfo>
  } else {
    return (<></>)
  }
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    axios
      .get(COUNTRIES_URL)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
  }

  const filteredCountries = !countryFilter || countryFilter.trim().length === 0 
    ? countries
    : countries.filter(country => country.name.toUpperCase().includes(countryFilter.toUpperCase()))

  return (
    <div>
      <Filter 
        filter={countryFilter} 
        handleChange={handleCountryFilterChange}
        text='find countries: '>
      </Filter>

      <View 
        countries={filteredCountries} 
        setCountryFilter={setCountryFilter}>
      </View>
    </div>
  )
}

export default App