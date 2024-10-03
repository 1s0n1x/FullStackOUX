import React, { useState } from 'react'

const FavAnecdote = (props) => {
  const { anecdotes, votes } = props;

  const dataFav = {
    anecdote: "",
    votes: 0
  }

  for(let i=0; i < anecdotes.length; i++) {
    if(votes[i] > dataFav.votes){
      dataFav.anecdote = anecdotes[i];
      dataFav.votes = votes[i];
    }
  }

  if(dataFav.votes == 0){
    return(
      <div>
        <h1>Anecdote with most votes</h1>
        There are no votes in anecdotes.
      </div>
    );
  }

  return(
    <div>
      <h1>Anecdote with most votes</h1>
      {dataFav.anecdote}<br />
      has {dataFav.votes} votes.
    </div>
  );
};

const App = () => {
  const [ selected, setSelection ] = useState(0);
  const [ votes, setVotes ] = useState({
    0: 0, 1: 0, 
    2: 0, 3: 0,
    4: 0, 5: 0,
    6: 0, 7: 0
  });

  const cVotes = { ...votes };
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const changeAnecdotes = () => {
    setSelection(Math.floor(Math.random() * anecdotes.length));
  };
  const addVote = () => {
    cVotes[selected] = cVotes[selected] + 1;
    setVotes(cVotes);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} <br />
      has {votes[selected]} votes. <br />
      
      <button onClick={addVote}>+1</button>
      <button onClick={changeAnecdotes}>Change</button>
      <FavAnecdote anecdotes={anecdotes} votes={cVotes} />
    </div>
  )
};

export default App;