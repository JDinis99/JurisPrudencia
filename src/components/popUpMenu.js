const PopUpMenu = (showMenu, handleMultipleTagChange) => {
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
      <button onClick={handleMultipleTagChange} value="true">Sim</button>
      <button onClick={handleMultipleTagChange} value="false">Não</button>
    </div>
  )
}

export default PopUpMenu;