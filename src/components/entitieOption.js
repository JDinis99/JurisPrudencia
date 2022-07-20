import parse from 'html-react-parser';

const entitieOption = (entities, type, anom, id, propSelect) => {
  function handleSelect() {
    propSelect(id)
  }

  let res = []

  for (let ent of entities) {
    res.push(
      <>
        <div className="EntitieSection">
          <button onClick={handleSelect}> Select </button>
        </div>

        <div className='EntitieSection'>
          {parse(ent)}
        </div>
    </>
    )
  }

  return(
    <div className="EntitieOptionBox">
      
      <div className='EntitieText'>
        {res}
      </div>

      <div className="EntitieSection">
        {type}
      </div>

      <div className='EntitieSection'>
        {anom}
      </div>
    </div>
  )
}

export default entitieOption;