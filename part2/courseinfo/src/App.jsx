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
        partsFormatted.push(<Part key={part.id} part={part.name} exercise={part.exercises}/>)
    }

    return (
        <div>
            {partsFormatted}
        </div>
    )
}

const Total = (props) => {
    const { amounts } = props;
    const total = amounts.reduce((accumulator, currentValue) => {
        if(typeof accumulator === 'object') {
            return accumulator.exercises + currentValue.exercises;
        }
        return accumulator + currentValue.exercises;
    });

    return (
        <div>
            <b>Total of {total} exercises</b>
        </div>
    )
}


const Course = (props) => {
    const { course } = props;

    return(
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total amounts={course.parts} />
        </div>
    )
}


const App = () => {
    const coursesFormatted = [];
    const courses = [
        {
            id: 1,
            name: 'Half Stack application development',
            parts: [
                {
                    name: 'Fundamentals of React',
                    exercises: 10,
                    id: 1
                },
                {
                    name: 'Using props to pass data',
                    exercises: 7,
                    id: 2
                },
                {
                    name: 'State of a component',
                    exercises: 14,
                    id: 3
                },
                {
                    name: 'Redux',
                    exercises: 11,
                    id: 4
                }
            ]
        },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    name: 'Routing',
                    exercises: 3,
                    id: 1
                },
                {
                    name: 'Middlewares',
                    exercises: 7,
                    id: 2
                }
            ]
        }
    ];

    for(let course of courses){
        coursesFormatted.push(
            <Course key={course.id} course={course} />
        )
    }

    return(
        <div>
            {coursesFormatted}
        </div>
    );
}

export default App