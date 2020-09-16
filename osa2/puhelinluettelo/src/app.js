import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({person, removePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id, person.name)}>delete</button>
    </div>
  )
}

const Persons = ({persons, removePerson}) => {
  return (
    <div>
      {persons.map(person => 
        <Person 
          key={person.name} 
          person={person} 
          removePerson={removePerson}>
        </Person>
      )}
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

const Notification = ({notification}) => {
  if (notification === undefined) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.text}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(undefined);

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person.name === newName)
        const updatedPerson = {...oldPerson, number: newNumber}
        const updateId = updatedPerson.id
        
        personService
          .update(updateId, updatedPerson)
          .then(response => response.data)
          .then(returnedPerson => {
            if (!returnedPerson) {
              setNotification({text: `Information of ${newName} has already been removed from server`, type: 'error'})
              setTimeout(() => setNotification(undefined), 2000)
              personService.getAll().then(response => setPersons(response.data))
              return
            }
            setPersons(persons.map(person => person.id !== updateId ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({text: `Number updated for ${newName}`, type: 'success'})
            setTimeout(() => setNotification(undefined), 2000)
          })
          .catch(error => {
            const msg = error.response.data.error
            console.log(msg)
            setNotification({text: "Person validation failed: " + msg, type: 'error'})
            setTimeout(() => setNotification(undefined), 2000)
          })
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification({text: `Added ${newName}`, type: 'success'})
        setTimeout(() => setNotification(undefined), 2000)
      })
      .catch(error => {
        const msg = error.response.data.error
        console.log(msg)
        setNotification({text: "Person validation failed: " + msg, type: 'error'})
        setTimeout(() => setNotification(undefined), 2000)
      })
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => personService.getAll())
        .then(response => {
          setPersons(response.data)
          setNotification({text: `Deleted ${name}`, type: 'success'})
          setTimeout(() => setNotification(undefined), 2000)
        })
        .catch(error => console.error(error))
    }
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
      <Notification notification={notification}></Notification>
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
      <Persons 
        persons={filteredPersons} 
        removePerson={removePerson}>
      </Persons>
    </div>
  )
}

export default App