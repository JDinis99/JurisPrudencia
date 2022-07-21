import parse from 'html-react-parser';

const entitieOption = (tokens, type, anom, list_id, propSelect) => {

  function handleSelect(token_id) {
    propSelect({
      list_id: list_id,
      token_id: token_id
    })
  }


  let res = []
  let counter = 0

  for (let token of tokens) {
    let c = counter
    res.push(
      <>
        <div className="EntitieSection">
          <button onClick={() => handleSelect(c)}> Select </button>
        </div>

        <div className='EntitieSection'>
          {parse(token.text)}
        </div>
    </>
    )
    counter++
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