import React, { useState, useEffect } from 'react'
import Axios from 'axios'


const getCountries = () => {
  const countries = Axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`);
  return countries;
}

const getCountry = (name) => {
  const country = Axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
  return country;
}


const App = () => {
  const [ search, setSearch ] = useState("");
  const [ countries, setCountries ] = useState([]);
  useEffect(() => {
    getCountries()
      .then((list) => setCountries(list.data));
  }, [])

  let arrayDisplay = search.split(" ").join("").length == 0
    ? countries
    : countries.filter((e) => e.name.common.toLowerCase().includes(search.toLowerCase()));

  console.log(arrayDisplay)

  return (
    <div>
      <div>
        Find the country: <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {
        arrayDisplay.length == 1
          ? (
            <div>
              <h1>{arrayDisplay[0].name.common}</h1>
              <p>
                capital {arrayDisplay[0].capital[0]} <br />
                area {arrayDisplay[0].area}
              </p>
              <h3>Languages:</h3>
              <ul>
                {Object.keys(arrayDisplay[0].languages).map(e => <li>{arrayDisplay[0].languages[e]}</li>)}
              </ul>
            </div>
          )
          :(
            <table>
              <tbody>
                {arrayDisplay.map((e) => <tr>
                  <td>{e.name.common}</td>
                  <td><button>View</button></td>
                </tr>)}
              </tbody>
            </table>
          )
      }
    </div>
  )
}

export default App