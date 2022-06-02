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
      <button onClick={handleTagChange} value="PER">PER</button>
      <button onClick={handleTagChange} value="DAT">DAT</button>
      <button onClick={handleTagChange} value="ORG">ORG</button>
      <button onClick={handleTagChange} value="LOC">LOC</button>
      <button onClick={handleTagChange} value="Remove">Remove</button>
    </div>
  )
}

export default ActionMenu;