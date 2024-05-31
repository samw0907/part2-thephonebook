import { useState, useEffect } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import Addcontact from './components/Addcontact'
import Notification from './components/Notification'
import contactService from './services/contacts'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '0401586955', id: 0},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 1 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 2 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 3 }
  ])
  const [newName, setNewName] = useState('enter name')
  const [newNumber, setNewNumber] = useState('enter number')
  const [nameSearch, setNameSearch] = useState('search')
  const [notification, setNotification] = useState({message: null, type: ''})

  useEffect(() => {
    contactService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()
    console.log('add button clicked', event.target)

    const existingContact = persons.find(person => person.name === newName)
      if (existingContact) {
       const confirmUpdate = window.confirm(`${existingContact.name} is already added to the phonebook, replace the old number with a new one?`)
          if (confirmUpdate) {
            console.log(existingContact.id)
            const updatedContact = { ...existingContact, number: newNumber}
            console.log(updatedContact)
            contactService.update(existingContact.id, updatedContact)
              .then(returnedContact => {
                setPersons(persons.map(person => person.id !== existingContact.id ? person : returnedContact))
                setNotification({message: `Updated details for ${returnedContact.name}`, type: 'success'})
                setTimeout(() => {
                  setNotification({message: null, type: ''})
                }, 5000)
                setNewName('')
                setNewNumber('')
              })
              .catch(error => {
                setNotification({message: `Information of ${existingContact.name} has already been removed from the server`, type: 'error'});
                setTimeout(() => {
                  setNotification({message: null, type: ''});
                }, 5000);
              });
          }
    } else {

    const person = {
      name: newName,
      number: newNumber,
      id: Date.now()
    }

    setPersons(persons.concat(person))
    setNewName('')
    setNewNumber('')

    contactService
      .create(person)
      .then(returnedPersons => {
        setPersons(persons.concat(returnedPersons))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Added ${newName}`, type: 'success'})
        setTimeout(() => {
        setNotification({message: null, type: ''})
        }, 5000)
      })
    }
  }

  const checkName = (event) => {
    event.preventDefault()
    console.log('search entered', event.target)
    const filter = persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))
    console.log(filter)
    setPersons(filter)
  }

  const handleNameInput = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
 }

 const handleCheckName = (event) => {
  console.log(event.target.value)
  setNameSearch(event.target.value)
 }

const handleDelete = (id) => {
  const personToDelete = persons.find((person) => {
  return person.id === id
})

if (window.confirm(`Delete ${(personToDelete.name)}?`)) {
  contactService
  .remove(id)
  .then(() => setPersons(persons.filter((person) => person.id !== id)))
} else {
  window.alert(`${personToDelete.name} not deleted`)
  }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <div>
        <Filter checkName={checkName} nameSearch={nameSearch} handleCheckName={handleCheckName}></Filter>
      </div>
      <h2>Add new contact</h2>
      <div>
        <Addcontact addName={addName} newName={newName} handleNameInput={handleNameInput} newNumber={newNumber} handleNumberInput={handleNumberInput}></Addcontact>
      </div>
      <h2>Numbers</h2>
      <div>
        <p>{persons.map(person => 
          <Person key={person.id} person={person} handleDelete={handleDelete}></Person>)}</p>
      </div>
    </div>
    )
}

export default App