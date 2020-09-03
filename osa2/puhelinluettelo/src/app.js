import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({person}) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => <Person key={person.name} person={person}></Person>)}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: 
        <input value={props.newName} onChange={props.handleNewNameChange}/>
      </div>
      <div>
        number: 
        <input value={props.newNumber} onChange={props.handleNewNumberChange}/>
      </div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Filter = ({nameFilter, handleNameFilterChange}) => {
  return (
    <div>
      filter shown with:
      <input value={nameFilter} onChange={handleNameFilterChange}/>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const filteredPersons = !nameFilter || nameFilter.trim().length === 0 
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(nameFilter.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        nameFilter={nameFilter} 
        handleNameFilterChange={handleNameFilterChange}>
      </Filter>

      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNewNameChange={handleNewNameChange}
        newNumber={newNumber}
        handleNewNumberChange={handleNewNumberChange}>
      </PersonForm>
      
      <h3>Numbers</h3>
      <Persons persons={filteredPersons}></Persons>
    </div>
  )
}

export default App