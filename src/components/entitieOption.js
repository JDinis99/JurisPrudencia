import parse from 'html-react-parser';

const entitieOption = (entities, type, anom, id, propSelect, propSplit) => {
  function handleSelect() {
    propSelect(id)
  }

  function handleSplit() {
    propSplit(id)
  }

  return(
    <div className="EntitieOptionBox">
      <div className='EntitieSection'>
        {parse(entities.join('<br />'))}
      </div>

      <div className='EntitieSection'>
        to
      </div>

      <div className='EntitieSection'>
        {anom}
      </div>

      <div className="EntitieOptionOptions">
        {type}
      </div>

      <div className="EntitieOptionOptions">
        <button onClick={handleSelect}> Select </button>
        <button onClick={handleSplit}> Split </button>
        <button> Remove </button>
      </div>
    </div>
  )
}

export default entitieOption;