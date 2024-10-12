import { useState, useEffect } from 'react'
import React from 'react'
import Axios from 'axios'

import "./App.css"


const getCountries = () => {
  const listCountry = Axios.get("https://studies.cs.helsinki.fi/restcountries/api/all");
  return listCountry;
}


const Country = (props) => {
  const { setFunc, name } = props;
  return (
    <tr>
      <td>{name}</td>
      <td><button onClick={() => setFunc(name)}>View</button></td>
    </tr>
  )
}

const CountryRender = (props) => {
  const { countryData } = props;
  console.log(countryData)

  return(
    <div>
      <h1>{countryData.name.common}</h1>
      <p>
        capital: {countryData.capital[0]}<br />
        area: {countryData.area}
      </p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(countryData.languages).map((e) => <li key={e}>{countryData.languages[e]}</li>)}
      </ul>
      <img src={countryData.flags.png} alt={`Flag of ${countryData.name.common}`} />
    </div>
  )
}


const Search = (props) => {
  const { searchUpdater } = props;

  return (
    <div>
      Find the country:  <input onChange={(e) => searchUpdater(e.target.value)} />
    </div>
  )
}

const Result = (props) => {
  console.log("reload")

  const { countryList, search } = props;
  const [ dataView, setView ] = useState({ searchValue: "", countryView: "" });

  const changeView = (country) => {
    console.log(countryView)
    setView({ searchValue: search, countryView: country })
  }

  console.log(countryList.find((e) => e.name === dataView.countryView))

  if(dataView.searchValue !== search || dataView.countryView === ""){
    let arrayDisplay = search.split(" ").join("").length == 0
      ? countryList
      : countryList.filter((e) => e.name.common.toLowerCase().includes(search.toLowerCase()));

    if(arrayDisplay.length > 10){
      return(
        <div className={search.split(" ").join("").length == 0 ? "invisible" : ""}>
          <p>Many country matches, be more specific in the name of the country you are looking for.</p>
        </div>
      )
    } else {
      return(
        <div>
          {arrayDisplay.length == 1
            ? <CountryRender countryData={arrayDisplay[0]} />
            : <table>
                <tbody>
                  {arrayDisplay.map((e) => <Country key={e.altSpellings[0]} name={e.name.common} setFunc={() => changeView(e.name.common.toLowerCase())} />)}
                </tbody>
              </table>}
        </div>
      )
    }
  }

  return (
    <div>
      <CountryRender countryData={countryList.filter((e) => e.name.common.toLowerCase().includes(dataView.searchValue.toLowerCase()))} />
    </div>
  )
}


const App = () => {
  const [ countries, setCountries ] = useState([]);
  const [ searchVal, setSearch ] = useState("");
  useEffect(() => {
    getCountries()
      .then((e) => setCountries(e.data));
  }, [ countries ]);

  return (
    <div>
      <Search searchUpdater={setSearch} />
      <Result countryList={countries} search={searchVal} />
    </div>
  )
}

export default App