const Filter = ({checkName, nameSearch, handleCheckName}) => {
    return (
        <form onSubmit={checkName}>
        <div>
          filter shown with <input
          type="search"
          value={nameSearch}
          onChange={handleCheckName}
        />
        </div>
      </form>
    )
}

export default Filter