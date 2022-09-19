const ActionMenu = (x, y, showMenu, handleTagChange) => {
  const style = () => {
    return {
      height: 200,
      width: 100,
      color: "FCD2D1",
      backgroundColor: "FF5C58",
      display:"flex",
      flexDirection: "column",
      padding:10,
      top:y,
      left:x,
      position:"absolute",
      display: showMenu ? "flex" : "none"
    }
  }

  return (
    <div style={style()}>
      <button onClick={handleTagChange} value="PES">PES</button>
      <button onClick={handleTagChange} value="DAT">DAT</button>
      <button onClick={handleTagChange} value="ORG">ORG</button>
      <button onClick={handleTagChange} value="LOC">LOC</button>
      <button onClick={handleTagChange} value="PRO">PRO</button>
      <button onClick={handleTagChange} value="MAT">MAT</button>
      <button onClick={handleTagChange} style={{color:"red"}} value="Remove">Remover</button>
      <button onClick={handleTagChange} style={{color:"red"}} value="Cancel">Cancelar</button>
    </div>
  )
}

export default ActionMenu;