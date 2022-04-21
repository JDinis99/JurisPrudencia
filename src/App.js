import './styles/App.css';
import indexCss from './styles/index.css';
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import Sidebar from './components/sidebar';


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
      //console.log(editorRef.current.getContent());
      let test = editorRef.current.selection.select(editorRef.current.dom.select('s')[0])
      console.log(test)
      test.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
    }
  };

  function Side() {
    getAllEntities()

    return (
      <div className='SideBar'>
        <Sidebar
        />
  
      </div>
    )
 
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

  const text = () => {
    let text = ""
    example_json.forEach(function(value) {
      let anonimized_text = value.text
      let anonimization = ""
      let substituion = ""
      value.entities.forEach(function(entitie) {
        if (entitie[0] === "ORG") {
          let substituion = "Substitute ORG"
          anonimization = "<font color=red><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "PER") {
          let substituion = "Substitute PER"
          anonimization = "<font color=green><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "DAT") {
          let substituion = "Substitute DAT"
          anonimization = "<font color=brown><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "LOC") {
          let substituion = "Substitute LOC"
          anonimization = "<font color=blue><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
      })
      text += '<p>' + anonimized_text + '</p>'
    })
    
    //console.log(text)
    return text
  }
  
  function EditorBox() {

    return (
      <>
        <Editor className="Text"
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={text()}
          init={{
            content_css: false,
            content_style : indexCss,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
              'autoresize',
              'importcss'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
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

      {Side()}

      {EditorBox()}

    </div>
  );
}

export default App;
