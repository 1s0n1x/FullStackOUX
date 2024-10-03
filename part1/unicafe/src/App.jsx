import React, { useState } from 'react'


const StatisticLine = (props) => {
  const { text, value } = props;

  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad } = props;
  const total = good + neutral + bad;

  if(total == 0){
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given.</p>
      </div>
    )
  }

  return(
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={total} />
          <StatisticLine text="Average" value={total / 3} />
          <StatisticLine text="Positive" value={(good / total) * 100 + "%"} />
        </tbody>
      </table>
    </div>
  );
}


const App = () => {
  const [ goodVal, setGood ] = useState(0);
  const [ neutralVal, setNeutral ] = useState(0);
  const [ badVal, setBad ] = useState(0);

  return (
    <div>
      <h1>Give FeedBack</h1>

      <button onClick={() => setGood(goodVal + 1)}>Good</button>
      <button onClick={() => setNeutral(neutralVal + 1)}>Neutral</button>
      <button onClick={() => setBad(badVal + 1)}>Bad</button>

      <Statistics good={goodVal} neutral={neutralVal} bad={badVal} />
    </div>
  )
}

export default App
