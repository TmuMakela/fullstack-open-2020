import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value, type}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {type}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const avg = (good - bad) / all
  const pos = good / all
  if (all === 0) return <p>No feedback given</p>
  return (
    <table>
      <tbody>
        <StatisticLine text={'good'} value={good}></StatisticLine>
        <StatisticLine text={'neutral'} value={neutral}></StatisticLine>
        <StatisticLine text={'bad'} value={bad}></StatisticLine>
        <StatisticLine text={'all'} value={all}></StatisticLine>
        <StatisticLine text={'average'} value={avg}></StatisticLine>
        <StatisticLine text={'positive'} value={pos} type={'%'}></StatisticLine>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good'></Button>
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral'></Button>
      <Button handleClick={() => setBad(bad + 1)} text='bad'></Button>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))