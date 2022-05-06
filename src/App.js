import './styles/App.css';
import indexCss from './styles/index.css';
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import StickyBox from "react-sticky-box";
import {TokenAnnotator, TextAnnotator} from 'react-text-annotate'

import Sidebar from './components/sidebar';


const example_json = require("./data/example.json");

const TAG_COLORS = {
  ORG: "#00ffa2",
  PERSON: "#84d2ff",
  DAT: "#66fc03",
  LOC: "#fc03c2"
};

const Card = ({ children }) => (
  <div
    style={{
      boxShadow: "0 2px 4px rgba(0,0,0,.1)",
      margin: 6,
      maxWidth: 500,
      padding: 16
    }}
  >
    {children}
  </div>
);

// Dictionary of entities by type, that is a dictionary of entitie name whose key is a list occurences of entitie
let allEntities = [
  {
    id: "ORG",
    label: "Organizacoes",
    expanded: true,
    children: []
  },
  {
    id: "PER",
    label: "Pessoas",
    expanded: true,
    children: []
  },
  {
    id: "DAT",
    label: "Datas",
    expanded: true,
    children: []
  },
  {
    id: "LOC",
    label: "Localizacoes",
    expanded: true,
    children: []
  }
]

function createChild (entitie) {
  let new_child = {
    id: entitie[3],
    label: entitie[3],
    expanded: true,
    children: [
      {
        id: entitie[1].toString(),
        label: entitie[1].toString(),
        data: entitie
      }
    ]
  }
  return new_child
}

  
function getAllEntities() {
  
  example_json.forEach(function (value) {
    value.entities.forEach(function (entitie) {

      let found = false

      // Divide entities per type
      if (entitie[0] === "ORG") {

        allEntities[0].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie) 
          allEntities[0].children.push(new_child)
        }
      }
      if (entitie[0] === "PER") {

        allEntities[1].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[1].children.push(new_child)
        }
      }
      if (entitie[0] === "DAT") {

        allEntities[2].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[2].children.push(new_child)
        }
      }
      if (entitie[0] === "LOC") {
        
        allEntities[3].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[3].children.push(new_child)
        }
      }
    })
  })
}

getAllEntities()

function App() {
  const editorRef = useRef(null);
  const [mode, setMode] = useState("Doccano")

  const [anom, setAnom] = useState(null)

  const handleChange = (value) => {
    let old_tag = anom.tag
    let new_anom = {
      value: value,
      tag: old_tag
    }
    setAnom(new_anom);
  }

  const handleTagChange = e => {
    let old_value = anom.value
    let new_tag = e.target.value
    let new_anom = {
      value: old_value,
      tag: new_tag
    }
    setAnom(new_anom);
  }
  
  const log = () => {
    if (editorRef.current) {
      //console.log(editorRef.current.getContent());
      let test = editorRef.current.selection.select(editorRef.current.dom.select('s')[0])
      console.log(test)
      test.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
    }
  }

  function Side() {

    return (
      <div className='SideBar'>
        <Sidebar allMenuItems={allEntities}/>
      </div>
    )
  }

  function changeMode() {
    if (mode === "Editor") {
      setMode("Doccano")
    }
    if (mode === "Doccano") {
      setMode("Editor")
    }
  }
  
  function Header() {
    return (
      <>
        <header className='PageHeader'>
          Header
        </header>
        <button onClick={changeMode}>
          Mode change
        </button>
      </>
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

    return text
  }

  const anomText = () => {
    let text = ""
    let final_entities = []
    // Counter for words not characters
    let counter = -1
    example_json.forEach(function(value) {
      console.log("Counter so far: ", counter)
      console.log("Iteration's text: ", value.text)
      console.log("Iteration's lenght: ", value.text.split(" ").length)

      value.entities.forEach(function(entitie) {
        let type = entitie[0]
        let split = value.text.split(entitie[3])

        let start = counter + split[0].split(" ").length
        let end = start + entitie[3].split(" ").length

        let final_entitie = {
          start: start,
          end: end,
          tag: type
        }

        console.log(final_entitie)
        final_entities.push(final_entitie)

      })
      counter += value.text.trim().split(" ").length
      text += value.text
      if (value.text != "") {
        text += " "
      }
  })
    
    // console.log(final_entities)
    console.log(text)
    
    if (anom === null) {
      setAnom({
        //value: [{start: 35, end: 36, tag: "PER"}],
        value: final_entities,
        tag: "PER"
      })
    }

    return text
  }
  
  function box() {

    if (mode === "Editor") {
      return (
        <>
          <Editor tinymceScriptSrc="http://localhost:3000/tinymce/js/tinymce/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={text()}
            init={{
              toolbar_sticky: true,
              menubar: 'tools',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'autoresize',
                'importcss',
                'example',
                'code'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | code | example',
            }}
          />
          <button onClick={log}>Log editor content</button>
        </>
      )
    }

    if (mode === "Doccano") {
      let text = anomText()
      if (anom === null) {
        return <></>
      }
      return (
        <>
          <h4>Default</h4>
          <select onChange={handleTagChange} value={anom.tag}>
            <option value="ORG">ORG</option>
            <option value="PER">PER</option>
            <option value="DAT">DAT</option>
            <option value="LOC">LOC</option>
          </select>
          <TokenAnnotator
            tokens={text.split(" ")}
            value={anom.value}
            onChange={handleChange}
            getSpan={span => ({
              ...span,
              tag: anom.tag,
              color: TAG_COLORS[anom.tag]
            })}
          />
        </>
      )
    }

  }
  
  const Word = (props) => {
    return <p> {props.word} </p>
  }

  return (
    <div className="App">
      {Header()}

      {Side()}

      {box()}

    </div>
  );
}

export default App;
