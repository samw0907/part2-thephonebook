const Person = ({person, handleDelete}) => {
    return (
      <li key={person.name}>
        {person.name} {person.number}
      <button type="button" value={person.id} name={person.name} id={person.id} onClick={() => handleDelete(person.id)} >delete</button>
      </li>
    )
  }
  
  export default Person