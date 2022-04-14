import './styles/App.css';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';


const example_json = require("./data/example.json");

// Dictionary of entities by type, that is a dictionary of entitie name whose key is a list occurences of entitie
let allEntities = {
  ORG: {},
  PER: {},
  DAT: {},
  LOC: {}
}



function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  function SideBar() {
    getAllEntities()

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
      <>
        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
        <button onClick={log}>Log editor content</button>
      </>
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

  return (
    <div className="App">
      {Header()}

      {SideBar()}

      {Text()}

    </div>
  );
}

export default App;
