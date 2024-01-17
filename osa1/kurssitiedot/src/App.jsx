const Header = (props) => {
  console.log(props)
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <>
      <p>
        {props.name} {props.count}
      </p>
    </>
  )
}

const Content = (props) => {
  console.log(props.parts)
  console.log(props.exercises)
  return (
    <>
      <Part name={props.parts[0]} count={props.exercises[0]} />
      <Part name={props.parts[1]} count={props.exercises[1]} />
      <Part name={props.parts[2]} count={props.exercises[2]} />
    </>
  )
}

const Total = (props) => {
  console.log(props)
  return (
    <>
      <p>Number of exercises {props.sum}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content parts={[part1, part2, part3]} exercises={[exercises1, exercises2, exercises3]} />
      <Total sum={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App