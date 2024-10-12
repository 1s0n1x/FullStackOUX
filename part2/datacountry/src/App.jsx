import { useState, useEffect } from 'react'
import React from 'react'
import Axios from 'axios'

import "./App.css"


const getCountries = () => {
    let response = Axios.get("https://studies.cs.helsinki.fi/restcountries/api/all");
    return response;
}
const getCountry = (name) => {
    let response =  Axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
    return response;
}
const getWeather = (country) => {
    let key = import.meta.env.VITE_SOME_KEY;
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${key}&units=metric`

    return Axios.get(api)
}


const CountryElement = (props) => {
    const { name, setFunc } = props;

    return (
        <tr>
            <td>{name}</td>
            <td><button onClick={() => setFunc(name)}>View</button></td>
        </tr>
    )
}
const CountryRender = (props) => {
    const { dataCountry } = props;

    console.log(dataCountry)
    return(
        <div>
            <h1>{dataCountry.name.common}</h1>
            <p>
                Capital: {Object.keys(dataCountry).includes("capital") ? dataCountry.capital[0] : "Unknown"} <br />
                Area: {Object.keys(dataCountry).includes("area") ? dataCountry.area : "Unknown"}
            </p>
            <h3>Languages:</h3>
            <ul>
                {Object.keys(dataCountry).includes("languages") ? Object.keys(dataCountry.languages).map((e) => <li key={e}>{dataCountry.languages[e]}</li>) : "Unknown"}
            </ul>
            <img src={dataCountry.flags.png} alt={`Flag of ${dataCountry.name.common}`} />
            {dataCountry.weatherData.response == false
                ? <div>
                    <h2>Weather in {dataCountry.name.common}</h2>
                    <p>{dataCountry.weatherData.message}</p>
                  </div>
                : <div>
                    <h2>Weather in {dataCountry.name.common}</h2>
                    <p>Temperature: {dataCountry.weatherData.main.temp} Celcius</p>
                    <img src={`https://openweathermap.org/img/wn/${dataCountry.weatherData.weather[0].icon}@2x.png`} alt="icon" />
                    <p>Wind: {dataCountry.weatherData.wind.speed}</p>
                  </div>   
            }
        </div>
    )
}


const Search = (props) => {
    const { searchUpdater } = props;

    return (
        <div>
          Find the country:  <input onChange={(e) => searchUpdater(e.target.value.toLowerCase())} />
        </div>
    )
}
const CountryList = (props) => {
    const { search, list } = props;
    const [ dataView, setView ] = useState({ country: "", searchVal: "", countryData: {} });


    const execRender = (name) => {
        getCountry(name)
            .then((e) => {
                getWeather(name)
                    .then((a) => {
                        setView({ country: name, searchVal: search, countryData: { ...e.data, weatherData: a.data } })
                    })
                    .catch(() => {
                        setView({ country: name, searchVal: search, countryData: { ...e.data, weatherData: { response: false, message: "No weather information available." } } })
                    })
            })
    }
    const arrayDisplay = search.split(" ").join("").length !== 0
        ? list.filter((e) => e.name.toLowerCase().includes(search))
        : list;

    if(dataView.searchVal !== search || dataView.country === ""){
        if(arrayDisplay.length > 10){
            //mensaje generico de muchos resultado y auto-ocultado, valor=0
            return (
                <div className={search.split(" ").join("").length == 0 ? "invisible" : ""}>
                    <p>Many country matches, be more specific in the name of the country you are looking for.</p>
                </div>
            )
        } else {
            //renderizacion de botones y asignacion de funcion
            return(
                <div>
                    { arrayDisplay.length == 1
                        ? execRender(arrayDisplay[0].name)
                        : <table>
                            <tbody>
                                {arrayDisplay.map((e) => <CountryElement key={e.key} name={e.name} setFunc={() => execRender(e.name)} />)}
                            </tbody>
                          </table>
                    }
                </div>
            )
        }
    } else {
        return (<CountryRender dataCountry={dataView.countryData} />)
    }
}


const App = () => {
    const [ countries, setCountries ] = useState([]);
    const [ searchVal, setSearch ] = useState("");
    useEffect(() => {
        getCountries()
            .then((e) => { setCountries(e.data.map((e) => { return { name: e.name.common, key: e.altSpellings[0] } })) })
    }, []);

  return (
    <div>
        <Search searchUpdater={setSearch} />
        <CountryList search={searchVal} list={countries} />
    </div>
  )
}

export default App