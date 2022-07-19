import parse from 'html-react-parser';

const entitieOption = (entities, type, anom, id, propSelect) => {
  function handleSelect() {
    propSelect(id)
  }

  return(
    <div className="EntitieOptionBox">
      <div className="EntitieSection">
        <button onClick={handleSelect}> Select </button>
      </div>

      <div className='EntitieSection'>
        {parse(entities.join('<br />---<br />'))}
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