import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      filter shown with
      <input
        value={value}
        onChange={handleChange} />
    </div>
  )
}

const PersonForm = ({ name, number, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (<form onSubmit={handleSubmit}>
    <div>
      name: <input
        value={name}
        onChange={handleNameChange} />
    </div>
    <div>
      number: <input
        value={number}
        onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const PersonLine = ({ person, handleDelete }) => {
  return (
    <form onSubmit={(e) => handleDelete(e, person.id)}>
      <div>
        {person.name} {person.number} {'\t'}
        <button type="submit">delete</button>
      </div>
    </form>
  )
}

const Persons = ({ list, handleDelete }) => {
  return (
    <>
      {list.map(person => <PersonLine key={person.name} person={person} handleDelete={handleDelete} />)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filt, setFilter] = useState('')

  useEffect(() => {
    console.log('effect activated')
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = {
          name: newName,
          number: newNumber
        }
        const id = persons
          .filter(person => person.name === newName)
          .map(person => person.id)[0]
        personService
          .update(id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (event, id) => {
    event.preventDefault()
    const name = persons
      .filter(person => person.id === id)
      .map(person => person.name)
    if (window.confirm(`Delete ${name}`)) {
      console.log(`Deleting person with id ${id}`)
      personService
        .remove(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filt.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filt} handleChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={addPerson} />
      <h3>Numbers</h3>
      <Persons list={personsToShow} handleDelete={deletePerson} />
    </div>
  )

}

export default App
