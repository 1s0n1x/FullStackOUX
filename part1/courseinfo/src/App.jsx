import React from 'react'


const Part = (props) => {
    return (
        <div>
            <p>{props.part} {props.exercise}</p>
        </div>
    )
}

const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Content = (props) => {
    let partsFormatted = [];

    for(let part of props.parts) {
        partsFormatted.push(<Part key={part.exercises} part={part.name} exercise={part.exercises}/>)
    }

    return (
        <div>
            {partsFormatted}
        </div>
    )
}

const Total = (props) => {
    let total = 0;

    for(let a of props.amounts){
        total = total + a.exercises;
    }

    return (
        <div>
            <p>Number of Exercises: {total}</p>
        </div>
    )
}


const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total amounts={course.parts} />
        </div>
    )
}

export default App