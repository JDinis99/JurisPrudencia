import './styles/App.css';
const example_json = require("./data/example.json");

// Dictionary of entities by type, that is a dictionary of entitie name whose key is a list occurences of entitie
let allEntities = {
  ORG: {},
  PER: {},
  DAT: {},
  LOC: {}
}

function App() {
  return (
    <div className="App">
      {Header()}

      {SideBar()}

      {Text()}

    </div>
  );
}

function SideBar() {
  getAllEntities()
  console.log(allEntities)
  Object.keys(allEntities.ORG).map(function(key, index) {
    console.log(key)
  })
  return (
    <div className='SideBar'>
      -----ORGS:----
      {Object.keys(allEntities.ORG).map((key, index) => (
        <Word word={key}/>
      ))}

    </div>
  )
}

function Header() {
  return (
    <header className='PageHeader'>
      Header
    </header>
  )
}

function Text() {
  return (
    <p>TEST</p>
  )
}


function getAllEntities() {
  
  example_json.forEach(function (value) {
    value.entities.forEach(function (entitie) {
      // Divide entities per type
      if (entitie[0] === "ORG") {
        // If first time seeing this entitie
        if (allEntities.ORG[entitie[3]] === undefined) {
          allEntities.ORG[entitie[3]] = [entitie]
        }
        else {
          allEntities.ORG[entitie[3]].push(entitie)
        }
      }
      if (entitie[0] === "PER") {
        // If first time seeing this entitie
        if (allEntities.PER[entitie[3]] === undefined) {
          allEntities.PER[entitie[3]] = [entitie]
        }
        else {
          allEntities.PER[entitie[3]].push(entitie)
        }
      }
      if (entitie[0] === "DAT") {
        // If first time seeing this entitie
        if (allEntities.DAT[entitie[3]] === undefined) {
          allEntities.DAT[entitie[3]] = [entitie]
        }
        else {
          allEntities.DAT[entitie[3]].push(entitie)
        }
      }
      if (entitie[0] === "LOC") {
        // If first time seeing this entitie
        if (allEntities.LOC[entitie[3]] === undefined) {
          allEntities.LOC[entitie[3]] = [entitie]
        }
        else {
          allEntities.LOC[entitie[3]].push(entitie)
        }
      }
    })
  })
  return allEntities
}

const Word = (props) => {
  return <p> {props.word} </p>
}

export default App;
