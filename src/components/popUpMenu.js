const PopUpMenu = (showMenu, handleMultipleTagChange, entities) => {
  const style = () => {
    return {
      height: 100,
      width: 500,
      color: "FCD2D1",
      backgroundColor: "rgb(252, 210, 209)",
      alignItems: "center",
      display:"flex",
      flexDirection: "column",
      padding:10,
      top: "50%",
      left: "50%",
      position:"absolute",
      display: showMenu ? "flex" : "none",
      "border-color": "black",
      "border-width": "10px",
      "border-style": "solid"
    }
  }

  return (
    <div className='PopUp' style={style()}>
      Quer aplicar esta mudança a todas as entidades iguais?
      <br></br>
      PER: {entities.PER}, DAT: {entities.DAT}, ORG: {entities.ORG}, LOC: {entities.LOC}, PRO: {entities.PRO}, MAT: {entities.MAT},
      <br></br>
      <button onClick={handleMultipleTagChange} value="Single">Não, apenas a esta entidade</button>
      <button onClick={handleMultipleTagChange} value="All-Equal">Sim, para todas as entidades iguais com o mesmo tipo</button>
      <button onClick={handleMultipleTagChange} value="All-All">Sim, para todas as entidades iguais independentemente do tipo</button>
    </div>
  )
}

export default PopUpMenu;