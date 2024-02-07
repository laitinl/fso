import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

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

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filt, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
            setNotification(`Updated the number of ${newName}`)
            setTimeout(() => setNotification(null), 5000)
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Updating the number of ${newName} failed`)
            setTimeout(() => setErrorMessage(null), 5000)
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
          setNotification(`Added ${newName}`)
          setTimeout(() => setNotification(null), 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage('Adding new contact failed')
          setTimeout(() => setErrorMessage(null), 5000)
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
          setNotification(`Deleted ${deletedPerson.name}`)
          setTimeout(() => setNotification(null), 5000)
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
        .catch(error => {
          setErrorMessage(`Information of ${name} has already been removed from server`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filt.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} className={'notification'} />
      <Notification message={errorMessage} className={'error'} />
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
