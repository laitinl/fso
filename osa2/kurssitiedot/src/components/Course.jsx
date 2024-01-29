const Course = ({ course }) => {
    console.log(course)
    return (
        <div>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

const Header = (props) => {
    console.log(props)
    return (
        <>
            <h1>{props.course.name}</h1>
        </>
    )
}

const Part = (props) => {
    console.log(props)
    return (
        <>
            <p>
                {props.part.name} {props.part.exercises}
            </p>
        </>
    )
}

const Content = (props) => {
    console.log(props)
    return (
        <>
            {props.parts.map(part =>
                <Part key={part.id} part={part} />)}
        </>
    )
}

const Total = (props) => {
    console.log(props)
    const total = props.parts.reduce((acc, current) => acc + current.exercises, 0)
    return (
        <>
            <b>total of {total} exercises</b>
        </>
    )
}

export default Course