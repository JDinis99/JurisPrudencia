import parse from 'html-react-parser';

const entitieOption = (entities, type, anom) => {
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
        <button> Join </button>
        <button> Split </button>
        <button> Remove </button>
      </div>
    </div>
  )
}

export default entitieOption;